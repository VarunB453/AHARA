import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import * as recipeService from '@/services/recipeService';
import type { CrazyRecipe, RecipeReview } from '@/services/recipeService';

export const useRecipeService = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => setError(null), []);

  // ========================================
  // READ OPERATIONS
  // ========================================

  const getAllRecipes = useCallback(async (): Promise<CrazyRecipe[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Pass user.id to allow fetching own unapproved recipes
      const recipes = await recipeService.getAllRecipes(user?.id);
      return recipes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch recipes';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRecipeById = useCallback(async (id: string): Promise<CrazyRecipe | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipe = await recipeService.getRecipeById(id);
      return recipe;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRecipesByUser = useCallback(async (
    userId: string, 
    includeUnapproved: boolean = false
  ): Promise<CrazyRecipe[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipes = await recipeService.getRecipesByUser(userId, includeUnapproved);
      return recipes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user recipes';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRecipesByAuthorName = useCallback(async (
    authorName: string
  ): Promise<CrazyRecipe[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipes = await recipeService.getRecipesByAuthorName(authorName);
      return recipes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch recipes by author';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchRecipes = useCallback(async (
    searchTerm: string,
    approvedOnly: boolean = false
  ): Promise<CrazyRecipe[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipes = await recipeService.searchRecipes(searchTerm, approvedOnly);
      return recipes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search recipes';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterRecipesByType = useCallback(async (
    isVeg: boolean,
    approvedOnly: boolean = true
  ): Promise<CrazyRecipe[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipes = await recipeService.filterRecipesByType(isVeg, approvedOnly);
      return recipes;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to filter recipes';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRecipesWithPagination = useCallback(async (
    page: number = 1,
    limit: number = 10,
    approvedOnly: boolean = true
  ): Promise<{recipes: CrazyRecipe[], total: number}> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await recipeService.getRecipesWithPagination(page, limit, approvedOnly);
      return {
        recipes: result.data,
        total: result.count
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch recipes';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { recipes: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ========================================
  // CREATE OPERATIONS
  // ========================================

  const createRecipe = useCallback(async (
    recipeData: any,
    imageFile?: File
  ): Promise<CrazyRecipe | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a recipe',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const recipeDataWithUser = {
        ...recipeData,
        author_id: user.id,
        author_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        author_email: user.email || '',
      };

      let newRecipe;
      if (imageFile) {
        newRecipe = await recipeService.createRecipeWithImage(recipeDataWithUser, imageFile);
      } else {
        newRecipe = await recipeService.createRecipe(recipeDataWithUser);
      }

      toast({
        title: 'Success!',
        description: 'Recipe created successfully and submitted for review.',
      });

      return newRecipe;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // ========================================
  // UPDATE OPERATIONS
  // ========================================

  const updateRecipe = useCallback(async (
    id: string,
    recipeData: any,
    imageFile?: File
  ): Promise<CrazyRecipe | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to update a recipe',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      let updatedRecipe;
      if (imageFile) {
        updatedRecipe = await recipeService.updateRecipeWithImage(id, recipeData, imageFile);
      } else {
        updatedRecipe = await recipeService.updateRecipe(id, recipeData);
      }

      toast({
        title: 'Success!',
        description: 'Recipe updated successfully.',
      });

      return updatedRecipe;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const approveRecipe = useCallback(async (id: string): Promise<CrazyRecipe | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const recipe = await recipeService.approveRecipe(id);
      
      toast({
        title: 'Success!',
        description: 'Recipe approved successfully.',
      });

      return recipe;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to approve recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ========================================
  // DELETE OPERATIONS
  // ========================================

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to delete a recipe',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      await recipeService.deleteRecipe(id);
      
      toast({
        title: 'Success!',
        description: 'Recipe deleted successfully.',
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete recipe';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // ========================================
  // INTERACTION OPERATIONS
  // ========================================

  const incrementViews = useCallback(async (recipeId: string): Promise<void> => {
    try {
      await recipeService.incrementRecipeViews(recipeId);
    } catch (err) {
      console.warn('Failed to increment views:', err);
    }
  }, []);

  const incrementLikes = useCallback(async (recipeId: string): Promise<void> => {
    try {
      await recipeService.incrementRecipeLikes(recipeId);
    } catch (err) {
      console.warn('Failed to increment likes:', err);
    }
  }, []);

  const decrementLikes = useCallback(async (recipeId: string): Promise<void> => {
    try {
      await recipeService.decrementRecipeLikes(recipeId);
    } catch (err) {
      console.warn('Failed to decrement likes:', err);
    }
  }, []);

  const getRecipeReviews = useCallback(async (recipeId: string): Promise<RecipeReview[]> => {
    // Don't set global loading state for reviews to avoid flickering the whole page
    try {
      return await recipeService.getRecipeReviews(recipeId);
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      // We don't show a toast here to avoid spamming the user if reviews fail quietly
      return [];
    }
  }, []);

  const submitReview = useCallback(async (
    review: Omit<RecipeReview, 'id' | 'created_at'>
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a review',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      await recipeService.submitReview(review);
      
      toast({
        title: 'Success!',
        description: 'Review submitted successfully.',
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit review';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const getReviewsByReviewers = useCallback(async (reviewerNames: string[]): Promise<RecipeReview[]> => {
    try {
      return await recipeService.getReviewsByReviewers(reviewerNames);
    } catch (err: any) {
      console.error('Failed to fetch reviews by reviewers:', err);
      return [];
    }
  }, []);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const getRecipeStats = useCallback(async (userId?: string): Promise<{
    total: number;
    userRecipes: number;
    approved: number;
  }> => {
    try {
      const stats = await recipeService.getRecipeStats(userId || user?.id);
      return stats;
    } catch (err: any) {
      console.error('Failed to get recipe stats:', err);
      return { total: 0, userRecipes: 0, approved: 0 };
    }
  }, [user]);

  const bulkUpdateApproval = useCallback(async (
    recipeIds: string[],
    approved: boolean
  ): Promise<number> => {
    setLoading(true);
    setError(null);
    
    try {
      const count = await recipeService.bulkUpdateApproval(recipeIds, approved);
      
      toast({
        title: 'Success!',
        description: `${count} recipes ${approved ? 'approved' : 'unapproved'} successfully.`,
      });

      return count;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to bulk update approval';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return 0;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    // State
    loading,
    error,
    
    // Utility
    clearError,
    
    // Read operations
    getAllRecipes,
    getRecipeById,
    getRecipesByUser,
    getRecipesByAuthorName,
    searchRecipes,
    filterRecipesByType,
    getRecipesWithPagination,
    
    // Create operations
    createRecipe,
    
    // Update operations
    updateRecipe,
    approveRecipe,
    
    // Delete operations
    deleteRecipe,
    
    // Interaction operations
    incrementViews,
    incrementLikes,
    decrementLikes,
    getRecipeReviews,
    submitReview,
    getReviewsByReviewers,
    
    // Utility functions
    getRecipeStats,
    bulkUpdateApproval,
    
    // Helper function
    isRecipeOwner: recipeService.isRecipeOwner,
  };
};
