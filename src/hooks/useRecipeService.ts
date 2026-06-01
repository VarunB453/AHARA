import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as recipeService from '@/services/recipeService';
import type { CrazyRecipe, RecipeReview } from '@/services/recipeService';

export const useRecipeService = () => {
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
      const recipes = await recipeService.getAllRecipes();
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

  const createRecipe = useCallback(async (): Promise<CrazyRecipe | null> => {
    toast({
      title: 'Recipe submissions are unavailable',
      description: 'Login and user recipe submission features have been removed.',
    });
    return null;
  }, [toast]);

  // ========================================
  // UPDATE OPERATIONS
  // ========================================

  const updateRecipe = useCallback(async (): Promise<CrazyRecipe | null> => {
    toast({
      title: 'Recipe editing is unavailable',
      description: 'Login and user recipe editing features have been removed.',
    });
    return null;
  }, [toast]);

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

  const deleteRecipe = useCallback(async (): Promise<boolean> => {
    toast({
      title: 'Recipe deletion is unavailable',
      description: 'Login and user recipe deletion features have been removed.',
    });
    return false;
  }, [toast]);

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
    toast({
      title: 'Review submission is unavailable',
      description: 'Login and user review features have been removed.',
    });
    return false;
  }, [toast]);

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
      const stats = await recipeService.getRecipeStats(userId);
      return stats;
    } catch (err: any) {
      console.error('Failed to get recipe stats:', err);
      return { total: 0, userRecipes: 0, approved: 0 };
    }
  }, []);

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
