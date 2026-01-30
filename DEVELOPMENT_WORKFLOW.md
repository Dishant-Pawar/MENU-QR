# 🚀 Development Workflow

Quick reference guide for daily development tasks in the MenuQR project.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp exampal.env MenuQR.env
# Edit MenuQR.env with your credentials

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Visit: http://localhost:3000

---

## Daily Development

### 1. Before Starting Work

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Run tests to ensure everything works
pnpm test:run

# Check for errors
pnpm build
```

### 2. During Development

#### Creating a New Feature

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Write code...

# Run tests frequently
pnpm test

# Check types
pnpm tsc --noEmit
```

#### Testing Your Changes

```bash
# Run all tests
pnpm test:run

# Watch mode for active development
pnpm test

# Check coverage
pnpm test:coverage

# Test specific file
pnpm test security.utils.test.ts
```

#### Performance Monitoring

The performance logger runs automatically in development. Watch console output:

```
🚀 GET /api/menus - 145ms (Fast) ✅
⚠️  POST /api/menus - 520ms (Slow)
🔥 GET /api/dishes - 1250ms (Very Slow)
```

### 3. Before Committing

**Pre-commit Checklist:**

```bash
# 1. Run tests
pnpm test:run

# 2. Check types
pnpm tsc --noEmit

# 3. Format code (if using Prettier)
pnpm format

# 4. Build to verify
pnpm build

# 5. Check for errors
git status
```

**Security Checklist:**
- ✅ All user inputs sanitized with `sanitizeInput()`
- ✅ Resource ownership checked with `checkOwnership()`
- ✅ File uploads validated with `validateFileUpload()`
- ✅ No secrets in code (use env variables)

**Performance Checklist:**
- ✅ Database queries optimized (avoid N+1)
- ✅ Caching applied where appropriate
- ✅ Images optimized
- ✅ Large components code-split

### 4. Committing Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add menu caching functionality"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
# Use GitHub UI to create PR
```

---

## Common Tasks

### Adding a New API Route

1. **Define in routes config** - [src/config/routes.config.ts](src/config/routes.config.ts)
2. **Create tRPC router** - `src/server/api/routers/your-router.ts`
3. **Register in registry** - [src/server/api/router.registry.ts](src/server/api/router.registry.ts)
4. **Write tests** - `src/server/api/routers/__tests__/your-router.test.ts`
5. **Add documentation** - Update API docs

**Example:**

```typescript
// src/server/api/routers/dishes.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { sanitizeInput, checkOwnership } from '~/utils/security.utils';

export const dishesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      menuId: z.string(),
      name: z.string(),
      price: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Sanitize input
      const sanitizedName = sanitizeInput(input.name);
      
      // 2. Check ownership
      const menu = await ctx.db.menus.findUnique({
        where: { id: input.menuId },
      });
      
      checkOwnership(menu?.userId, ctx.user.id);
      
      // 3. Create dish
      return ctx.db.dishes.create({
        data: {
          ...input,
          name: sanitizedName,
        },
      });
    }),
});
```

### Adding a New Page

1. **Create page file** - `src/app/your-page/page.tsx`
2. **Add to routes config** - [src/config/routes.config.ts](src/config/routes.config.ts)
3. **Create page component** - `src/pageComponents/YourPage/index.tsx`
4. **Write tests** - `src/pageComponents/YourPage/__tests__/index.test.tsx`

### Adding a New Component

1. **Create component** - `src/components/YourComponent/index.tsx`
2. **Add styles if needed** - Use Tailwind classes
3. **Export from index** - `src/components/index.ts`
4. **Write tests** - `src/components/YourComponent/__tests__/index.test.tsx`

### Optimizing a Database Query

```typescript
import { QueryCache, cachedQuery } from '~/utils/db-optimization.utils';

const menuCache = new QueryCache<Menu>();

// Instead of direct query:
const menu = await ctx.db.menus.findUnique({
  where: { id },
  include: {
    dishes: true,
    categories: true,
  },
});

// Use cached query:
const menu = await cachedQuery(
  menuCache,
  `menu:${id}`,
  () => ctx.db.menus.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      dishes: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  }),
  300000 // 5 minutes TTL
);
```

### Adding Security to an Endpoint

```typescript
import { 
  sanitizeInput, 
  validateSlug, 
  checkOwnership,
  validateFileUpload 
} from '~/utils/security.utils';

export const yourRouter = createTRPCRouter({
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Sanitize all string inputs
      const sanitizedName = sanitizeInput(input.name);
      
      // 2. Validate slug format
      if (!validateSlug(input.slug)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid slug format',
        });
      }
      
      // 3. Check resource ownership
      const resource = await ctx.db.resources.findUnique({
        where: { id: input.id },
      });
      
      checkOwnership(resource?.userId, ctx.user.id);
      
      // 4. Proceed with update
      return ctx.db.resources.update({
        where: { id: input.id },
        data: {
          name: sanitizedName,
          slug: input.slug,
        },
      });
    }),
});
```

---

## Debugging

### Performance Issues

1. **Check performance logs:**
   - Look for 🔥 (Very Slow) or ⚠️ (Slow) indicators
   - Response times shown in console

2. **Profile database queries:**
   ```typescript
   // Enable Prisma logging
   // In src/server/db.ts
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

3. **Use monitoring utility:**
   ```typescript
   import { monitorQuery } from '~/utils/db-optimization.utils';
   
   const result = await monitorQuery(
     'getMenus',
     () => ctx.db.menus.findMany()
   );
   ```

### Test Failures

```bash
# Run specific test
pnpm test security.utils.test.ts

# Run with verbose output
pnpm test -- --reporter=verbose

# Run in UI mode for debugging
pnpm test:ui
```

### Type Errors

```bash
# Check all types
pnpm tsc --noEmit

# Check specific file
pnpm tsc --noEmit src/utils/security.utils.ts
```

### Security Issues

1. **Check security guide:** [SECURITY_GUIDE.md](SECURITY_GUIDE.md)
2. **Review security checklist**
3. **Test with malicious input:**
   ```typescript
   const xssAttempt = '<script>alert("xss")</script>';
   const result = sanitizeInput(xssAttempt);
   expect(result).not.toContain('<script>');
   ```

---

## Code Review Checklist

When reviewing code (yours or others):

### Functionality
- ✅ Code works as expected
- ✅ Edge cases handled
- ✅ Error handling present
- ✅ Tests pass

### Security
- ✅ Input sanitized
- ✅ Output encoded
- ✅ Authorization checked
- ✅ No sensitive data exposed

### Performance
- ✅ Queries optimized
- ✅ No N+1 queries
- ✅ Caching used appropriately
- ✅ Pagination implemented

### Code Quality
- ✅ Follows naming conventions
- ✅ DRY principle
- ✅ Single responsibility
- ✅ Well commented

### Testing
- ✅ Unit tests written
- ✅ Integration tests if needed
- ✅ Coverage maintained
- ✅ Tests pass

---

## Deployment

### Pre-deployment Checklist

```bash
# 1. All tests pass
pnpm test:run

# 2. Build succeeds
pnpm build

# 3. Environment variables set
# Check production .env

# 4. Database migrations run
pnpm prisma migrate deploy

# 5. Security check
# Review SECURITY_GUIDE.md
```

### Deployment Steps

```bash
# 1. Update version
# Edit package.json version

# 2. Commit and tag
git add .
git commit -m "chore: bump version to X.X.X"
git tag vX.X.X

# 3. Push changes
git push origin main --tags

# 4. Deploy (Vercel/other platform)
# Usually automatic on push to main
```

---

## Resources

- [PROJECT_AUDIT_REPORT.md](PROJECT_AUDIT_REPORT.md) - Comprehensive project audit
- [SECURITY_GUIDE.md](SECURITY_GUIDE.md) - Security best practices
- [PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md) - Performance optimization
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing strategies
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide

---

## Getting Help

### Common Issues

**Issue:** Tests failing  
**Solution:** Run `pnpm install` and `pnpm test:run`

**Issue:** Database connection error  
**Solution:** Check `MenuQR.env` and ensure database is running

**Issue:** Build errors  
**Solution:** Run `pnpm tsc --noEmit` to see type errors

**Issue:** Performance slow  
**Solution:** Check performance logs, review [PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md)

### Contact

- Project Lead: [Your Name]
- Technical Questions: [Team Email]
- Security Issues: security@yourcompany.com

---

**Last Updated:** January 30, 2026
