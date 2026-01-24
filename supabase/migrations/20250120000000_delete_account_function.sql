-- ==============================================================================
-- SUPABASE ACCOUNT DELETION & CASCADING DELETE SETUP
-- ==============================================================================
-- This script sets up everything needed to allow users to delete their own accounts.
-- It ensures that when a user is deleted, all their associated data (Profile,
-- Favorites, Recipes, Reviews) is automatically deleted (Cascading Delete).
-- ==============================================================================

-- 1. SETUP CASCADING DELETE FOR PROFILES
-- ======================================
DO $$
BEGIN
  -- Drop the constraint if it exists to ensure we can recreate it with CASCADE
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_id_fkey;
  END IF;

  -- Re-add with ON DELETE CASCADE
  ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
END $$;

-- 2. SETUP CASCADING DELETE FOR FAVORITES
-- =======================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'favorites_user_id_fkey' AND table_name = 'favorites'
  ) THEN
    ALTER TABLE public.favorites DROP CONSTRAINT favorites_user_id_fkey;
  END IF;

  ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
END $$;

-- 3. SETUP CASCADING DELETE FOR RECIPES (crazy_recipes)
-- =====================================================
DO $$
BEGIN
  -- Check for author_id foreign key
  -- Note: The constraint name might vary, so we try to find it or drop by standard naming
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'crazy_recipes_author_id_fkey' AND table_name = 'crazy_recipes'
  ) THEN
    ALTER TABLE public.crazy_recipes DROP CONSTRAINT crazy_recipes_author_id_fkey;
  END IF;

  -- If the table exists, add the constraint
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crazy_recipes') THEN
    ALTER TABLE public.crazy_recipes
    ADD CONSTRAINT crazy_recipes_author_id_fkey
    FOREIGN KEY (author_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 4. SETUP CASCADING DELETE FOR REVIEWS (crazy_recipe_reviews)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'crazy_recipe_reviews_reviewer_id_fkey' AND table_name = 'crazy_recipe_reviews'
  ) THEN
    ALTER TABLE public.crazy_recipe_reviews DROP CONSTRAINT crazy_recipe_reviews_reviewer_id_fkey;
  END IF;

  -- If the table exists, add the constraint
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crazy_recipe_reviews') THEN
    ALTER TABLE public.crazy_recipe_reviews
    ADD CONSTRAINT crazy_recipe_reviews_reviewer_id_fkey
    FOREIGN KEY (reviewer_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 5. CREATE THE SECURE DELETE FUNCTION
-- ====================================
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();

  -- Ensure the user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete the user from auth.users
  -- Because of the constraints we set up above, this will automatically delete:
  -- 1. The user's profile
  -- 2. The user's favorites
  -- 3. The user's recipes
  -- 4. The user's reviews
  DELETE FROM auth.users
  WHERE id = current_user_id;
END;
$$;

-- 6. GRANT PERMISSIONS
-- ====================
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION delete_own_account IS 'Allows users to delete their own account. Triggers cascading deletes for all associated data (Profile, Favorites, Recipes, Reviews).';

