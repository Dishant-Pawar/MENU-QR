-- This trigger automatically creates a profile entry in public.profiles 
-- when a new user signs up in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
