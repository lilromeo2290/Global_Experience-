# Global Experience — Next.js Web App

Production-ready Next.js 16 standalone app for the Global Experience volunteer / placement platform. Uses MySQL (via Prisma), NextAuth, and Paystack.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack, standalone output)
- **DB**: MySQL via Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Paystack
- **Process manager**: PM2 (on the VPS)
- **Reverse proxy**: Apache (Webuzo default) or Nginx

---

## Deploy to Webuzo VPS (recommended flow)

This repo is set up so you can `git clone` directly on the VPS and run a single deploy script.

### 1. On your Webuzo VPS (via SSH or Webuzo Terminal)

```bash
# Go to your user's home (NOT public_html — we'll symlink later)
cd ~

# Clone the repo
git clone https://github.com/lilromeo2290/Global_Experience-.git global-experience
cd global-experience

# Create your .env from the template
cp .env.production.example .env
nano .env   # fill in real MySQL creds, NEXTAUTH_SECRET, etc.
```

### 2. Create a MySQL database in Webuzo

1. Webuzo Admin → **Database → MySQL Database**
2. Create DB (e.g. `globalexp_app`) + user with full privileges
3. Put the credentials into `.env`:
   ```
   DATABASE_URL=mysql://USER:PASSWORD@localhost:3306/globalexp_app
   ```

### 3. Run the deploy script

```bash
bash deploy.sh
```

This will:
- Install Node.js dependencies
- Generate the Prisma client
- Build Next.js (standalone mode)
- Copy static + public assets into the standalone bundle
- Apply the Prisma schema to your MySQL DB (creates all tables)
- (Re)start PM2 process named `global-experience`
- Save PM2 config so it auto-starts on reboot

### 4. Point your domain to the app

The repo ships an Apache reverse-proxy config in `.htaccess.production`.

```bash
# Copy it to your domain's document root
cp ~/global-experience/.htaccess.production ~/public_html/<your-domain>/.htaccess
```

Then in Webuzo: ensure `AllowOverride All` is set for the domain so `.htaccess` is honored.

### 5. SSL

Webuzo Admin → **SSL → Install SSL** (built-in Let's Encrypt).

---

## Useful PM2 commands

| Action | Command |
|---|---|
| Status | `pm2 status` |
| Live logs | `pm2 logs global-experience` |
| Restart | `pm2 restart global-experience` |
| Stop | `pm2 stop global-experience` |
| Delete | `pm2 delete global-experience` |
| Boot setup | `pm2 startup` then `pm2 save` |

---

## Updating the app after a new push

```bash
cd ~/global-experience
git pull
bash deploy.sh
```

The deploy script is idempotent — it stops the old PM2 process and starts a fresh one.

---

## Local development

```bash
# Install
bun install     # or: npm install

# Generate Prisma client
npx prisma generate

# Create a local SQLite db (dev only — schema uses MySQL in production)
# Edit .env to use a real MySQL URL for dev, or run a local MySQL instance.

# Push schema to dev DB
npx prisma db push

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
.
├── prisma/
│   └── schema.prisma          # 15 MySQL models
├── public/                    # Images, robots.txt, etc.
├── src/
│   ├── app/                   # App Router pages + API routes
│   │   ├── (public pages)
│   │   ├── admin/             # Admin CMS
│   │   └── api/               # REST + NextAuth endpoints
│   ├── components/            # React components (shadcn/ui based)
│   └── lib/                   # Prisma client, auth, utils
├── deploy.sh                  # ← Run on the VPS after git clone
├── .env.production.example    # ← Template, copy to .env on the VPS
├── .htaccess.production       # ← Apache reverse proxy rules
├── ecosystem.config.js        # PM2 process config (used by deploy.sh)
└── next.config.ts             # output: 'standalone'
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 502 Bad Gateway | `pm2 logs global-experience` — usually a missing `.env` or DB connection issue |
| `Prisma Client not found` | `cd ~/global-experience && npx prisma generate && bash deploy.sh` |
| Port 3000 already in use | `pm2 list` → `pm2 delete <name>` then re-run `bash deploy.sh` |
| MySQL connection refused | `service mysql status` (Webuzo) — start it if stopped |
| `.htaccess` not honored | Webuzo → Apache config → set `AllowOverride All` for the domain |
