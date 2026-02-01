# Production Deployment Guide

## Quick Setup Checklist

### 1. Supabase Configuration

**Database Connection:**
- Connection String: `postgresql://postgres.pwlbowhzyxqvihiygnlh:Ravan%40008%40%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`

postgresql://postgres.pwlbowhzyxqvihiygnlh:Ravan%40008%40%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

- Ensure database is **NOT paused** (check Supabase dashboard)
- Disable Row Level Security (RLS) on all tables for now:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE public.menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes_tag DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes_translation DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_languages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories_translation DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_translations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages DISABLE ROW LEVEL SECURITY;
```

**Seed Languages (REQUIRED):**
```sql
-- Run in Supabase SQL Editor
INSERT INTO languages (id, iso_code, name, flag_url)
VALUES 
  (gen_random_uuid(), 'en', 'English', 'https://flagsapi.com/GB/flat/64.png')
ON CONFLICT (name) DO NOTHING;
```

### 2. Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables for **Production, Preview, Development**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pwlbowhzyxqvihiygnlh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGJvd2h6eXhxdmloaXlnbmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzg5OTcsImV4cCI6MjA4NDc1NDk5N30.P-235vR9hJZ55oc61R8EJc4fzmzElJ_FHkuB_CJJkmE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGJvd2h6eXhxdmloaXlnbmxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE3ODk5NywiZXhwIjoyMDg0NzU0OTk3fQ.Eo_TEFo247ZQrrW4pHlYIpmdEXTzPVWIuGw5T_BPug4

# Database - Use the pooler URL (NOT db.pwlbowhzyxqvihiygnlh)
DATABASE_URL=postgresql://postgres.pwlbowhzyxqvihiygnlh:Ravan%40008%40%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Direct Database URL
DIRECT_URL=postgresql://postgres:Ravan%40008%40%40@db.pwlbowhzyxqvihiygnlh.supabase.co:5432/postgres
```

### 3. Vercel Build Configuration

Go to: Vercel Dashboard → Your Project → Settings → General → Build & Development Settings

```bash
Build Command: pnpm run build
Install Command: pnpm install && pnpm prisma generate
Output Directory: .next
```

### 4. Deploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Common Issues & Fixes

### ❌ "Can't reach database server"
**Solution:** 
- Check if Supabase database is paused (Resume it)
- Verify DATABASE_URL uses `aws-1-ap-south-1.pooler.supabase.com` (NOT `db.pwlbowhzyxqvihiygnlh`)
- Ensure password is URL-encoded: `Ravan%40008%40%40`

### ❌ "Something went wrong" when creating restaurant
**Solution:**
- Run language seed SQL (see step 1 above)
- Check RLS is disabled on all tables

### ❌ "Route couldn't be rendered statically"
**Solution:** Already fixed - `export const dynamic = "force-dynamic"` in authenticated routes layout

### ❌ TypeScript build errors
**Solution:** All fixed in latest commits

## Files Modified for Production

- ✅ `next.config.mjs` - Image config with TypeScript const assertion
- ✅ `src/app/(authenticatedRoutes)/layout.tsx` - Dynamic rendering for all auth routes
- ✅ `src/server/api/routers/menus.ts` - Dynamic language lookup
- ✅ `src/server/api/routers/payments.ts` - Lazy Lemon Squeezy client
- ✅ `src/app/payments-api/subscription-updated/route.ts` - Webhook hardening

## Local Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Seed languages (first time only)
node seed-languages.js

# Start dev server
pnpm dev
```

## Production Checklist

- [x] TypeScript strict mode compliance
- [x] Environment variables configured in Vercel
- [x] Database connection uses pooler URL
- [x] Languages seeded in database
- [x] RLS disabled (or proper policies added)
- [x] Build command set to `pnpm run build`
- [x] Dynamic rendering enabled for auth routes
- [ ] Supabase redirect URLs updated with production domain
- [ ] Test restaurant creation on production
- [ ] Test existing restaurants display

## Support

If issues persist, check:
1. Vercel deployment logs
2. Browser console errors (F12)
3. Supabase database status (not paused)
4. Environment variables are saved and deployment rerun

---

**Last Updated:** January 31, 2026
**Production URL:** [Your Vercel deployment URL]
