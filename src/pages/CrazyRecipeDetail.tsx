import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, Heart, Share2, ChefHat, Leaf, Flame, Star, User, ArrowLeft, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRecipeService } from '@/hooks/useRecipeService';
import type { CrazyRecipe, RecipeReview } from '@/services/recipeService';
import CrazyRecipeForm from '@/components/CrazyRecipeForm';
import { 
  weirdFoodRecipes, 
  weirdFoodReviews, 
  getReviewsForWeirdFood, 
  getAverageRatingForWeirdFood,
  type WeirdFoodRecipe 
} from '@/data/weirdFoods';

const CrazyRecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getRecipeById, deleteRecipe, incrementViews: serviceIncrementViews, getRecipeReviews, submitReview } = useRecipeService();
  
  const [recipe, setRecipe] = useState<CrazyRecipe | null>(null);
  const [reviews, setReviews] = useState<RecipeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFrontendRecipe, setIsFrontendRecipe] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  });
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecipe();
      fetchReviews();
      incrementViews();
    }
  }, [id]);

  const fetchRecipe = async () => {
    if (!id) return;
    
    try {
      // First check if it's a frontend recipe
      const frontendRecipe = weirdFoodRecipes.find(recipe => recipe.id === id);
      
      if (frontendRecipe) {
        // It's a frontend recipe
        const typedRecipe: CrazyRecipe = {
          id: frontendRecipe.id,
          title: frontendRecipe.title,
          description: frontendRecipe.description,
          ingredients: frontendRecipe.ingredients,
          instructions: frontendRecipe.instructions,
          cooking_time: frontendRecipe.cooking_time,
          is_veg: frontendRecipe.is_veg,
          image_url: frontendRecipe.image_url,
          author_id: '00000000-0000-0000-0000-000000000001',
          author_name: 'AHARA',
          author_email: 'admin@ahara-auth.com',
          views_count: frontendRecipe.views_count,
          likes_count: frontendRecipe.likes_count,
          is_approved: true,
          created_at: frontendRecipe.created_at,
          updated_at: frontendRecipe.created_at
        };
        setRecipe(typedRecipe);
        setIsFrontendRecipe(true);
        setLoading(false);
        return;
      }

      // If not frontend recipe, try to fetch from database using service
      const dbRecipe = await getRecipeById(id);
      
      if (dbRecipe) {
        setRecipe(dbRecipe);
        setIsFrontendRecipe(false);
      } else {
        // If not found in DB either
        throw new Error('Recipe not found');
      }
    } catch (error: any) {
      console.error('Error fetching recipe:', error);
      toast({
        title: 'Recipe not found',
        description: 'The requested recipe could not be found.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // First check if it's a frontend recipe
      const frontendRecipe = weirdFoodRecipes.find(recipe => recipe.id === id);
      
      if (frontendRecipe) {
        // It's a frontend recipe - use frontend reviews
        const frontendReviews = getReviewsForWeirdFood(id);
        const typedReviews: RecipeReview[] = frontendReviews.map(review => ({
          id: review.id,
          recipe_id: review.recipe_id,
          reviewer_id: '00000000-0000-0000-0000-000000000002',
          reviewer_name: review.reviewer_name,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at
        }));
        
        setReviews(typedReviews);
        setHasReviewed(false); // Frontend recipes don't support user reviews
        return;
      }

      // If not frontend recipe, try to fetch from database using service
      const fetchedReviews = await getRecipeReviews(id);
      
      // Map to ensure types match if there are any discrepancies
      const typedReviews: RecipeReview[] = fetchedReviews.map(item => ({
        id: item.id || '',
        recipe_id: item.recipe_id || '',
        reviewer_id: item.reviewer_id || '',
        reviewer_name: item.reviewer_name || '',
        rating: Number(item.rating) || 5,
        comment: item.comment || '',
        created_at: item.created_at || ''
      }));
      
      setReviews(typedReviews);
      
      // Check if current user has already reviewed
      if (user) {
        const userReviewExists = typedReviews.some(review => review.reviewer_id === user.id);
        setHasReviewed(userReviewExists || false);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    }
  };

  const incrementViews = async () => {
    // Don't increment views for frontend recipes
    if (isFrontendRecipe || !id) return;
    
    await serviceIncrementViews(id);
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like recipes',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This would need a proper likes system implementation
      toast({
        title: 'Feature coming soon',
        description: 'Recipe likes will be available soon!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not like recipe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title,
          text: recipe?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Recipe link copied to clipboard',
      });
    }
  };

  const handleEdit = () => {
    if (isFrontendRecipe) {
      toast({
        title: 'Cannot edit',
        description: 'Featured recipes cannot be edited.',
        variant: 'destructive',
      });
      return;
    }
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!user || !recipe) return;
    
    // Prevent deletion of frontend recipes
    if (isFrontendRecipe) {
      toast({
        title: 'Cannot delete',
        description: 'Featured recipes cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }
    
    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setDeleting(true);

    try {
      const success = await deleteRecipe(recipe.id);

      if (success) {
        // Navigate back to crazy recipes list
        navigate('/crazy-recipes');
      }
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      // Toast is already handled in deleteRecipe
    } finally {
      setDeleting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    // Prevent reviews on frontend recipes
    if (isFrontendRecipe) {
      toast({
        title: 'Reviews not available',
        description: 'Featured recipes do not support user reviews.',
        variant: 'destructive',
      });
      return;
    }

    if (!userReview.comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please write a review comment',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingReview(true);

    try {
      const success = await submitReview({
        recipe_id: id,
        reviewer_id: user.id,
        reviewer_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        rating: userReview.rating,
        comment: userReview.comment.trim(),
      });

      if (!success) throw new Error('Failed to submit review');

      setUserReview({ rating: 5, comment: '' });
      setHasReviewed(true);
      fetchReviews();

    } catch (error: any) {
      console.error('Error submitting review:', error);
      // Toast is handled in submitReview
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isEditing && recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVegMode={true} onToggleVegMode={() => {}} />
        <div className="container py-8">
          <CrazyRecipeForm
            editMode={true}
            initialData={recipe}
            onSuccess={() => {
              setIsEditing(false);
              fetchRecipe();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVegMode={true} onToggleVegMode={() => {}} />
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-96 bg-secondary rounded-xl mb-8"></div>
              <div className="h-8 bg-secondary rounded mb-4"></div>
              <div className="h-4 bg-secondary rounded mb-8"></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-64 bg-secondary rounded"></div>
                <div className="h-64 bg-secondary rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVegMode={true} onToggleVegMode={() => {}} />
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Recipe Not Found</h1>
            <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist or hasn't been approved yet.</p>
            <Link to="/crazy-recipes">
              <Button>Browse Crazy Recipes</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={true} onToggleVegMode={() => {}} />
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/crazy-recipes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Crazy Recipes
          </Link>

          {/* Recipe Header */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
            {/* Recipe Image */}
            <div className="relative h-96">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <ChefHat className="h-24 w-24 text-primary/40" />
                </div>
              )}
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant={recipe.is_veg ? 'default' : 'destructive'} className="gap-1">
                  {recipe.is_veg ? (
                    <><Leaf className="h-3 w-3" />Vegetarian</>
                  ) : (
                    <><Flame className="h-3 w-3" />Non-Vegetarian</>
                  )}
                </Badge>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {recipe.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  {/* Edit and Delete buttons for recipe author */}
                  {user && user.id === recipe.author_id && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDelete} 
                        disabled={deleting}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={handleLike} className="gap-2">
                    <Heart className="h-4 w-4" />
                    {recipe.likes_count}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                {recipe.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {recipe.cooking_time} minutes
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {recipe.views_count} views
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {recipe.author_name}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {reviews.length} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Ingredients */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Instructions</h2>
              <div className="whitespace-pre-wrap text-foreground">
                {recipe.instructions}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">Reviews</h2>

            {/* Add Review Form */}
            {user && !hasReviewed && (
              <div className="rounded-xl border border-border bg-card p-6 mb-8">
                <h3 className="font-semibold text-lg text-foreground mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= userReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="reviewComment">Your Review</Label>
                    <Textarea
                      id="reviewComment"
                      placeholder="Share your experience with this recipe..."
                      value={userReview.comment}
                      onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-border bg-card">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to review this crazy recipe!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{review.reviewer_name}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CrazyRecipeDetail;
