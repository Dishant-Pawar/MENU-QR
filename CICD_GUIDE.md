# 🚀 CI/CD Pipeline Guide

Complete guide to the automated testing, security scanning, and deployment pipelines.

---

## Overview

This project uses **GitHub Actions** for CI/CD with comprehensive automation:

- ✅ **Automated Testing** - Run on every push and PR
- 🔒 **Security Scanning** - Daily scans and on-demand checks
- 🚀 **Deployment Pipeline** - Automated production deployments
- 🔍 **PR Validation** - Automatic checks on pull requests
- 🪝 **Git Hooks** - Local validation before commit/push

---

## Table of Contents

1. [Workflows Overview](#workflows-overview)
2. [Setup Instructions](#setup-instructions)
3. [CI Pipeline](#ci-pipeline)
4. [Security Scanning](#security-scanning)
5. [Deployment Pipeline](#deployment-pipeline)
6. [PR Checks](#pr-checks)
7. [Git Hooks](#git-hooks)
8. [Secrets Configuration](#secrets-configuration)
9. [Troubleshooting](#troubleshooting)

---

## Workflows Overview

### 📋 Available Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **ci.yml** | Push, PR | Run tests, lint, build |
| **security-scan.yml** | Push, PR, Daily | Security scanning |
| **deploy.yml** | Push to main | Production deployment |
| **pr-checks.yml** | Pull requests | PR validation |

### Workflow Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/ci.yml)
[![Security](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/security-scan.yml/badge.svg)](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/security-scan.yml)
[![Deploy](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/menu-qr-rest/actions/workflows/deploy.yml)
```

---

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions is enabled by default for public repositories.

For private repositories:
1. Go to **Settings** → **Actions** → **General**
2. Enable **Allow all actions and reusable workflows**

### 2. Install Git Hooks

```bash
# Install husky (if not already installed)
pnpm install

# Setup git hooks
npx husky install

# Make hooks executable (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push

# Windows: Hooks should work automatically
```

### 3. Configure Secrets

Go to **Settings** → **Secrets and variables** → **Actions**

Required secrets:
- `VERCEL_TOKEN` - For deployment (if using Vercel)
- `CODECOV_TOKEN` - For coverage reports (optional)
- `PRODUCTION_DATABASE_URL` - Production database (if using auto-migrations)

### 4. Branch Protection

Recommended branch protection rules for `main`:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators
4. Status checks required:
   - `Lint & Type Check`
   - `Run Tests`
   - `Build Project`
   - `Security Audit`

---

## CI Pipeline

### File: `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs:**

#### 1. Lint & Type Check
```bash
# What runs
pnpm lint       # ESLint
pnpm tsc --noEmit  # TypeScript check
```

#### 2. Run Tests
```bash
# What runs
pnpm test:run       # All tests
pnpm test:coverage  # With coverage
```

**Artifacts:**
- Coverage report (retained 7 days)

#### 3. Build Project
```bash
# What runs
pnpm build  # Next.js build
```

**Checks:**
- Build completes successfully
- No build errors

#### 4. Security Audit
```bash
# What runs
pnpm audit --audit-level=high
```

**Artifacts:**
- Security audit JSON (retained 7 days)

#### 5. Summary
- Aggregates all job results
- Fails if any critical job fails

### Viewing Results

1. Go to **Actions** tab
2. Select **CI Pipeline** workflow
3. Click on latest run
4. View individual job logs

---

## Security Scanning

### File: `.github/workflows/security-scan.yml`

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- **Daily at 2 AM UTC** (scheduled)

**Jobs:**

#### 1. Dependency Scanning
```bash
pnpm audit --audit-level=moderate
```

**Checks:**
- Known vulnerabilities in dependencies
- Critical severity issues fail the build

#### 2. CodeQL Analysis
- Static code analysis for JavaScript/TypeScript
- Detects security vulnerabilities
- Results appear in Security tab

#### 3. Secret Detection
- Scans for accidentally committed secrets
- Uses TruffleHog for detection
- Checks API keys, tokens, passwords

#### 4. SAST (Static Application Security Testing)
```bash
# Checks for:
- console.log in production code
- Hardcoded secrets patterns
- Security TODOs
```

#### 5. Docker Scanning (Optional)
- Scans Docker images for vulnerabilities
- Disabled by default (set `if: true` to enable)

### Security Alerts

**View Security Issues:**
1. Go to **Security** tab
2. Check **Code scanning alerts**
3. Review and fix findings

**Daily Reports:**
- Automated scan runs daily
- Email notifications for new issues
- Review in Actions tab

---

## Deployment Pipeline

### File: `.github/workflows/deploy.yml`

**Triggers:**
- Push to `main` branch
- Manual trigger via **Actions** tab

**Jobs:**

#### 1. Pre-deployment Validation
```bash
# Checks:
- Commit message for [skip deploy]
- Verifies main branch
```

#### 2. Full Test Suite
```bash
pnpm test:run       # All tests
pnpm tsc --noEmit   # Type check
pnpm build          # Build verification
```

#### 3. Security Check
```bash
pnpm audit --audit-level=critical
```
**Deployment blocked if critical vulnerabilities found**

#### 4. Deploy to Production
```bash
# Using Vercel CLI
vercel pull --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

#### 5. Post-deployment Checks
- Health check endpoint
- Deployment notification
- Summary report

### Skip Deployment

Add `[skip deploy]` to commit message:
```bash
git commit -m "docs: update README [skip deploy]"
```

### Manual Deployment

1. Go to **Actions** tab
2. Select **Deploy to Production**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

---

## PR Checks

### File: `.github/workflows/pr-checks.yml`

**Automatic checks on every pull request:**

#### 1. PR Validation
```
✅ Title format: "feat: add new feature"
✅ Description length: > 20 characters
⚠️  Linked issue (warning)
```

**Valid PR Title Prefixes:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

#### 2. Code Quality
```bash
pnpm lint           # Linting
pnpm tsc --noEmit   # Type check
```

#### 3. Test Coverage
```bash
pnpm test:coverage
```
**Posts coverage report as PR comment**

#### 4. Security Check
```bash
pnpm audit --audit-level=high
```

#### 5. File Size Check
- Warns if files > 1MB added

#### 6. Changed Files Summary
- Posts list of changed files as comment

#### 7. Build Preview
```bash
pnpm build
```

### PR Review Checklist

Before requesting review, ensure:
- ✅ All checks pass (green checkmarks)
- ✅ PR description is complete
- ✅ Linked to related issue
- ✅ Tests added for new features
- ✅ No security warnings

---

## Git Hooks

### Pre-commit Hook

**File:** `.husky/pre-commit`

**Runs before every commit:**
```bash
✅ Type check (pnpm tsc --noEmit)
✅ Run tests (pnpm test:run)
⚠️  Check for console.log
❌ Fail if hardcoded secrets detected
```

**Skip hook (not recommended):**
```bash
git commit --no-verify -m "message"
```

### Commit Message Hook

**File:** `.husky/commit-msg`

**Validates commit message format:**
```
✅ feat(auth): add login functionality
✅ fix(menu): resolve display issue
❌ updated files  # Invalid
```

**Format:**
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

### Pre-push Hook

**File:** `.husky/pre-push`

**Runs before pushing:**
```bash
✅ Full test suite with coverage
✅ Build verification
✅ Security audit
```

**Warning:** Pre-push checks take 1-2 minutes.

### Bypass Hooks

**Emergency bypass (use sparingly):**
```bash
# Skip all hooks
git push --no-verify
```

---

## Secrets Configuration

### Required Secrets

#### VERCEL_TOKEN
**Purpose:** Deploy to Vercel

**How to get:**
1. Go to Vercel Dashboard
2. Settings → Tokens
3. Create new token
4. Add to GitHub: Settings → Secrets → Actions
   - Name: `VERCEL_TOKEN`
   - Value: `<your-token>`

#### CODECOV_TOKEN (Optional)
**Purpose:** Upload coverage reports

**How to get:**
1. Go to [codecov.io](https://codecov.io)
2. Link your repository
3. Get upload token
4. Add to GitHub secrets

#### PRODUCTION_DATABASE_URL (Optional)
**Purpose:** Run database migrations

**Format:**
```
postgresql://user:password@host:5432/database?schema=public
```

### Environment Variables

For deployment, configure in Vercel:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add all required env vars from `MenuQR.env`

---

## Troubleshooting

### Common Issues

#### ❌ Tests Failing in CI

**Symptom:** Tests pass locally but fail in CI

**Solutions:**
```bash
# 1. Check Node version matches CI (18.x)
node --version

# 2. Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 3. Run tests exactly as CI does
pnpm test:run
```

#### ❌ Build Failing

**Symptom:** Build works locally but fails in CI

**Solutions:**
```bash
# 1. Check for missing env vars
# CI might need environment variables

# 2. Clean build
rm -rf .next
pnpm build

# 3. Check for TypeScript errors
pnpm tsc --noEmit
```

#### ❌ Security Audit Failing

**Symptom:** `pnpm audit` shows vulnerabilities

**Solutions:**
```bash
# 1. Update dependencies
pnpm update

# 2. Fix vulnerabilities
pnpm audit fix

# 3. Check if fixes available
pnpm audit --audit-level=high
```

#### ❌ Git Hooks Not Running

**Symptom:** Commits succeed without running checks

**Solutions:**
```bash
# 1. Reinstall husky
npx husky install

# 2. Make hooks executable (Mac/Linux)
chmod +x .husky/*

# 3. Check git config
git config core.hooksPath
# Should output: .husky
```

#### ❌ Deployment Failing

**Symptom:** Deployment job fails

**Solutions:**
1. **Check secrets:**
   - Verify `VERCEL_TOKEN` is set
   - Token has correct permissions

2. **Check Vercel project:**
   - Project linked correctly
   - Build settings match local

3. **Manual deploy to test:**
   ```bash
   vercel --prod
   ```

### Debug CI Issues

**Enable debug logging:**

1. **In workflow file:**
   ```yaml
   env:
     ACTIONS_RUNNER_DEBUG: true
     ACTIONS_STEP_DEBUG: true
   ```

2. **Re-run with debug:**
   - Go to failed workflow run
   - Click "Re-run jobs"
   - Select "Enable debug logging"

### Getting Help

**CI/CD Issues:**
1. Check workflow logs in Actions tab
2. Review this guide
3. Check GitHub Actions documentation
4. Open issue with workflow logs

**Local Hook Issues:**
1. Check husky installation
2. Review hook scripts in `.husky/`
3. Test hooks manually:
   ```bash
   .husky/pre-commit
   ```

---

## Best Practices

### 1. Commit Frequently
- Small, focused commits
- Clear commit messages
- Run hooks on each commit

### 2. Branch Strategy
```
main (production)
  ↑
develop (staging)
  ↑
feature/your-feature
```

### 3. PR Workflow
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Open PR to `develop`
5. Wait for all checks ✅
6. Request review
7. Merge when approved
8. Delete branch

### 4. Security
- Never commit secrets
- Review security scan results
- Update dependencies regularly
- Run `pnpm audit` before pushing

### 5. Testing
- Write tests for new features
- Maintain >80% coverage
- Run tests before committing
- Fix failing tests immediately

---

## Monitoring

### CI/CD Metrics

**Track these metrics:**
- ✅ Build success rate
- ⏱️ Average build time
- 🔒 Security vulnerabilities found
- 📊 Test coverage percentage
- 🚀 Deployment frequency

### Notifications

**Enable notifications:**
1. Go to your GitHub notifications settings
2. Enable "Actions" notifications
3. Choose email or Slack/Discord webhook

### Status Dashboard

View all workflow statuses:
- Go to repository **Actions** tab
- See all recent runs
- Filter by workflow, branch, or status

---

## Advanced Configuration

### Customize Workflows

**Modify check frequency:**
```yaml
# In security-scan.yml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM
  # Change to: '0 */6 * * *'  # Every 6 hours
```

**Add custom checks:**
```yaml
# In ci.yml, add new job
custom-check:
  name: Custom Check
  runs-on: ubuntu-latest
  steps:
    - run: echo "Your custom check"
```

### Parallel Jobs

Current parallel jobs:
- Lint + Test + Security (run simultaneously)
- Build (waits for above)

**Add more parallel jobs:**
```yaml
jobs:
  job1:
    # runs independently
  job2:
    # runs independently
  job3:
    needs: [job1, job2]  # waits for both
```

---

## Cheat Sheet

### Quick Commands

```bash
# Local checks (same as pre-push)
pnpm test:coverage && pnpm build

# Type check
pnpm tsc --noEmit

# Security audit
pnpm audit --audit-level=high

# Manual hook trigger
.husky/pre-commit

# Skip hooks (emergency only)
git commit --no-verify
git push --no-verify

# View workflow logs
gh run list  # Using GitHub CLI
gh run view <run-id> --log
```

### PR Commands

```bash
# Create PR with good title
git checkout -b feat/add-caching
# ... make changes ...
git commit -m "feat(perf): add Redis caching"
git push origin feat/add-caching
# Create PR via GitHub UI or CLI
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [CodeQL](https://codeql.github.com/)

---

**Last Updated:** January 30, 2026
