-- Migration to automatically make 'VarunB@12345' an admin upon signup or if they already exist

-- 1. Create a function to check email and set is_admin
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS TRIGGER AS $$
DECLARE
  u_email text;
BEGIN
  -- Get email from auth.users
  -- This requires SECURITY DEFINER to access auth.users
  SELECT email INTO u_email 
  FROM auth.users 
  WHERE id = NEW.user_id;
  
  -- Check if email matches the specific admin email
  IF u_email = 'VarunB@12345' THEN
    NEW.is_admin := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a trigger to run BEFORE insertion into profiles
DROP TRIGGER IF EXISTS on_profile_created_admin_check ON public.profiles;

CREATE TRIGGER on_profile_created_admin_check
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_admin_check();

-- 3. Run an update immediately in case the user already exists
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'VarunB@12345';
  
  IF target_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET is_admin = true
    WHERE user_id = target_user_id;
  END IF;
END $$;
