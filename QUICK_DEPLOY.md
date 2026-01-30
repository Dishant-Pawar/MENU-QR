# ⚡ Quick Production Deployment Reference

## 🚨 Before First Deploy

```bash
# 1. Seed languages in production database (CRITICAL!)
node seed-languages.js

# 2. Verify build works
pnpm build

# 3. Push to deploy
git push origin main
```

---

## 🔑 Required Environment Variables

**In Vercel Dashboard → Settings → Environment Variables:**

```bash
# Database (REQUIRED)
DATABASE_URL="postgres://postgres:PASSWORD@PROJECT.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@PROJECT.supabase.co:5432/postgres"
SUPABASE_SERVICE_KEY="eyJ..."

# Public (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Payments (Optional - App works without these)
LEMON_SQUEEZY_API_KEY="..."
LEMON_SQUEEZY_STORE_ID="..."
LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID="..."
LEMONS_SQUEEZY_SIGNATURE_SECRET="..."
```

---

## 🐛 Common Issues - Quick Fixes

### "Something went wrong" when creating restaurant
```bash
# Fix: Languages not seeded
node seed-languages.js
```

### Build fails: "LEMON_SQUEEZY_API_KEY is required"
```bash
# This is fixed - just redeploy latest code
git pull origin main
git push origin main
```

### Images not loading
```
# Check next.config.mjs includes your Supabase hostname
# Pattern: **.supabase.co should match all projects
```

---

## 📊 Monitoring Logs

**Search in Vercel Logs:**
```
✅ Success: "[Webhook] Successfully processed"
⚠️ Warning: "[getBaseUrl] Using fallback URL"  
❌ Error:   "[MenuForm] Failed to create/update menu"
```

---

## ✅ Post-Deploy Test Checklist

- [ ] Create restaurant
- [ ] Upload image
- [ ] View public menu
- [ ] Test language switch
- [ ] Check Vercel logs (no errors)

---

## 🆘 Emergency Rollback

```bash
# In Vercel Dashboard
Deployments → Previous deployment → Promote to Production
```

---

## 📞 Support

- **Logs**: Vercel Dashboard → Function Logs
- **Errors**: Sentry Dashboard
- **Email**: support@feastqr.com

---

## 🎯 That's It!

See `PRODUCTION_DEPLOYMENT.md` for full guide.
See `PRODUCTION_AUDIT_SUMMARY.md` for all changes made.
