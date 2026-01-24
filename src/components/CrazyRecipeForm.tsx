import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Clock, ChefHat, Leaf, Flame, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecipeService } from '@/hooks/useRecipeService';
import type { CrazyRecipe } from '@/services/recipeService';

interface CrazyRecipeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editMode?: boolean;
  initialData?: CrazyRecipe;
}

const CrazyRecipeForm = ({ onSuccess, onCancel, editMode = false, initialData }: CrazyRecipeFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createRecipe, updateRecipe, deleteRecipe } = useRecipeService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    ingredients: initialData?.ingredients || [''],
    instructions: initialData?.instructions || '',
    cookingTime: initialData?.cooking_time?.toString() || '',
    isVeg: initialData?.is_veg ?? true,
    image: null as File | null,
    imagePreview: initialData?.image_url || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(initialData?.image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to share your recipe',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.instructions.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const validIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
    if (validIngredients.length === 0) {
      toast({
        title: 'Ingredients required',
        description: 'Please add at least one ingredient',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.cookingTime || parseInt(formData.cookingTime) <= 0) {
      toast({
        title: 'Invalid cooking time',
        description: 'Please enter a valid cooking time',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: validIngredients,
        instructions: formData.instructions.trim(),
        cooking_time: parseInt(formData.cookingTime),
        is_veg: formData.isVeg,
        image_url: existingImageUrl || undefined,
        author_id: user.id,
        author_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        author_email: user.email || '',
        is_approved: true, // Auto-approve for now so user can see their recipe
      };

      let result;
      
      if (editMode && initialData) {
        // For update, we don't need to send author info again, but it doesn't hurt
        result = await updateRecipe(initialData.id, recipeData, formData.image || undefined);
      } else {
        // For create, author info is required
        // @ts-ignore - Temporary fix for type mismatch if types aren't fully updated yet
        result = await createRecipe(recipeData, formData.image || undefined);
      }

      if (result) {
        // Update existing image URL reference
        if (result.image_url) {
          setExistingImageUrl(result.image_url);
        }

        // Reset form for new recipes
        if (!editMode) {
          setFormData({
            title: '',
            description: '',
            ingredients: [''],
            instructions: '',
            cookingTime: '',
            isVeg: true,
            image: null,
            imagePreview: ''
          });
          setExistingImageUrl(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }

        onSuccess?.();
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editMode || !initialData) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${initialData.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const success = await deleteRecipe(initialData.id);
      
      if (success) {
        onSuccess?.();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-2xl border border-border bg-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ChefHat className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {editMode ? 'Edit Your Crazy Recipe' : 'Share Your Crazy Recipe'}
          </h1>
          <p className="text-muted-foreground">
            {editMode 
              ? 'Update your culinary masterpiece and keep the creativity flowing!'
              : 'Unleash your creativity and share your unique culinary masterpiece with the world!'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Recipe Image</Label>
            <div className="flex flex-col items-center">
              {formData.imagePreview || existingImageUrl ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={formData.imagePreview || existingImageUrl || ''}
                    alt="Recipe preview"
                    className="w-full h-64 object-cover rounded-xl border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {editMode && existingImageUrl && !formData.image && (
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      Current image
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="recipe-image"
                  />
                  <label
                    htmlFor="recipe-image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-secondary/30"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center">
                      Click to upload recipe image
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                placeholder="Give your crazy recipe a name"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Cooking Time (minutes) *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="cookingTime"
                  type="number"
                  placeholder="30"
                  value={formData.cookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your crazy recipe and what makes it special..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Veg/Non-Veg Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              {formData.isVeg ? (
                <Leaf className="h-5 w-5 text-veg" />
              ) : (
                <Flame className="h-5 w-5 text-nonveg" />
              )}
              <div>
                <span className="font-medium">Recipe Type</span>
                <p className="text-sm text-muted-foreground">
                  {formData.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </p>
              </div>
            </div>
            <Switch
              checked={formData.isVeg}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVeg: checked }))}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Ingredients *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Ingredient ${index + 1}`}
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Cooking Instructions *</Label>
            <Textarea
              id="instructions"
              placeholder="Step by step instructions to make your crazy recipe..."
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              rows={6}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Recipe' : 'Submit Recipe')}
              <ChefHat className="h-4 w-4" />
            </Button>
            {editMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrazyRecipeForm;
