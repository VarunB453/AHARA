import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CrazyRecipe = Database['public']['Tables']['crazy_recipes']['Row'];
type CrazyRecipeInsert = Database['public']['Tables']['crazy_recipes']['Insert'];
type CrazyRecipeUpdate = Database['public']['Tables']['crazy_recipes']['Update'];

// Export types for use in other files
export type { CrazyRecipe, CrazyRecipeInsert, CrazyRecipeUpdate };

// ========================================
// READ OPERATIONS
// ========================================

/**
 * Fetch all recipes (publicly visible)
 * @param userId - Optional user ID (legacy parameter, kept for compatibility)
 * @returns Promise<CrazyRecipe[]>
 */
export const getAllRecipes = async (userId?: string): Promise<CrazyRecipe[]> => {
  const query = supabase
    .from('crazy_recipes')
    .select('*')
    .order('created_at', { ascending: false });

  // For now, we want to show all recipes publicly regardless of approval status
  // if (userId) {
  //   // Show approved recipes OR user's own recipes
  //   query = query.or(`is_approved.eq.true,author_id.eq.${userId}`);
  // } else {
  //   // Show only approved recipes
  //   query = query.eq('is_approved', true);
  // }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching recipes:', error);
    if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
      console.warn('CRITICAL: The crazy_recipes table is missing from the database. Please run the FIX_STORAGE_AND_DB.sql script in Supabase.');
    }
    throw new Error(`Failed to fetch recipes: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch single recipe by ID
 * @param id - Recipe ID
 * @returns Promise<CrazyRecipe | null>
 */
export const getRecipeById = async (id: string): Promise<CrazyRecipe | null> => {
  const { data, error } = await supabase
    .from('crazy_recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Recipe not found
      return null;
    }
    console.error('Error fetching recipe:', error);
    throw new Error(`Failed to fetch recipe: ${error.message}`);
  }

  return data;
};

/**
 * Fetch recipes by user ID
 * @param userId - User ID
 * @param includeUnapproved - Whether to include unapproved recipes
 * @returns Promise<CrazyRecipe[]>
 */
export const getRecipesByUser = async (
  userId: string, 
  includeUnapproved: boolean = false
): Promise<CrazyRecipe[]> => {
  let query = supabase
    .from('crazy_recipes')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (!includeUnapproved) {
    query = query.eq('is_approved', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user recipes:', error);
    throw new Error(`Failed to fetch user recipes: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch recipes by author name
 * @param authorName - Author name
 * @returns Promise<CrazyRecipe[]>
 */
export const getRecipesByAuthorName = async (authorName: string): Promise<CrazyRecipe[]> => {
  const { data, error } = await supabase
    .from('crazy_recipes')
    .select('*')
    .eq('author_name', authorName)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
      console.warn('crazy_recipes table missing. Returning empty recipes.');
      return [];
    }
    console.error('Error fetching recipes by author name:', error);
    throw new Error(`Failed to fetch recipes by author name: ${error.message}`);
  }

  return data || [];
};

/**
 * Search recipes by title or description
 * @param searchTerm - Search term
 * @param approvedOnly - Whether to show only approved recipes
 * @returns Promise<CrazyRecipe[]>
 */
export const searchRecipes = async (
  searchTerm: string,
  approvedOnly: boolean = false
): Promise<CrazyRecipe[]> => {
  let query = supabase
    .from('crazy_recipes')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (approvedOnly) {
    query = query.eq('is_approved', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching recipes:', error);
    throw new Error(`Failed to search recipes: ${error.message}`);
  }

  return data || [];
};

/**
 * Filter recipes by type (Veg/Non-veg)
 * @param isVeg - True for Veg, False for Non-veg
 * @param approvedOnly - Whether to show only approved recipes
 * @returns Promise<CrazyRecipe[]>
 */
export const filterRecipesByType = async (
  isVeg: boolean,
  approvedOnly: boolean = false
): Promise<CrazyRecipe[]> => {
  let query = supabase
    .from('crazy_recipes')
    .select('*')
    .eq('is_veg', isVeg)
    .order('created_at', { ascending: false });

  if (approvedOnly) {
    query = query.eq('is_approved', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering recipes:', error);
    throw new Error(`Failed to filter recipes: ${error.message}`);
  }

  return data || [];
};

export interface GetRecipesOptions {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filterType?: 'all' | 'veg' | 'non-veg';
  sortBy?: 'newest' | 'popular' | 'views';
  approvedOnly?: boolean;
}

/**
 * Get recipes with pagination, filtering, searching and sorting
 * @param options - Options for fetching recipes
 * @returns Promise<{ data: CrazyRecipe[], count: number }>
 */
export const getRecipes = async (
  options: GetRecipesOptions
): Promise<{ data: CrazyRecipe[]; count: number }> => {
  const {
    page,
    pageSize,
    searchTerm,
    filterType = 'all',
    sortBy = 'newest',
    approvedOnly = true
  } = options;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('crazy_recipes')
    .select('*', { count: 'exact' });

  // Apply approval filter
  if (approvedOnly) {
    query = query.eq('is_approved', true);
  }

  // Apply veg/non-veg filter
  if (filterType === 'veg') {
    query = query.eq('is_veg', true);
  } else if (filterType === 'non-veg') {
    query = query.eq('is_veg', false);
  }

  // Apply search
  if (searchTerm) {
    // Search in title and description
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Apply sorting
  switch (sortBy) {
    case 'popular':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'views':
      query = query.order('views_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching recipes:', error);
    throw new Error(`Failed to fetch recipes: ${error.message}`);
  }

  return {
    data: data || [],
    count: count || 0
  };
};

/**
 * Get recipes with pagination (Legacy wrapper around getRecipes)
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @param approvedOnly - Whether to show only approved recipes
 * @returns Promise<{ data: CrazyRecipe[], count: number }>
 */
export const getRecipesWithPagination = async (
  page: number,
  pageSize: number,
  approvedOnly: boolean = false
): Promise<{ data: CrazyRecipe[]; count: number }> => {
  return getRecipes({
    page,
    pageSize,
    approvedOnly,
    filterType: 'all',
    sortBy: 'newest'
  });
};

// ========================================
// CREATE OPERATIONS
// ========================================

/**
 * Create a new recipe
 * @param recipeData - Recipe data to insert
 * @returns Promise<CrazyRecipe>
 */
export const createRecipe = async (recipeData: CrazyRecipeInsert): Promise<CrazyRecipe> => {
  const { data, error } = await supabase
    .from('crazy_recipes')
    .insert(recipeData)
    .select()
    .single();

  if (error) {
    console.error('Error creating recipe:', error);
    throw new Error(`Failed to create recipe: ${error.message}`);
  }

  return data;
};

/**
 * Create recipe with image upload
 * @param recipeData - Recipe data
 * @param imageFile - Image file to upload
 * @returns Promise<CrazyRecipe>
 */
export const createRecipeWithImage = async (
  recipeData: CrazyRecipeInsert,
  imageFile?: File
): Promise<CrazyRecipe> => {
  let imageUrl = recipeData.image_url || null;

  // Upload image if provided
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${recipeData.author_id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('crazy-recipe-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      
      // Check for missing bucket error
      if (uploadError.message.includes('Bucket not found')) {
        console.warn('CRITICAL: Storage bucket "crazy-recipe-images" is missing. Please run the FIX_STORAGE_AND_DB.sql script in Supabase.');
        // Proceed without image to allow recipe creation
        imageUrl = null;
      } else {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('crazy-recipe-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }
  }

  // Create recipe with image URL
  return await createRecipe({
    ...recipeData,
    image_url: imageUrl
  });
};

// ========================================
// UPDATE OPERATIONS
// ========================================

/**
 * Update an existing recipe
 * @param id - Recipe ID
 * @param recipeData - Recipe data to update
 * @returns Promise<CrazyRecipe>
 */
export const updateRecipe = async (
  id: string, 
  recipeData: CrazyRecipeUpdate
): Promise<CrazyRecipe> => {
  const { data, error } = await supabase
    .from('crazy_recipes')
    .update(recipeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating recipe:', error);
    throw new Error(`Failed to update recipe: ${error.message}`);
  }

  return data;
};

/**
 * Update recipe with new image
 * @param id - Recipe ID
 * @param recipeData - Recipe data to update
 * @param imageFile - New image file (optional)
 * @param deleteOldImage - Whether to delete the old image
 * @returns Promise<CrazyRecipe>
 */
export const updateRecipeWithImage = async (
  id: string,
  recipeData: CrazyRecipeUpdate,
  imageFile?: File,
  deleteOldImage: boolean = true
): Promise<CrazyRecipe> => {
  // Get current recipe to access old image
  const currentRecipe = await getRecipeById(id);
  if (!currentRecipe) {
    throw new Error('Recipe not found');
  }

  let imageUrl = recipeData.image_url;

  // Upload new image if provided
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${currentRecipe.author_id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('crazy-recipe-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading new image:', uploadError);
      if (uploadError.message.includes('Bucket not found')) {
        console.warn('CRITICAL: Storage bucket "crazy-recipe-images" is missing. Please run the FIX_STORAGE_AND_DB.sql script in Supabase.');
        // Don't update image if bucket missing
      } else {
        throw new Error(`Failed to upload new image: ${uploadError.message}`);
      }
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('crazy-recipe-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;

      // Delete old image if specified and it exists
      if (deleteOldImage && currentRecipe.image_url) {
        await deleteRecipeImage(currentRecipe.image_url);
      }
    }
  }

  // Update recipe
  return await updateRecipe(id, {
    ...recipeData,
    image_url: imageUrl
  });
};

/**
 * Approve a recipe (admin function)
 * @param id - Recipe ID
 * @returns Promise<CrazyRecipe>
 */
export const approveRecipe = async (id: string): Promise<CrazyRecipe> => {
  return await updateRecipe(id, { is_approved: true });
};

/**
 * Update recipe statistics (views, likes)
 * @param id - Recipe ID
 * @param stats - Statistics to update
 * @returns Promise<CrazyRecipe>
 */
export const updateRecipeStats = async (
  id: string,
  stats: { views_count?: number; likes_count?: number }
): Promise<CrazyRecipe> => {
  return await updateRecipe(id, stats);
};

// ========================================
// DELETE OPERATIONS
// ========================================

/**
 * Delete a recipe by ID
 * @param id - Recipe ID
 * @returns Promise<void>
 */
export const deleteRecipe = async (id: string): Promise<void> => {
  // Get recipe before deletion to clean up image
  const recipe = await getRecipeById(id);
  
  if (recipe?.image_url) {
    await deleteRecipeImage(recipe.image_url);
  }

  const { error } = await supabase
    .from('crazy_recipes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting recipe:', error);
    throw new Error(`Failed to delete recipe: ${error.message}`);
  }
};

/**
 * Delete recipe image from storage
 * @param imageUrl - Public URL of the image
 * @returns Promise<void>
 */
export const deleteRecipeImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'crazy-recipe-images');
    
    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      const { error } = await supabase.storage
        .from('crazy-recipe-images')
        .remove([filePath]);

      if (error) {
        // Ignore bucket not found error during cleanup
        if (!error.message.includes('Bucket not found')) {
          console.error('Error deleting recipe image:', error);
        }
      }
    }
  } catch (error) {
    console.warn('Error parsing image URL for deletion:', error);
  }
};

// ========================================
// INTERACTION OPERATIONS
// ========================================

/**
 * Increment recipe view count using RPC function
 * @param recipeId - Recipe ID
 * @returns Promise<void>
 */
export const incrementRecipeViews = async (recipeId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_recipe_views', { 
    recipe_id: recipeId 
  });

  if (error) {
    console.warn('Failed to increment views:', error);
  }
};

/**
 * Increment recipe like count using RPC function
 * @param recipeId - Recipe ID
 * @returns Promise<void>
 */
export const incrementRecipeLikes = async (recipeId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_recipe_likes', { 
    recipe_id: recipeId 
  });

  if (error) {
    console.warn('Failed to increment likes:', error);
  }
};

/**
 * Decrement recipe like count using RPC function
 * @param recipeId - Recipe ID
 * @returns Promise<void>
 */
export const decrementRecipeLikes = async (recipeId: string): Promise<void> => {
  const { error } = await supabase.rpc('decrement_recipe_likes', { 
    recipe_id: recipeId 
  });

  if (error) {
    console.warn('Failed to decrement likes:', error);
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Check if user owns the recipe
 * @param recipe - Recipe object
 * @param userId - User ID to check
 * @returns boolean
 */
export const isRecipeOwner = (recipe: CrazyRecipe, userId?: string): boolean => {
  if (!userId) return false;
  return recipe.author_id === userId;
};

/**
 * Get recipe statistics
 * @param userId - Optional user ID to filter stats
 * @returns Promise<{ total: number; userRecipes: number; approved: number }>
 */
export const getRecipeStats = async (userId?: string): Promise<{
  total: number;
  userRecipes: number;
  approved: number;
}> => {
  const { count: total } = await supabase
    .from('crazy_recipes')
    .select('*', { count: 'exact', head: true });

  const { count: approved } = await supabase
    .from('crazy_recipes')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true);

  let userRecipes = 0;
  if (userId) {
    const { count } = await supabase
      .from('crazy_recipes')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);
    userRecipes = count || 0;
  }

  return {
    total: total || 0,
    approved: approved || 0,
    userRecipes
  };
};

/**
 * Bulk update approval status
 * @param recipeIds - Array of recipe IDs
 * @param approved - Approval status to set
 * @returns Promise<number> - Number of updated recipes
 */
export const bulkUpdateApproval = async (
  recipeIds: string[],
  approved: boolean
): Promise<number> => {
  const { error, count } = await supabase
    .from('crazy_recipes')
    .update({ is_approved: approved })
    .in('id', recipeIds);

  if (error) {
    console.error('Error bulk updating approval:', error);
    throw new Error(`Failed to bulk update approval: ${error.message}`);
  }

  return count || 0;
};

// ========================================
// REVIEW OPERATIONS
// ========================================

export interface RecipeReview {
  id: string;
  recipe_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

/**
 * Fetch reviews for a recipe
 * @param recipeId - Recipe ID
 * @returns Promise<RecipeReview[]>
 */
export const getRecipeReviews = async (recipeId: string): Promise<RecipeReview[]> => {
  const { data, error } = await supabase
    .from('crazy_recipe_reviews')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    // If table doesn't exist, return empty array to prevent crash
    if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
      console.warn('crazy_recipe_reviews table missing. Returning empty reviews.');
      return [];
    }
    console.error('Error fetching reviews:', error);
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  // Type assertion
  return (data || []) as unknown as RecipeReview[];
};

/**
 * Submit a review for a recipe
 * @param review - Review data
 * @returns Promise<void>
 */
export const submitReview = async (
  review: Omit<RecipeReview, 'id' | 'created_at'>
): Promise<void> => {
  const { error } = await supabase
    .from('crazy_recipe_reviews')
    .insert(review);

  if (error) {
    console.error('Error submitting review:', error);
    throw new Error(`Failed to submit review: ${error.message}`);
  }
};

/**
 * Fetch reviews by specific reviewer names
 * @param reviewerNames - Array of reviewer names
 * @returns Promise<RecipeReview[]>
 */
export const getReviewsByReviewers = async (reviewerNames: string[]): Promise<RecipeReview[]> => {
  const { data, error } = await supabase
    .from('crazy_recipe_reviews')
    .select('*')
    .in('reviewer_name', reviewerNames);

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
      console.warn('crazy_recipe_reviews table missing. Returning empty reviews.');
      return [];
    }
    console.error('Error fetching reviews by reviewers:', error);
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  return (data || []) as unknown as RecipeReview[];
};
