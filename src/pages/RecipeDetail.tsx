import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Flame, Share2, Printer, ChefHat, Check, Heart, Bookmark, TrendingUp, Award, Timer, Utensils } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { getRecipeDetail } from '@/data/recipeDetails';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LikeButton from '@/components/LikeButton';
import { useState } from 'react';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isVegMode, setIsVegMode] = useState(true);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  
  const recipe = recipes.find(r => r.id === id);
  const details = id ? getRecipeDetail(id) : null;

  if (!recipe || !details) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Recipe not found</h1>
          <Link to="/recipes" className="text-primary hover:underline mt-4 inline-block">
            Browse all recipes
          </Link>
        </div>
      </div>
    );
  }

  const spiceLevelConfig = {
    mild: { label: 'Mild', color: 'text-spice-mild', flames: 1 },
    medium: { label: 'Medium', color: 'text-spice-medium', flames: 2 },
    hot: { label: 'Hot', color: 'text-spice-hot', flames: 3 },
  };

  const spice = spiceLevelConfig[recipe.spiceLevel];

  const toggleStep = (step: number) => {
    setCheckedSteps(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const progressPercentage = (checkedSteps.length / details.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />
      
      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="absolute inset-0 h-[60vh] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/60 to-background" />
        </div>

        <div className="container relative mx-auto px-4 pt-8">
          {/* Back Button */}
          <Link to="/recipes">
            <Button variant="outline" size="sm" className="mb-6 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Button>
          </Link>

          {/* Recipe Header */}
          <div className="mt-32 md:mt-48 rounded-2xl bg-card/95 backdrop-blur-sm p-6 md:p-8 shadow-2xl border border-border/50">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Veg/Non-Veg Badge */}
              <Badge variant="outline" className={cn(
                "border-2 bg-card/80 backdrop-blur-sm",
                recipe.isVeg ? "border-veg text-veg" : "border-nonveg text-nonveg"
              )}>
                <div className={cn(
                  "h-2 w-2 rounded-full mr-2 animate-pulse",
                  recipe.isVeg ? "bg-veg" : "bg-nonveg"
                )} />
                {recipe.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </Badge>

              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {recipe.region}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                {Array.from({ length: spice.flames }).map((_, i) => (
                  <Flame key={i} className={cn("h-3 w-3", spice.color)} />
                ))}
                <span className={cn("text-sm font-medium", spice.color)}>{spice.label}</span>
              </Badge>

              {recipe.isTrending && (
                <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
              {recipe.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6 max-w-3xl leading-relaxed">
              {recipe.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-sm">{recipe.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">({recipe.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
            </div>

            {/* Chef & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link to={`/chefs`} className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={recipe.chef.avatar}
                    alt={recipe.chef.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all duration-300"
                  />
                  {recipe.chef.isVerified && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                      <Award className="h-2 w-2 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recipe by</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {recipe.chef.name}
                  </p>
                  {recipe.chef.specialty && (
                    <p className="text-xs text-muted-foreground">{recipe.chef.specialty}</p>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <LikeButton recipeId={recipe.id} variant="icon" className="hover:scale-110 transition-transform" />
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Ingredients & Nutrition */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <Card className="sticky top-24 shadow-lg border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Cooking Progress
                </CardTitle>
                <CardDescription>
                  {checkedSteps.length} of {details.instructions.length} steps completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
                {progressPercentage === 100 && (
                  <Badge className="w-full justify-center bg-green-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Recipe Complete!
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Ingredients Card */}
            <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Ingredients
                </CardTitle>
                <CardDescription>For {recipe.servings} servings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors">
                      <span className="text-foreground font-medium">{ingredient.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {ingredient.quantity} {ingredient.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Card */}
            <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Nutrition per Serving</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-3 text-center border border-primary/20">
                    <p className="text-2xl font-bold text-primary">{details.nutrition.calories}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-3 text-center border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-600">{details.nutrition.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-3 text-center border border-orange-500/20">
                    <p className="text-2xl font-bold text-orange-600">{details.nutrition.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-3 text-center border border-yellow-500/20">
                    <p className="text-2xl font-bold text-yellow-600">{details.nutrition.fat}g</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 p-3 text-center border border-green-500/20">
                    <p className="text-2xl font-bold text-green-600">{details.nutrition.fiber}g</p>
                    <p className="text-xs text-muted-foreground">Fiber</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-3 text-center border border-purple-500/20">
                    <p className="text-2xl font-bold text-purple-600">{details.nutrition.sodium}mg</p>
                    <p className="text-xs text-muted-foreground">Sodium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="tips">Chef's Tips</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instructions" className="space-y-6">
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-primary" />
                        Step-by-Step Instructions
                      </CardTitle>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {details.instructions.reduce((acc, inst) => acc + (inst.time || 0), 0)} min total
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {details.instructions.map((instruction) => (
                      <div
                        key={instruction.step}
                        className={cn(
                          "relative pl-12 pb-6 border-l-2 last:border-l-0 last:pb-0 transition-all duration-300",
                          checkedSteps.includes(instruction.step) 
                            ? "border-primary/50" 
                            : "border-border"
                        )}
                      >
                        {/* Step Number */}
                        <button
                          onClick={() => toggleStep(instruction.step)}
                          className={cn(
                            "absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 hover:scale-110",
                            checkedSteps.includes(instruction.step)
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted text-muted-foreground hover:bg-primary/20"
                          )}
                        >
                          {checkedSteps.includes(instruction.step) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            instruction.step
                          )}
                        </button>

                        <div className={cn(
                          "transition-all duration-300",
                          checkedSteps.includes(instruction.step) && "opacity-60"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{instruction.title}</h3>
                            {instruction.time && (
                              <Badge variant="secondary" className="gap-1">
                                <Timer className="h-3 w-3" />
                                {instruction.time} min
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {instruction.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tips">
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Award className="h-6 w-6 text-primary" />
                      Chef's Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {details.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tags">
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">Recipe Tags</CardTitle>
                    <CardDescription>Explore related recipes with these tags</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="capitalize hover:bg-primary/20 transition-colors cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
