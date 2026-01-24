import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/RecipeCard';
import FilterSection from '@/components/FilterSection';
import { recipes, regions } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const [isVegMode, setIsVegMode] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSpice, setSelectedSpice] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Update search query when URL parameter changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, searchQuery]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Veg/Non-Veg filter
      // When toggle is "veg" (isVegMode = true), show only vegetarian recipes
      // When toggle is "non-veg" (isVegMode = false), show only non-vegetarian recipes
      if (isVegMode && !recipe.isVeg) return false;
      if (!isVegMode && recipe.isVeg) return false;

      // Region filter
      if (selectedRegion !== 'All Regions' && recipe.region !== selectedRegion) return false;

      // Spice filter
      if (selectedSpice !== 'All' && recipe.spiceLevel !== selectedSpice.toLowerCase()) return false;

      // Time filter
      if (selectedTime !== 'All') {
        if (selectedTime === 'Quick (<30 min)' && recipe.cookingTime >= 30) return false;
        if (selectedTime === 'Medium (30-60 min)' && (recipe.cookingTime < 30 || recipe.cookingTime > 60)) return false;
        if (selectedTime === 'Long (>60 min)' && recipe.cookingTime <= 60) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [isVegMode, selectedRegion, selectedSpice, selectedTime, searchQuery]);

  // No animations - using CSS transitions instead

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Explore <span className="text-primary">Indian Recipes</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover {recipes.length} authentic recipes from skilled chefs across India
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Recipes</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection
                      selectedRegion={selectedRegion}
                      onRegionChange={setSelectedRegion}
                      selectedSpice={selectedSpice}
                      onSpiceChange={setSelectedSpice}
                      selectedTime={selectedTime}
                      onTimeChange={setSelectedTime}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="flex gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold">Filters</h3>
                </div>
                <FilterSection
                  selectedRegion={selectedRegion}
                  onRegionChange={setSelectedRegion}
                  selectedSpice={selectedSpice}
                  onSpiceChange={setSelectedSpice}
                  selectedTime={selectedTime}
                  onTimeChange={setSelectedTime}
                />
              </div>
            </aside>

            {/* Recipe Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
                  {isVegMode && <span className="ml-1 text-veg">(Vegetarian only)</span>}
                  {!isVegMode && <span className="ml-1 text-nonveg">(Non-Vegetarian only)</span>}
                </p>
                <div className="flex items-center gap-2">
                  {(selectedRegion !== 'All Regions' || selectedSpice !== 'All' || selectedTime !== 'All') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRegion('All Regions');
                        setSelectedSpice('All');
                        setSelectedTime('All');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Grid */}
              {filteredRecipes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">No recipes found</h3>
                  <p className="mt-1 text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recipes;
