-- Update admin check to handle the transformed email format

CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS TRIGGER AS $$
DECLARE
  u_email text;
BEGIN
  -- Get email from auth.users
  SELECT email INTO u_email 
  FROM auth.users 
  WHERE id = NEW.user_id;
  
  -- Check for specific admin email (transformed)
  IF u_email = 'VarunB_at_12345@ahara.admin' OR u_email = 'varunb_at_12345@ahara.admin' THEN
    NEW.is_admin := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger is already bound to this function, so just updating the function is enough.
-- But let's run an update for existing users just in case.

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'VarunB_at_12345@ahara.admin' OR email = 'varunb_at_12345@ahara.admin';
  
  IF target_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET is_admin = true
    WHERE user_id = target_user_id;
  END IF;
END $$;
