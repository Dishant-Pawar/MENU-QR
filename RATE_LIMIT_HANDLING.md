# Rate Limit Handling

## Issue
Supabase Auth API enforces rate limits on email sending to prevent abuse. When exceeded, the API returns a `429 Too Many Requests` error with the header `x-sb-error-code: over_email_send_rate_limit`.

## Solution Implemented

### 1. Improved Error Handling in Registration Form
- Updated [UserAuthForm.tsx](src/pageComponents/Register/molecules/UserAuthForm.tsx) to properly check for errors in the signup response
- Changed from try-catch pattern (which doesn't work for Supabase) to checking the returned `error` object
- Added specific handling for 429 rate limit errors

### 2. User-Friendly Error Messages
Added translations for rate limit errors:
- **English**: "You've made too many requests. Please wait a few minutes before trying again."
- **Polish**: "Wykonałeś zbyt wiele żądań. Poczekaj kilka minut przed ponowną próbą."

### 3. Prevention Strategies

#### During Development
- Avoid repeatedly testing signup with the same email
- Use the test accounts in dev mode (non-production) instead of creating new accounts
- Consider using Supabase local development with `supabase start` to avoid hitting production rate limits

#### In Production
The current implementation already handles this well by:
- Showing clear error messages to users
- Not allowing further signup attempts until the user dismisses the error
- Using form submission state to prevent double-submissions

### 4. Rate Limit Details
Supabase's default rate limits (as of 2024):
- **Signup/Email sends**: ~4-6 emails per hour per IP address
- **Password resets**: Similar limits apply
- **OAuth signups**: Usually higher limits

## Additional Recommendations

### 1. Client-Side Debouncing
Consider adding a cooldown timer after failed signup attempts:

```typescript
const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);

const onSubmit = async (data: RegisterFormValues) => {
  if (cooldownUntil && cooldownUntil > new Date()) {
    toast({
      title: "Please wait",
      description: "You can try again in a few minutes",
      variant: "destructive",
    });
    return;
  }

  const { error } = await supabase().auth.signUp({...});
  
  if (error?.status === 429) {
    setCooldownUntil(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes
    // ... show error
  }
};
```

### 2. Monitoring
Consider adding monitoring for rate limit errors to track if this is a common issue:
- Sentry already configured - ensure auth errors are being captured
- Monitor `x-sb-error-code` header in production logs

### 3. Alternative Approaches
If rate limiting becomes a persistent issue:
- Use OAuth providers (Google, GitHub) which have higher limits
- Implement a waitlist/invitation system to control signup rate
- Contact Supabase support to increase limits for your project (available on paid plans)

## Testing
To test the rate limit handling:
1. Attempt to sign up with a new email address 5-6 times within an hour
2. Verify that the error message appears correctly in both English and Polish
3. Confirm that the error is user-friendly and not a generic error

## Related Files
- [UserAuthForm.tsx](src/pageComponents/Register/molecules/UserAuthForm.tsx) - Registration form with rate limit handling
- [common.ts (en)](src/i18n/locales/en/common.ts) - English translations
- [common.ts (pl)](src/i18n/locales/pl/common.ts) - Polish translations
