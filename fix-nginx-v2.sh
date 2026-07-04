#!/usr/bin/env bash
# ============================================================
#  Webuzo Nginx Fix v4 — Restore original, then minimal patch
# ============================================================
#  Strategy: restore the original Webuzo config (with working SSL),
#  then make the smallest possible changes to proxy to port 3000.
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
  /etc/nginx/conf.d/webuzoVH.conf; do
  if [ -f "$f" ]; then
    VHOST_FILE="$f"
    break
  fi
done

if [ -z "$VHOST_FILE" ]; then
  print_err "Could not find webuzoVH.conf"
  exit 1
fi

print_ok "Found: $VHOST_FILE"

# --- 2. Restore the EARLIEST (original) backup --------------------------------
print_step "Restoring original Webuzo config from backup"

FIRST_BACKUP=$(ls -t "${VHOST_FILE}".bak.* 2>/dev/null | tail -1)
if [ -n "$FIRST_BACKUP" ]; then
  # Check if this backup has SSL certs (it's the original)
  if grep -q "ssl_certificate.*${DOMAIN}" "$FIRST_BACKUP" 2>/dev/null; then
    cp "$FIRST_BACKUP" "$VHOST_FILE"
    print_ok "Restored original config from $FIRST_BACKUP"
  else
    # Try finding one with SSL
    for bak in $(ls -t "${VHOST_FILE}".bak.* 2>/dev/null); do
      if grep -q "ssl_certificate.*${DOMAIN}" "$bak" 2>/dev/null; then
        cp "$bak" "$VHOST_FILE"
        print_ok "Restored original config from $bak"
        FIRST_BACKUP="$bak"
        break
      fi
    done
  fi
else
  print_warn "No backups found. Using current config."
fi

# Make a fresh backup before patching
FRESH_BACKUP="${VHOST_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$VHOST_FILE" "$FRESH_BACKUP"
print_ok "Fresh backup: $FRESH_BACKUP"

# --- 3. Verify the original has SSL config -----------------------------------
if ! grep -q "ssl_certificate.*${DOMAIN}" "$VHOST_FILE"; then
  print_err "No SSL config found for $DOMAIN in $VHOST_FILE"
  echo "  Cannot proceed — HTTPS will break without proper SSL config."
  echo "  Please re-install SSL via Webuzo admin panel, then re-run this script."
  exit 1
fi

print_ok "SSL config confirmed present"

# --- 4. Patch using Python — minimal surgical changes ------------------------
print_step "Patching server blocks (minimal changes, preserving SSL)"

export VHOST_FILE DOMAIN

python3 << 'PYEOF'
import os, re

vhost_file = os.environ["VHOST_FILE"]
domain = os.environ["DOMAIN"]

with open(vhost_file, 'r') as f:
    content = f.read()

lines = content.split('\n')

# Find all server blocks
blocks = []
i = 0
while i < len(lines):
    stripped = lines[i].strip()
    if stripped == 'server {' or stripped.startswith('server {'):
        start = i
        depth = 0
        for j in range(i, len(lines)):
            depth += lines[j].count('{') - lines[j].count('}')
            if depth == 0:
                blocks.append((start, j+1))
                i = j + 1
                break
        else:
            i += 1
    else:
        i += 1

# Find blocks for our domain
domain_blocks = []
for idx, (start, end) in enumerate(blocks):
    block_text = '\n'.join(lines[start:end])
    if re.search(r'server_name\s+[^;]*' + re.escape(domain), block_text):
        is_ssl = bool(re.search(r'ssl_certificate', block_text))
        domain_blocks.append((start, end, is_ssl))

print(f"Found {len(domain_blocks)} server block(s) for {domain}")
for start, end, is_ssl in domain_blocks:
    label = "HTTPS (port 443)" if is_ssl else "HTTP (port 80)"
    print(f"  Lines {start+1}-{end}: {label}")

# Proxy location block to inject
PROXY_BLOCK = """    # --- Reverse proxy to Node.js app (PM2 on port 3000) ---
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /images/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }

    location /gallery/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }"""

# Process blocks in REVERSE order to preserve line numbers
for start, end, is_ssl in reversed(domain_blocks):
    label = "HTTPS" if is_ssl else "HTTP"
    block_lines = lines[start:end]
    new_block_lines = []

    skip_next_root = False
    added_proxy = False
    skip_return_301 = False

    for line_idx, line in enumerate(block_lines):
        stripped = line.strip()

        # Skip the "return 301 https://..." redirect in HTTP block
        if not is_ssl and re.search(r'return\s+301\s+https://', stripped):
            print(f"  [{label}] Removed: {stripped}")
            continue

        # Skip "if ($request_uri !~ ... redirect" blocks in HTTP
        if not is_ssl and re.search(r'if\s*\(\s*\$request_uri', stripped):
            skip_return_301 = True
            print(f"  [{label}] Removed redirect if-block: {stripped}")
            continue
        if skip_return_301 and stripped == '}':
            skip_return_301 = False
            continue
        if skip_return_301:
            print(f"  [{label}] Removed redirect if-block line: {stripped}")
            continue

        # Skip root directive (we're proxying, not serving files)
        if stripped.startswith('root '):
            print(f"  [{label}] Removed: {stripped}")
            continue

        # Skip index directive
        if stripped.startswith('index '):
            print(f"  [{label}] Removed: {stripped}")
            continue

        # Skip existing location / blocks (replace with our proxy)
        if re.match(r'location\s+/\s*\{', stripped) or stripped == 'location / {':
            # Collect all lines until matching closing brace
            depth = 0
            for j2 in range(line_idx, len(block_lines)):
                depth += block_lines[j2].count('{') - block_lines[j2].count('}')
                if depth == 0:
                    break
            # Skip all these lines (replace with proxy)
            if not added_proxy:
                new_block_lines.extend(PROXY_BLOCK.split('\n'))
                added_proxy = True
                print(f"  [{label}] Replaced 'location /' with reverse proxy")
            # We need to skip lines from line_idx to j2 (inclusive)
            # But we're in a for loop, so we need a different approach
            # Let's mark them for removal
            for skip_idx in range(line_idx + 1, j2 + 1):
                block_lines[skip_idx] = None  # Mark for removal
            continue

        # Skip location blocks for static assets we handle in proxy
        if re.match(r'location\s+/(images|gallery|_next/static)/', stripped) or \
           re.match(r'location\s+/\._next/static/', stripped):
            depth = 0
            for j2 in range(line_idx, len(block_lines)):
                depth += block_lines[j2].count('{') - block_lines[j2].count('}')
                if depth == 0:
                    break
            for skip_idx in range(line_idx + 1, j2 + 1):
                block_lines[skip_idx] = None
            print(f"  [{label}] Removed existing static location block")
            continue

        # Skip lines marked for removal
        if line is None:
            continue

        new_block_lines.append(line)

    # If we never added proxy (no existing location / to replace), add it before closing brace
    if not added_proxy:
        # Find the closing brace and insert before it
        for i2 in range(len(new_block_lines) - 1, -1, -1):
            if new_block_lines[i2].strip() == '}':
                # Insert proxy block before closing brace
                proxy_lines = PROXY_BLOCK.split('\n')
                new_block_lines = new_block_lines[:i2] + proxy_lines + new_block_lines[i2:]
                print(f"  [{label}] Added reverse proxy before closing brace")
                break

    # Replace lines in the main array
    lines = lines[:start] + new_block_lines + lines[end:]

# Write result
new_content = '\n'.join(lines)
with open(vhost_file, 'w') as f:
    f.write(new_content)

print(f"\nPatched successfully")
PYEOF

if [ $? -ne 0 ]; then
  print_err "Python script failed — restoring fresh backup"
  cp "$FRESH_BACKUP" "$VHOST_FILE"
  exit 1
fi

print_ok "Server blocks patched"

# --- 5. Test Nginx config ---------------------------------------------------
print_step "Testing Nginx configuration"

if nginx -t 2>&1; then
  print_ok "Nginx config test passed!"
else
  print_err "Nginx config test FAILED — restoring fresh backup"
  cp "$FRESH_BACKUP" "$VHOST_FILE"
  service nginx restart 2>/dev/null
  exit 1
fi

# --- 6. Restart Nginx --------------------------------------------------------
print_step "Restarting Nginx"
service nginx restart 2>/dev/null || systemctl restart nginx 2>/dev/null
print_ok "Nginx restarted"

# --- 7. Verify ---------------------------------------------------------------
print_step "Verifying"
sleep 2

HTTP_LOCAL=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://127.0.0.1:3000/ 2>/dev/null || echo "000")
print_ok "Node app (localhost:3000): HTTP $HTTP_LOCAL"

HTTP_DOMAIN=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://$DOMAIN/" 2>/dev/null || echo "000")
print_ok "http://$DOMAIN/: HTTP $HTTP_DOMAIN"

HTTPS_DOMAIN=$(curl -sk -o /dev/null -w "%{http_code}" --connect-timeout 10 "https://$DOMAIN/" 2>/dev/null || echo "000")
print_ok "https://$DOMAIN/: HTTP $HTTPS_DOMAIN"

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  Done! Domain should now serve the Next.js app via proxy${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "Backup: $FRESH_BACKUP"
echo ""
