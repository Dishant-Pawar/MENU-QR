# Vercel Deployment Checklist

## Issues Fixed ✅

1. **Duplicate `runtimeEnv` in src/env.mjs** - FIXED
   - Removed duplicate environment variable mappings

2. **Prisma version mismatch** - FIXED
   - Aligned `@prisma/client` to version 5.22.0 (was 5.4.1)
   - Now matches `prisma` devDependency version 5.22.0

3. **next.config.mjs syntax error** - FIXED
   - Removed problematic JSDoc type cast in spread operator

## Required Environment Variables in Vercel

### Critical (Required for deployment)
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `DIRECT_URL` - Direct database connection
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- ✅ `SUPABASE_SERVICE_KEY` - Supabase service role key
- ⚠️ `NEXT_PUBLIC_APP_URL` - **MISSING** - Set to: `https://menu-qr-lovat.vercel.app`

### Optional (For full functionality)
- `LEMON_SQUEEZY_API_KEY` - Payment provider
- `LEMONS_SQUEEZY_SIGNATURE_SECRET` - Payment webhooks
- `LEMON_SQUEEZY_STORE_ID` - Store identifier
- `LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID` - Subscription plan
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Analytics
- `NEXT_PUBLIC_UMAMI_URL` - Analytics endpoint
- `SENTRY_AUTH_TOKEN` - Error tracking (if enabled)

## Vercel Settings to Check

1. **Build & Development Settings**
   - Build Command: `pnpm run build` ✅
   - Install Command: `pnpm install && pnpm prisma generate` ✅
   - Node.js Version: 18.x or 20.x ✅

2. **Environment Variables**
   - Go to: Project Settings → Environment Variables
   - Add missing `NEXT_PUBLIC_APP_URL` with value: `https://menu-qr-lovat.vercel.app`
   - Set scope to: Production, Preview, Development

3. **Build Cache**
   - If still seeing old errors, disable build cache temporarily:
   - Project Settings → General → Build & Development Settings
   - Redeploy without cache from Deployments tab

## Supabase Configuration

### Required Actions
1. **Database Trigger** (For new user registration)
   ```sql
   CREATE TRIGGER on_auth_user_created
   AFTER INSERT ON auth.users
   FOR EACH ROW
   EXECUTE FUNCTION public.handle_new_user();
   ```
   - Run this in: Supabase Dashboard → SQL Editor

2. **Redirect URLs**
   - Go to: Authentication → URL Configuration
   - Add these to redirect URLs:
     - `https://menu-qr-lovat.vercel.app/auth/confirm`
     - `https://menu-qr-lovat.vercel.app/dashboard`
     - `https://menu-qr-lovat.vercel.app/**` (wildcard)

## Post-Deployment Testing

1. **User Registration Flow**
   - Register new user
   - Check email confirmation redirect
   - Verify profile created in Supabase

2. **Menu Creation**
   - Login with new user
   - Create restaurant menu
   - Verify permissions work correctly

3. **Account Deletion**
   - Navigate to Settings
   - Test account deletion flow
   - Confirm all data removed

## Common Deployment Errors & Solutions

### Error: "missing ) after argument list"
- **Cause**: Duplicate code or syntax errors in config files
- **Solution**: Fixed in env.mjs (removed duplicate runtimeEnv)

### Error: "Prisma version mismatch"
- **Cause**: @prisma/client and prisma versions don't match
- **Solution**: Aligned both to 5.22.0 in package.json

### Error: "Failed to load next.config.mjs"
- **Cause**: Syntax error in next.config.mjs or env.mjs
- **Solution**: Removed problematic type cast and duplicate code

### Error: "Environment variable validation failed"
- **Cause**: Missing required environment variables
- **Solution**: Add all required variables in Vercel dashboard

## Next Steps

1. ⚠️ **IMMEDIATE**: Add `NEXT_PUBLIC_APP_URL` to Vercel environment variables
2. ⚠️ **CRITICAL**: Run database trigger SQL in Supabase dashboard
3. ✅ Update Supabase redirect URLs
4. ✅ Test deployment after these changes
5. ✅ Monitor deployment logs for any new issues

## Contact & Resources

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard/project/pwlbowhzyxqvihiygnlh
- Production URL: https://menu-qr-lovat.vercel.app
- Repository: https://github.com/Dishant-Pawar/MENU-QR
