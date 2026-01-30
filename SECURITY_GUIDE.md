# 🔒 Security Best Practices

## Overview

This document outlines security best practices implemented in the MenuQR project and guidelines for maintaining security.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [SQL Injection Prevention](#sql-injection-prevention)
4. [XSS Protection](#xss-protection)
5. [File Upload Security](#file-upload-security)
6. [API Security](#api-security)
7. [Data Protection](#data-protection)
8. [Security Headers](#security-headers)

---

## Authentication & Authorization

### Current Implementation

**Supabase Authentication:**
- JWT-based authentication
- Secure session management
- Automatic token refresh

**tRPC Middleware:**
```typescript
// privateProcedure ensures authentication
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.user } });
});
```

### Best Practices

✅ **DO:**
- Always use `privateProcedure` for protected routes
- Verify user ownership before accessing resources
- Use environment variables for sensitive keys
- Implement rate limiting on authentication endpoints

❌ **DON'T:**
- Store passwords in plain text
- Expose service keys to client
- Trust client-side authentication alone
- Allow unlimited login attempts

### Resource Ownership Check

```typescript
import { checkOwnership } from '~/utils/security.utils';

// In your procedure
const menu = await ctx.db.menus.findFirst({ where: { id } });
checkOwnership(menu.userId, ctx.user.id);
```

---

## Input Validation & Sanitization

### Validation with Zod

All user inputs are validated using Zod schemas:

```typescript
import { z } from 'zod';
import { securitySchemas } from '~/utils/security.utils';

const menuSchema = z.object({
  name: z.string().min(1).max(100),
  slug: securitySchemas.slug,
  email: securitySchemas.email,
  url: securitySchemas.url.optional(),
});
```

### Input Sanitization

```typescript
import { sanitizeInput } from '~/utils/security.utils';

const safeInput = sanitizeInput(userInput);
```

**What it prevents:**
- XSS attacks
- HTML injection
- Script execution

---

## SQL Injection Prevention

### Prisma Parametrized Queries

✅ **Safe (Prisma handles it):**
```typescript
await db.menus.findFirst({
  where: { slug: userInput }, // Automatically escaped
});
```

❌ **Unsafe (Never do this):**
```typescript
await db.$queryRaw`SELECT * FROM menus WHERE slug = '${userInput}'`; // Dangerous!
```

### SQL Injection Detection

```typescript
import { detectSQLInjection } from '~/utils/security.utils';

if (detectSQLInjection(input)) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Invalid input detected',
  });
}
```

---

## XSS Protection

### Content Security Policy

Implemented in middleware:

```typescript
// src/middleware.ts
response.headers.set('Content-Security-Policy', 
  "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
);
```

### Input Sanitization

```typescript
import { sanitizeInput } from '~/utils/security.utils';

// Before saving to database
const sanitizedName = sanitizeInput(input.name);
```

### Output Encoding

React automatically escapes output, but for raw HTML:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(dirty);
```

---

## File Upload Security

### File Validation

```typescript
import { validateFileUpload } from '~/utils/security.utils';

validateFileUpload(
  file,
  5, // max size in MB
  ['image/jpeg', 'image/png', 'image/webp']
);
```

### Filename Sanitization

```typescript
import { sanitizeFilename } from '~/utils/security.utils';

const safeName = sanitizeFilename(originalName);
// '../../../evil.exe' becomes '_.._.._.._evil.exe'
```

### Best Practices

✅ **DO:**
- Validate file type and size
- Sanitize filenames
- Store files in separate storage (Supabase Storage)
- Generate unique identifiers for files
- Scan files for malware (if possible)

❌ **DON'T:**
- Trust file extensions
- Allow executable file uploads
- Store files in web-accessible directories
- Use original filenames directly

---

## API Security

### Rate Limiting

```typescript
// Example rate limiting configuration
export const RATE_LIMITS = {
  API_CALLS_PER_MINUTE: 60,
  LOGIN_ATTEMPTS_PER_HOUR: 5,
  MENU_CREATES_PER_DAY: 10,
};
```

**Implementation needed:** Integrate rate limiting middleware

### CORS Configuration

```typescript
// next.config.mjs
const config = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

### API Key Management

✅ **DO:**
- Store API keys in environment variables
- Use different keys for development/production
- Rotate keys regularly
- Never commit keys to version control

```bash
# .env (never commit)
SUPABASE_SERVICE_KEY=your_secret_key_here
LEMON_SQUEEZY_API_KEY=your_api_key_here
```

---

## Data Protection

### Sensitive Data Masking

```typescript
import { maskSensitiveData } from '~/utils/security.utils';

// Before logging
console.log(maskSensitiveData(userData));
// { email: "user@example.com", password: "***REDACTED***" }
```

### Encryption at Rest

- **Database:** Supabase provides encryption at rest
- **Storage:** Supabase Storage encrypts files
- **Backups:** Encrypted automatically

### Data Minimization

Only collect and store necessary data:

```typescript
// Good: Only select needed fields
select: {
  id: true,
  name: true,
  // Don't select everything
}
```

---

## Security Headers

### Implemented Headers

```typescript
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### What They Do

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS filter
- **Strict-Transport-Security**: Forces HTTPS
- **Referrer-Policy**: Controls referrer information

---

## Audit Logging

### Implementation

```typescript
import { createAuditLog } from '~/utils/security.utils';

createAuditLog({
  userId: ctx.user.id,
  action: 'DELETE_MENU',
  resource: 'menus',
  resourceId: menuId,
  timestamp: new Date(),
  success: true,
});
```

### What to Log

✅ **Always log:**
- Authentication attempts (success/failure)
- Resource modifications (create, update, delete)
- Permission changes
- Failed authorization attempts
- Sensitive data access

❌ **Never log:**
- Passwords
- API keys
- Personal identification numbers
- Credit card details

---

## Security Checklist

### Before Deployment

- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] File upload restrictions in place
- [ ] Audit logging enabled
- [ ] Error messages don't expose sensitive info
- [ ] Database backups configured
- [ ] Monitoring and alerting set up

### Regular Maintenance

- [ ] Review and rotate API keys quarterly
- [ ] Update dependencies monthly
- [ ] Review audit logs weekly
- [ ] Scan for vulnerabilities monthly
- [ ] Review access permissions quarterly
- [ ] Update security documentation

---

## Common Vulnerabilities

### 1. SQL Injection
**Prevention:** Use Prisma's parametrized queries ✅

### 2. XSS (Cross-Site Scripting)
**Prevention:** Sanitize input, use React's escaping ✅

### 3. CSRF (Cross-Site Request Forgery)
**Prevention:** Supabase handles CSRF tokens ✅

### 4. Insecure Direct Object References
**Prevention:** Always check resource ownership ✅

### 5. Security Misconfiguration
**Prevention:** Follow this guide, use security headers ✅

### 6. Sensitive Data Exposure
**Prevention:** Mask data in logs, encrypt at rest ✅

---

## Incident Response

### If a Security Issue is Discovered

1. **Assess Impact**
   - What data was accessed?
   - How many users affected?

2. **Contain**
   - Disable affected features
   - Rotate compromised keys

3. **Investigate**
   - Review audit logs
   - Identify root cause

4. **Remediate**
   - Fix vulnerability
   - Deploy patch

5. **Notify**
   - Inform affected users
   - Document incident

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [tRPC Security Best Practices](https://trpc.io/docs/server/authorization)

---

## Security Contact

For security issues, contact: security@yourapp.com

**Last Updated:** January 30, 2026
