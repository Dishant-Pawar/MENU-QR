# CI/CD Quick Reference

## 🚀 One-Command Setup

```bash
# Install dependencies and setup git hooks
pnpm install

# Hooks are automatically installed via "prepare" script
```

## 📋 Quick Checks Before Push

```bash
# Full pre-push check
pnpm test:coverage && pnpm build

# Just tests
pnpm test:run

# Just type check
pnpm tsc --noEmit

# Security audit
pnpm audit --audit-level=high
```

## 🔄 CI/CD Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Runs on:** Every push and PR
- ✅ Lint & type check
- ✅ Run tests with coverage
- ✅ Build verification
- ✅ Security audit

### 2. Security Scan (`.github/workflows/security-scan.yml`)
**Runs on:** Push, PR, and daily at 2 AM
- 🔒 Dependency scanning
- 🔍 CodeQL analysis
- 🚨 Secret detection
- ⚡ SAST scanning

### 3. Deploy (`.github/workflows/deploy.yml`)
**Runs on:** Push to `main`
- 🧪 Full test suite
- 🔒 Security check
- 🚀 Deploy to production
- ✅ Post-deploy validation

### 4. PR Checks (`.github/workflows/pr-checks.yml`)
**Runs on:** Every pull request
- 📝 PR title format validation
- 🧪 Test coverage report
- 🔒 Security check
- 📦 Build preview

## 🪝 Git Hooks

### Pre-commit (`.husky/pre-commit`)
```bash
✅ Type check
✅ Run tests
⚠️  Check for console.log
❌ Fail on hardcoded secrets
```

### Commit Message (`.husky/commit-msg`)
```bash
✅ Validates format: "feat: add feature"
❌ Rejects: "updated files"
```

### Pre-push (`.husky/pre-push`)
```bash
✅ Full test suite
✅ Build check
✅ Security audit
```

## 🚫 Skip Hooks (Emergency Only)

```bash
# Skip pre-commit and commit-msg
git commit --no-verify -m "message"

# Skip pre-push
git push --no-verify
```

## 📝 Commit Message Format

**Required format:**
```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Refactoring
- test: Tests
- chore: Maintenance
- perf: Performance
- ci: CI/CD changes
```

**Examples:**
```bash
✅ feat(auth): add login functionality
✅ fix(menu): resolve display issue
✅ docs: update README
✅ test(security): add XSS tests
❌ updated files
❌ changes
```

## 🔧 Required Secrets

Add these in **GitHub Settings → Secrets**:

- `VERCEL_TOKEN` - For deployment
- `CODECOV_TOKEN` - For coverage (optional)
- `PRODUCTION_DATABASE_URL` - For migrations (optional)

## 📊 Status Badges

Add to README:
```markdown
![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/USER/REPO/actions/workflows/security-scan.yml/badge.svg)
![Deploy](https://github.com/USER/REPO/actions/workflows/deploy.yml/badge.svg)
```

## 🐛 Troubleshooting

### Tests fail in CI but pass locally
```bash
# Match CI Node version (18.x)
node --version

# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Hooks not running
```bash
# Reinstall husky
npx husky install

# Make executable (Mac/Linux)
chmod +x .husky/*
```

### Security audit failing
```bash
# Update dependencies
pnpm update

# Fix vulnerabilities
pnpm audit fix
```

## 📚 Full Documentation

See [CICD_GUIDE.md](CICD_GUIDE.md) for complete documentation.

---

**Quick Tips:**
- ✅ Commit frequently with good messages
- ✅ Let hooks catch issues early
- ✅ Review CI logs when builds fail
- ✅ Keep dependencies updated
- ✅ Never commit secrets
