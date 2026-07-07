#!/bin/bash
#=============================================================================
# deploy-fresh.sh — Complete fresh deployment of Global Experience on Webuzo VPS
# Run as root on the VPS: bash deploy-fresh.sh
#=============================================================================

set -e

DOMAIN="globalexperiencegh.org"
REPO="https://github.com/lilromeo2290/Global_Experience-.git"
APP_DIR="/home/clipe233/public_html/$DOMAIN"
PORT=3002
APP_NAME="global-experience"

echo "============================================"
echo "  Fresh Deployment: $DOMAIN"
echo "  App Port: $PORT"
echo "============================================"
echo ""

# ---- Step 1: Stop any existing PM2 process ----
echo ">>> Step 1: Cleaning up old PM2 processes..."
pm2 delete $APP_NAME 2>/dev/null || true
fuser -k ${PORT}/tcp 2>/dev/null || true
sleep 1

# ---- Step 2: Clone the repo ----
echo ""
echo ">>> Step 2: Cloning from GitHub..."
if [ -d "$APP_DIR" ]; then
    echo "  Directory exists. Removing old files..."
    rm -rf "$APP_DIR"
fi

su - clipe233 -c "cd /home/clipe233/public_html && git clone $REPO $DOMAIN"
git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
echo "  Cloned successfully."

# ---- Step 3: Create .env.production ----
echo ""
echo ">>> Step 3: Creating .env file..."
echo "  You need to provide the DATABASE_URL and other secrets."
echo "  Creating template - you MUST edit this before building!"

cat > "$APP_DIR/.env" << 'ENVEOF'
# ============================================
# Global Experience - Production Environment
# ============================================
# IMPORTANT: Edit this file with your actual values!

# Database (MySQL on this VPS)
DATABASE_URL="mysql://clipe233:YOUR_DB_PASSWORD@127.0.0.1:3306/globalexperience_db"

# NextAuth
NEXTAUTH_URL="https://globalexperiencegh.org"
NEXTAUTH_SECRET="CHANGE_THIS_TO_A_RANDOM_STRING"

# Admin email
ADMIN_EMAIL="admin@globalexperiencegh.org"

# Paystack (optional)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
PAYSTACK_SECRET_KEY=""
ENVEOF

echo ""
echo "  ⚠️  .env created at $APP_DIR/.env"
echo "  ⚠️  EDIT IT NOW with your real database password and secrets!"
echo ""
read -p "  Press ENTER after you've edited the .env file, or type 'skip' to continue with defaults: " ENVOK
if [ "$ENVOK" = "skip" ]; then
    echo "  Continuing with template .env (may not work correctly)..."
fi

# ---- Step 4: Create MySQL database ----
echo ""
echo ">>> Step 4: Creating MySQL database..."
echo "  Checking if database exists..."
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'globalexperience_db'" -s 2>/dev/null || echo "")
if [ -z "$DB_EXISTS" ]; then
    echo "  Creating database globalexperience_db..."
    mysql -u root -e "CREATE DATABASE globalexperience_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "  WARNING: Could not create database. You may need to create it manually via Webuzo panel."
    mysql -u root -e "GRANT ALL PRIVILEGES ON globalexperience_db.* TO 'clipe233'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || echo "  WARNING: Could not grant privileges."
    echo "  Database created."
else
    echo "  Database already exists. Using existing database."
fi

# ---- Step 5: Install dependencies ----
echo ""
echo ">>> Step 5: Installing dependencies..."
cd "$APP_DIR"
su - clipe233 -c "cd $APP_DIR && npm install --legacy-peer-deps" || { echo "  ERROR: npm install failed!"; exit 1; }
echo "  Dependencies installed."

# ---- Step 6: Generate Prisma client ----
echo ""
echo ">>> Step 6: Generating Prisma client..."
su - clipe233 -c "cd $APP_DIR && npx prisma generate" || echo "  WARNING: prisma generate failed"

# ---- Step 7: Push database schema ----
echo ""
echo ">>> Step 7: Pushing database schema..."
su - clipe233 -c "cd $APP_DIR && npx prisma db push --skip-generate" || echo "  WARNING: prisma db push failed (check DATABASE_URL in .env)"

# ---- Step 8: Build Next.js ----
echo ""
echo ">>> Step 8: Building Next.js..."
su - clipe233 -c "cd $APP_DIR && npm run build" || { echo "  ERROR: Build failed!"; exit 1; }
echo "  Build complete."

# ---- Step 9: Copy static files to nested standalone dir ----
echo ""
echo ">>> Step 9: Copying static files to standalone directory..."
STANDALONE_DIR="$APP_DIR/.next/standalone"
NESTED_DIR=$(find "$STANDALONE_DIR" -name "server.js" -not -path "*/node_modules/*" -exec dirname {} \; | head -1)

if [ -z "$NESTED_DIR" ]; then
    echo "  ERROR: Could not find server.js in standalone directory!"
    exit 1
fi

echo "  Found server.js at: $NESTED_DIR"

# Copy .next/static
cp -r "$APP_DIR/.next/static" "$NESTED_DIR/.next/"
echo "  Copied .next/static"

# Copy public
cp -r "$APP_DIR/public" "$NESTED_DIR/"
echo "  Copied public/"

# Copy .env
cp "$APP_DIR/.env" "$NESTED_DIR/.env"
echo "  Copied .env"

# ---- Step 10: Create PM2 ecosystem config ----
echo ""
echo ">>> Step 10: Creating PM2 config..."
mkdir -p "$NESTED_DIR/logs"

cat > "$NESTED_DIR/ecosystem.config.js" << EOFPM2
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'server.js',
    cwd: '$NESTED_DIR',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT,
      HOSTNAME: '0.0.0.0',
    },
    error_file: '$NESTED_DIR/logs/error.log',
    out_file: '$NESTED_DIR/logs/output.log',
    merge_logs: true,
  }],
};
EOFPM2

echo "  PM2 config created."

# ---- Step 11: Start PM2 ----
echo ""
echo ">>> Step 11: Starting app with PM2..."
pm2 start "$NESTED_DIR/ecosystem.config.js"
pm2 save
sleep 4

# Check if running
PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"status":"[^"]*"' | head -1 || echo "unknown")
echo "  PM2 status: $PM2_STATUS"

# ---- Step 12: Configure Nginx ----
echo ""
echo ">>> Step 12: Configuring Nginx reverse proxy..."
VHOST_FILE="/usr/local/apps/nginx/etc/conf.d/webuzoVH.conf"

# Run the Python fix script
python3 << PYEOF
import re, shutil, subprocess, sys, os

VHOST = "$VHOST_FILE"
DOMAIN = "$DOMAIN"
PORT = $PORT

if not os.path.exists(VHOST):
    print(f"  ERROR: {VHOST} not found!")
    sys.exit(1)

# Backup
shutil.copy2(VHOST, VHOST + ".bak.fresh-deploy")
print("  Backup saved")

with open(VHOST) as f:
    content = f.read()

lines = content.split('\n')
out = []
i = 0
blocks_fixed = 0

while i < len(lines):
    line = lines[i]
    
    if line.strip().startswith('server {') or line.strip() == 'server{':
        brace = 1
        j = i + 1
        is_ours = False
        is_https = False
        
        while j < len(lines) and brace > 0:
            s = lines[j].strip()
            brace += s.count('{') - s.count('}')
            if 'server_name' in s and DOMAIN in s:
                is_ours = True
            if ':443' in s and 'listen' in s:
                is_https = True
            j += 1
        
        block_end = j - 1
        
        if is_ours:
            blocks_fixed += 1
            block_type = "HTTPS" if is_https else "HTTP"
            print(f"  Found {block_type} block for {DOMAIN}")
            
            k = i
            in_php = False
            php_depth = 0
            proxy_added = False
            
            while k <= block_end:
                s = lines[k].strip()
                
                # Comment out PHP location block
                if re.match(r'location\s+~\s+\(\.', s) and not in_php:
                    in_php = True
                    php_depth = 1
                    out.append("        #DISABLED: " + lines[k])
                    k += 1
                    continue
                
                if in_php:
                    php_depth += s.count('{') - s.count('}')
                    out.append("        #DISABLED: " + lines[k])
                    if php_depth <= 0:
                        in_php = False
                    k += 1
                    continue
                
                # Insert proxy block after fpmsocket
                if 'fpmsocket' in s and not proxy_added:
                    out.append(lines[k])
                    out.append("")
                    out.append(f"        # --- Next.js Reverse Proxy (port {PORT}) ---")
                    out.append(f"        location / {{")
                    out.append(f"                proxy_pass http://127.0.0.1:{PORT};")
                    out.append(f"                proxy_http_version 1.1;")
                    out.append(f"                proxy_set_header Upgrade \$http_upgrade;")
                    out.append(f"                proxy_set_header Connection 'upgrade';")
                    out.append(f"                proxy_set_header Host \$host;")
                    out.append(f"                proxy_set_header X-Real-IP \$remote_addr;")
                    out.append(f"                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;")
                    out.append(f"                proxy_set_header X-Forwarded-Proto \$scheme;")
                    out.append(f"                proxy_cache_bypass \$http_upgrade;")
                    out.append(f"                proxy_read_timeout 300s;")
                    out.append(f"                proxy_connect_timeout 75s;")
                    out.append(f"        }}")
                    out.append(f"        # --- End Next.js Reverse Proxy ---")
                    out.append("")
                    proxy_added = True
                    k += 1
                    continue
                
                out.append(lines[k])
                k += 1
            
            i = block_end + 1
            continue
    
    out.append(lines[i])
    i += 1

with open(VHOST, 'w') as f:
    f.write('\n'.join(out))

print(f"  Fixed {blocks_fixed} server block(s)")

print("  Testing Nginx...")
r = subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-t'], capture_output=True, text=True)
if r.returncode == 0:
    print("  Config OK")
    cache = "/usr/local/apps/nginx/var/cache"
    if os.path.exists(cache):
        for item in os.listdir(cache):
            p = os.path.join(cache, item)
            (os.remove(p)) if os.path.isfile(p) else (shutil.rmtree(p)) if os.path.isdir(p) else None
        print("  Cache cleared")
    subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-s', 'reload'])
    print("  Nginx reloaded")
else:
    print("  Config FAILED:")
    print(r.stderr)
    shutil.copy2(VHOST + ".bak.fresh-deploy", VHOST)
    print("  Backup restored")
    sys.exit(1)
PYEOF

# ---- Step 13: Final verification ----
echo ""
echo "============================================"
echo "  DEPLOYMENT VERIFICATION"
echo "============================================"
echo ""

sleep 2

# Test app directly
HTTP_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null || echo "000")
echo "  Local test (port $PORT):  HTTP $HTTP_LOCAL"

# Test through Nginx
HTTP_EXT=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
echo "  External test (HTTPS):    HTTP $HTTP_EXT"

# Check title
TITLE=$(curl -s https://$DOMAIN 2>/dev/null | grep -oP '<title>[^<]*</title>' | head -1 || echo "N/A")
echo "  Page title:               $TITLE"

echo ""
if [ "$HTTP_LOCAL" = "200" ] && [ "$HTTP_EXT" = "200" ]; then
    echo "  ✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "  Site: https://$DOMAIN"
    echo "  Admin: https://$DOMAIN/admin"
    echo ""
    echo "  PM2 commands:"
    echo "    pm2 list                    - Check status"
    echo "    pm2 logs $APP_NAME          - View logs"
    echo "    pm2 restart $APP_NAME       - Restart app"
    echo ""
    echo "  Future updates:"
    echo "    cd $APP_DIR"
    echo "    git pull origin main"
    echo "    npm install --legacy-peer-deps"
    echo "    npm run build"
    echo "    NESTED=\$(find .next/standalone -name server.js -not -path '*/node_modules/*' -exec dirname {} \; | head -1)"
    echo "    cp -r .next/static \$NESTED/.next/ && cp -r public \$NESTED/ && cp .env \$NESTED/.env"
    echo "    pm2 restart $APP_NAME"
else
    echo "  ⚠️  Deployment may have issues. Check PM2 logs:"
    echo "    pm2 logs $APP_NAME --lines 30 --nostream"
fi

echo ""
