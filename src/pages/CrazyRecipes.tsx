import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, Eye, Heart, ChefHat, Leaf, Flame, Star, User, Edit, Trash2, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CrazyRecipeForm from '@/components/CrazyRecipeForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRecipeService } from '@/hooks/useRecipeService';
import type { CrazyRecipe } from '@/services/recipeService';
import { 
  weirdFoodRecipes, 
  weirdFoodReviews, 
  getReviewsForWeirdFood, 
  getAverageRatingForWeirdFood,
  type WeirdFoodRecipe 
} from '@/data/weirdFoods';

const CrazyRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getRecipes, deleteRecipe } = useRecipeService();

  const [dbRecipes, setDbRecipes] = useState<CrazyRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('newest');

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 9;

  // Calculate frontend recipes based on filters
  const frontendRecipes = useMemo(() => {
    let filtered: CrazyRecipe[] = weirdFoodRecipes.map(recipe => ({
      ...recipe,
      image_url: recipe.image_url,
      author_id: '00000000-0000-0000-0000-000000000001',
      author_name: 'Spice Route Navigator',
      author_email: 'admin@spiceroute.com',
      views_count: 0,
      likes_count: 0,
      is_approved: true,
      updated_at: recipe.created_at
    }));

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filterType === 'veg') {
      filtered = filtered.filter(recipe => recipe.is_veg);
    } else if (filterType === 'non-veg') {
      filtered = filtered.filter(recipe => !recipe.is_veg);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return b.likes_count - a.likes_count;
        case 'views':
          return b.views_count - a.views_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterType, sortBy]);

  // Combined recipes for display
  const displayedRecipes = [...frontendRecipes, ...dbRecipes];

  const fetchRecipes = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const { recipes, total } = await getRecipes({
        page: pageNum,
        pageSize: PAGE_SIZE,
        searchTerm,
        filterType,
        sortBy,
        approvedOnly: true
      });

      if (isLoadMore) {
        setDbRecipes(prev => [...prev, ...recipes]);
      } else {
        setDbRecipes(recipes);
      }

      // Check if we have more recipes to load
      // Total count includes all matching DB recipes
      // We have loaded (pageNum * PAGE_SIZE) recipes roughly
      // More accurate: if we received less than PAGE_SIZE, we are done.
      // But we need to know if there is a next page.
      const loadedCount = isLoadMore ? dbRecipes.length + recipes.length : recipes.length;
      // Alternatively, relying on page count logic:
      const totalPages = Math.ceil(total / PAGE_SIZE);
      setHasMore(pageNum < totalPages);

    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Don't show toast on initial load to avoid annoyance if DB is down but frontend recipes work
      if (isLoadMore) {
        toast({
          title: 'Error',
          description: 'Failed to load more recipes. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getRecipes, searchTerm, filterType, sortBy, toast, dbRecipes.length]);
  // Note: dbRecipes.length in dep array is suspicious for recursion if we aren't careful,
  // but fetchRecipes is called by effects/handlers.
  // Actually, remove dbRecipes.length from deps to avoid stale closure issues or loops?
  // 'dbRecipes' is used in 'isLoadMore' branch via 'setDbRecipes(prev => ...)' so we don't need it in deps.
  // But 'loadedCount' calc uses it.
  // Better logic for hasMore: `recipes.length === PAGE_SIZE` and `total > pageNum * PAGE_SIZE`.

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    // We don't clear dbRecipes immediately to avoid flicker, let fetchRecipes replace it.
    // But if we change filters, old recipes might not match.
    // Better to clear or show loading.
    setDbRecipes([]);
    fetchRecipes(1, false);
  }, [fetchRecipes]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipes(nextPage, true);
  };

  const handleRecipeSubmit = () => {
    setShowUploadForm(false);
    // Refresh list
    setPage(1);
    fetchRecipes(1, false);
  };

  const handleUploadClick = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to share your crazy recipe',
        variant: 'destructive',
      });
      return;
    }
    setShowUploadForm(true);
  };

  const getReviewsAndRating = (recipeId: string) => {
    // Check if it's a frontend recipe
    const isFrontendRecipe = weirdFoodRecipes.some(recipe => recipe.id === recipeId);
    
    if (isFrontendRecipe) {
      const reviews = getReviewsForWeirdFood(recipeId);
      const averageRating = getAverageRatingForWeirdFood(recipeId);
      return { reviews, averageRating, isFrontendRecipe: true };
    }
    
    return { reviews: [], averageRating: 0, isFrontendRecipe: false };
  };

  const handleDeleteRecipe = async (recipeId: string, recipeTitle: string) => {
    if (!user) return;
    
    // Check if it's a frontend recipe (can't delete frontend recipes)
    const isFrontendRecipe = weirdFoodRecipes.some(recipe => recipe.id === recipeId);
    if (isFrontendRecipe) {
      toast({
        title: 'Cannot delete',
        description: 'This is a featured recipe and cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipeTitle}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    const success = await deleteRecipe(recipeId);
    
    if (success) {
      // Remove from state directly to avoid refetching and losing position
      setDbRecipes(prev => prev.filter(r => r.id !== recipeId));
    }
  };

  if (showUploadForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVegMode={true} onToggleVegMode={() => {}} />
        <div className="container py-8">
          <CrazyRecipeForm
            onSuccess={handleRecipeSubmit}
            onCancel={() => setShowUploadForm(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={true} onToggleVegMode={() => {}} />
      
      <main className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ChefHat className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Crazy Recipes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover the most creative and unconventional recipes from our community. 
            From fusion experiments to wild combinations, these recipes push the boundaries of Indian cuisine!
          </p>
          
          {/* Upload Button */}
          <Button
            onClick={handleUploadClick}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Share Your Crazy Recipe
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="search-section mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search crazy recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 p-1 rounded-lg bg-secondary">
                <Button
                  variant={filterType === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'veg' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('veg')}
                  className="gap-1"
                >
                  <Leaf className="h-3 w-3" />
                  Veg
                </Button>
                <Button
                  variant={filterType === 'non-veg' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('non-veg')}
                  className="gap-1"
                >
                  <Flame className="h-3 w-3" />
                  Non-Veg
                </Button>
              </div>

              <div className="flex gap-2 p-1 rounded-lg bg-secondary">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('newest')}
                >
                  Newest
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('popular')}
                >
                  Popular
                </Button>
                <Button
                  variant={sortBy === 'views' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('views')}
                >
                  Most Viewed
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading && !loadingMore && dbRecipes.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary rounded mb-2"></div>
                <div className="h-4 bg-secondary rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-secondary rounded flex-1"></div>
                  <div className="h-4 bg-secondary rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || filterType !== 'all' ? 'No recipes found' : 'No crazy recipes yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a crazy recipe with the community!'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={handleUploadClick} className="gap-2">
                <Plus className="h-4 w-4" />
                Share First Recipe
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedRecipes.map((recipe) => {
                const { reviews, averageRating, isFrontendRecipe } = getReviewsAndRating(recipe.id);

                return (
                  <div
                    key={recipe.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Recipe Image */}
                    <div className="relative h-48 overflow-hidden">
                      {recipe.image_url ? (
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error(`Failed to load image: ${recipe.image_url}`);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-primary/40" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant={recipe.is_veg ? 'default' : 'destructive'} className="gap-1">
                          {recipe.is_veg ? (
                            <><Leaf className="h-3 w-3" />Veg</>
                          ) : (
                            <><Flame className="h-3 w-3" />Non-Veg</>
                          )}
                        </Badge>
                      </div>

                      {/* Featured Badge for Frontend Recipes */}
                      {isFrontendRecipe && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Recipe Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {recipe.description}
                      </p>

                      {/* Recipe Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.cooking_time} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {recipe.views_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {recipe.likes_count}
                        </div>
                      </div>

                      {/* Rating Display */}
                      {isFrontendRecipe && averageRating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({averageRating.toFixed(1)} • {reviews.length} reviews)
                          </span>
                        </div>
                      )}

                      {/* Author */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">{recipe.author_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Edit and Delete buttons for recipe author */}
                          {user && user.id === recipe.author_id && !isFrontendRecipe && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast({
                                  title: 'Edit feature coming soon',
                                  description: 'Recipe editing will be available soon!',
                                })}
                                className="gap-1 h-8 px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                                className="gap-1 h-8 px-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}

                          <Link to={`/crazy-recipes/${recipe.id}`}>
                            <Button variant="ghost" size="sm">
                              View Recipe
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Load More Recipes
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Explore More Button for Guest Users */}
        {!user && displayedRecipes.length >= 3 && !hasMore && (
          <div className="mt-12 text-center">
            <div className="rounded-xl border border-border bg-card p-8 shadow-soft">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Want to explore more crazy recipes?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sign in to discover all the creative recipes from our community and share your own culinary experiments!
              </p>
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="gap-2"
              >
                <LogIn className="h-5 w-5" />
                Sign In to Explore More
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CrazyRecipes;
