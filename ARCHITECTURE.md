# Project Architecture Overview

This document provides a visual overview of the refactored architecture.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Next.js    │  │    React     │  │   Tailwind   │         │
│  │  App Router  │  │  Components  │  │     CSS      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Middleware Layer                           │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Performance Logger (NEW)                            │       │
│  │  - Request timing                                    │       │
│  │  - Response metrics                                  │       │
│  │  - Slow request warnings                             │       │
│  └─────────────────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Language Detection                                  │       │
│  │  - Cookie management                                 │       │
│  │  - Header parsing                                    │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Configuration Layer (NEW)                    │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Route Config    │  │  Router Registry │                    │
│  │  APP_ROUTES      │  │  ROUTER_REGISTRY │                    │
│  │  - Type-safe     │  │  - Centralized   │                    │
│  │  - Single source │  │  - Metadata      │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer (tRPC)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Menus   │  │   Auth   │  │Languages │  │ Payments │       │
│  │  Router  │  │  Router  │  │  Router  │  │  Router  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │     Prisma       │  │    Supabase      │                    │
│  │  - ORM           │  │  - Auth          │                    │
│  │  - Type safety   │  │  - Storage       │                    │
│  │  - Migrations    │  │  - Real-time     │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
src/
│
├── config/ (NEW)                    # Configuration management
│   ├── routes.config.ts             # Centralized routes
│   └── __tests__/                   # Route tests
│
├── middleware/  (ENHANCED)          # Request/Response processing
│   ├── performance-logger.middleware.ts  # NEW: Performance tracking
│   └── __tests__/                   # Middleware tests
│
├── server/
│   └── api/
│       ├── router.registry.ts (NEW) # Centralized router management
│       ├── root.ts (SIMPLIFIED)     # Router exports
│       ├── trpc.ts                  # tRPC setup
│       ├── routers/                 # Individual routers
│       │   ├── auth.ts
│       │   ├── menus.ts
│       │   ├── languages.ts
│       │   └── payments.ts
│       └── __tests__/ (NEW)         # API tests
│
├── test/ (NEW)                      # Test configuration
│   └── setup.ts
│
├── utils/
│   └── dev-utils.ts (NEW)           # Development utilities
│
└── examples/ (NEW)                  # Code examples
    └── route-usage.examples.tsx
```

## 🔄 Request Flow

```
1. Client Request
   └─> http://app.com/menu/restaurant-123
        │
        ▼
2. Next.js Middleware
   ├─> Performance Logger starts timer
   ├─> Language detection
   └─> Route protection check (uses APP_ROUTES)
        │
        ▼
3. Route Handler (Next.js App Router)
   └─> Uses APP_ROUTES.MENU.VIEW('restaurant-123')
        │
        ▼
4. tRPC API Call (if needed)
   ├─> Router Registry lookup
   ├─> menusRouter.getBySlug
   └─> Context includes user, db
        │
        ▼
5. Data Layer
   ├─> Prisma ORM query
   └─> Supabase storage access
        │
        ▼
6. Response
   ├─> Performance Logger records time
   ├─> Adds X-Response-Time header
   └─> Logs to console (dev mode)
        │
        ▼
7. Client Receives Response
   └─> React component renders
```

## 🧪 Testing Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vitest Framework                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Unit Tests                    Integration Tests                │
│  ┌─────────────────┐          ┌─────────────────┐             │
│  │ Route Config    │          │ tRPC Routers    │             │
│  │ Performance     │          │ API Endpoints   │             │
│  │ Router Registry │          │ Middleware      │             │
│  └─────────────────┘          └─────────────────┘             │
│                                                                 │
│  Test Utilities                Coverage Reports                 │
│  ┌─────────────────┐          ┌─────────────────┐             │
│  │ Mock Data       │          │ v8 Provider     │             │
│  │ Helpers         │          │ HTML Reports    │             │
│  │ Fixtures        │          │ JSON Output     │             │
│  └─────────────────┘          └─────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Route Management Flow

```
Before Refactoring:
   Component → Hardcoded String "/menu/create" → Navigate
   ❌ No type safety
   ❌ Hard to find usages
   ❌ Easy to make typos

After Refactoring:
   Component → APP_ROUTES.MENU.CREATE → Navigate
   ✅ Type-safe
   ✅ Auto-completion
   ✅ Easy to refactor
   ✅ Single source of truth
```

## 📊 Performance Monitoring Flow

```
Request Arrives
    │
    ▼
Middleware Starts
    │
    ├─> Start Performance Timer
    │
    ▼
Process Request
    │
    ├─> Execute route handler
    ├─> Call tRPC procedures
    └─> Fetch from database
    │
    ▼
Response Ready
    │
    ├─> Stop Performance Timer
    ├─> Calculate Duration
    ├─> Add X-Response-Time Header
    │
    ▼
Log Performance
    │
    ├─> Console Output (dev)
    │   [PERF] GET /menu - 45ms
    │
    ├─> Store Metrics
    │   └─> In-memory buffer (last 100)
    │
    └─> Check Threshold
        └─> Warn if > 1000ms
```

## 🔌 Router Registry Pattern

```
Traditional Approach:
   root.ts
     ├─> Import router A
     ├─> Import router B
     ├─> Import router C
     └─> Manually combine

New Centralized Approach:
   router.registry.ts
     ├─> ROUTER_REGISTRY
     │     ├─> menus: menusRouter
     │     ├─> auth: authRouter
     │     └─> ...
     │
     ├─> ROUTER_METADATA
     │     ├─> menus: { critical: true, ... }
     │     └─> ...
     │
     └─> Helper Functions
           ├─> getRegisteredRouters()
           ├─> isRouterRegistered()
           └─> getCriticalRouters()

   root.ts (simplified)
     └─> export { appRouter } from './router.registry'
```

## 🛠️ Development Workflow

```
Developer Starts Work
    │
    ▼
Check Checklist (CHECKLIST.md)
    │
    ▼
Write Code
    │
    ├─> Use APP_ROUTES for navigation
    ├─> Follow naming conventions
    └─> Monitor performance in console
    │
    ▼
Write Tests
    │
    ├─> Add to __tests__ folder
    └─> Run: pnpm test
    │
    ▼
Before Commit
    │
    ├─> pnpm test:run
    ├─> pnpm lint
    ├─> pnpm check-types
    └─> node scripts/check-routes.js
    │
    ▼
Commit & Push
    │
    ▼
CI/CD Pipeline Runs
    │
    ├─> Run tests
    ├─> Check types
    ├─> Run linter
    └─> Build project
```

## 📚 Documentation Hierarchy

```
README.md (Entry Point)
    │
    ├─> INSTALLATION.md
    │   └─> Step-by-step setup
    │
    ├─> QUICKSTART.md
    │   └─> Get started quickly
    │
    ├─> REFACTORING.md
    │   ├─> Complete details
    │   ├─> Usage examples
    │   └─> Migration guide
    │
    ├─> REFACTORING_SUMMARY.md
    │   └─> High-level overview
    │
    ├─> NAMING_CONVENTIONS.md
    │   └─> Coding standards
    │
    ├─> CHECKLIST.md
    │   └─> Development workflow
    │
    └─> src/examples/
        └─> Code examples
```

## 🎨 Component Integration

```
Menu Component Example:

┌─────────────────────────────────────┐
│        MenuCard.tsx                 │
│                                     │
│  import { APP_ROUTES }              │
│    from '~/config/routes.config'    │
│                                     │
│  function MenuCard({ slug }) {      │
│    const router = useRouter()      │
│                                     │
│    const handleView = () => {       │
│      router.push(                   │
│        APP_ROUTES.MENU.VIEW(slug)   │ ← Type-safe
│      )                              │
│    }                                │
│                                     │
│    return (                         │
│      <Link                          │
│        href={                       │
│          APP_ROUTES.MENU.MANAGE     │ ← Auto-complete
│            (slug)                   │
│        }                            │
│      >                              │
│        Manage Menu                  │
│      </Link>                        │
│    )                                │
│  }                                  │
└─────────────────────────────────────┘
```

## 🔐 Type Safety Benefits

```
TypeScript Inference:

APP_ROUTES.MENU.VIEW('test')
    ↓
Type: string
Value: "/menu/test"
    ↓
Auto-completion in IDE
Error checking at compile time
Refactoring support
Find all usages
```

---

## 📈 Metrics & Monitoring

```
Performance Metrics:
┌─────────────────────────────────────┐
│ Path: /menu/test                    │
│ Method: GET                         │
│ Duration: 45ms                      │
│ Timestamp: 2026-01-30T10:30:00Z    │
└─────────────────────────────────────┘
    │
    ├─> Console Output (Development)
    ├─> Response Header (Always)
    └─> In-memory Storage (Analytics)

Aggregated Metrics:
┌─────────────────────────────────────┐
│ Average Response Times:             │
│ /menu/[slug]: 45ms                  │
│ /api/trpc: 123ms                    │
│ /menu/create: 234ms                 │
└─────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Easy testing
- ✅ Performance monitoring
- ✅ Maintainable codebase
- ✅ Developer-friendly tooling
