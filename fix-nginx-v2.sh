#!/usr/bin/env bash
# ============================================================
#  Webuzo Nginx Fix v3 — Patch ALL server blocks for a domain
# ============================================================
#  Webuzo creates separate HTTP (port 80) and HTTPS (port 443)
#  server blocks. We need to patch BOTH:
#    - HTTP block  → reverse proxy to port 3000
#    - HTTPS block → reverse proxy to port 3000 (keeps SSL certs)
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
  exit 1
fi

print_ok "Found vhost file: $VHOST_FILE"

# --- 2. Check if the domain exists in the config ----------------------------
print_step "Looking for $DOMAIN in vhost config"

if ! grep -q "server_name.*$DOMAIN" "$VHOST_FILE"; then
  print_err "Domain $DOMAIN not found in $VHOST_FILE"
  exit 1
fi

print_ok "Domain $DOMAIN found in config"

# --- 3. Back up the file ----------------------------------------------------
BACKUP="${VHOST_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$VHOST_FILE" "$BACKUP"
print_ok "Backed up to $BACKUP"

# --- 4. Patch ALL server blocks for this domain ----------------------------
print_step "Patching all server blocks for $DOMAIN"

# Export so Python can read them inside the quoted heredoc
export VHOST_FILE DOMAIN

python3 << 'PYEOF'
import sys, re, os

vhost_file = os.environ.get("VHOST_FILE", "")
domain = os.environ.get("DOMAIN", "")

with open(vhost_file, 'r') as f:
    content = f.read()

# Find ALL server blocks
blocks = []
i = 0
lines = content.split('\n')

while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    if stripped == 'server {' or stripped.startswith('server {'):
        start = i
        depth = 0
        for j in range(i, len(lines)):
            depth += lines[j].count('{') - lines[j].count('}')
            if depth == 0:
                block = '\n'.join(lines[start:j+1])
                blocks.append((start, j+1, block))
                i = j + 1
                break
        else:
            i += 1
    else:
        i += 1

# Find ALL blocks for this domain
target_blocks = []
for idx, (start, end, block) in enumerate(blocks):
    if re.search(r'server_name\s+[^;]*' + re.escape(domain), block):
        is_ssl = bool(re.search(r'ssl_certificate', block))
        target_blocks.append((idx, start, end, block, is_ssl))
        label = "HTTPS" if is_ssl else "HTTP"
        print(f"Found {label} server block at lines {start+1}-{end} (block #{idx+1})")

if not target_blocks:
    print(f"ERROR: Could not find any server block for {domain}")
    sys.exit(1)

print(f"Found {len(target_blocks)} server block(s) for {domain}")

# Process blocks in REVERSE order (so line numbers stay valid after each replacement)
for t_idx, t_start, t_end, t_block, is_ssl in reversed(target_blocks):
    label = "HTTPS" if is_ssl else "HTTP"
    
    # Extract original listen and server_name
    listen_lines = []
    server_name_line = None
    ssl_cert_line = None
    ssl_key_line = None
    
    for line in t_block.split('\n'):
        stripped = line.strip()
        if stripped.startswith('listen '):
            listen_lines.append(stripped)
        if stripped.startswith('server_name '):
            server_name_line = stripped
        if stripped.startswith('ssl_certificate ') and not stripped.startswith('ssl_certificate_key'):
            ssl_cert_line = stripped
        if stripped.startswith('ssl_certificate_key'):
            ssl_key_line = stripped
    
    if not listen_lines:
        listen_lines = ['listen 80;']
    if not server_name_line:
        server_name_line = f'server_name {domain} www.{domain};'
    
    listen_block = '\n    '.join(listen_lines)
    
    print(f"  Patching {label} block:")
    for l in listen_lines:
        print(f"    listen: {l}")
    print(f"    server_name: {server_name_line}")
    
    # Build the replacement server block
    if is_ssl and ssl_cert_line and ssl_key_line:
        # HTTPS block — keep SSL, add proxy
        new_block = f"""# === {domain} — Node.js reverse proxy (auto-configured, HTTPS) ===
server {{
    {listen_block}

    {server_name_line}

    # SSL certificates (preserved from Webuzo)
    {ssl_cert_line}
    {ssl_key_line}

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Reverse proxy to Next.js app on port 3000 (PM2)
    location / {{
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }}

    # Static assets — cache aggressively
    location /_next/static/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }}

    location /images/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }}

    location /gallery/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
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
    else:
        # HTTP block — simple proxy, no SSL
        new_block = f"""# === {domain} — Node.js reverse proxy (auto-configured, HTTP) ===
server {{
    {listen_block}

    {server_name_line}

    # Reverse proxy to Next.js app on port 3000 (PM2)
    location / {{
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }}

    # Static assets — cache aggressively
    location /_next/static/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }}

    location /images/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }}

    location /gallery/ {{
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
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

    # Replace the block in the lines array
    new_lines = lines[:t_start] + new_block.split('\n') + lines[t_end:]
    lines = new_lines
    print(f"  Replaced {label} block successfully")

# Write the final result
new_content = '\n'.join(lines)
with open(vhost_file, 'w') as f:
    f.write(new_content)

print(f"All server blocks for {domain} have been patched")
PYEOF

if [ $? -ne 0 ]; then
  print_err "Python script failed — restoring backup"
  cp "$BACKUP" "$VHOST_FILE"
  exit 1
fi

print_ok "All server blocks patched"

# --- 5. Ensure log directory exists -----------------------------------------
print_step "Ensuring Nginx log directory exists"
mkdir -p /usr/local/apps/nginx/logs
print_ok "Log directory ready"

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

# --- 7. Restart Nginx (reload may not pick up all changes) ------------------
print_step "Restarting Nginx"

if service nginx restart 2>/dev/null || systemctl restart nginx 2>/dev/null; then
  print_ok "Nginx restarted"
else
  print_warn "Could not restart via service/systemctl, trying nginx -s reload"
  nginx -s reload 2>/dev/null && print_ok "Nginx reloaded" || print_err "Could not reload Nginx"
fi

# --- 8. Verify ---------------------------------------------------------------
print_step "Verifying"

sleep 2

# Test Node app directly
HTTP_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://127.0.0.1:3000/ 2>/dev/null || echo "000")
print_ok "Node app (localhost:3000): HTTP $HTTP_LOCAL"

# Test HTTP domain
HTTP_DOMAIN=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://$DOMAIN/" 2>/dev/null || echo "000")
print_ok "http://$DOMAIN/: HTTP $HTTP_DOMAIN"

# Test HTTPS domain (follow redirects)
HTTPS_DOMAIN=$(curl -sL -o /dev/null -w "%{http_code}" --connect-timeout 10 "https://$DOMAIN/" 2>/dev/null || echo "000")
print_ok "https://$DOMAIN/: HTTP $HTTPS_DOMAIN"

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  Done! Both HTTP and HTTPS now proxy to the Node.js app${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "Backup of original config: $BACKUP"
echo ""
