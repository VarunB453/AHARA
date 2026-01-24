-- Fix Account Deletion Function - Remove invalid request.headers reference
-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS profile_deletion_audit ON profiles;
DROP FUNCTION IF EXISTS log_account_deletion();

-- Recreate the function without request.headers
CREATE OR REPLACE FUNCTION log_account_deletion()
RETURNS TRIGGER AS $$
DECLARE
    client_ip INET;
    user_agent_str TEXT;
BEGIN
    -- Get client IP safely
    BEGIN
        client_ip := inet_client_addr();
    EXCEPTION WHEN OTHERS THEN
        client_ip := NULL;
    END;
    
    -- Set user_agent to NULL since request.headers is not available in Supabase
    -- You can optionally pass user-agent from your application instead
    user_agent_str := NULL;
    
    INSERT INTO account_deletion_audit (
        user_id,
        deleted_by,
        deleted_at,
        user_data,
        ip_address,
        user_agent
    ) VALUES (
        OLD.user_id,
        auth.uid(),
        NOW(),
        json_build_object(
            'username', OLD.username,
            'avatar_url', OLD.avatar_url,
            'created_at', OLD.created_at,
            'updated_at', OLD.updated_at
        ),
        client_ip,
        user_agent_str
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER profile_deletion_audit
    BEFORE DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_account_deletion();

-- Note: To capture user-agent, pass it from your application layer
-- You can do this by:
-- 1. Creating a stored procedure that accepts user_agent as a parameter
-- 2. Calling it from your backend with the actual user-agent header
