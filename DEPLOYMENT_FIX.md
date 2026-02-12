# Deployment Fix for QR Code Menu URLs

## Issues Fixed ✅

### 1. **i18n Configuration Conflict (CRITICAL)**
The `i18n` configuration in `next.config.mjs` is **NOT compatible** with Next.js App Router and was causing deployment failures.

**Fixed:** Commented out the i18n configuration.

### 2. **Missing Dynamic Params Configuration**
The dynamic route `/menu/[slug]` didn't have `dynamicParams = true` set, which is required for handling dynamic slugs at runtime.

**Fixed:** Added `export const dynamicParams = true;` to `src/app/menu/[slug]/page.tsx`

### 3. **Unnecessary Route Configuration**
The custom routes in `vercel.json` were redundant and could interfere with Next.js App Router's automatic routing.

**Fixed:** Removed custom routes from `vercel.json`.

## Deploy to Vercel

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix: Remove i18n config conflict and add dynamic params for menu routes"
git push
```

### Step 2: Verify Environment Variables in Vercel
Go to your Vercel project dashboard → Settings → Environment Variables and ensure these are set:

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `DIRECT_URL` - Direct database connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL (e.g., `https://testing-code-puce.vercel.app`)

### Step 3: Redeploy
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the three dots next to the latest deployment
3. Select "Redeploy"
4. OR: Just push your code changes and Vercel will auto-deploy

### Step 4: Test Your QR Code
After successful deployment, scan your QR code. The URL should now work:
`https://testing-code-puce.vercel.app/menu/prasad-malegoan-736`

## Troubleshooting

### If you still get 404:
1. **Check Build Logs**: Ensure the build completes without errors
2. **Verify Route**: Make sure the slug `prasad-malegoan-736` exists in your database
3. **Check Database Connection**: Verify DATABASE_URL is correctly set in Vercel

### If build fails:
1. Clear Vercel build cache:
   - Project Settings → General → Build & Development Settings
   - Redeploy without cache
2. Check that all environment variables are set correctly
3. Review build logs for specific error messages

## What Changed

### Files Modified:
1. **src/app/menu/[slug]/page.tsx**
   - Added `export const dynamicParams = true;`
   
2. **next.config.mjs**
   - Commented out `i18n` configuration (incompatible with App Router)
   
3. **vercel.json**
   - Removed unnecessary custom routes

## Next Steps

After deployment:
1. Test the menu URL in your browser
2. Scan the QR code to verify it works
3. If you have multiple menu slugs, test a few more to ensure they all work

The main issue was the `i18n` configuration conflicting with Next.js 13+ App Router. This has been resolved.
