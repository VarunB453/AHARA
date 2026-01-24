-- Account Deletion Database Setup
-- This SQL script sets up the necessary database structure for account deletion

-- 1. Add deleted_at column to profiles table for soft delete support
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

-- 2. Create index for deleted_at for performance
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- 3. Add role column to profiles table for admin functionality
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 4. Create audit log table for account deletions
CREATE TABLE IF NOT EXISTS account_deletion_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    reason TEXT,
    user_data JSONB, -- Store snapshot of user data before deletion
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Create indexes for audit table
CREATE INDEX IF NOT EXISTS idx_account_deletion_audit_user_id ON account_deletion_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_account_deletion_audit_deleted_at ON account_deletion_audit(deleted_at);

-- 6. Create RLS (Row Level Security) policies for audit table
ALTER TABLE account_deletion_audit ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON account_deletion_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only system can insert audit logs
CREATE POLICY "System can insert audit logs" ON account_deletion_audit
    FOR INSERT WITH CHECK (true);

-- 7. Create function to log account deletion
CREATE OR REPLACE FUNCTION log_account_deletion()
RETURNS TRIGGER AS $$
BEGIN
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
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to automatically log profile deletions
DROP TRIGGER IF EXISTS profile_deletion_audit ON profiles;
CREATE TRIGGER profile_deletion_audit
    BEFORE DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_account_deletion();

-- 9. Create view for active users (non-deleted)
CREATE OR REPLACE VIEW active_profiles AS
SELECT 
    id,
    user_id,
    username,
    avatar_url,
    created_at,
    updated_at
FROM profiles 
WHERE deleted_at IS NULL;

-- 10. Add comments for documentation
COMMENT ON TABLE account_deletion_audit IS 'Audit log for all account deletions';
COMMENT ON COLUMN account_deletion_audit.user_data IS 'Snapshot of user data before deletion';
COMMENT ON COLUMN account_deletion_audit.deleted_by IS 'Who performed the deletion (null for self-deletion)';
COMMENT ON COLUMN profiles.deleted_at IS 'Timestamp for soft delete (null means active)';

-- 11. Create function to safely delete user account (for admin use)
CREATE OR REPLACE FUNCTION safe_delete_user(target_user_id UUID, performer_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    deletion_count INTEGER;
    deletion_count_2 INTEGER;
BEGIN
    -- Check if performer is admin or deleting own account
    IF performer_id IS NOT NULL AND performer_id != target_user_id THEN
        IF NOT EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = performer_id AND role = 'admin'
        ) THEN
            RETURN 'ERROR: Only admins can delete other users';
        END IF;
    END IF;

    -- Delete favorites first (foreign key dependency)
    DELETE FROM favorites WHERE user_id = target_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;

    -- Delete profile
    DELETE FROM profiles WHERE user_id = target_user_id;
    GET DIAGNOSTICS deletion_count_2 = ROW_COUNT;
    deletion_count := deletion_count + deletion_count_2;

    -- The auth user deletion will be handled by the edge function
    RETURN CONCAT('SUCCESS: Deleted ', deletion_count, ' records for user ', target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION safe_delete_user TO authenticated;
