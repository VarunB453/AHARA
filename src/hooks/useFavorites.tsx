import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isValidUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    if (!isValidUuid(user.id)) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(f => f.recipe_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((recipeId: string) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (recipeId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your favorite recipes.",
        variant: "destructive",
      });
      return false;
    }

    if (!isValidUuid(user.id)) {
      toast({
        title: "Sign in required",
        description: "Please sign in again to manage favorites.",
        variant: "destructive",
      });
      return false;
    }

    const isCurrentlyFavorite = isFavorite(recipeId);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== recipeId));
        toast({
          title: "Removed from favorites",
          description: "Recipe removed from your favorites.",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, recipe_id: recipeId });

        if (error) {
          // If it's a duplicate key error, the favorite already exists
          if (error.code === '23505') {
            // Refresh favorites to get the current state
            await fetchFavorites();
            toast({
              title: "Already in favorites",
              description: "This recipe is already in your favorites.",
            });
            return true;
          }
          throw error;
        }

        setFavorites(prev => {
          // Only add if not already in favorites to prevent duplicates
          if (!prev.includes(recipeId)) {
            return [...prev, recipeId];
          }
          return prev;
        });
        toast({
          title: "Added to favorites",
          description: "Recipe saved to your favorites!",
        });
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, isFavorite, toast]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
};
