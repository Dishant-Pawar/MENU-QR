# 🚀 Installation & Setup Guide

Follow these steps to complete the refactoring setup.

## Step 1: Install Dependencies

Run this command to install all new dependencies including the testing framework:

```bash
pnpm install
```

This will install:
- `vitest` - Testing framework
- `@vitest/ui` - Test UI
- `@vitest/coverage-v8` - Coverage reporting
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Jest DOM matchers
- `@vitejs/plugin-react` - Vite React plugin
- `jsdom` - DOM implementation for testing

## Step 2: Verify Installation

After installation, verify everything works:

```bash
# Run tests to verify setup
pnpm test:run

# Check for TypeScript errors
pnpm check-types

# Try running the dev server
pnpm dev
```

## Step 3: Expected Results

### ✅ Successful Installation

You should see:
```
✓ src/config/__tests__/routes.config.test.ts (8 tests)
✓ src/middleware/__tests__/performance-logger.middleware.test.ts (6 tests)
✓ src/server/api/__tests__/router.registry.test.ts (7 tests)
✓ src/server/api/__tests__/trpc.test.ts (3 tests)

Test Files  4 passed (4)
     Tests  24 passed (24)
```

### ✅ Dev Server Running

Console output should show:
```
[PERF] GET / - 45ms
[PERF] GET /api/trpc - 123ms
```

## Step 4: Explore New Features

### Check Performance Monitoring

Open browser console and try:
```javascript
// Print all dev info
window.devUtils.printDevInfo()

// Check performance summary
window.devUtils.printPerformanceSummary()

// Check for slow routes
window.devUtils.checkSlowRoutes(500)
```

### Run Migration Helper

Check for hardcoded routes in your codebase:
```bash
node scripts/check-routes.js
```

### Open Test UI

Launch interactive test interface:
```bash
pnpm test:ui
```

## Troubleshooting

### Issue: pnpm not found

**Solution:**
```bash
npm install -g pnpm
```

### Issue: Tests fail to run

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate Prisma client
pnpm prisma generate

# Check for missing dependencies
pnpm install
```

### Issue: Build fails

**Solution:**
```bash
# Clear build cache
rm -rf .next

# Rebuild
pnpm build
```

## What's Next?

After successful installation:

1. **Read Documentation**
   - [QUICKSTART.md](QUICKSTART.md) - Quick start guide
   - [REFACTORING.md](REFACTORING.md) - Complete details
   - [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Coding standards

2. **Review Examples**
   - [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx)

3. **Start Developing**
   - Use [CHECKLIST.md](CHECKLIST.md) as your guide
   - Follow naming conventions
   - Write tests for new features
   - Monitor performance

## Quick Command Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Testing
pnpm test                   # Run tests (watch mode)
pnpm test:run              # Run tests once
pnpm test:coverage         # Generate coverage
pnpm test:ui               # Open test UI

# Code Quality
pnpm lint                   # Run linter
pnpm format                 # Format code
pnpm check-types           # Type check

# Utilities
node scripts/check-routes.js  # Check hardcoded routes
```

## Verification Checklist

After installation, verify:

- [ ] `pnpm install` completed without errors
- [ ] `pnpm test:run` shows all tests passing
- [ ] `pnpm check-types` shows no errors
- [ ] `pnpm dev` starts successfully
- [ ] Performance logs appear in console
- [ ] Browser devtools shows `window.devUtils` available
- [ ] `node scripts/check-routes.js` runs successfully

## Expected File Changes

After installation, you should see:

### Modified Files:
- `package.json` - Updated with new dependencies and scripts
- `pnpm-lock.yaml` - Updated lock file

### No Changes Needed to:
- All new files created by refactoring
- Your existing source code
- Configuration files

## Getting Help

If you encounter issues:

1. Check [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) for overview
2. Review [TROUBLESHOOTING](#troubleshooting) section above
3. Check test files for usage examples
4. Verify all steps were followed in order

## Success Indicators

You'll know everything is working when:

1. ✅ All tests pass
2. ✅ Dev server starts and shows performance logs
3. ✅ No TypeScript errors
4. ✅ `window.devUtils` available in browser
5. ✅ Migration script runs without errors

---

## 🎉 Congratulations!

Once installation is complete, you'll have:
- ✅ Full testing infrastructure
- ✅ Performance monitoring
- ✅ Centralized route management
- ✅ Development utilities
- ✅ Comprehensive documentation

**You're ready to start developing! 🚀**

---

**Last Updated:** January 30, 2026
**Estimated Installation Time:** 2-5 minutes
**Prerequisites:** Node.js 18+, pnpm
