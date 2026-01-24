import { Link } from 'react-router-dom';
import { Clock, Users, Star, Flame, Heart, TrendingUp, Award, ChefHat } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import LikeButton from './LikeButton';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

const RecipeCard = ({ recipe, index = 0 }: RecipeCardProps) => {
  const spiceLevelConfig = {
    mild: { label: 'Mild', color: 'bg-spice-mild', flames: 1 },
    medium: { label: 'Medium', color: 'bg-spice-medium', flames: 2 },
    hot: { label: 'Hot', color: 'bg-spice-hot', flames: 3 },
  };

  const spice = spiceLevelConfig[recipe.spiceLevel];

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Top Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {/* Veg/Non-Veg Badge */}
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-sm",
                recipe.isVeg 
                  ? "border-veg bg-card/90" 
                  : "border-nonveg bg-card/90"
              )}>
                <div className={cn(
                  "h-3.5 w-3.5 rounded-full animate-pulse",
                  recipe.isVeg ? "bg-veg" : "bg-nonveg"
                )} />
              </div>
              
              {/* Like Button */}
              <LikeButton 
                recipeId={recipe.id} 
                variant="icon" 
                className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg transition-all duration-300 hover:scale-110"
              />
            </div>

            {/* Top Right Badge */}
            <div className="absolute right-3 top-3">
              <Badge variant="secondary" className="flex items-center gap-1 bg-foreground/80 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{recipe.rating}</span>
              </Badge>
            </div>

            {/* Bottom Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary backdrop-blur-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {recipe.cookingTime} min
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/20 border-secondary/50 text-secondary-foreground backdrop-blur-sm">
                    <Users className="h-3 w-3 mr-1" />
                    {recipe.servings}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: spice.flames }).map((_, i) => (
                    <Flame key={i} className={cn("h-4 w-4 animate-pulse", 
                      recipe.spiceLevel === 'mild' ? 'text-spice-mild' :
                      recipe.spiceLevel === 'medium' ? 'text-spice-medium' : 'text-spice-hot'
                    )} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick View Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <span className="text-sm font-semibold">View Recipe</span>
                <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2 text-xs font-semibold uppercase tracking-wider">
                  {recipe.region}
                </Badge>
                <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                  {recipe.title}
                </h3>
              </div>
              {recipe.isTrending && (
                <Badge variant="default" className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {recipe.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recipe.cookingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: spice.flames }).map((_, i) => (
                  <Flame key={i} className={cn("h-3.5 w-3.5", 
                    recipe.spiceLevel === 'mild' ? 'text-spice-mild' :
                    recipe.spiceLevel === 'medium' ? 'text-spice-medium' : 'text-spice-hot'
                  )} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{spice.label}</span>
              </div>
            </div>

            {/* Chef Info */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={recipe.chef.avatar}
                    alt={recipe.chef.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-border"
                  />
                  {recipe.chef.isVerified && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                      <Award className="h-2 w-2 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {recipe.chef.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {recipe.chef.specialty}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5" />
                <span>{recipe.likes || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipeCard;
