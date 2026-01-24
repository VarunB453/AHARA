import { useState, useMemo } from 'react';
import { MapPin, Utensils, Flame, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/RecipeCard';
import { recipes, regions } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Region descriptions and images
const regionData: Record<string, { description: string; image: string; flavors: string[] }> = {
  Punjab: {
    description: 'Known for rich, creamy curries, tandoori dishes, and hearty Punjabi hospitality. The land of butter chicken, lassi, and vibrant flavors.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=400&fit=crop',
    flavors: ['Creamy', 'Buttery', 'Tandoori', 'Robust'],
  },
  Hyderabad: {
    description: 'Famous for aromatic biryanis and royal Nizami cuisine. A perfect blend of Mughlai and Telugu culinary traditions.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
    flavors: ['Aromatic', 'Spicy', 'Royal', 'Layered'],
  },
  Karnataka: {
    description: 'Home to crispy dosas, filter coffee, and unique Udupi cuisine. South Indian flavors with coconut and curry leaves.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&h=400&fit=crop',
    flavors: ['Coconut', 'Tangy', 'Mild', 'Fermented'],
  },
  'Tamil Nadu': {
    description: 'The heart of South Indian cuisine with fiery Chettinad dishes, temple town recipes, and filter coffee culture.',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&h=400&fit=crop',
    flavors: ['Spicy', 'Tamarind', 'Pepper', 'Traditional'],
  },
  Goa: {
    description: 'Portuguese-influenced coastal cuisine featuring seafood, vindaloo, and tropical flavors with kokum and coconut.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=400&fit=crop',
    flavors: ['Coastal', 'Tangy', 'Coconut', 'Seafood'],
  },
  Delhi: {
    description: 'Street food capital with legendary chaat, kebabs, and Mughlai influences. A melting pot of North Indian flavors.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&h=400&fit=crop',
    flavors: ['Street Food', 'Spicy', 'Chaat', 'Mughlai'],
  },
  Gujarat: {
    description: 'Vegetarian paradise known for thali culture, sweet-savory balance, and innovative snacks like dhokla and fafda.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=400&fit=crop',
    flavors: ['Sweet', 'Savory', 'Light', 'Vegetarian'],
  },
  Kerala: {
    description: 'God\'s own country with coconut-rich curries, fresh seafood, and unique dishes like appam and stew.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
    flavors: ['Coconut', 'Seafood', 'Spiced', 'Fresh'],
  },
  Rajasthan: {
    description: 'Desert cuisine with unique preparations like dal baati churma, gatte ki sabzi, and rich royal recipes.',
    image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800&h=400&fit=crop',
    flavors: ['Rustic', 'Ghee-rich', 'Preserved', 'Royal'],
  },
};

const Regions = () => {
  const [isVegMode, setIsVegMode] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Get recipes for a region
  const getRegionRecipes = (region: string) => {
    return recipes.filter((r) => {
      if (isVegMode && !r.isVeg) return false;
      return r.region === region;
    });
  };

  // Get recipe counts per region
  const regionStats = useMemo(() => {
    const stats: Record<string, { total: number; veg: number; nonVeg: number }> = {};
    regions.filter(r => r !== 'All Regions').forEach((region) => {
      const regionRecipes = recipes.filter((r) => r.region === region);
      stats[region] = {
        total: regionRecipes.length,
        veg: regionRecipes.filter((r) => r.isVeg).length,
        nonVeg: regionRecipes.filter((r) => !r.isVeg).length,
      };
    });
    return stats;
  }, []);

  const activeRegions = regions.filter(r => r !== 'All Regions' && regionStats[r]?.total > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/30 via-background to-primary/10 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Explore by <span className="text-primary">Region</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover the diverse culinary traditions of India, from the royal kitchens of Hyderabad to the coastal flavors of Kerala
            </p>
          </div>
        </div>
      </section>

      {/* Region Cards */}
      <section className="py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeRegions.map((region) => {
              const data = regionData[region];
              const stats = regionStats[region];
              const regionRecipes = getRegionRecipes(region);
              const isExpanded = selectedRegion === region;

              return (
                <article
                  key={region}
                  className={cn(
                    "group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300",
                    isExpanded ? "md:col-span-2 lg:col-span-3" : "hover:shadow-warm"
                  )}
                >
                  {/* Header Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={data?.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop'}
                      alt={region}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-white" />
                        <h3 className="font-display text-2xl font-bold text-white">
                          {region}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {data?.description || 'Explore authentic recipes from this region.'}
                    </p>

                    {/* Flavor Tags */}
                    {data?.flavors && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {data.flavors.map((flavor) => (
                          <Badge key={flavor} variant="secondary" className="text-xs">
                            {flavor}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="h-4 w-4 text-primary" />
                        <span className="font-medium">{stats?.total || 0}</span>
                        <span className="text-muted-foreground">Recipes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-veg" />
                        <span className="text-muted-foreground">{stats?.veg || 0} Veg</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-nonveg" />
                        <span className="text-muted-foreground">{stats?.nonVeg || 0} Non-Veg</span>
                      </div>
                    </div>

                    {/* Expand/Collapse */}
                    <Button
                      variant="outline"
                      className="mt-4 w-full gap-2"
                      onClick={() => setSelectedRegion(isExpanded ? null : region)}
                    >
                      {isExpanded ? 'Show Less' : 'View Recipes'}
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </Button>

                    {/* Expanded Recipe Grid */}
                    {isExpanded && (
                      <div className="mt-6 border-t border-border pt-6">
                        <h4 className="mb-4 font-display text-lg font-semibold">
                          {region} Recipes {isVegMode && '(Vegetarian)'}
                        </h4>
                        {regionRecipes.length > 0 ? (
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {regionRecipes.map((recipe) => (
                              <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground">
                            No {isVegMode ? 'vegetarian ' : ''}recipes found for this region.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Regions;
