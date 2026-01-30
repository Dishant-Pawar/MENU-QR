# Development Checklist

Use this checklist to ensure code quality and consistency.

## Before Starting Development

- [ ] Pull latest changes from main branch
- [ ] Install dependencies: `pnpm install`
- [ ] Run existing tests: `pnpm test:run`
- [ ] Verify environment variables in `.env`
- [ ] Start dev server: `pnpm dev`

## During Development

### When Adding New Routes

- [ ] Add route to `src/config/routes.config.ts`
- [ ] Use `APP_ROUTES` constant instead of hardcoded strings
- [ ] Update route metadata if needed
- [ ] Check if route needs protection (auth required)
- [ ] Add tests for route configuration

### When Creating Components

- [ ] Follow naming conventions (PascalCase for components)
- [ ] Use centralized routes from `APP_ROUTES`
- [ ] Add prop type definitions
- [ ] Include JSDoc comments for complex logic
- [ ] Consider adding unit tests

### When Adding tRPC Routers

- [ ] Create router in `src/server/api/routers/`
- [ ] Register in `src/server/api/router.registry.ts`
- [ ] Add to `ROUTER_REGISTRY`
- [ ] Add metadata to `ROUTER_METADATA`
- [ ] Mark as critical if essential for app function
- [ ] Add tests for critical procedures

### When Adding Utilities

- [ ] Use camelCase naming for files
- [ ] Add TypeScript types
- [ ] Include JSDoc documentation
- [ ] Write unit tests
- [ ] Export from `index.ts` if in utils folder

### When Writing Code

- [ ] Follow naming conventions in `NAMING_CONVENTIONS.md`
- [ ] Use TypeScript strict mode (no `any` types)
- [ ] Add error handling where appropriate
- [ ] Consider performance implications
- [ ] Remove console.logs before committing
- [ ] Format code: `pnpm format`

## Testing Requirements

### Unit Tests

- [ ] Write tests for new features
- [ ] Tests in `__tests__` folder or `.test.ts` files
- [ ] Test critical paths and edge cases
- [ ] Mock external dependencies
- [ ] Run tests: `pnpm test`

### Coverage

- [ ] Maintain or improve test coverage
- [ ] Check coverage: `pnpm test:coverage`
- [ ] Critical routes should have 100% coverage

### Performance

- [ ] Check dev console for slow requests (>500ms)
- [ ] Use `window.devUtils.checkSlowRoutes()` in browser
- [ ] Optimize slow operations
- [ ] Consider caching strategies

## Before Committing

### Code Quality

- [ ] Run linter: `pnpm lint`
- [ ] Check types: `pnpm check-types`
- [ ] Format code: `pnpm format`
- [ ] Run all tests: `pnpm test:run`
- [ ] Fix any errors or warnings

### Migration Checks

- [ ] Check for hardcoded routes: `node scripts/check-routes.js`
- [ ] Update any found hardcoded routes
- [ ] Verify route usage with centralized config

### Documentation

- [ ] Update README if needed
- [ ] Add/update JSDoc comments
- [ ] Update relevant documentation files
- [ ] Add examples if introducing new patterns

### Git

- [ ] Review all changes: `git diff`
- [ ] Stage only related changes
- [ ] Write clear commit message (see format below)
- [ ] No sensitive data in commit (check .env files)

## Commit Message Format

```
<type>: <short description>

<optional longer description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `docs`: Documentation changes
- `style`: Code style/formatting
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```
feat: add centralized route configuration

Implemented APP_ROUTES constant to provide a single source of truth
for all application routes. Includes type-safe dynamic route helpers.

Closes #123
```

```
fix: resolve performance logging memory leak

Fixed issue where performance metrics buffer was growing unbounded.
Added MAX_BUFFER_SIZE limit and automatic cleanup.
```

## Before Creating PR

### Code Review Prep

- [ ] All tests passing: `pnpm test:run`
- [ ] No type errors: `pnpm check-types`
- [ ] No lint errors: `pnpm lint`
- [ ] Code formatted: `pnpm format`
- [ ] Build succeeds: `pnpm build`

### Documentation

- [ ] PR title is descriptive
- [ ] PR description explains what and why
- [ ] Link to related issues
- [ ] Add screenshots/videos if UI changes
- [ ] Update CHANGELOG if applicable

### Testing

- [ ] Tests cover new functionality
- [ ] Manual testing completed
- [ ] Edge cases considered
- [ ] Error scenarios tested
- [ ] Performance tested (no major regressions)

## After PR Merge

- [ ] Delete feature branch
- [ ] Verify deploy succeeded
- [ ] Monitor for errors in production
- [ ] Update local main branch: `git pull origin main`
- [ ] Celebrate! 🎉

## Troubleshooting Checklist

### Tests Failing

- [ ] Clear test cache: `pnpm test -- --clearCache`
- [ ] Check for environment variable issues
- [ ] Verify all dependencies installed
- [ ] Check for conflicting test data
- [ ] Review test output for specific errors

### Build Failing

- [ ] Check for TypeScript errors
- [ ] Verify all imports are correct
- [ ] Check environment variables
- [ ] Clear `.next` folder and rebuild
- [ ] Verify all required dependencies installed

### Performance Issues

- [ ] Check console for slow requests
- [ ] Use `window.devUtils.printPerformanceSummary()`
- [ ] Profile with browser DevTools
- [ ] Check database query efficiency
- [ ] Consider implementing caching

### Type Errors

- [ ] Run `pnpm check-types` for details
- [ ] Check import paths
- [ ] Verify type definitions exist
- [ ] Check for circular dependencies
- [ ] Regenerate Prisma client: `pnpm prisma generate`

## Quick Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Testing
pnpm test                   # Run tests (watch mode)
pnpm test:run              # Run tests once
pnpm test:coverage         # Generate coverage report
pnpm test:ui               # Open test UI

# Code Quality
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier
pnpm check-types           # TypeScript type checking

# Database
pnpm db:push               # Push schema to database
pnpm db:start              # Start Supabase locally
pnpm db:stop               # Stop Supabase locally
pnpm prepare:local         # Prepare local database
pnpm prepare:remote        # Prepare remote database

# Custom Scripts
node scripts/check-routes.js  # Check for hardcoded routes
```

## Resources

- [REFACTORING.md](REFACTORING.md) - Complete refactoring guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Naming standards
- [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - Code examples

---

**Remember:** Quality over speed. Take time to do it right! 🚀
