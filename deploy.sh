#!/usr/bin/env bash
# ============================================================
#  Webuzo VPS — One-shot deploy script
# ============================================================
#  Run this on the Webuzo VPS after `git clone`:
#
#      cd ~/public_html
#      git clone https://github.com/lilromeo2290/Global_Experience-.git global-experience
#      cd global-experience
#      cp .env.production.example .env    # then edit .env
#      bash deploy.sh
#
#  What this script does:
#    1. Verifies .env exists
#    2. Installs Node.js deps (bun preferred, falls back to npm)
#    3. Generates Prisma client
#    4. Builds Next.js (standalone output)
#    5. Copies .next/static + public/ into standalone/
#    6. Pushes Prisma schema to MySQL (creates tables)
#    7. (Re)starts PM2 process
#    8. Prints status + URLs
# ============================================================

set -e

# Color codes for nice output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "\n${BLUE}==>${NC} $1"; }
print_ok()   { echo -e "${GREEN}✓${NC} $1"; }
print_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
print_err()  { echo -e "${RED}✗${NC} $1"; }

# --- 0. Sanity checks ---------------------------------------------------------
print_step "Pre-flight checks"

if [ ! -f .env ]; then
  print_err ".env not found."
  echo "    Run: cp .env.production.example .env"
  echo "    Then edit .env with your Webuzo MySQL credentials."
  exit 1
fi

# Load .env
set -a
source .env
set +a

print_ok ".env loaded"
print_ok "DATABASE_URL=${DATABASE_URL:0:30}..."

# Ensure required tools exist
for cmd in node npm; do
  if ! command -v $cmd > /dev/null; then
    print_err "$cmd is not installed. Install Node.js first."
    exit 1
  fi
done
print_ok "Node.js $(node -v) detected"

# --- 1. Install dependencies --------------------------------------------------
print_step "Installing dependencies (this can take a few minutes)"

# Prefer bun if available (faster), fall back to npm
if command -v bun > /dev/null && [ -f bun.lock ]; then
  print_ok "Using bun"
  bun install --production=false
elif [ -f package-lock.json ]; then
  print_ok "Using npm"
  npm ci || npm install
else
  print_ok "Using npm (no lockfile)"
  npm install
fi
print_ok "Dependencies installed"

# --- 2. Generate Prisma client ------------------------------------------------
print_step "Generating Prisma client"
npx prisma generate
print_ok "Prisma client generated"

# --- 3. Build Next.js ---------------------------------------------------------
print_step "Building Next.js (standalone mode)"
NODE_ENV=production npx next build
print_ok "Build complete"

# --- 4. Assemble standalone deployment bundle --------------------------------
print_step "Assembling standalone bundle"

# .next/static → .next/standalone/.next/static
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
print_ok "Copied .next/static"

# public/ → .next/standalone/public
cp -r public .next/standalone/public
print_ok "Copied public/"

# prisma/ → .next/standalone/prisma (so we can run prisma db push from standalone later)
mkdir -p .next/standalone/prisma
cp prisma/schema.prisma .next/standalone/prisma/schema.prisma
print_ok "Copied prisma/schema.prisma"

# Copy .env into standalone so the server has it at runtime
cp .env .next/standalone/.env
print_ok "Copied .env into standalone"

# Copy ecosystem.config.js if present
if [ -f ecosystem.config.js ]; then
  cp ecosystem.config.js .next/standalone/ecosystem.config.js
  print_ok "Copied ecosystem.config.js"
fi

# --- 5. Apply database schema -------------------------------------------------
print_step "Pushing Prisma schema to MySQL"
npx prisma db push --accept-data-loss
print_ok "Database schema applied"

# --- 6. Start / restart PM2 ---------------------------------------------------
print_step "Starting app with PM2"

# Ensure PM2 is installed
if ! command -v pm2 > /dev/null; then
  print_warn "PM2 not found — installing globally..."
  npm install -g pm2
fi

# Move standalone bundle to a stable location so PM2 doesn't break on rebuild
APP_DIR="$HOME/webuzo-app"
rm -rf $APP_DIR
cp -r .next/standalone $APP_DIR
mkdir -p $APP_DIR/logs
print_ok "Deployed standalone bundle to $APP_DIR"

# If an old PM2 process is running, stop it
pm2 delete global-experience 2>/dev/null || true

# Start with PM2
cd $APP_DIR
if [ -f ecosystem.config.js ]; then
  pm2 start ecosystem.config.js
else
  PORT=${PORT:-3000} HOSTNAME=0.0.0.0 pm2 start server.js --name global-experience
fi
pm2 save
print_ok "PM2 process started"

# Try to set up auto-start on boot (may require sudo)
print_step "Enabling PM2 auto-start on boot"
pm2 startup 2>&1 | tail -5 || print_warn "Could not auto-start PM2 on boot (may need sudo)"

# --- 7. Final status ----------------------------------------------------------
print_step "Deployment complete!"

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  App is running on port ${PORT:-3000}${NC}"
echo -e "${GREEN}  PM2 process:  global-experience${NC}"
echo -e "${GREEN}  App folder:   $APP_DIR${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Configure your domain in Webuzo to point to this app"
echo "  2. Use the .htaccess in this folder to reverse-proxy Apache → port ${PORT:-3000}"
echo "  3. Install SSL via Webuzo admin panel"
echo ""
echo "Useful commands:"
echo "  pm2 status                    # check process status"
echo "  pm2 logs global-experience    # view live logs"
echo "  pm2 restart global-experience # restart after .env changes"
echo "  pm2 stop global-experience    # stop the app"
echo ""
