# Google OAuth Configuration Guide

## Overview
Google OAuth is already implemented in the codebase for both Login and Register pages. Follow these steps to configure it in Supabase.

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project for your app

### 1.2 Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: `MenuQR` (or your app name)
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users if in testing mode
6. Click **Save and Continue**

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: MenuQR Web Client
   - **Authorized JavaScript origins**:
     - `https://menu-qr-lovat.vercel.app`
     - `http://localhost:3000` (for development)
   - **Authorized redirect URIs**:
     - `https://pwlbowhzyxqvihiygnlh.supabase.co/auth/v1/callback`
     - (Add your Supabase project callback URL)
5. Click **Create**
6. **SAVE** your Client ID and Client Secret

## Step 2: Configure Supabase

### 2.1 Add Google Provider to Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/pwlbowhzyxqvihiygnlh)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the provider list
4. Toggle **Enable**
5. Enter your credentials:
   - **Client ID**: (from Step 1.4)
   - **Client Secret**: (from Step 1.4)
6. Click **Save**

### 2.2 Configure Redirect URLs
1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `https://menu-qr-lovat.vercel.app/**` (wildcard)
   - `https://menu-qr-lovat.vercel.app/dashboard`
   - `https://menu-qr-lovat.vercel.app/auth/confirm`
   - `http://localhost:3000/**` (for development)
   - `http://localhost:3000/dashboard` (for development)

### 2.3 Site URL Configuration
Set your Site URL to: `https://menu-qr-lovat.vercel.app`

## Step 3: Environment Variables

Ensure your Vercel environment variables are set:

```env
# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://pwlbowhzyxqvihiygnlh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Add this if not already set
NEXT_PUBLIC_APP_URL=https://menu-qr-lovat.vercel.app
```

## Step 4: Test Google OAuth

### 4.1 Local Testing
1. Run your app locally: `pnpm dev`
2. Navigate to `/login` or `/register`
3. Click the **Google** button
4. You should be redirected to Google sign-in
5. After signing in, you should be redirected back to `/dashboard`

### 4.2 Production Testing
1. Visit `https://menu-qr-lovat.vercel.app/login`
2. Click the **Google** button
3. Sign in with your Google account
4. Verify redirect to dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Problem**: The redirect URI doesn't match what's configured in Google Console

**Solution**:
1. Check Google Console → Credentials → Your OAuth Client
2. Ensure this URL is added to **Authorized redirect URIs**:
   ```
   https://pwlbowhzyxqvihiygnlh.supabase.co/auth/v1/callback
   ```
3. Wait 5 minutes for Google's cache to update

### Error: "OAuth Error: Invalid client"
**Problem**: Client ID or Secret is incorrect

**Solution**:
1. Double-check credentials in Supabase match Google Console
2. Regenerate secret in Google Console if needed
3. Update Supabase with new credentials

### Error: "Access blocked: This app's request is invalid"
**Problem**: OAuth consent screen not configured properly

**Solution**:
1. Complete OAuth consent screen setup in Google Console
2. Add your email as a test user if app is in testing mode
3. Verify required scopes are added

### User not appearing in database
**Problem**: Database trigger not created

**Solution**:
Run this SQL in Supabase SQL Editor:
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

## Implementation Details

### Login Page (`src/pageComponents/Login/molecules/UserAuthForm.tsx`)
- ✅ Google OAuth button implemented
- ✅ Redirects to `/dashboard` after success
- ✅ Error handling with toast notifications

### Register Page (`src/pageComponents/Register/molecules/UserAuthForm.tsx`)
- ✅ Google OAuth button implemented
- ✅ Redirects to `/dashboard` after success
- ✅ Uses same OAuth flow as login
- ✅ No email confirmation required for OAuth

### OAuth Flow
1. User clicks "Google" button
2. `signInWithOauth()` function is called
3. Redirects to Google sign-in page
4. Google redirects back to Supabase callback URL
5. Supabase processes OAuth and creates/updates user
6. User is redirected to `/dashboard`
7. Database trigger creates profile automatically

## Security Notes

- ✅ OAuth uses Supabase's secure callback URL
- ✅ Client secrets stored securely in Supabase
- ✅ Redirect URLs validated server-side
- ✅ HTTPS enforced in production
- ✅ PKCE flow used by Supabase for additional security

## Support

If you encounter issues:
1. Check Supabase logs: **Authentication** → **Logs**
2. Check browser console for errors
3. Verify all URLs match exactly (no trailing slashes)
4. Ensure database trigger is created

## Quick Reference

**Supabase Project**: `pwlbowhzyxqvihiygnlh`
**Callback URL**: `https://pwlbowhzyxqvihiygnlh.supabase.co/auth/v1/callback`
**Production URL**: `https://menu-qr-lovat.vercel.app`
**Dashboard URL**: `https://menu-qr-lovat.vercel.app/dashboard`
