# ⚡ Performance Optimization Guide

## Overview

This guide covers performance optimization strategies implemented in the MenuQR project and best practices for maintaining high performance.

## Table of Contents

1. [Database Query Optimization](#database-query-optimization)
2. [Caching Strategies](#caching-strategies)
3. [Frontend Performance](#frontend-performance)
4. [API Performance](#api-performance)
5. [Monitoring & Profiling](#monitoring--profiling)

---

## Database Query Optimization

### N+1 Query Problem

❌ **Bad (N+1 queries):**
```typescript
const menus = await db.menus.findMany();
for (const menu of menus) {
  const dishes = await db.dishes.findMany({ where: { menuId: menu.id } });
}
// 1 + N queries!
```

✅ **Good (Single query with include):**
```typescript
const menus = await db.menus.findMany({
  include: { dishes: true }
});
// 1 query!
```

### Select Only Needed Fields

❌ **Bad (Selects everything):**
```typescript
const menu = await db.menus.findFirst({
  where: { id },
  include: { dishes: true } // Gets ALL dish fields
});
```

✅ **Good (Select specific fields):**
```typescript
const menu = await db.menus.findFirst({
  where: { id },
  select: {
    id: true,
    name: true,
    dishes: {
      select: {
        id: true,
        name: true,
        price: true,
      }
    }
  }
});
// Returns only needed data, much faster!
```

### Use Pagination

```typescript
import { getUserMenusPaginated } from '~/utils/db-optimization.utils';

const result = await getUserMenusPaginated(db, userId, page, 10);
// {
//   menus: [...],
//   pagination: { page, pageSize, total, totalPages }
// }
```

### Batch Operations

❌ **Bad (Multiple inserts):**
```typescript
for (const dish of dishes) {
  await db.dishes.create({ data: dish });
}
```

✅ **Good (Batch insert):**
```typescript
await db.dishes.createMany({
  data: dishes
});
```

### Query Performance Monitoring

```typescript
import { monitorQuery } from '~/utils/db-optimization.utils';

const result = await monitorQuery('getMenuBySlug', () =>
  db.menus.findFirst({ where: { slug } })
);
// Logs: [DB QUERY] getMenuBySlug took 45.23ms
// Warns if > 1000ms
```

### Database Indexes

Ensure proper indexes exist:

```sql
-- Good indexes for common queries
CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_menus_slug ON menus(slug);
CREATE INDEX idx_dishes_menu_id ON dishes(menu_id);
CREATE INDEX idx_dishes_category_id ON dishes(category_id);
```

**Check in Prisma schema:**
```prisma
model Menus {
  id     String @id @default(uuid())
  userId String
  slug   String @unique
  
  @@index([userId])
  @@index([slug])
}
```

---

## Caching Strategies

### In-Memory Cache

```typescript
import { cachedQuery, CACHE_TTL } from '~/utils/db-optimization.utils';

// Cache menu for 5 minutes
const menu = await cachedQuery(
  `menu:${slug}`,
  () => db.menus.findFirst({ where: { slug } }),
  CACHE_TTL.MEDIUM
);
```

### Cache Invalidation

```typescript
import { invalidateCachePattern } from '~/utils/db-optimization.utils';

// After updating a menu
await db.menus.update({ where: { id }, data });
invalidateCachePattern(`menu:${slug}`);
```

### Cache Layers

```
┌─────────────────────────────────────┐
│     Browser Cache (Client)          │  ← Fastest
├─────────────────────────────────────┤
│     Next.js Static Generation        │
├─────────────────────────────────────┤
│     In-Memory Cache (Server)         │
├─────────────────────────────────────┤
│     Database Query                   │  ← Slowest
└─────────────────────────────────────┘
```

### CDN for Static Assets

```typescript
// next.config.mjs
const config = {
  images: {
    domains: ['your-cdn.com'],
    loader: 'cloudinary', // or 'imgix', 'akamai'
  },
};
```

### HTTP Caching Headers

```typescript
// For static content
response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

// For dynamic content
response.headers.set('Cache-Control', 'private, max-age=300, must-revalidate');
```

---

## Frontend Performance

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MenuCreator = dynamic(() => import('~/pageComponents/MenuCreator'), {
  loading: () => <Loading />,
  ssr: false,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/menu-image.jpg"
  alt="Menu"
  width={800}
  height={600}
  quality={85}
  loading="lazy"
  placeholder="blur"
/>
```

### React Query Optimization

```typescript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['menu', slug],
  queryFn: () => api.menus.getBySlug.query({ slug }),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  cacheTime: 10 * 60 * 1000,
});
```

### Prefetching

```typescript
import { PrefetchTRPCQuery } from '~/components/PrefetchTRPCQuery';

// Prefetch data before navigation
<Link href="/menu/create">
  <PrefetchTRPCQuery queryKey={['languages', 'getAll']} />
  Create Menu
</Link>
```

### Virtual Scrolling

For large lists:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: dishes.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
});
```

---

## API Performance

### tRPC Performance Tips

✅ **Batch Multiple Queries:**
```typescript
const [menus, languages, profile] = await Promise.all([
  api.menus.getAll.query(),
  api.languages.getAll.query(),
  api.auth.getProfile.query(),
]);
```

✅ **Use Subscriptions for Real-time:**
```typescript
// Instead of polling
api.menus.getBySlug.useSubscription({ slug });
```

### Compression

```typescript
// next.config.mjs
const config = {
  compress: true, // Enable gzip compression
};
```

### Response Size Optimization

❌ **Bad (Large response):**
```json
{
  "menu": {
    "id": "...",
    "name": "...",
    "dishes": [
      { "id": "...", "name": "...", "description": "...", ... }, // 100 fields
      // ... 200 dishes
    ]
  }
}
```

✅ **Good (Paginated, minimal fields):**
```json
{
  "dishes": [
    { "id": "...", "name": "...", "price": 10.99 }, // Only needed fields
    // ... 20 dishes per page
  ],
  "pagination": {
    "page": 1,
    "total": 200,
    "hasMore": true
  }
}
```

---

## Monitoring & Profiling

### Performance Monitoring

Built-in performance logger tracks every request:

```typescript
// Automatically logs in console
[PERF] GET /menu/test-restaurant - 45ms
[PERF] POST /api/trpc/menus.create - 234ms
⚠️  Slow request detected: GET /api/menus took 1250ms
```

### Browser DevTools

```javascript
// In browser console
window.devUtils.printPerformanceSummary();
// Shows average, min, max response times per route

window.devUtils.checkSlowRoutes(500);
// Lists all routes slower than 500ms
```

### Database Performance

```typescript
import { checkDatabaseHealth } from '~/utils/db-optimization.utils';

const health = await checkDatabaseHealth(db);
// { healthy: true, latency: 23 }
```

### Prisma Query Logging

```typescript
// In development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// See all queries in console with timing
```

### Performance Budgets

Set performance targets:

```typescript
const PERFORMANCE_BUDGETS = {
  API_RESPONSE_TIME: 500, // ms
  PAGE_LOAD_TIME: 2000, // ms
  BUNDLE_SIZE: 250, // KB
  IMAGE_SIZE: 200, // KB
};
```

---

## Performance Checklist

### Database

- [ ] Indexes on frequently queried columns
- [ ] Select only needed fields
- [ ] Use pagination for large datasets
- [ ] Avoid N+1 queries
- [ ] Use batch operations
- [ ] Monitor slow queries

### Caching

- [ ] Implement query caching
- [ ] Cache static content
- [ ] Use CDN for assets
- [ ] Set proper HTTP cache headers
- [ ] Implement cache invalidation

### Frontend

- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Lazy loading for heavy components
- [ ] React Query caching configured
- [ ] Virtual scrolling for large lists

### API

- [ ] Response size optimized
- [ ] Compression enabled
- [ ] Rate limiting implemented
- [ ] Batch requests where possible
- [ ] Monitor API response times

---

## Common Performance Issues

### Issue: Slow Menu Loading

**Diagnosis:**
```typescript
// Check query performance
const start = performance.now();
const menu = await db.menus.findFirst({ where: { slug } });
console.log(`Query took: ${performance.now() - start}ms`);
```

**Solutions:**
1. Add caching
2. Optimize query (select specific fields)
3. Add database indexes
4. Use pagination

### Issue: Large Bundle Size

**Diagnosis:**
```bash
npm run build
# Check .next/analyze or bundle analyzer
```

**Solutions:**
1. Dynamic imports for large components
2. Remove unused dependencies
3. Use tree-shaking
4. Optimize images

### Issue: Slow Initial Page Load

**Solutions:**
1. Use Next.js Static Generation
2. Implement skeleton loading
3. Optimize fonts (subset, preload)
4. Defer non-critical scripts

---

## Performance Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Time to First Byte (TTFB) | < 200ms | Monitor |
| First Contentful Paint | < 1.8s | Monitor |
| Largest Contentful Paint | < 2.5s | Monitor |
| Time to Interactive | < 3.8s | Monitor |
| API Response Time | < 500ms | ✅ Monitored |
| Database Query Time | < 100ms | ✅ Monitored |

### Tools

- **Lighthouse:** Web performance audit
- **Chrome DevTools:** Performance profiling
- **Prisma Studio:** Database query analysis
- **Next.js Bundle Analyzer:** Bundle size analysis
- **React DevTools Profiler:** Component rendering

---

## Advanced Optimizations

### Database Connection Pooling

```typescript
// Prisma handles this automatically, but you can configure:
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  connection_limit = 10
}
```

### Read Replicas

For high-traffic apps:

```typescript
// Primary for writes
const primaryDb = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

// Replica for reads
const replicaDb = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_REPLICA_URL } }
});
```

### Edge Caching

```typescript
// Vercel Edge Functions
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Runs on edge, closer to users
}
```

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)

**Last Updated:** January 30, 2026
