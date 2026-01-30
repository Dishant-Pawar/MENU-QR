# 📚 Documentation Index

Welcome to the MenuQR documentation! This index helps you find the right documentation for your needs.

## 🚀 Getting Started

Start here if you're new to the refactored codebase:

1. **[INSTALLATION.md](INSTALLATION.md)** ⭐ START HERE
   - Install dependencies
   - Verify setup
   - Troubleshooting
   - Quick commands

2. **[QUICKSTART.md](QUICKSTART.md)**
   - Quick start guide
   - Common tasks
   - Development workflow
   - Best practices

3. **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)**
   - What was changed
   - Benefits summary
   - Quick reference
   - Key takeaways

## 📖 Detailed Documentation

Dive deeper into specific topics:

### Architecture & Design

- **[ARCHITECTURE.md](ARCHITECTURE.md)**
  - System architecture diagrams
  - Request flow
  - Component integration
  - Directory structure

- **[REFACTORING.md](REFACTORING.md)**
  - Complete refactoring details
  - Usage examples
  - Migration guide
  - Performance monitoring

### Standards & Guidelines

- **[NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)**
  - File naming rules
  - Variable conventions
  - TypeScript guidelines
  - Git commit format

- **[CHECKLIST.md](CHECKLIST.md)**
  - Development workflow
  - Before committing
  - Testing requirements
  - Code review prep

## 🔧 Technical Reference

### Configuration

- **[src/config/routes.config.ts](src/config/routes.config.ts)**
  - Centralized route definitions
  - Route helpers
  - Type-safe navigation

- **[src/server/api/router.registry.ts](src/server/api/router.registry.ts)**
  - tRPC router registry
  - Router metadata
  - Helper functions

### Middleware

- **[src/middleware/performance-logger.middleware.ts](src/middleware/performance-logger.middleware.ts)**
  - Performance monitoring
  - Metrics collection
  - Logging utilities

- **[src/middleware.ts](src/middleware.ts)**
  - Main middleware
  - Language detection
  - Request processing

### Testing

- **[vitest.config.ts](vitest.config.ts)**
  - Test configuration
  - Coverage settings

- **[src/test/setup.ts](src/test/setup.ts)**
  - Global test setup
  - Mock configuration

## 💡 Examples & Utilities

### Code Examples

- **[src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx)**
  - 10+ practical examples
  - Navigation patterns
  - Route protection
  - Best practices

### Development Tools

- **[src/utils/dev-utils.ts](src/utils/dev-utils.ts)**
  - Performance utilities
  - Router info
  - Development helpers

- **[scripts/check-routes.js](scripts/check-routes.js)**
  - Find hardcoded routes
  - Migration helper
  - Code analysis

## 📋 By Use Case

### "I want to..."

#### ...get started quickly
1. [INSTALLATION.md](INSTALLATION.md) - Install dependencies
2. [QUICKSTART.md](QUICKSTART.md) - Start developing
3. [CHECKLIST.md](CHECKLIST.md) - Follow workflow

#### ...understand the architecture
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Visual diagrams
2. [REFACTORING.md](REFACTORING.md) - Detailed explanation
3. [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Overview

#### ...add new routes
1. [src/config/routes.config.ts](src/config/routes.config.ts) - Add route
2. [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - See examples
3. [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Follow standards

#### ...add new tRPC routers
1. [src/server/api/router.registry.ts](src/server/api/router.registry.ts) - Register router
2. [REFACTORING.md](REFACTORING.md#router-registry-system) - Read guide
3. [src/server/api/__tests__/](src/server/api/__tests__/) - See test examples

#### ...write tests
1. [CHECKLIST.md](CHECKLIST.md#testing-requirements) - Requirements
2. [src/config/__tests__/](src/config/__tests__/) - See examples
3. [QUICKSTART.md](QUICKSTART.md#writing-a-test) - Quick guide

#### ...monitor performance
1. [src/middleware/performance-logger.middleware.ts](src/middleware/performance-logger.middleware.ts) - API reference
2. [REFACTORING.md](REFACTORING.md#performance-logging-middleware) - Usage guide
3. [src/utils/dev-utils.ts](src/utils/dev-utils.ts) - Dev tools

#### ...follow best practices
1. [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Standards
2. [CHECKLIST.md](CHECKLIST.md) - Workflow
3. [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - Examples

#### ...migrate existing code
1. [scripts/check-routes.js](scripts/check-routes.js) - Find hardcoded routes
2. [REFACTORING.md](REFACTORING.md#migration-guide) - Migration guide
3. [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - Before/after

## 📑 By Document Type

### Setup & Installation
- [INSTALLATION.md](INSTALLATION.md) - Complete installation guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide

### Architecture & Design
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [REFACTORING.md](REFACTORING.md) - Refactoring details
- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Summary

### Standards & Process
- [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Naming standards
- [CHECKLIST.md](CHECKLIST.md) - Development checklist

### Code & Examples
- [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx) - Code examples
- [src/utils/dev-utils.ts](src/utils/dev-utils.ts) - Utilities

## 🎯 Quick Links by Role

### For New Developers
1. [INSTALLATION.md](INSTALLATION.md)
2. [QUICKSTART.md](QUICKSTART.md)
3. [ARCHITECTURE.md](ARCHITECTURE.md)
4. [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx)

### For Maintainers
1. [REFACTORING.md](REFACTORING.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)
4. [src/server/api/router.registry.ts](src/server/api/router.registry.ts)

### For Reviewers
1. [CHECKLIST.md](CHECKLIST.md)
2. [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)
3. Test files in `__tests__/` folders

### For DevOps
1. [.github/workflows/ci.yml](.github/workflows/ci.yml)
2. [INSTALLATION.md](INSTALLATION.md)
3. [vitest.config.ts](vitest.config.ts)

## 📊 File Statistics

| Category | Files | Lines of Code |
|----------|-------|---------------|
| Documentation | 8 | ~3,000 |
| Source Code | 6 | ~600 |
| Tests | 4 | ~400 |
| Configuration | 3 | ~100 |
| Scripts | 1 | ~100 |
| **Total** | **22** | **~4,200** |

## 🔍 Search Tips

### Find by keyword:

- **Routes**: [routes.config.ts](src/config/routes.config.ts), [REFACTORING.md](REFACTORING.md#centralized-route-configuration)
- **Performance**: [performance-logger.middleware.ts](src/middleware/performance-logger.middleware.ts), [REFACTORING.md](REFACTORING.md#performance-logging-middleware)
- **Testing**: [CHECKLIST.md](CHECKLIST.md#testing-requirements), test files
- **Router**: [router.registry.ts](src/server/api/router.registry.ts), [REFACTORING.md](REFACTORING.md#router-registry-system)
- **Naming**: [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)
- **Setup**: [INSTALLATION.md](INSTALLATION.md)

## 📞 Support Resources

### Primary Documentation
- **Main README**: [README.md](README.md)
- **This Index**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

### Quick References
- **Commands**: [QUICKSTART.md](QUICKSTART.md#quick-command-reference)
- **Checklist**: [CHECKLIST.md](CHECKLIST.md#quick-commands-reference)
- **Examples**: [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx)

### Troubleshooting
- **Installation Issues**: [INSTALLATION.md](INSTALLATION.md#troubleshooting)
- **Development Issues**: [CHECKLIST.md](CHECKLIST.md#troubleshooting-checklist)
- **Performance Issues**: [REFACTORING.md](REFACTORING.md#performance-monitoring)

## 🗺️ Documentation Map

```
MenuQR Documentation Structure

README.md (Main entry)
    │
    ├─── INSTALLATION.md (Setup)
    │    └─── QUICKSTART.md (Get started)
    │
    ├─── REFACTORING_SUMMARY.md (Overview)
    │    └─── REFACTORING.md (Details)
    │         └─── ARCHITECTURE.md (Deep dive)
    │
    ├─── NAMING_CONVENTIONS.md (Standards)
    │    └─── CHECKLIST.md (Workflow)
    │
    └─── Examples & References
         ├─── route-usage.examples.tsx
         ├─── dev-utils.ts
         └─── Test files
```

## ✨ Document Quality

All documentation includes:
- ✅ Clear purpose and scope
- ✅ Code examples
- ✅ Command references
- ✅ Visual diagrams (where applicable)
- ✅ Cross-references to related docs
- ✅ Troubleshooting sections
- ✅ Quick reference tables

## 🎓 Learning Path

**Beginner** (Day 1)
1. [INSTALLATION.md](INSTALLATION.md)
2. [QUICKSTART.md](QUICKSTART.md)
3. [src/examples/route-usage.examples.tsx](src/examples/route-usage.examples.tsx)

**Intermediate** (Week 1)
1. [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md)
4. [CHECKLIST.md](CHECKLIST.md)

**Advanced** (Month 1)
1. [REFACTORING.md](REFACTORING.md)
2. Source code deep dive
3. Test implementation
4. Performance optimization

---

## 📅 Last Updated

- **Date**: January 30, 2026
- **Total Documents**: 22 files
- **Coverage**: Setup, Architecture, Standards, Examples, Tests

---

## 🎯 Next Steps

1. Start with [INSTALLATION.md](INSTALLATION.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Reference [CHECKLIST.md](CHECKLIST.md) during development
4. Bookmark this index for quick navigation

**Happy coding! 🚀**
