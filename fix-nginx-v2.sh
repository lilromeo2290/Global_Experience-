#!/usr/bin/env bash
# ============================================================
#  Webuzo Nginx Fix v2 — Surgical patch of ONE domain's vhost
# ============================================================
#  Instead of overwriting the entire webuzoVH.conf, this script
#  finds ONLY the server block for your domain and replaces it
#  with a reverse proxy to port 3000.
#
#  Usage:
#    bash fix-nginx-v2.sh globalexperiencegh.org
# ============================================================

set -e

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Usage: bash fix-nginx-v2.sh your-domain.com"
  exit 1
fi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'
print_step() { echo -e "\n${BLUE}==>${NC} $1"; }
print_ok()   { echo -e "${GREEN}✓${NC} $1"; }
print_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
print_err()  { echo -e "${RED}✗${NC} $1"; }

# --- 1. Find the Webuzo vhost config file -----------------------------------
print_step "Finding Webuzo vhost config"

VHOST_FILE=""
for f in \
  /usr/local/apps/nginx/etc/conf.d/webuzoVH.conf \
  /etc/nginx/conf.d/webuzoVH.conf \
  /usr/local/apps/nginx/etc/vhosts/webuzoVH.conf; do
  if [ -f "$f" ]; then
    VHOST_FILE="$f"
    break
  fi
done

if [ -z "$VHOST_FILE" ]; then
  print_err "Could not find webuzoVH.conf"
  echo "  Searched: /usr/local/apps/nginx/etc/conf.d/ and /etc/nginx/conf.d/"
  exit 1
fi

print_ok "Found vhost file: $VHOST_FILE"

# --- 2. Check if the domain exists in the config ----------------------------
print_step "Looking for $DOMAIN in vhost config"

if ! grep -q "server_name.*$DOMAIN" "$VHOST_FILE"; then
  print_err "Domain $DOMAIN not found in $VHOST_FILE"
  echo "  Make sure you added the domain in Webuzo admin panel first."
  exit 1
fi

print_ok "Domain $DOMAIN found in config"

# Show which line the server block starts
LINE_NUM=$(grep -n "server_name.*$DOMAIN" "$VHOST_FILE" | head -1 | cut -d: -f1)
echo "  server_name directive is on line $LINE_NUM"

# --- 3. Back up the file ----------------------------------------------------
BACKUP="${VHOST_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$VHOST_FILE" "$BACKUP"
print_ok "Backed up to $BACKUP"

# --- 4. Extract the server block for this domain ----------------------------
print_step "Extracting the current server block for $DOMAIN"

# Use Python to surgically extract and replace the server block
# This is more reliable than sed/awk for nested braces
python3 << PYEOF
import sys, re

vhost_file = "$VHOST_FILE"
domain = "$DOMAIN"

with open(vhost_file, 'r') as f:
    content = f.read()

# Find the server block that contains our domain
# Strategy: find all 'server {' blocks, check which one has our server_name
blocks = []
i = 0
lines = content.split('\n')

while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    # Found a server block start
    if stripped == 'server {' or stripped.startswith('server {'):
        # Track brace depth to find the end
        start = i
        depth = 0
        for j in range(i, len(lines)):
            depth += lines[j].count('{') - lines[j].count('}')
            if depth == 0:
                # We found the matching closing brace
                block = '\n'.join(lines[start:j+1])
                blocks.append((start, j+1, block))
                i = j + 1
                break
        else:
            i += 1
    else:
        i += 1

# Find which block contains our domain
target_idx = None
target_block = None
for idx, (start, end, block) in enumerate(blocks):
    if re.search(r'server_name\s+[^;]*' + re.escape(domain), block):
        target_idx = idx
        target_block = block
        print(f"Found domain server block at lines {start+1}-{end} (block #{idx+1})")
        print(f"Block preview (first 5 lines):")
        for l in block.split('\n')[:5]:
            print(f"  {l}")
        break

if target_idx is None:
    print(f"ERROR: Could not find server block for {domain}")
    sys.exit(1)

# Extract the original listen directives and server_name from Webuzo's config
listen_lines = []
server_name_line = None
for line in target_block.split('\n'):
    stripped = line.strip()
    if stripped.startswith('listen '):
        listen_lines.append(stripped)
        print(f"  Preserving listen: {stripped}")
    if stripped.startswith('server_name '):
        server_name_line = stripped
        print(f"  Preserving server_name: {stripped}")

if not listen_lines:
    listen_lines = ['listen 80;', 'listen [::]:80;']
    print("  No listen directives found, using defaults")

if not server_name_line:
    server_name_line = f'server_name {domain} www.{domain};'

listen_block = '\n    '.join(listen_lines)

# Build the replacement server block
# NOTE: bash heredoc expands $var, so Nginx $host etc. must be escaped as \$ below
new_block = f"""# === {domain} — Node.js reverse proxy (auto-configured) ===
server {{
    {listen_block}

    {server_name_line}

    # Reverse proxy to Next.js app on port 3000 (PM2)
    location / {{
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        # Proxy headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        proxy_buffering off;
        proxy_cache_bypass \$http_upgrade;
    }}

    # Static assets — cache aggressively
    location /_next/static/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }}

    location /images/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }}

    location /gallery/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }}

    # Block hidden/sensitive files
    location ~ /\\. {{
        deny all;
        access_log off;
        log_not_found off;
    }}

    access_log /usr/local/apps/nginx/logs/{domain}.access.log;
    error_log /usr/local/apps/nginx/logs/{domain}.error.log;
}}"""

# Reconstruct the file: keep everything before and after the target block
target_start, target_end, _ = blocks[target_idx]

# Lines before the target block
before = lines[:target_start]
# Lines after the target block
after = lines[target_end:]

# Assemble new content
new_lines = before + new_block.split('\n') + after
new_content = '\n'.join(new_lines)

with open(vhost_file, 'w') as f:
    f.write(new_content)

print(f"Successfully replaced server block for {domain}")
print(f"Original block had {target_end - target_start} lines")
print(f"New block has {len(new_block.split(chr(10)))} lines")
PYEOF

if [ $? -ne 0 ]; then
  print_err "Python script failed — restoring backup"
  cp "$BACKUP" "$VHOST_FILE"
  exit 1
fi

print_ok "Patched server block for $DOMAIN"

# --- 5. Ensure log directory exists -----------------------------------------
print_step "Ensuring Nginx log directory exists"
mkdir -p /usr/local/apps/nginx/logs
print_ok "Log directory ready: /usr/local/apps/nginx/logs/"

# --- 6. Test Nginx config ---------------------------------------------------
print_step "Testing Nginx configuration"

if nginx -t 2>&1; then
  print_ok "Nginx config test passed!"
else
  print_err "Nginx config test FAILED — restoring backup"
  cp "$BACKUP" "$VHOST_FILE"
  print_ok "Restored backup"
  exit 1
fi

# --- 6. Reload Nginx --------------------------------------------------------
print_step "Reloading Nginx"

if systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null || nginx -s reload 2>/dev/null; then
  print_ok "Nginx reloaded"
else
  print_err "Could not reload Nginx"
  echo "  Try: systemctl restart nginx"
  exit 1
fi

# --- 7. Verify ---------------------------------------------------------------
print_step "Verifying"

sleep 2

# Test via localhost first
HTTP_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://127.0.0.1:3000/ 2>/dev/null || echo "000")
print_ok "Node app (localhost:3000): HTTP $HTTP_LOCAL"

# Test via domain
HTTP_DOMAIN=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://$DOMAIN/" 2>/dev/null || echo "000")
if echo "$HTTP_DOMAIN" | grep -q "200\|302\|301"; then
  print_ok "Site is LIVE at http://$DOMAIN/ (HTTP $HTTP_DOMAIN)"
else
  print_warn "Domain returned HTTP $HTTP_DOMAIN"
  echo "  The Node app may still be starting up, or check DNS."
  echo "  pm2 status"
  echo "  tail -f /var/log/nginx/${DOMAIN}.error.log"
fi

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  Done! Your domain should now serve the Next.js app.${NC}"
echo -e "${GREEN}  If you see the default page, clear browser cache (Ctrl+Shift+R)${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "Backup of original config: $BACKUP"
echo ""
