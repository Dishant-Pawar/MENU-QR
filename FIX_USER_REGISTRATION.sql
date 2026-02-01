-- ============================================
-- Fix Missing User Profile Creation Trigger
-- ============================================
-- 
-- This script fixes the issue where new registered users
-- don't appear in the profiles table because the trigger
-- that creates profile entries is missing.
--
-- Run this directly in your Supabase SQL Editor:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste and run this script
--
-- ============================================

-- Create the trigger that calls handle_new_user() when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If you have existing users without profiles, run this to backfill:
-- (Comment out the above and uncomment below if needed)

/*
INSERT INTO public.profiles (id, full_name, email)
SELECT 
  u.id,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.email
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
*/
