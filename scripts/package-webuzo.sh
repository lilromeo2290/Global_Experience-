#!/bin/bash
# ============================================================
# Webuzo VPS Deployment Packager for Next.js (standalone)
# ============================================================
# Produces: /home/z/my-project/download/webuzo-deploy.zip
# Upload the zip to public_html on your Webuzo VPS and extract.
# ============================================================

set -e

PROJECT=/home/z/my-project
BUILD_DIR=$PROJECT/.next
STAGE_DIR=/tmp/webuzo-stage
OUT_DIR=$PROJECT/download
ZIP_NAME=webuzo-deploy.zip
APP_NAME=global-experience  # folder name inside public_html

# Cleanup
rm -rf $STAGE_DIR
mkdir -p $STAGE_DIR/$APP_NAME
mkdir -p $OUT_DIR

echo "==> [1/7] Verifying standalone build exists..."
if [ ! -f $BUILD_DIR/standalone/server.js ]; then
  echo "ERROR: .next/standalone/server.js not found. Run 'next build' first."
  exit 1
fi

echo "==> [2/7] Copying standalone server bundle..."
cp -r $BUILD_DIR/standalone/. $STAGE_DIR/$APP_NAME/

echo "==> [3/7] Copying .next/static (compiled assets)..."
mkdir -p $STAGE_DIR/$APP_NAME/.next
cp -r $BUILD_DIR/static $STAGE_DIR/$APP_NAME/.next/static

echo "==> [4/7] Copying public folder (images, etc.)..."
cp -r $PROJECT/public $STAGE_DIR/$APP_NAME/public

echo "==> [5/7] Copying Prisma schema + migrations for Webuzo MySQL setup..."
mkdir -p $STAGE_DIR/$APP_NAME/prisma
cp $PROJECT/prisma/schema.prisma $STAGE_DIR/$APP_NAME/prisma/schema.prisma
# Also bundle the generated prisma client to avoid re-generation on the server
mkdir -p $STAGE_DIR/$APP_NAME/node_modules/.prisma
cp -r $PROJECT/node_modules/.prisma/* $STAGE_DIR/$APP_NAME/node_modules/.prisma/ 2>/dev/null || true

echo "==> [6/7] Writing deployment support files..."
# --- ecosystem.config.js (PM2 process manager) ---
cat > $STAGE_DIR/$APP_NAME/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'global-experience',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      time: true,
    },
  ],
};
EOF

# --- .env.example (production env template) ---
cat > $STAGE_DIR/$APP_NAME/.env.example <<'EOF'
# ============ Webuzo Production Environment ============
# Copy this file to .env and fill in your real Webuzo MySQL credentials.

# MySQL database (Webuzo gives you a DB name, user, password in the control panel)
# Format: mysql://USER:PASSWORD@localhost:3306/DB_NAME
DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME

# NextAuth.js
NEXTAUTH_SECRET=replace-with-a-long-random-string
NEXTAUTH_URL=http://your-domain.com

# App config
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Email (for contact form / nodemailer) - optional
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

# Paystack (donations)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

# Z-AI SDK (chatbot)
ZAI_API_KEY=
EOF

# --- start.sh (manual start without PM2, fallback) ---
cat > $STAGE_DIR/$APP_NAME/start.sh <<'EOF'
#!/bin/bash
# Manual start script (no PM2). Run from inside the app folder.
# Recommended: use PM2 instead (see README.md).
cd "$(dirname "$0")"
mkdir -p logs
[ -f .env ] || { echo "ERROR: .env not found. Copy .env.example to .env first."; exit 1; }
export $(grep -v '^#' .env | xargs)
node server.js 2>&1 | tee logs/output.log
EOF
chmod +x $STAGE_DIR/$APP_NAME/start.sh

# --- .htaccess (Apache reverse proxy to Node.js on port 3000) ---
# Webuzo uses Apache + nginx. This .htaccess lets you serve the Node app
# from public_html without exposing port 3000 to the public internet.
cat > $STAGE_DIR/$APP_NAME/.htaccess <<'EOF'
# Route all traffic to the Node.js app running on port 3000 (PM2)
# Requires mod_proxy and mod_proxy_http enabled in Apache.

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^your-domain\.com$ [NC]
    RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>

<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</IfModule>
EOF

# --- README.md (deployment instructions) ---
cat > $STAGE_DIR/$APP_NAME/README.md <<'EOF'
# Webuzo Deployment - Global Experience

This package contains a Next.js **standalone production build** ready to run on a Webuzo VPS.

## Folder layout (after extraction)
```
public_html/
└── global-experience/
    ├── server.js              # Next.js standalone server entry
    ├── package.json
    ├── ecosystem.config.js    # PM2 config
    ├── start.sh               # Manual start (fallback)
    ├── .htaccess              # Apache reverse proxy rules
    ├── .env.example           # Edit & rename to .env
    ├── README.md              # This file
    ├── public/                # Images & static files
    ├── prisma/
    │   └── schema.prisma
    ├── .next/
    │   └── static/            # Compiled JS/CSS
    ├── node_modules/          # Production deps (incl. Prisma client)
    └── logs/                  # PM2 logs (auto-created)
```

## Deployment steps

### 1. Upload & extract
1. Login to **Webuzo admin panel**.
2. Open **File Manager** → go to `public_html/` for your domain.
3. Upload `webuzo-deploy.zip`.
4. Right-click → **Extract**. You should now have `public_html/global-experience/`.

### 2. Create a MySQL database
1. In Webuzo: **Database → MySQL Database**.
2. Create a new database (e.g. `globalexp_app`).
3. Create a MySQL user with full privileges on this DB.
4. Note the **DB name**, **DB user**, and **DB password**.

### 3. Configure .env
1. In `public_html/global-experience/`, edit `.env.example`.
2. Set `DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME`
3. Set `NEXTAUTH_SECRET` (run `openssl rand -hex 32` to generate).
4. Set `NEXTAUTH_URL=http://your-domain.com`.
5. Save the file as `.env` (rename or copy).

### 4. Apply database schema
Run from inside `public_html/global-experience/` (via SSH or Webuzo Terminal):
```bash
cd ~/public_html/global-experience
npx prisma db push
# Optional: seed initial data
# npx prisma db seed
```
This creates all the tables (User, Program, HeroSlide, FAQ, GalleryImage, etc.) in MySQL.

### 5. Start the app with PM2
Webuzo has Node.js + PM2 pre-installed. From SSH or Webuzo Terminal:
```bash
cd ~/public_html/global-experience
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed instruction to make PM2 auto-start on reboot
```

Verify it's running:
```bash
pm2 status
curl http://127.0.0.1:3000/
```

### 6. Point your domain to the app
Two options:

**Option A — Apache reverse proxy (recommended for Webuzo)**
- Make sure `.htaccess` is in `public_html/global-experience/` (it is, by default).
- In Webuzo: **WebServer → Configuration → Apache → your domain**.
- Make sure `AllowOverride All` is set so `.htaccess` is honored.
- Verify `mod_proxy` and `mod_proxy_http` are enabled (they usually are on Webuzo).
- Visit `http://your-domain.com/` — should now serve the Next.js app.

**Option B — Nginx reverse proxy**
Edit `/etc/nginx/conf.d/<your-domain>.conf` and add:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```
Then `service nginx reload`.

### 7. SSL (Let's Encrypt)
Webuzo has built-in Let's Encrypt: **Webuzo Admin → SSL → Install SSL**.

## Updating the app later
1. Re-upload a fresh `webuzo-deploy.zip`.
2. Extract over the existing folder (backup `.env` first!).
3. `pm2 restart global-experience`.

## Troubleshooting
- **502 Bad Gateway**: PM2 process not running. Run `pm2 status` and `pm2 logs global-experience`.
- **Database connection error**: Check `.env` `DATABASE_URL` and MySQL is running (`service mysql status`).
- **Prisma client missing**: Run `npx prisma generate` inside the app folder.
- **Port 3000 already in use**: `pm2 list` then `pm2 delete <id>` first.

EOF

echo "==> [7/7] Zipping the package..."
cd $STAGE_DIR
rm -f $OUT_DIR/$ZIP_NAME
zip -r -q $OUT_DIR/$ZIP_NAME $APP_NAME/

# Cleanup stage
rm -rf $STAGE_DIR

# Report
echo ""
echo "============================================================"
echo "  DEPLOYMENT PACKAGE READY"
echo "============================================================"
echo "  File:   $OUT_DIR/$ZIP_NAME"
echo "  Size:   $(du -h $OUT_DIR/$ZIP_NAME | cut -f1)"
echo "  App folder inside zip: $APP_NAME/"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Download $OUT_DIR/$ZIP_NAME"
echo "  2. Upload to your Webuzo public_html/"
echo "  3. Extract — you'll get public_html/$APP_NAME/"
echo "  4. Follow README.md inside the extracted folder"
