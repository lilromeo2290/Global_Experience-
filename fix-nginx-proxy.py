#!/usr/bin/env python3
"""
fix-nginx-proxy.py — Surgically inject reverse proxy into globalexperiencegh.org server blocks
in Webuzo's webuzoVH.conf, preserving all other domains and Webuzo directives.
"""

import re
import shutil
import subprocess
import sys

VHOST_PATH = "/usr/local/apps/nginx/etc/conf.d/webuzoVH.conf"
BACKUP_PATH = VHOST_PATH + ".bak.proxy-fix"
DOMAIN = "globalexperiencegh.org"
PROXY_PORT = 3002

# Read the config
with open(VHOST_PATH, 'r') as f:
    content = f.read()

# Backup first
shutil.copy2(VHOST_PATH, BACKUP_PATH)
print(f"Backup saved to {BACKUP_PATH}")

# The reverse proxy block to inject
PROXY_BLOCK = f"""
        # --- Next.js Reverse Proxy ---
        location / {{
                proxy_pass http://127.0.0.1:{PROXY_PORT};
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_cache_bypass $http_upgrade;
                proxy_read_timeout 300s;
                proxy_connect_timeout 75s;
        }}
        # --- End Next.js Reverse Proxy ---
"""

# Strategy: Find each server block for our domain and inject the proxy location
# We need to handle both HTTP (port 80) and HTTPS (port 443) blocks

lines = content.split('\n')
new_lines = []
i = 0
modified_blocks = 0

while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    # Detect a server block start
    if stripped == 'server {' or stripped.startswith('server {'):
        # Look ahead to find server_name and check if it's our domain
        block_start = i
        brace_depth = 1
        j = i + 1
        is_our_domain = False
        has_return_301 = False
        has_proxy_location = False
        return_301_line = -1
        php_location_start = -1
        php_location_end = -1
        
        while j < len(lines) and brace_depth > 0:
            s = lines[j].strip()
            brace_depth += s.count('{') - s.count('}')
            
            if 'server_name' in s and DOMAIN in s:
                is_our_domain = True
            
            if is_our_domain:
                if 'return 301 https' in s and DOMAIN in s:
                    has_return_301 = True
                    return_301_line = j
                
                if 'location /' in s and 'proxy_pass' in s and str(PROXY_PORT) in s:
                    has_proxy_location = True
                
                # Find the PHP location block to comment out
                if re.match(r'location\s+~\s+\(\\?\.php', s) and php_location_start == -1:
                    php_location_start = j
                
            j += 1
        
        block_end = j - 1  # Last line of this server block
        
        if is_our_domain:
            print(f"\nFound {'HTTPS' if 'ssl' in lines[i+1] else 'HTTP'} server block for {DOMAIN} (lines {block_start+1}-{block_end+1})")
            
            if has_proxy_location:
                print(f"  Already has reverse proxy to port {PROXY_PORT}, skipping.")
                # Just copy lines as-is
                for k in range(block_start, block_end + 1):
                    new_lines.append(lines[k])
                i = block_end + 1
                continue
            
            # Process this block
            modified_blocks += 1
            
            for k in range(block_start, block_end + 1):
                s = lines[k].strip()
                
                # For HTTP block: keep the return 301 redirect (it sends to HTTPS)
                # But we still need a location / for cases where redirect doesn't apply
                
                # Comment out the PHP location block since we're not serving PHP
                if k == php_location_start:
                    # Comment out from here until the closing }
                    new_lines.append(f"        #DISABLED: {lines[k]}")
                    # Find the closing brace of this location block
                    depth = 1
                    k2 = k + 1
                    while k2 <= block_end and depth > 0:
                        s2 = lines[k2].strip()
                        depth += s2.count('{') - s2.count('}')
                        if depth > 0:
                            new_lines.append(f"        #DISABLED: {lines[k2]}")
                        else:
                            new_lines.append(f"        #DISABLED: {lines[k2]}")
                        k2 += 1
                    # Skip the lines we just commented out
                    # We need to advance k past these lines
                    # Since we're in a for loop, we'll use a marker
                    # Actually, let's just mark them and skip
                    for skip_k in range(k + 1, k2):
                        lines[skip_k] = None  # Mark for skipping
                    continue
                
                # Skip lines marked as None
                if lines[k] is None:
                    continue
                
                # Insert the proxy block right before the webmail location or error_log
                # Best place: right after the fpmsocket line, before any location blocks
                if 'fpmsocket' in s and DOMAIN in lines[block_start] or ('fpmsocket' in s and any(DOMAIN in lines[x] for x in range(block_start, k))):
                    new_lines.append(lines[k])
                    # Insert proxy block here (after fpmsocket, before location blocks)
                    if not has_return_301:
                        # HTTPS block or HTTP block without redirect
                        new_lines.append(PROXY_BLOCK)
                    else:
                        # HTTP block with 301 redirect — still add proxy for completeness
                        # (the redirect happens first, but if someone hits a path that 
                        # doesn't redirect, the proxy will handle it)
                        new_lines.append(PROXY_BLOCK)
                    continue
                
                new_lines.append(lines[k])
            
            i = block_end + 1
            continue
    
    # Skip None lines
    if line is None:
        i += 1
        continue
    
    new_lines.append(line)
    i += 1

# Write the modified config
result = '\n'.join(new_lines)

with open(VHOST_PATH, 'w') as f:
    f.write(result)

print(f"\nModified {modified_blocks} server block(s).")

# Test nginx config
print("\nTesting Nginx config...")
result = subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-t'], 
                       capture_output=True, text=True)
if result.returncode == 0:
    print("✓ Nginx config test PASSED")
    # Clear cache
    import os
    cache_dir = "/usr/local/apps/nginx/var/cache"
    if os.path.exists(cache_dir):
        for f in os.listdir(cache_dir):
            fp = os.path.join(cache_dir, f)
            if os.path.isfile(fp):
                os.remove(fp)
            elif os.path.isdir(fp):
                shutil.rmtree(fp)
        print("✓ Nginx proxy cache cleared")
    
    # Reload
    subprocess.run(['/usr/local/apps/nginx/sbin/nginx', '-s', 'reload'])
    print("✓ Nginx reloaded")
else:
    print("✗ Nginx config test FAILED:")
    print(result.stderr)
    print("\nRestoring backup...")
    shutil.copy2(BACKUP_PATH, VHOST_PATH)
    print("Backup restored. Please check the errors above.")
    sys.exit(1)

print(f"\nDone! Your app should now be accessible at https://{DOMAIN}")
print(f"App is running on port {PROXY_PORT} via PM2.")
