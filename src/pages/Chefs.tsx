import { useState, useEffect, useMemo } from 'react';
import { Search, Award, Users, MapPin, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { chefs, recipes, regions } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Chefs = () => {
  const [isVegMode, setIsVegMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', ...new Set(chefs.map(chef => chef.specialty))];

  const filteredChefs = useMemo(() => {
    return chefs.filter((chef) => {
      if (selectedSpecialty !== 'All' && chef.specialty !== selectedSpecialty) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          chef.name.toLowerCase().includes(query) ||
          chef.specialty.toLowerCase().includes(query) ||
          chef.region.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedSpecialty, searchQuery]);

  // No animations - using CSS transitions instead

  // Get recipe count for each chef
  const getChefRecipes = (chefId: string) => {
    return recipes.filter(r => r.chef.id === chefId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/30 via-background to-primary/10 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Meet Our <span className="text-primary">Expert Chefs</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover culinary masters from across India sharing their authentic family recipes
            </p>

            {/* Search and Filter */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search chefs by name, specialty, or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="h-12 w-full sm:w-48">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Chefs Grid */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredChefs.length}</span> chefs
            </p>
          </div>

          {filteredChefs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChefs.map((chef) => {
                const chefRecipes = getChefRecipes(chef.id);
                return (
                  <article
                    key={chef.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-warm"
                  >
                    {/* Header with Avatar */}
                    <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-6 text-center">
                      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-lg">
                        <img
                          src={chef.avatar}
                          alt={chef.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {chef.isVerified && (
                        <div className="absolute right-4 top-4">
                          <Badge className="gap-1 bg-primary/90">
                            <Award className="h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {chef.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {chef.region}
                      </div>

                      <Badge variant="secondary" className="mt-3">
                        {chef.specialty}
                      </Badge>

                      <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                        {chef.bio}
                      </p>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-foreground">
                            {chef.recipesCount}
                          </p>
                          <p className="text-xs text-muted-foreground">Recipes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-foreground">
                            {(chef.followers / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-primary">
                            {chef.rating}
                          </p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>

                      {/* Sample Recipes */}
                      {chefRecipes.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Popular Recipes
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {chefRecipes.slice(0, 3).map((recipe) => (
                              <Badge key={recipe.id} variant="outline" className="text-xs">
                                {recipe.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <Button className="mt-6 w-full gap-2" variant="outline">
                        <Users className="h-4 w-4" />
                        View Profile
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <ChefHat className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">No chefs found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chefs;
