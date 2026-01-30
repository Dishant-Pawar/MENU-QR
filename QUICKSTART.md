# Quick Start Guide - Refactored Project

This guide helps you get started with the newly refactored codebase.

## 🚀 Installation

```bash
# Install dependencies
pnpm install

# Run tests to verify everything works
pnpm test:run
```

## 📝 Key Changes You Need to Know

### 1. Centralized Routes

**Before:**
```typescript
router.push('/menu/create');
router.push(`/menu/${slug}`);
```

**After:**
```typescript
import { APP_ROUTES } from '~/config/routes.config';

router.push(APP_ROUTES.MENU.CREATE);
router.push(APP_ROUTES.MENU.VIEW(slug));
```

### 2. Performance Monitoring

Performance is now automatically logged. Check your console during development:

```
[PERF] GET /menu/test - 45ms
[PERF] POST /api/trpc/menus.create - 234ms
```

Slow requests (>1000ms) will show a warning.

### 3. Running Tests

```bash
# Watch mode (recommended during development)
pnpm test

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# Interactive UI
pnpm test:ui
```

## 🛠️ Common Tasks

### Adding a New Route

1. Open [src/config/routes.config.ts](src/config/routes.config.ts)
2. Add your route to the appropriate section:

```typescript
export const APP_ROUTES = {
  // ... existing routes
  SETTINGS: '/settings',
  PROFILE: (userId: string) => `/profile/${userId}`,
} as const;
```

### Adding a New tRPC Router

1. Create your router file in `src/server/api/routers/`
2. Open [src/server/api/router.registry.ts](src/server/api/router.registry.ts)
3. Add to registry:

```typescript
import { myNewRouter } from './routers/myNew';

export const ROUTER_REGISTRY = {
  // ... existing routers
  myNew: myNewRouter,
} as const;

export const ROUTER_METADATA = {
  // ... existing metadata
  myNew: {
    name: 'My New Router',
    description: 'Handles new feature',
    critical: false,
  },
} as const;
```

### Writing a Test

1. Create `__tests__` folder next to your source file
2. Create `yourfile.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../yourfile';

describe('YourFeature', () => {
  it('should work correctly', () => {
    const result = yourFunction('test');
    expect(result).toBe('expected');
  });
});
```

### Checking Performance

```typescript
import { getAverageResponseTime, getAllMetrics } from '~/middleware/performance-logger.middleware';

// Get average time for a route
const avgTime = getAverageResponseTime('/api/trpc/menus.getAll');
console.log(`Average: ${avgTime}ms`);

// Get all metrics
const metrics = getAllMetrics();
console.log(`Total requests: ${metrics.length}`);
```

## 🔍 Migration Helpers

### Check for Hardcoded Routes

Run this script to find hardcoded routes in your code:

```bash
node scripts/check-routes.js
```

It will show you files that might need updating.

### Development Utilities

In the browser console, you can use:

```javascript
// Print all development info
window.devUtils.printDevInfo();

// Check performance
window.devUtils.printPerformanceSummary();

// Check slow routes
window.devUtils.checkSlowRoutes(500); // threshold in ms

// Validate routes
window.devUtils.validateRouteConfig();
```

## 📚 Documentation Files

- [REFACTORING.md](REFACTORING.md) - Complete refactoring details
- [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Naming standards
- [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - Code examples

## ⚡ Development Workflow

1. **Start development server:**
   ```bash
   pnpm dev
   ```

2. **Run tests in watch mode:**
   ```bash
   pnpm test
   ```

3. **Before committing:**
   ```bash
   pnpm test:run
   pnpm lint
   pnpm check-types
   ```

## 🎯 Best Practices

1. ✅ Always use `APP_ROUTES` instead of hardcoded strings
2. ✅ Write tests for new features
3. ✅ Follow naming conventions in NAMING_CONVENTIONS.md
4. ✅ Check performance logs for slow operations
5. ✅ Run tests before committing

## 🆘 Troubleshooting

### Tests Failing

```bash
# Clear test cache
pnpm test -- --clearCache

# Run specific test
pnpm test -- routes.config.test.ts
```

### Performance Issues

Check the console for slow requests and optimize:

```bash
# Check for routes >500ms
window.devUtils.checkSlowRoutes(500);
```

### Type Errors

```bash
# Check TypeScript errors
pnpm check-types
```

## 📞 Need Help?

1. Check [REFACTORING.md](REFACTORING.md) for detailed information
2. Look at [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) for code examples
3. Review test files in `__tests__` folders for usage patterns

---

**Happy coding! 🚀**
