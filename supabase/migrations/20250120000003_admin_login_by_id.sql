-- Create function for admin login by ID
CREATE OR REPLACE FUNCTION public.admin_login_by_id(
    admin_id TEXT,
    password TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    user_id UUID,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    profile_record RECORD;
    auth_user RECORD;
BEGIN
    -- Find the admin profile by ID
    SELECT p.user_id, p.is_admin INTO profile_record
    FROM public.profiles p
    WHERE p.id = admin_id AND p.is_admin = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, 'Invalid admin ID'::TEXT;
        RETURN;
    END IF;
    
    -- Get the auth user to verify email exists
    SELECT u.id, u.email INTO auth_user
    FROM auth.users u
    WHERE u.id = profile_record.user_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, 'Admin user not found in auth system'::TEXT;
        RETURN;
    END IF;
    
    -- Return success with user_id (client will handle password verification)
    RETURN QUERY SELECT true, auth_user.id, 'Admin verified'::TEXT;
    RETURN;
END;
$$;

-- Create function to get user email by ID
CREATE OR REPLACE FUNCTION public.get_user_email_by_id(
    user_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT u.email INTO user_email
    FROM auth.users u
    WHERE u.id = user_id;
    
    RETURN user_email;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.admin_login_by_id(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_email_by_id(UUID) TO authenticated, anon;
