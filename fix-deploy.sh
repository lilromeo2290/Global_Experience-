#!/bin/bash
# fix-deploy.sh — Fix Next.js standalone deployment on Webuzo VPS
# Run on the VPS as root or with sudo
# Usage: bash fix-deploy.sh

set -e

APP_DIR="/home/clipe233/public_html/globalexperiencegh.org"
APP_NAME="global-experience"
PORT=3000

echo "============================================"
echo "  Next.js Standalone Deploy Fix Script"
echo "============================================"
echo ""

# ---- Step 1: Check PM2 process ----
echo ">>> Step 1: Checking PM2 process..."
if pm2 describe "$APP_NAME" &>/dev/null; then
    echo "  PM2 process '$APP_NAME' found. Stopping it..."
    pm2 delete "$APP_NAME" 2>/dev/null || true
else
    echo "  No PM2 process '$APP_NAME' running."
fi

# ---- Step 2: Check if project directory exists ----
echo ""
echo ">>> Step 2: Checking project directory..."
if [ ! -d "$APP_DIR" ]; then
    echo "  ERROR: Project directory $APP_DIR does not exist!"
    echo "  Please clone the repo first:"
    echo "    su - clipe233 -c 'cd /home/clipe233/public_html && git clone https://github.com/lilromeo2290/Global_Experience-.git globalexperiencegh.org'"
    exit 1
fi

echo "  Project directory exists: $APP_DIR"
cd "$APP_DIR"

# ---- Step 3: Pull latest code ----
echo ""
echo ">>> Step 3: Pulling latest code..."
git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
su - clipe233 -c "cd $APP_DIR && git pull origin main" || echo "  WARNING: git pull failed, continuing with existing code"

# ---- Step 4: Install dependencies ----
echo ""
echo ">>> Step 4: Installing dependencies..."
if command -v bun &>/dev/null; then
    echo "  Using bun..."
    su - clipe233 -c "cd $APP_DIR && bun install" || { echo "  bun install failed, trying npm..."; su - clipe233 -c "cd $APP_DIR && npm ci"; }
else
    echo "  Using npm..."
    su - clipe233 -c "cd $APP_DIR && npm ci"
fi

# ---- Step 5: Generate Prisma client ----
echo ""
echo ">>> Step 5: Generating Prisma client..."
su - clipe233 -c "cd $APP_DIR && npx prisma generate" || echo "  WARNING: prisma generate failed"

# ---- Step 6: Build Next.js ----
echo ""
echo ">>> Step 6: Building Next.js..."
su - clipe233 -c "cd $APP_DIR && npm run build" || { echo "  ERROR: Build failed!"; exit 1; }

# ---- Step 7: Verify standalone output ----
echo ""
echo ">>> Step 7: Verifying standalone build output..."
STANDALONE_DIR="$APP_DIR/.next/standalone"
if [ ! -d "$STANDALONE_DIR" ]; then
    echo "  ERROR: Standalone directory not found at $STANDALONE_DIR"
    echo "  Make sure next.config.js has: output: 'standalone'"
    exit 1
fi
echo "  Standalone directory found: $STANDALONE_DIR"

# ---- Step 8: Copy static files into standalone (CRITICAL!) ----
echo ""
echo ">>> Step 8: Copying static files into standalone directory..."
echo "  This is the #1 cause of 404 errors!"

# Copy .next/static → standalone/.next/static
if [ -d "$APP_DIR/.next/static" ]; then
    echo "  Copying .next/static → .next/standalone/.next/static"
    rm -rf "$STANDALONE_DIR/.next/static"
    cp -r "$APP_DIR/.next/static" "$STANDALONE_DIR/.next/static"
    echo "  Done. Files in .next/static:"
    ls "$STANDALONE_DIR/.next/static/" 2>/dev/null | head -5
else
    echo "  WARNING: .next/static not found!"
fi

# Copy public → standalone/public
if [ -d "$APP_DIR/public" ]; then
    echo "  Copying public → standalone/public"
    rm -rf "$STANDALONE_DIR/public"
    cp -r "$APP_DIR/public" "$STANDALONE_DIR/public"
    echo "  Done. Files in public:"
    ls "$STANDALONE_DIR/public/" 2>/dev/null | head -5
else
    echo "  WARNING: public directory not found!"
fi

# ---- Step 9: Check/fix .env.production ----
echo ""
echo ">>> Step 9: Checking .env.production..."
if [ ! -f "$STANDALONE_DIR/.env" ] && [ ! -f "$STANDALONE_DIR/.env.production" ]; then
    echo "  No .env file in standalone dir. Copying from project root..."
    if [ -f "$APP_DIR/.env.production" ]; then
        cp "$APP_DIR/.env.production" "$STANDALONE_DIR/.env"
        echo "  Copied .env.production → .env"
    elif [ -f "$APP_DIR/.env" ]; then
        cp "$APP_DIR/.env" "$STANDALONE_DIR/.env"
        echo "  Copied .env → .env"
    else
        echo "  WARNING: No .env file found anywhere! App may not work correctly."
    fi
else
    echo "  .env file exists in standalone directory."
fi

# ---- Step 10: Push database schema ----
echo ""
echo ">>> Step 10: Pushing Prisma schema to database..."
su - clipe233 -c "cd $APP_DIR && npx prisma db push --skip-generate" || echo "  WARNING: prisma db push failed (may need manual DB setup)"

# ---- Step 11: Create PM2 ecosystem config ----
echo ""
echo ">>> Step 11: Creating PM2 ecosystem config..."
cat > "$STANDALONE_DIR/ecosystem.config.js" << 'EOFPM2'
module.exports = {
  apps: [{
    name: 'global-experience',
    script: 'server.js',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: __dirname + '/logs/error.log',
    out_file: __dirname + '/logs/output.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
EOFPM2

mkdir -p "$STANDALONE_DIR/logs"
echo "  ecosystem.config.js created."

# ---- Step 12: Start with PM2 ----
echo ""
echo ">>> Step 12: Starting app with PM2..."
cd "$STANDALONE_DIR"
pm2 start ecosystem.config.js
pm2 save
echo "  PM2 process started."

# ---- Step 13: Verify app responds locally ----
echo ""
echo ">>> Step 13: Verifying app responds on port $PORT..."
sleep 3
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" 2>/dev/null | grep -q "200\|30"; then
    echo "  SUCCESS: App responds on http://localhost:$PORT"
    # Show a snippet of what it returns
    echo "  Response preview:"
    curl -s "http://localhost:$PORT" 2>/dev/null | head -c 200
    echo ""
else
    echo "  WARNING: App may not be responding correctly on port $PORT"
    echo "  Checking PM2 logs..."
    pm2 logs "$APP_NAME" --lines 20 --nostream 2>/dev/null || true
fi

# ---- Step 14: Fix Nginx — remove root directive and clear cache ----
echo ""
echo ">>> Step 14: Fixing Nginx configuration..."

VHOST_FILE="/usr/local/apps/nginx/etc/conf.d/webuzoVH.conf"

if [ -f "$VHOST_FILE" ]; then
    # Remove root directive for our domain ONLY (within the domain's server blocks)
    echo "  Removing 'root' directive for globalexperiencegh.org server blocks..."
    
    python3 << 'PYEOF'
import re, sys

vhost_path = "/usr/local/apps/nginx/etc/conf.d/webuzoVH.conf"
domain = "globalexperiencegh.org"

with open(vhost_path, 'r') as f:
    content = f.read()

# Find all server blocks for this domain and remove root directive
# We need to be surgical: only remove root lines inside blocks for our domain
lines = content.split('\n')
new_lines = []
in_target_block = False
brace_depth = 0

for line in lines:
    stripped = line.strip()
    
    # Detect start of a server block for our domain
    if 'server {' in stripped or stripped == 'server{':
        # Look ahead to check if this block contains our domain
        # We'll track it after we enter
        in_target_block = True
        brace_depth = 1
        new_lines.append(line)
        continue
    
    if in_target_block:
        if '{' in stripped:
            brace_depth += stripped.count('{')
        if '}' in stripped:
            brace_depth -= stripped.count('}')
        
        # Check if this is still our domain's block
        if brace_depth <= 0:
            in_target_block = False
            new_lines.append(line)
            continue
        
        # Check if line contains our domain as server_name
        if 'server_name' in stripped and domain in stripped:
            # This is definitely our block
            pass
        
        # Remove root directive pointing to our domain's public_html
        if stripped.startswith('root ') and domain in stripped:
            print(f"  REMOVING: {line.strip()}")
            continue
        
        # Remove index directive (we want proxy, not static files)
        if stripped.startswith('index ') and in_target_block:
            print(f"  REMOVING: {line.strip()}")
            continue
    
    new_lines.append(line)

with open(vhost_path, 'w') as f:
    f.write('\n'.join(new_lines))

print("  Done removing root/index directives.")
PYEOF

    # Clear Nginx proxy cache
    echo "  Clearing Nginx proxy cache..."
    rm -rf /usr/local/apps/nginx/var/cache/* 2>/dev/null || true
    echo "  Proxy cache cleared."

    # Test Nginx config
    echo "  Testing Nginx config..."
    if /usr/local/apps/nginx/sbin/nginx -t 2>&1; then
        echo "  Nginx config OK. Reloading..."
        /usr/local/apps/nginx/sbin/nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true
    else
        echo "  WARNING: Nginx config test failed! Not reloading."
    fi
else
    echo "  WARNING: $VHOST_FILE not found!"
fi

# ---- Step 15: Check Webuzo custom include ----
echo ""
echo ">>> Step 15: Checking Webuzo custom domain include..."
CUSTOM_CONF="/var/webuzo-data/nginx/custom/domains/globalexperiencegh.org.conf"
if [ -f "$CUSTOM_CONF" ]; then
    echo "  Found custom include: $CUSTOM_CONF"
    echo "  Contents:"
    cat "$CUSTOM_CONF"
    echo ""
    echo "  If this file contains a 'location /' block, it may override our proxy!"
    echo "  Consider backing up and clearing it:"
    echo "    cp $CUSTOM_CONF ${CUSTOM_CONF}.bak"
    echo "    echo '' > $CUSTOM_CONF"
else
    echo "  No custom include found (good)."
fi

# ---- Summary ----
echo ""
echo "============================================"
echo "  DEPLOY FIX SUMMARY"
echo "============================================"
echo ""
echo "  App directory: $APP_DIR"
echo "  Standalone dir: $STANDALONE_DIR"
echo "  PM2 process: $APP_NAME"
echo "  Port: $PORT"
echo ""
echo "  Key files copied:"
echo "    .next/static → $(ls $STANDALONE_DIR/.next/static/ 2>/dev/null | wc -l) items"
echo "    public → $(ls $STANDALONE_DIR/public/ 2>/dev/null | wc -l) items"
echo ""

# Final test
echo "  Testing http://localhost:$PORT ..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" 2>/dev/null)
echo "  HTTP Status: $HTTP_CODE"

echo ""
echo "  Testing https://globalexperiencegh.org ..."
HTTP_CODE_EXT=$(curl -sk -o /dev/null -w "%{http_code}" "https://globalexperiencegh.org" 2>/dev/null || echo "failed")
echo "  HTTP Status: $HTTP_CODE_EXT"

echo ""
echo "  Testing http://globalexperiencegh.org ..."
HTTP_CODE_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -L "http://globalexperiencegh.org" 2>/dev/null || echo "failed")
echo "  HTTP Status: $HTTP_CODE_EXT"

echo ""
echo "  If you still see the wrong page, try:"
echo "    1. Clear browser cache (Ctrl+Shift+R)"
echo "    2. Check: cat $CUSTOM_CONF"
echo "    3. Check PM2 logs: pm2 logs $APP_NAME"
echo ""
