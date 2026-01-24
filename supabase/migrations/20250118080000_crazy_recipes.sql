-- Create crazy_recipes table for user-submitted unique recipes
CREATE TABLE IF NOT EXISTS public.crazy_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  cooking_time INTEGER NOT NULL, -- in minutes
  is_veg BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false, -- Admin approval before public display
  views_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crazy_recipe_reviews table for user reviews
CREATE TABLE IF NOT EXISTS public.crazy_recipe_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.crazy_recipes(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, reviewer_id)
);

-- Enable Row Level Security
ALTER TABLE public.crazy_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crazy_recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for crazy_recipes
-- Anyone can view approved recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipes'
      AND policyname = 'Anyone can view approved recipes'
  ) THEN
    CREATE POLICY "Anyone can view approved recipes"
    ON public.crazy_recipes
    FOR SELECT
    USING (is_approved = true);
  END IF;
END$$;

-- Users can view their own recipes regardless of approval status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipes'
      AND policyname = 'Users can view their own recipes'
  ) THEN
    CREATE POLICY "Users can view their own recipes"
    ON public.crazy_recipes
    FOR SELECT
    USING (auth.uid() = author_id);
  END IF;
END$$;

-- Authenticated users can insert recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipes'
      AND policyname = 'Authenticated users can insert recipes'
  ) THEN
    CREATE POLICY "Authenticated users can insert recipes"
    ON public.crazy_recipes
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);
  END IF;
END$$;

-- Users can update their own recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipes'
      AND policyname = 'Users can update their own recipes'
  ) THEN
    CREATE POLICY "Users can update their own recipes"
    ON public.crazy_recipes
    FOR UPDATE
    USING (auth.uid() = author_id);
  END IF;
END$$;

-- Users can delete their own recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipes'
      AND policyname = 'Users can delete their own recipes'
  ) THEN
    CREATE POLICY "Users can delete their own recipes"
    ON public.crazy_recipes
    FOR DELETE
    USING (auth.uid() = author_id);
  END IF;
END$$;

-- Policies for crazy_recipe_reviews
-- Anyone can view reviews for approved recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipe_reviews'
      AND policyname = 'Anyone can view reviews for approved recipes'
  ) THEN
    CREATE POLICY "Anyone can view reviews for approved recipes"
    ON public.crazy_recipe_reviews
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.crazy_recipes 
        WHERE id = recipe_id AND is_approved = true
      )
    );
  END IF;
END$$;

-- Authenticated users can insert reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipe_reviews'
      AND policyname = 'Authenticated users can insert reviews'
  ) THEN
    CREATE POLICY "Authenticated users can insert reviews"
    ON public.crazy_recipe_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);
  END IF;
END$$;

-- Users can update their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipe_reviews'
      AND policyname = 'Users can update their own reviews'
  ) THEN
    CREATE POLICY "Users can update their own reviews"
    ON public.crazy_recipe_reviews
    FOR UPDATE
    USING (auth.uid() = reviewer_id);
  END IF;
END$$;

-- Users can delete their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'crazy_recipe_reviews'
      AND policyname = 'Users can delete their own reviews'
  ) THEN
    CREATE POLICY "Users can delete their own reviews"
    ON public.crazy_recipe_reviews
    FOR DELETE
    USING (auth.uid() = reviewer_id);
  END IF;
END$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crazy_recipes_author_id ON public.crazy_recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_crazy_recipes_is_approved ON public.crazy_recipes(is_approved);
CREATE INDEX IF NOT EXISTS idx_crazy_recipes_created_at ON public.crazy_recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crazy_recipe_reviews_recipe_id ON public.crazy_recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_crazy_recipe_reviews_reviewer_id ON public.crazy_recipe_reviews(reviewer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_crazy_recipes_updated_at
    BEFORE UPDATE ON public.crazy_recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
