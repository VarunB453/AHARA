-- Create function to increment recipe views
CREATE OR REPLACE FUNCTION increment_recipe_views(recipe_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.crazy_recipes 
    SET views_count = views_count + 1 
    WHERE id = recipe_id AND is_approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment recipe likes
CREATE OR REPLACE FUNCTION increment_recipe_likes(recipe_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.crazy_recipes 
    SET likes_count = likes_count + 1 
    WHERE id = recipe_id AND is_approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrement recipe likes
CREATE OR REPLACE FUNCTION decrement_recipe_likes(recipe_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.crazy_recipes 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = recipe_id AND is_approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_recipe_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_recipe_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_recipe_likes(UUID) TO authenticated;
