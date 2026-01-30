# Naming Conventions Guide

This document outlines the standardized naming conventions used throughout the project.

## Files and Folders

### TypeScript/React Files
- **Components**: PascalCase with `.tsx` extension
  - ✅ `MenuCard.tsx`
  - ✅ `UserAuthForm.tsx`
  - ❌ `menu-card.tsx`

- **Utilities/Helpers**: camelCase with `.ts` extension
  - ✅ `getBaseUrl.ts`
  - ✅ `uploadFile.ts`
  - ❌ `GetBaseUrl.ts`

- **Configuration Files**: kebab-case with `.config.ts` or `.config.mjs`
  - ✅ `routes.config.ts`
  - ✅ `next.config.mjs`
  - ✅ `tailwind.config.ts`

- **API Routes**: kebab-case with `route.ts`
  - ✅ `route.ts` (in folder structure)
  - ✅ `[trpc]/route.ts` (dynamic routes)

- **Middleware**: kebab-case with `.middleware.ts`
  - ✅ `performance-logger.middleware.ts`
  - ✅ `auth-guard.middleware.ts`

- **Test Files**: Same as source with `.test.ts` or `.test.tsx`
  - ✅ `routes.config.test.ts`
  - ✅ `MenuCard.test.tsx`
  - Tests in `__tests__` folders

### Folders
- **Component Folders**: PascalCase
  - ✅ `MenuCard/`
  - ✅ `UserAuthForm/`
  
- **Utility Folders**: camelCase
  - ✅ `utils/`
  - ✅ `hooks/`
  
- **Route Folders**: kebab-case for multi-word
  - ✅ `privacy-policy/`
  - ✅ `terms-of-service/`
  
- **Special Folders**: camelCase or kebab-case
  - ✅ `pageComponents/`
  - ✅ `(auth)/` (route groups)
  - ✅ `__tests__/` (test folders)

## Variables and Functions

### Variables
- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_FILE_SIZE = 5000000;
  const DEFAULT_LANGUAGE_ID = "a6a94629";
  const APP_ROUTES = { ... };
  ```

- **Regular Variables**: camelCase
  ```typescript
  const userName = "John";
  const isAuthenticated = true;
  const menuData = [];
  ```

- **React Props**: camelCase
  ```typescript
  interface MenuCardProps {
    menuName: string;
    isPublished: boolean;
    onEdit: () => void;
  }
  ```

### Functions
- **Regular Functions**: camelCase
  ```typescript
  function getUserById(id: string) { }
  const fetchMenuData = async () => { };
  ```

- **React Components**: PascalCase
  ```typescript
  function MenuCard() { }
  const UserProfile = () => { };
  ```

- **Hook Functions**: camelCase starting with "use"
  ```typescript
  function useUserSubscription() { }
  const useAuth = () => { };
  ```

- **Utility Functions**: camelCase with descriptive names
  ```typescript
  function formatDate() { }
  function validateEmail() { }
  const getAverageResponseTime = () => { };
  ```

## TypeScript Types and Interfaces

### Interfaces
- PascalCase, typically ending with props for component props
  ```typescript
  interface User { }
  interface MenuCardProps { }
  interface PerformanceMetrics { }
  ```

### Types
- PascalCase
  ```typescript
  type AppRouter = typeof appRouter;
  type MenuStatus = 'draft' | 'published';
  ```

### Enums
- PascalCase for enum name, UPPER_SNAKE_CASE for values
  ```typescript
  enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }
  ```

## Database/Prisma

### Models
- PascalCase singular
  ```prisma
  model Menu { }
  model User { }
  model Dish { }
  ```

### Fields
- camelCase
  ```prisma
  model Menu {
    id String
    createdAt DateTime
    isPublished Boolean
  }
  ```

## API/tRPC

### Router Names
- camelCase plural
  ```typescript
  const menusRouter = createTRPCRouter({ });
  const paymentsRouter = createTRPCRouter({ });
  ```

### Procedure Names
- camelCase, descriptive action
  ```typescript
  getAll: publicProcedure.query()
  createMenu: privateProcedure.mutation()
  updateDish: privateProcedure.mutation()
  ```

## CSS/Styling

### CSS Classes (Tailwind)
- Use Tailwind utility classes as-is
- Custom classes: kebab-case
  ```css
  .custom-scrollbar { }
  .menu-card-shadow { }
  ```

### CSS Modules
- File: `Component.module.css`
- Classes: camelCase in TypeScript
  ```typescript
  import styles from './MenuCard.module.css'
  <div className={styles.menuCard} />
  ```

## Environment Variables

### Format
- UPPER_SNAKE_CASE with prefix
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=
  DATABASE_URL=
  LEMON_SQUEEZY_API_KEY=
  ```

### Prefixes
- `NEXT_PUBLIC_` - Client-side accessible
- No prefix - Server-side only

## Import/Export

### Named Exports (Preferred)
```typescript
export const APP_ROUTES = { };
export function getUserById() { }
export interface MenuProps { }
```

### Default Exports (Components)
```typescript
export default function MenuCard() { }
```

## Comments and Documentation

### File Headers
```typescript
/**
 * Component/Module Name
 * 
 * Brief description of purpose
 */
```

### Function Documentation
```typescript
/**
 * Brief description
 * 
 * @param paramName - Description
 * @returns Description
 */
function myFunction(paramName: string): string { }
```

## Git Commit Messages

### Format
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- test: Adding tests
- docs: Documentation
- style: Formatting, missing semicolons
- chore: Maintenance tasks

### Examples
```
feat: add centralized route configuration
fix: resolve performance logging issue
refactor: standardize naming conventions
test: add unit tests for critical routes
```

## Summary Checklist

- [ ] Files: PascalCase for components, camelCase for utilities, kebab-case for configs
- [ ] Functions: camelCase (PascalCase for React components)
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] Types/Interfaces: PascalCase
- [ ] Folders: Match content type (PascalCase for components, camelCase for utilities)
- [ ] Tests: Match source name with `.test.ts` or `.test.tsx`
- [ ] Environment: UPPER_SNAKE_CASE with appropriate prefix
- [ ] Database: PascalCase models, camelCase fields
