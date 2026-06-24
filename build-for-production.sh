#!/bin/bash
# ============================================
# Build script for production deployment
# Run this BEFORE uploading to the VPS
# ============================================
set -e

echo "==> Cleaning previous build..."
rm -rf .next

echo "==> Installing dependencies..."
npm install

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Building Next.js (standalone mode)..."
npx next build

echo "==> Copying static assets to standalone..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "==> Creating deployment package..."
tar -czf deploy-package.tar.gz \
  .next/standalone \
  public \
  package.json \
  package-lock.json \
  prisma \
  ecosystem.config.js \
  .env.example

echo ""
echo "==> Build complete!"
echo "==> Deployment package: deploy-package.tar.gz"
echo "==> Upload this to your Webuzo VPS"
ls -lh deploy-package.tar.gz
