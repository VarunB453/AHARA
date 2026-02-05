import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, Eye, Heart, ChefHat, Leaf, Flame, Star, User, Edit, Trash2 } from 'lucide-react';
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
  const { getAllRecipes, deleteRecipe } = useRecipeService();
  const [recipes, setRecipes] = useState<CrazyRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<CrazyRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('newest');

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, searchTerm, filterType, sortBy]);

  // No animations - using CSS transitions instead

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      
      // Combine frontend weird foods with any database recipes
      const frontendRecipes: CrazyRecipe[] = weirdFoodRecipes.map(recipe => ({
        ...recipe,
        image_url: recipe.image_url,
        author_id: '00000000-0000-0000-0000-000000000001',
        author_name: 'aahara',
        author_email: 'admin@ahara.com',
        views_count: 0,
        likes_count: 0,
        is_approved: true,
        updated_at: recipe.created_at
      }));

      // Fetch database recipes using service
      let dbRecipes: CrazyRecipe[] = [];
      try {
        dbRecipes = await getAllRecipes();
      } catch (dbError) {
        console.error('Database connection failed:', dbError);
        // Don't show toast here to avoid annoying users, just log it
        // and show frontend recipes only
      }
      
      // Combine frontend and database recipes, with frontend recipes first
      const allRecipes = [...frontendRecipes, ...dbRecipes];
      setRecipes(allRecipes);
    } catch (error: any) {
      console.error('Error in recipe loading flow:', error);
      // Fallback to just frontend recipes if something major breaks
      const frontendRecipes: CrazyRecipe[] = weirdFoodRecipes.map(recipe => ({
        ...recipe,
        image_url: recipe.image_url,
        author_id: '00000000-0000-0000-0000-000000000001',
        author_name: 'AHARA',
        author_email: 'admin@ahara.com',
        views_count: 0,
        likes_count: 0,
        is_approved: true,
        updated_at: recipe.created_at
      }));
      setRecipes(frontendRecipes);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecipes = () => {
    let filtered = [...recipes];

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

    // Guest mode: Show only 3 recipes to non-authenticated users
    // Removed restriction to show all recipes publicly as requested
    // if (!user) {
    //   filtered = filtered.slice(0, 3);
    // }

    setFilteredRecipes(filtered);
  };

  const handleRecipeSubmit = () => {
    setShowUploadForm(false);
    fetchRecipes(); // Refresh the list
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

  const frontendRecipeData = useMemo(() => {
    const data = new Map<string, { reviews: typeof weirdFoodReviews, averageRating: number, isFrontendRecipe: boolean }>();
    const frontendIds = new Set(weirdFoodRecipes.map(r => r.id));
    
    // Group reviews by recipe ID first
    const reviewsMap = new Map<string, typeof weirdFoodReviews>();
    weirdFoodReviews.forEach(review => {
      if (!reviewsMap.has(review.recipe_id)) {
        reviewsMap.set(review.recipe_id, []);
      }
      reviewsMap.get(review.recipe_id)!.push(review);
    });

    frontendIds.forEach(id => {
      const reviews = reviewsMap.get(id) || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      data.set(id, {
        reviews,
        averageRating,
        isFrontendRecipe: true
      });
    });
    
    return data;
  }, []);

  const getReviewsAndRating = (recipeId: string) => {
    return frontendRecipeData.get(recipeId) || { reviews: [], averageRating: 0, isFrontendRecipe: false };
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
      fetchRecipes();
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
        {loading ? (
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
        ) : filteredRecipes.length === 0 ? (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => {
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
        )}

      </main>

      <Footer />
    </div>
  );
};

export default CrazyRecipes;
