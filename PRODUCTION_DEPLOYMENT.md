# Production Deployment Guide

## 🚀 Vercel Deployment Checklist

### ✅ Required Environment Variables

Configure these in Vercel Dashboard → Settings → Environment Variables:

#### **Database & Core Services** (REQUIRED)
```bash
DATABASE_URL="postgres://..."              # Supabase connection with pgbouncer
DIRECT_URL="postgresql://..."              # Direct Supabase connection
SUPABASE_SERVICE_KEY="eyJ..."              # Supabase service role key
NEXT_PUBLIC_SUPABASE_URL="https://..."     # Public Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."     # Public Supabase anon key
```

#### **Optional - Payment Integration**
```bash
LEMON_SQUEEZY_API_KEY="..."                # Only if using payments
LEMON_SQUEEZY_STORE_ID="..."               # Only if using payments
LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID="..."# Only if using payments
LEMONS_SQUEEZY_SIGNATURE_SECRET="..."      # Webhook signature verification
```

#### **Optional - Analytics**
```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID="..."         # Umami analytics
NEXT_PUBLIC_UMAMI_URL="..."                # Umami server URL
```

#### **Optional - Custom Domain**
```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"  # Your production URL
FEASTQR_DASHBOARD_URL="https://..."        # Custom dashboard URL
FEASTQR_YWWW_DASHBOARD_URL="https://..."   # Alternative dashboard URL
```

#### **Optional - Monitoring**
```bash
SENTRY_DSN="..."                           # Error tracking (if using Sentry)
```

---

## 🔧 Pre-Deployment Steps

### 1. Database Setup
```bash
# Run Prisma migrations
npx prisma migrate deploy

# Seed languages (CRITICAL - required for menu creation)
node seed-languages.js
```

### 2. Verify Build Locally
```bash
# Clean install
pnpm install

# Test production build
pnpm build

# Check for TypeScript errors
pnpm type-check

# Run tests
pnpm test
```

### 3. Environment Validation
- ✅ All required env vars are set in Vercel
- ✅ Database is accessible from Vercel (check Supabase IP allowlist)
- ✅ Supabase Storage buckets are created
- ✅ Languages table is seeded

---

## 🛡️ Production Safety Features Implemented

### Error Handling
- ✅ Production-ready error logging with context
- ✅ Graceful fallbacks for missing configurations
- ✅ User-friendly error messages (no stack traces to users)
- ✅ Sentry integration for error tracking

### Performance
- ✅ Timeout protection on webhooks (25s limit)
- ✅ Image optimization with Next.js Image
- ✅ SWC minification enabled
- ✅ Compression enabled
- ✅ `poweredByHeader` disabled

### Security
- ✅ HMAC signature verification for webhooks
- ✅ Environment variable validation at build time
- ✅ No secrets exposed to client
- ✅ TypeScript strict mode compliance
- ✅ Input validation with Zod schemas

### Serverless Compatibility
- ✅ No filesystem writes
- ✅ Stateless operations
- ✅ Dynamic environment variable handling
- ✅ Proper runtime configuration (`nodejs` for API routes)
- ✅ No localhost references in production

---

## 🐛 Common Deployment Issues & Fixes

### Issue: "Something went wrong" when creating restaurant

**Cause:** Languages table not seeded in database

**Fix:**
```bash
# Connect to production database
node seed-languages.js
```

### Issue: Build fails with "LEMON_SQUEEZY_API_KEY is required"

**Cause:** Lazy initialization fixed this - ensure latest code is deployed

**Verify:** Check that `src/server/api/routers/payments.ts` uses `getLemonSqueezyClient()` function

### Issue: Images not loading

**Cause:** Supabase domain not in Next.js image config

**Fix:** Add your Supabase project hostname to `next.config.mjs` remotePatterns

### Issue: Webhook signature validation fails

**Cause:** Missing or incorrect `LEMONS_SQUEEZY_SIGNATURE_SECRET`

**Fix:** 
1. Get secret from Lemon Squeezy dashboard
2. Add to Vercel environment variables
3. Redeploy

---

## 📊 Monitoring & Logging

### Logs to Monitor

**Successful Operations:**
```
[Webhook] Successfully processed: subscription_updated
```

**Warnings (Non-Critical):**
```
[Webhook] Unhandled event type: order_created
[getBaseUrl] Using fallback URL - configure NEXT_PUBLIC_SITE_URL
[tRPC] Using fallback URL - configure NEXT_PUBLIC_SITE_URL
```

**Errors (Action Required):**
```
[Webhook] Missing x-signature header
[Webhook] Invalid signature
[Webhook] Database upsert error: ...
[MenuForm] Failed to create/update menu: ...
```

### Recommended Monitoring Tools
1. **Vercel Analytics** - Built-in performance monitoring
2. **Sentry** - Error tracking (already configured)
3. **Supabase Dashboard** - Database performance
4. **Vercel Logs** - Real-time serverless function logs

---

## 🔄 Deployment Workflow

### Push to Main Branch
```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Run `pnpm build`
3. Deploy to production
4. Run health checks

### Manual Deployment via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## ⚠️ Known Limitations & Risks

### Current Risks
1. **Database Language Dependency**: Menu creation fails if languages not seeded
   - **Mitigation**: Added clear error message, seed script documented
   
2. **Payment Routes Without Config**: Routes fail if Lemon Squeezy not configured
   - **Mitigation**: Lazy initialization prevents build failures
   
3. **Long Webhook Processing**: Could timeout on Vercel's 10s limit for hobby plan
   - **Mitigation**: Added 25s timeout protection, webhook processing is fast
   
4. **Image URLs in Seed Data**: localhost references in seed.sql
   - **Impact**: Only affects seeded dev data, not production

### Performance Considerations
- Supabase free tier: 500MB database, 1GB storage
- Vercel hobby: 100GB bandwidth/month
- Cold start latency: ~1-2s for first request
- Image optimization: On-demand, cached at edge

---

## 🎯 Post-Deployment Verification

### Critical Paths to Test

1. **Authentication**
   - Sign up new user
   - Log in
   - Log out

2. **Menu Creation**
   - Create restaurant ✅ FIXED
   - Upload images
   - Add dishes
   - Publish menu

3. **Public Menu View**
   - Access via slug
   - Language switching
   - Mobile responsive

4. **Payments** (if configured)
   - Create checkout
   - Cancel subscription
   - View subscription status

### Health Check Endpoints
```bash
# App loads
curl https://your-domain.com

# tRPC health
curl https://your-domain.com/api/trpc

# Check Vercel deployment
vercel --prod --confirm
```

---

## 📈 Performance Optimization Opportunities

### Future Improvements
1. **Add React Query Caching**: Reduce duplicate API calls
2. **Implement ISR**: For public menu pages
3. **Add CDN**: For static assets
4. **Database Indexes**: Optimize frequent queries
5. **Connection Pooling**: Already using pgbouncer ✅
6. **Rate Limiting**: Add to webhook endpoints
7. **Compression**: Already enabled ✅

---

## 🆘 Support & Troubleshooting

### Getting Help
- **Vercel Logs**: Dashboard → Deployments → View Function Logs
- **Supabase Logs**: Dashboard → Logs Explorer
- **Sentry**: Error tracking dashboard
- **Support Email**: support@feastqr.com

### Debug Mode
Set in Vercel environment variables (development/preview only):
```bash
DEBUG=true
NODE_ENV=development  # For verbose logging
```

---

## ✅ Final Pre-Launch Checklist

- [ ] All required environment variables configured
- [ ] Database migrations applied
- [ ] Languages table seeded
- [ ] Successful production build locally
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Supabase storage buckets created
- [ ] Custom domain configured (if applicable)
- [ ] DNS records pointed to Vercel
- [ ] SSL certificate active
- [ ] Sentry error tracking configured
- [ ] Analytics configured
- [ ] Tested critical user flows
- [ ] Webhook endpoints tested
- [ ] Image uploads working
- [ ] Payment flow tested (if applicable)
- [ ] Mobile responsive verified
- [ ] Performance metrics acceptable
- [ ] Error boundaries working
- [ ] 404 page working
- [ ] Error page working

---

## 🎉 You're Ready for Production!

Your application is now production-ready with:
- ✅ TypeScript strict mode compliance
- ✅ Proper error handling and logging
- ✅ Vercel serverless optimization
- ✅ Security best practices
- ✅ Performance optimizations
- ✅ Comprehensive monitoring

**Deploy with confidence! 🚀**
