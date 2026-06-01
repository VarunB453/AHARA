import { useCallback, useEffect, useState } from 'react';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'ahara:favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading] = useState(false);
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((recipeId: string) => favorites.includes(recipeId), [favorites]);

  const toggleFavorite = useCallback(async (recipeId: string) => {
    try {
      const isCurrentlyFavorite = favorites.includes(recipeId);
      const nextFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== recipeId)
        : [...favorites, recipeId];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
      setFavorites(nextFavorites);

      toast({
        title: isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: isCurrentlyFavorite ? 'Recipe removed from this browser.' : 'Recipe saved in this browser.',
      });

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [favorites, toast]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
};
