# GitOps CI/CD Documentation

## Overview

This project uses a comprehensive GitOps approach with GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI Tests (`ci.yml`)
**Triggers:** Push to main/develop, Pull requests
- Runs on Node 18.x and 20.x
- Type checking with TypeScript
- ESLint code linting
- Unit and integration tests
- Code coverage reporting to Codecov

### 2. Build & Performance (`build.yml`)
**Triggers:** Push, Pull requests
- Project build verification
- Route checking
- Bundle size analysis
- Build artifact generation

### 3. Database Migrations (`database-migrations.yml`)
**Triggers:** Push to main (migration files), Manual dispatch
- Validates Prisma schema
- Runs Supabase migrations
- Deploys Prisma migrations
- Supports staging and production environments

### 4. Deploy to Vercel (`deploy-vercel.yml`)
**Triggers:** Push to main, Manual dispatch
- Pre-deployment checks (tests, types, lint)
- Production deployment
- Preview deployment support
- Deployment summaries

### 5. Security Scanning (`security.yml`)
**Triggers:** Schedule (weekly), Push, Pull requests
- Dependency review
- NPM security audit
- Snyk vulnerability scanning
- CodeQL static analysis
- Secret scanning with TruffleHog

### 6. PR Checks Enhanced (`pr-checks-enhanced.yml`)
**Triggers:** Pull requests
- Code quality checks
- Test execution
- Build verification
- Bundle size monitoring
- Auto-labeling
- PR summary comments

### 7. Release Management (`release.yml`)
**Triggers:** Version tags, Manual dispatch
- Automated release creation
- Changelog generation
- GitHub release notes
- Version tagging

## Required Secrets

### GitHub Secrets Configuration

#### Vercel
```
VERCEL_TOKEN                 # Vercel authentication token
VERCEL_ORG_ID               # Vercel organization ID
VERCEL_PROJECT_ID           # Vercel project ID
```

#### Supabase
```
SUPABASE_ACCESS_TOKEN                # Supabase CLI access token
PRODUCTION_SUPABASE_PROJECT_REF      # Production project reference
STAGING_SUPABASE_PROJECT_REF         # Staging project reference
NEXT_PUBLIC_SUPABASE_URL             # Production Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY        # Production anon key
SUPABASE_SERVICE_KEY                 # Production service role key
STAGING_SUPABASE_URL                 # Staging Supabase URL
STAGING_SUPABASE_ANON_KEY            # Staging anon key
STAGING_SUPABASE_SERVICE_KEY         # Staging service role key
```

#### Database
```
DATABASE_URL                 # Production database connection string
DIRECT_URL                  # Production direct database connection
STAGING_DATABASE_URL        # Staging database connection string
STAGING_DIRECT_URL          # Staging direct database connection
```

#### Payments
```
LEMON_SQUEEZY_API_KEY                   # LemonSqueezy API key
LEMON_SQUEEZY_STORE_ID                  # LemonSqueezy store ID
LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID   # Subscription variant ID
```

#### Security & Monitoring
```
SNYK_TOKEN                  # Snyk security scanning token
CODECOV_TOKEN              # Codecov coverage reporting token
```

## Environment Configuration

### Production
- Branch: `main`
- URL: https://feastqr.com
- Auto-deploy on merge to main
- Runs all security checks
- Database migrations auto-applied

### Staging
- Manual deployment via workflow dispatch
- Separate Supabase project
- Testing environment

### Preview
- Auto-deployed for pull requests
- Temporary environment
- Uses staging credentials

## Usage Examples

### Deploy to Production
```bash
# Automatically triggers on push to main
git push origin main

# Or manually trigger
gh workflow run deploy-vercel.yml -f environment=production
```

### Run Database Migrations
```bash
# Manually run migrations
gh workflow run database-migrations.yml -f environment=production
```

### Create a Release
```bash
# Tag and push
git tag v1.0.0
git push origin v1.0.0

# Or manual dispatch
gh workflow run release.yml -f version=v1.0.0
```

### Run Security Scan
```bash
gh workflow run security.yml
```

## Workflow Dependencies

```
PR Created
    ├── pr-checks-enhanced.yml
    │   ├── Code Quality
    │   ├── Tests
    │   └── Build Check
    └── security.yml
        ├── Dependency Review
        └── CodeQL Analysis

Push to Main
    ├── ci.yml (Tests)
    ├── security.yml (Full Scan)
    ├── database-migrations.yml
    └── deploy-vercel.yml
        ├── Pre-deploy Checks
        └── Production Deploy
```

## Best Practices

1. **Always create PRs** - Never push directly to main
2. **Wait for checks** - All checks must pass before merging
3. **Review security alerts** - Check security workflow results
4. **Monitor deployments** - Check deployment summaries
5. **Version tagging** - Use semantic versioning for releases

## Monitoring

- Check workflow runs: GitHub Actions tab
- View coverage: Codecov dashboard
- Security reports: GitHub Security tab
- Deployment logs: Vercel dashboard

## Rollback Procedure

```bash
# Revert to previous version
git revert <commit-hash>
git push origin main

# Or deploy specific version
gh workflow run deploy-vercel.yml -f environment=production
```

## Troubleshooting

### Build Failures
1. Check environment variables
2. Verify database connectivity
3. Review error logs in Actions tab

### Deployment Failures
1. Verify Vercel token is valid
2. Check environment secrets
3. Ensure build passes locally

### Migration Failures
1. Review migration files
2. Check database permissions
3. Verify Supabase connection

## Local Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Type check
pnpm check-types

# Lint
pnpm lint

# Build
pnpm build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push and create a PR
5. Wait for CI checks to pass
6. Request review

## Support

For CI/CD issues, contact the DevOps team or create an issue in the repository.
