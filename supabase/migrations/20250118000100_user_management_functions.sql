-- Create function to check if user exists by email
CREATE OR REPLACE FUNCTION public.check_user_exists_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Check if user exists in auth.users table
    SELECT COUNT(*) INTO user_count
    FROM auth.users
    WHERE email = user_email;
    
    RETURN user_count > 0;
END;
$$;

-- Create function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.created_at,
        u.last_sign_in_at
    FROM auth.users u
    WHERE u.email = user_email
    LIMIT 1;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.check_user_exists_by_email(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO authenticated, anon;
