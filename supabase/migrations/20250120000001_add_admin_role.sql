-- ==============================================================================
-- ADMIN ROLE & PERMISSIONS SETUP
-- ==============================================================================

-- 1. ADD ADMIN COLUMN TO PROFILES
-- ===============================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 2. FUNCTION TO CHECK IF USER IS ADMIN
-- =====================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND is_admin = TRUE
  );
END;
$$;

-- 3. ADMIN DELETE USER FUNCTION
-- =============================
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the executor is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Delete the user from auth.users
  -- This will trigger cascading deletes
  DELETE FROM auth.users
  WHERE id = target_user_id;
END;
$$;

-- 4. UPDATE RLS POLICIES FOR RECIPES
-- ==================================
-- Allow admins to ALL on crazy_recipes
CREATE POLICY "Admins can do everything on recipes"
ON public.crazy_recipes
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 5. UPDATE RLS POLICIES FOR REVIEWS
-- ==================================
-- Allow admins to ALL on crazy_recipe_reviews
CREATE POLICY "Admins can do everything on reviews"
ON public.crazy_recipe_reviews
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 6. GRANT PERMISSIONS
-- ====================
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Comment
COMMENT ON FUNCTION admin_delete_user IS 'Allows admins to delete any user account.';
