# Task: Build Admin CMS for Global Experience NGO Website

## Summary
Built a complete Admin CMS for the Global Experience NGO website with authentication, CRUD operations for all content types, file upload, and a professional admin dashboard.

## What was done:

### 1. Prisma Schema
- Added 8 new models: AdminUser, HeroSlide, Program, TeamMember, GalleryImage, FAQ, Application, SiteSetting
- Kept existing User and Post models
- Ran `prisma db push` to sync

### 2. NextAuth Configuration
- Created `src/lib/auth.ts` with credentials provider using bcryptjs
- Created `src/app/api/auth/[...nextauth]/route.ts`
- Created `src/middleware.ts` to protect /admin and /api/admin routes
- Added NEXTAUTH_SECRET and NEXTAUTH_URL to .env

### 3. Seed Script
- Created `prisma/seed.ts` that seeds all data
- Admin user: admin@globalexperiencegh.org / romeo@clipe233
- 9 hero slides, 12 programs, 2 team members, 6 gallery images, 10 FAQs, 8 site settings
- Added seed config to package.json

### 4. Admin Layout & Login
- `src/app/admin/layout.tsx` - Conditional layout (sidebar for dashboard, plain for login)
- `src/app/admin/login/page.tsx` - Clean login form with brand styling
- Sidebar with Green Vogue gradient, Cornell Red active state
- Responsive with mobile sheet sidebar and collapsible desktop sidebar

### 5. Dashboard Page
- `src/app/admin/page.tsx` - Stats cards, recent applications, quick actions

### 6. API Routes (all with auth protection)
- Hero slides CRUD
- Programs CRUD
- Team members CRUD
- Gallery images CRUD
- FAQs CRUD
- Applications CRUD (with status management)
- Settings (key-value pairs)
- File upload to /public/uploads/

### 7. Admin CRUD Pages
- Hero slides management with image upload, toggle, reorder
- Programs management with sector, description, toggle, reorder
- Team members management with photo upload, bio, expertise
- Gallery management with category filter, image upload, toggle
- FAQs management with reorder, toggle
- Applications management with status filter, status updates, detail view
- Settings page with contact info and social links

## Key Design Decisions:
- Admin login page uses plain layout (no sidebar) for clean UX
- All API routes check authentication via getServerSession
- File uploads stored in /public/uploads/ with UUID filenames
- Reorder functionality via up/down buttons (simpler than drag-and-drop)
- Brand colors used throughout: Cornell Red (#B31B1B) for accents, Green Vogue (#1A4D2E) for sidebar
