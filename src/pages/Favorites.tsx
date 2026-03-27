import { useState, useEffect } from 'react';
import { Heart, Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { recipes } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, loading, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterSpice, setFilterSpice] = useState<string>('all');
  const [filterVeg, setFilterVeg] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  // Get favorite recipes
  const favoriteRecipes = recipes.filter(recipe => isFavorite(recipe.id));

  // Filter recipes based on search and filters
  const filteredRecipes = favoriteRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRegion = filterRegion === 'all' || recipe.region === filterRegion;
    const matchesSpice = filterSpice === 'all' || recipe.spiceLevel === filterSpice;
    const matchesVeg = filterVeg === 'all' || 
                      (filterVeg === 'veg' && recipe.isVeg) || 
                      (filterVeg === 'non-veg' && !recipe.isVeg);

    return matchesSearch && matchesRegion && matchesSpice && matchesVeg;
  });

  // Get unique regions for filter
  const regions = Array.from(new Set(recipes.map(r => r.region))).sort();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view and manage your favorite recipes.
            </p>
            <Button asChild className="w-full">
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('favorites.title')}</h1>
              <p className="text-muted-foreground">
                {loading ? t('common.loading') : `${favoriteRecipes.length} ${t('favorites.count')}`}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your favorite recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSpice} onValueChange={setFilterSpice}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Spice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVeg} onValueChange={setFilterVeg}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Veg</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || filterRegion !== 'all' || filterSpice !== 'all' || filterVeg !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterRegion !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Region: {filterRegion}
                  <button
                    onClick={() => setFilterRegion('all')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterSpice !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Spice: {filterSpice}
                  <button
                    onClick={() => setFilterSpice('all')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterVeg !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filterVeg === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                  <button
                    onClick={() => setFilterVeg('all')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterRegion('all');
                  setFilterSpice('all');
                  setFilterVeg('all');
                }}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {favoriteRecipes.length === 0 
                ? "No favorites yet" 
                : "No recipes match your filters"
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {favoriteRecipes.length === 0
                ? "Start exploring and save your favorite recipes to see them here!"
                : "Try adjusting your filters or search terms"
              }
            </p>
            {favoriteRecipes.length === 0 && (
              <Button asChild>
                <a href="/recipes">Explore Recipes</a>
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-4"
          )}>
            {filteredRecipes.map((recipe, index) => (
              viewMode === 'grid' ? (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ) : (
                <Card key={recipe.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground">{recipe.chef.name}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {recipe.region}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⏱ {recipe.cookingTime} min</span>
                        <span>👥 {recipe.servings} servings</span>
                        <span>⭐ {recipe.rating}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
