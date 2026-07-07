#!/bin/bash
#=============================================================================
# deploy-globalexperience.sh — One-shot deployment for globalexperiencegh.org
# on Webuzo VPS. Run as root.
#
# This script:
#   1. Clones the repo (or pulls if exists)
#   2. Installs deps & builds Next.js
#   3. Copies static files to the correct nested standalone dir
#   4. Creates .env with MySQL connection
#   5. Sets up PM2 with correct config
#   6. Configures Nginx via Webuzo's custom include (survives Webuzo updates)
#   7. Comments out PHP blocks in webuzoVH.conf for this domain
#
# Usage: bash deploy-globalexperience.sh [DB_PASSWORD]
#=============================================================================

set -e

DOMAIN="globalexperiencegh.org"
REPO="https://github.com/lilromeo2290/Global_Experience-.git"
APP_DIR="/home/clipe233/public_html/$DOMAIN"
PORT=3002
APP_NAME="global-experience"
DB_NAME="clipe233_globalxp_db"
DB_USER="clipe233"
DB_PASS="${1:-GlobalXp2026}"

echo "============================================"
echo "  Deploying: $DOMAIN"
echo "  Port: $PORT | DB: $DB_NAME"
echo "============================================"
echo ""

# ---- Step 1: Stop existing PM2 process ----
echo ">>> [1/8] Stopping old process..."
pm2 delete $APP_NAME 2>/dev/null || true
fuser -k ${PORT}/tcp 2>/dev/null || true
sleep 1

# ---- Step 2: Clone or update repo ----
echo ""
echo ">>> [2/8] Getting code..."
if [ -d "$APP_DIR" ]; then
    echo "  Directory exists. Pulling latest..."
    git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
    cd "$APP_DIR"
    git reset --hard HEAD 2>/dev/null || true
    git pull origin main 2>/dev/null || echo "  Pull failed, using existing code"
else
    echo "  Cloning from GitHub..."
    su - clipe233 -c "cd /home/clipe233/public_html && git clone $REPO $DOMAIN" 2>/dev/null || git clone $REPO "$APP_DIR"
    git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
fi
cd "$APP_DIR"

# ---- Step 3: Create .env ----
echo ""
echo ">>> [3/8] Creating .env..."
cat > "$APP_DIR/.env" << EOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}"
NEXTAUTH_URL="https://${DOMAIN}"
NEXTAUTH_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'change-me-secret-key-$(date +%s)')"
ADMIN_EMAIL="admin@${DOMAIN}"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
PAYSTACK_SECRET_KEY=""
EOF
echo "  .env created"

# ---- Step 4: Install, generate Prisma, build ----
echo ""
echo ">>> [4/8] Installing & building..."
npm install --legacy-peer-deps 2>&1 | tail -3
npx prisma generate 2>&1 | tail -2
npx prisma db push --skip-generate 2>&1 | tail -2 || echo "  DB push warning (may need manual setup)"
npm run build 2>&1 | tail -5

# ---- Step 5: Copy static files to nested standalone dir ----
echo ""
echo ">>> [5/8] Copying static files..."
NESTED_DIR=$(find "$APP_DIR/.next/standalone" -name "server.js" -not -path "*/node_modules/*" -exec dirname {} \; | head -1)

if [ -z "$NESTED_DIR" ]; then
    echo "  ERROR: server.js not found in standalone dir!"
    exit 1
fi

echo "  Found server.js at: $NESTED_DIR"
cp -r "$APP_DIR/.next/static" "$NESTED_DIR/.next/"
cp -r "$APP_DIR/public" "$NESTED_DIR/"
cp "$APP_DIR/.env" "$NESTED_DIR/.env"
echo "  Files copied"

# ---- Step 6: Set up PM2 ----
echo ""
echo ">>> [6/8] Setting up PM2..."
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

pm2 start "$NESTED_DIR/ecosystem.config.js"
pm2 save
sleep 4
echo "  PM2 started"

# ---- Step 7: Configure Nginx via custom include ----
echo ""
echo ">>> [7/8] Configuring Nginx..."

# 7a: Update the custom include file (this survives Webuzo updates!)
CUSTOM_CONF="/var/webuzo-data/nginx/custom/domains/${DOMAIN}.conf"
cat > "$CUSTOM_CONF" << NGINXCUSTOM
location ^~ / {
    proxy_pass http://127.0.0.1:${PORT};
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

location ^~ /_next/static/ {
    proxy_pass http://127.0.0.1:${PORT};
    expires 365d;
    add_header Cache-Control "public, immutable";
}
NGINXCUSTOM
echo "  Custom include updated: $CUSTOM_CONF"

# 7b: Comment out PHP block for this domain in webuzoVH.conf
python3 << 'PYEOF'
import re, shutil, subprocess, sys

VHOST = "/usr/local/apps/nginx/etc/conf.d/webuzoVH.conf"
DOMAIN = "globalexperiencegh.org"

shutil.copy2(VHOST, VHOST + ".bak.deploy")

with open(VHOST) as f:
    lines = f.readlines()

out = []
in_php = False
php_depth = 0
in_our_domain = False
brace_depth = 0

for line in lines:
    s = line.strip()
    
    if s.startswith('server {') or s == 'server{':
        if brace_depth == 0:
            in_our_domain = False
        brace_depth += 1
    
    if not in_our_domain:
        if 'server_name' in s and DOMAIN in s:
            in_our_domain = True
    
    brace_depth += s.count('{') - s.count('}')
    
    if brace_depth <= 0:
        in_our_domain = False
        in_php = False
    
    if in_our_domain and not in_php:
        if re.match(r'location\s+~\s+\(\.', s):
            in_php = True
            php_depth = 1
            out.append("        #DISABLED: " + line)
            continue
    
    if in_php:
        php_depth += s.count('{') - s.count('}')
        out.append("        #DISABLED: " + line)
        if php_depth <= 0:
            in_php = False
        continue
    
    out.append(line)

with open(VHOST, 'w') as f:
    f.writelines(out)

r = subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-t'], capture_output=True, text=True)
if r.returncode == 0:
    subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-s', 'reload'])
    print("  Nginx configured & reloaded")
else:
    print("  Nginx test FAILED - restoring backup")
    print(r.stderr)
    shutil.copy2(VHOST + ".bak.deploy", VHOST)
    sys.exit(1)
PYEOF

# ---- Step 8: Verify ----
echo ""
echo ">>> [8/8] Verifying..."
sleep 2

HTTP_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT 2>/dev/null || echo "000")
HTTP_EXT=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
TITLE=$(curl -s https://$DOMAIN 2>/dev/null | grep -oP '<title>[^<]*</title>' | head -1 || echo "N/A")

echo ""
echo "============================================"
echo "  DEPLOYMENT RESULT"
echo "============================================"
echo "  Local (port $PORT):  HTTP $HTTP_LOCAL"
echo "  External (HTTPS):   HTTP $HTTP_EXT"
echo "  Title:              $TITLE"
echo ""

if [ "$HTTP_LOCAL" = "200" ] && [ "$HTTP_EXT" = "200" ]; then
    echo "  ✅ SUCCESS! Site is live at https://$DOMAIN"
    echo ""
    echo "  Admin panel: https://$DOMAIN/admin"
    echo "  PM2 status:  pm2 list"
    echo "  App logs:    pm2 logs $APP_NAME"
    echo ""
    echo "  To update after code changes:"
    echo "    cd $APP_DIR && git pull origin main"
    echo "    npm install --legacy-peer-deps && npm run build"
    echo "    NESTED=\$(find .next/standalone -name server.js -not -path '*/node_modules/*' -exec dirname {} \; | head -1)"
    echo "    cp -r .next/static \$NESTED/.next/ && cp -r public \$NESTED/ && cp .env \$NESTED/.env"
    echo "    pm2 restart $APP_NAME"
else
    echo "  ⚠️  Something may be wrong. Check logs:"
    echo "    pm2 logs $APP_NAME --lines 30 --nostream"
fi
echo ""
