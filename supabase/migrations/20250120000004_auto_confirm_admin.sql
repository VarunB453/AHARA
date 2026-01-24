-- Ensure the admin user is auto-confirmed so they can login immediately
-- This is critical because we are using a fake email domain (@spiceroute.admin)

-- 1. Create a function to auto-confirm the specific admin user
CREATE OR REPLACE FUNCTION public.auto_confirm_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for the transformed admin email (case-insensitive check just in case)
  IF LOWER(NEW.email) = 'varunb_at_12345@ahara.admin' THEN
    NEW.email_confirmed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
-- We drop it first to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created_admin_confirm ON auth.users;

CREATE TRIGGER on_auth_user_created_admin_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_admin();

-- 3. Update any existing user that matches this email to be confirmed
DO $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE LOWER(email) = 'varunb_at_12345@ahara.admin';
END $$;
