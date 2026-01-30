# 🧪 Testing Guide

## Overview

Comprehensive guide to testing in the MenuQR project, covering unit tests, integration tests, and end-to-end testing strategies.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Setup](#test-setup)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [Testing Best Practices](#testing-best-practices)
6. [Coverage Goals](#coverage-goals)

---

## Testing Philosophy

### The Testing Pyramid

```
        /\
       /E2E\         ← Few, slow, expensive
      /------\
     /  API   \      ← Some, medium speed
    /----------\
   / Unit Tests \    ← Many, fast, cheap
  /--------------\
```

### What to Test

✅ **Always Test:**
- Business logic
- Data transformations
- Security validations
- Error handling
- Edge cases

❌ **Don't Test:**
- Third-party libraries
- Framework internals
- Trivial getters/setters
- UI styling

---

## Test Setup

### Running Tests

```bash
# Watch mode (development)
pnpm test

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# Interactive UI
pnpm test:ui

# Specific file
pnpm test security.utils.test.ts
```

### Test File Structure

```
src/
├── utils/
│   ├── security.utils.ts
│   └── __tests__/
│       └── security.utils.test.ts
│
├── server/api/routers/
│   ├── menus.ts
│   └── __tests__/
│       └── menus.router.test.ts
```

### Naming Convention

- Test files: `*.test.ts` or `*.test.tsx`
- Test folders: `__tests__/`
- Test names: Descriptive, start with "should"

---

## Unit Testing

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MyFeature', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('myFunction', () => {
    it('should handle valid input', () => {
      const result = myFunction('valid');
      expect(result).toBe('expected');
    });

    it('should throw error for invalid input', () => {
      expect(() => myFunction('invalid')).toThrow();
    });
  });
});
```

### Testing Utilities

```typescript
// src/utils/__tests__/security.utils.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateSlug } from '../security.utils';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should escape HTML', () => {
      expect(sanitizeInput('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
  });

  describe('validateSlug', () => {
    it('should accept valid slugs', () => {
      expect(validateSlug('my-restaurant-123')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(validateSlug('test@123')).toBe(false);
    });
  });
});
```

### Testing with Mocks

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('API Call', () => {
  it('should fetch data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: 'test' }),
    });
    
    global.fetch = mockFetch;
    
    const result = await fetchData();
    
    expect(mockFetch).toHaveBeenCalledWith('/api/data');
    expect(result).toEqual({ data: 'test' });
  });
});
```

---

## Integration Testing

### Testing tRPC Routers

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { type PrismaClient } from '@prisma/client';

describe('Menus Router', () => {
  const mockDb = {
    menus: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  } as unknown as PrismaClient;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMenus', () => {
    it('should return user menus', async () => {
      const mockMenus = [
        { id: 'menu-1', name: 'Restaurant', userId: 'user-123' },
      ];

      (mockDb.menus.findMany as any).mockResolvedValue(mockMenus);

      const result = await mockDb.menus.findMany({
        where: { userId: mockUser.id },
      });

      expect(result).toEqual(mockMenus);
    });
  });

  describe('createMenu', () => {
    it('should create menu with valid data', async () => {
      const newMenu = {
        name: 'New Restaurant',
        city: 'New York',
      };

      const createdMenu = {
        id: 'menu-new',
        ...newMenu,
        slug: 'new-restaurant-new-york-123',
      };

      (mockDb.menus.create as any).mockResolvedValue(createdMenu);

      const result = await mockDb.menus.create({
        data: newMenu,
      });

      expect(result).toEqual(createdMenu);
      expect(mockDb.menus.create).toHaveBeenCalled();
    });
  });
});
```

### Testing with Database

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

describe('Database Integration', () => {
  let db: PrismaClient;

  beforeAll(async () => {
    db = new PrismaClient();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should create and retrieve menu', async () => {
    // Create
    const menu = await db.menus.create({
      data: {
        name: 'Test Restaurant',
        slug: 'test-restaurant-' + Date.now(),
        userId: 'test-user',
      },
    });

    expect(menu.id).toBeDefined();

    // Retrieve
    const retrieved = await db.menus.findFirst({
      where: { id: menu.id },
    });

    expect(retrieved?.name).toBe('Test Restaurant');

    // Cleanup
    await db.menus.delete({ where: { id: menu.id } });
  });
});
```

### Testing React Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuCard } from '../MenuCard';

describe('MenuCard', () => {
  it('should render menu name', () => {
    render(<MenuCard name="Test Restaurant" />);
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('should call onEdit when button clicked', async () => {
    const onEdit = vi.fn();
    
    render(<MenuCard name="Test" onEdit={onEdit} />);
    
    const button = screen.getByRole('button', { name: /edit/i });
    await user.click(button);
    
    expect(onEdit).toHaveBeenCalled();
  });
});
```

---

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('should calculate total', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

### 2. Test One Thing

❌ **Bad:**
```typescript
it('should create menu and add dishes and categories', () => {
  // Testing too many things
});
```

✅ **Good:**
```typescript
it('should create menu', () => {
  // Test only menu creation
});

it('should add dish to menu', () => {
  // Test only dish addition
});
```

### 3. Use Descriptive Names

❌ **Bad:**
```typescript
it('test1', () => {});
it('works', () => {});
```

✅ **Good:**
```typescript
it('should throw error when slug is invalid', () => {});
it('should return cached data when available', () => {});
```

### 4. Don't Test Implementation Details

❌ **Bad:**
```typescript
it('should call internal method', () => {
  // Testing implementation
  expect(component.internalMethod).toHaveBeenCalled();
});
```

✅ **Good:**
```typescript
it('should display success message', () => {
  // Testing behavior
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

### 5. Mock External Dependencies

```typescript
// Mock API calls
vi.mock('~/server/supabase/supabaseClient', () => ({
  supabase: () => ({
    from: () => ({
      select: () => ({ data: mockData }),
    }),
  }),
}));
```

### 6. Test Edge Cases

```typescript
describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should reject without @', () => {
    expect(validateEmail('test.com')).toBe(false);
  });

  it('should handle very long emails', () => {
    const longEmail = 'a'.repeat(300) + '@example.com';
    expect(validateEmail(longEmail)).toBe(false);
  });
});
```

---

## Coverage Goals

### Target Coverage

- **Critical paths:** 100%
- **Business logic:** 90%+
- **Utilities:** 90%+
- **UI Components:** 70%+
- **Overall:** 80%+

### Check Coverage

```bash
pnpm test:coverage
```

### Coverage Report

```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
All files                   |   82.5  |   78.3   |   85.1  |   82.9  |
 utils/                     |   95.2  |   92.1   |   97.3  |   95.5  |
  security.utils.ts         |   98.5  |   95.3   |  100.0  |   98.8  |
  db-optimization.utils.ts  |   92.1  |   89.2   |   94.7  |   92.4  |
 server/api/routers/        |   78.3  |   72.5   |   81.2  |   78.9  |
  menus.ts                  |   75.2  |   68.9   |   78.3  |   75.8  |
----------------------------|---------|----------|---------|---------|
```

### Improving Coverage

1. **Identify uncovered code:**
   ```bash
   pnpm test:coverage
   # Open coverage/index.html
   ```

2. **Add tests for uncovered lines**

3. **Focus on critical paths first**

4. **Don't chase 100% blindly** - some code isn't worth testing

---

## Test Organization

### Group Related Tests

```typescript
describe('MenuRouter', () => {
  describe('Public endpoints', () => {
    describe('getMenuBySlug', () => {
      it('should return published menu', () => {});
      it('should return null for unpublished', () => {});
    });
  });

  describe('Private endpoints', () => {
    describe('createMenu', () => {
      it('should require authentication', () => {});
      it('should create menu with valid data', () => {});
    });
  });
});
```

### Use Test Fixtures

```typescript
// test/fixtures/menus.ts
export const mockMenu = {
  id: 'menu-1',
  name: 'Test Restaurant',
  slug: 'test-restaurant-123',
  userId: 'user-1',
};

export const mockMenus = [mockMenu, /* ... */];

// In tests
import { mockMenu } from '~/test/fixtures/menus';

it('should work with menu', () => {
  const result = processMenu(mockMenu);
  expect(result).toBeDefined();
});
```

---

## Common Testing Patterns

### Testing Async Code

```typescript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Testing Errors

```typescript
it('should throw on invalid input', () => {
  expect(() => processData(null)).toThrow('Invalid input');
});

it('should handle async errors', async () => {
  await expect(asyncOperation()).rejects.toThrow('Error');
});
```

### Testing with Timers

```typescript
import { vi } from 'vitest';

it('should debounce calls', () => {
  vi.useFakeTimers();
  
  const fn = vi.fn();
  const debounced = debounce(fn, 1000);
  
  debounced();
  debounced();
  debounced();
  
  expect(fn).not.toHaveBeenCalled();
  
  vi.advanceTimersByTime(1000);
  
  expect(fn).toHaveBeenCalledTimes(1);
  
  vi.useRealTimers();
});
```

---

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test:run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Kent C. Dodds - Testing](https://kentcdodds.com/blog/write-tests)
- [Martin Fowler - Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

**Last Updated:** January 30, 2026
