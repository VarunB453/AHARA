import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Utensils, Star, Quote, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RecipeCard from '@/components/RecipeCard';
import ChefCard from '@/components/ChefCard';
import FilterSection from '@/components/FilterSection';
import Footer from '@/components/Footer';
import { recipes, chefs } from '@/data/recipes';

const Index = () => {
  const navigate = useNavigate();
  const [isVegMode, setIsVegMode] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSpice, setSelectedSpice] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      // Veg/Non-Veg filter
      if (isVegMode && !recipe.isVeg) return false;
      if (!isVegMode && recipe.isVeg) return false;

      // Region filter
      if (selectedRegion !== 'All Regions' && recipe.region !== selectedRegion) return false;

      // Spice level filter
      if (selectedSpice && recipe.spiceLevel !== selectedSpice) return false;

      // Cooking time filter
      if (selectedTime) {
        if (selectedTime === 'quick' && recipe.cookingTime >= 30) return false;
        if (selectedTime === 'medium' && (recipe.cookingTime < 30 || recipe.cookingTime > 60)) return false;
        if (selectedTime === 'slow' && recipe.cookingTime <= 60) return false;
      }

      return true;
    });

    return filtered.sort(() => Math.random() - 0.5);
  }, [isVegMode, selectedRegion, selectedSpice, selectedTime]);

  // No animations - using CSS transitions instead

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={isVegMode} onToggleVegMode={setIsVegMode} />
      
      <main>
        <HeroSection isVegMode={isVegMode} />

        {/* Recipes Section */}
        <section id="recipes" className="py-16">
          <div className="container">
            {/* Section Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {isVegMode ? (
                    <Leaf className="h-5 w-5 text-veg" />
                  ) : (
                    <Utensils className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {isVegMode ? 'Vegetarian Selection' : 'Non-Vegetarian Selection'}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {isVegMode ? 'Pure Vegetarian Delights' : 'Non-Vegetarian Specialties'}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>

            <div className="grid gap-8 ">
              {/* <aside className="lg:sticky lg:top-24 lg:h-fit">
                <FilterSection
                  selectedRegion={selectedRegion}
                  selectedSpice={selectedSpice}
                  selectedTime={selectedTime}
                  onRegionChange={setSelectedRegion}
                  onSpiceChange={setSelectedSpice}
                  onTimeChange={setSelectedTime}
                />
              </aside> */}

              {/* Recipe Grid */}
              <div>
                {filteredRecipes.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredRecipes.slice(0, 3).map((recipe, index) => (
                      <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                    <Utensils className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      No recipes found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters to find more recipes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                Success Stories
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Community Achievements
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Hear from our community members who have transformed their culinary journey with Spice Route Navigator
              </p>
            </div>

            {/* Success Stories Grid with Infinite Scroll */}
            <div className="relative overflow-hidden py-8">
              <div className="flex animate-scroll-right-to-left gap-8">
                {/* Combined set of cards for infinite scroll */}
                <div className="flex gap-8">
                  {/* Story 1 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                        <p className="text-sm text-muted-foreground">Home Chef</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "Spice Route Navigator helped me master authentic regional recipes. My family loves the new flavors I bring to our dinner table!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>50+ Recipes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 2 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Raj Patel</h4>
                        <p className="text-sm text-muted-foreground">Food Blogger</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "The detailed recipes and chef insights have elevated my content. My followers love the authentic techniques I've learned!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>100K+ Followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 3 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Leaf className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Anita Desai</h4>
                        <p className="text-sm text-muted-foreground">Culinary Student</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "Learning from master chefs through this platform has been incredible. It's like having a mentor in my kitchen every day!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Top Student</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 4 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Vikram Singh</h4>
                        <p className="text-sm text-muted-foreground">Restaurant Owner</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "The chef connections I made through this platform helped me refine my menu. Our restaurant's popularity has soared!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>3 Restaurants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.7 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 5 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Meera Reddy</h4>
                        <p className="text-sm text-muted-foreground">Recipe Developer</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "I've developed over 200 fusion recipes inspired by the regional techniques. The community feedback has been invaluable!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>200+ Recipes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 6 */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Leaf className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Kavita Menon</h4>
                        <p className="text-sm text-muted-foreground">Cooking Instructor</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "My cooking classes are always full now! The platform's structured approach to teaching Indian cuisine is unmatched."
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>500+ Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate set for seamless infinite scroll */}
                  {/* Story 1 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                        <p className="text-sm text-muted-foreground">Home Chef</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "Spice Route Navigator helped me master authentic regional recipes. My family loves the new flavors I bring to our dinner table!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>50+ Recipes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 2 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Raj Patel</h4>
                        <p className="text-sm text-muted-foreground">Food Blogger</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "The detailed recipes and chef insights have elevated my content. My followers love the authentic techniques I've learned!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>100K+ Followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 3 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Leaf className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Anita Desai</h4>
                        <p className="text-sm text-muted-foreground">Culinary Student</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "Learning from master chefs through this platform has been incredible. It's like having a mentor in my kitchen every day!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Top Student</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 4 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Vikram Singh</h4>
                        <p className="text-sm text-muted-foreground">Restaurant Owner</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "The chef connections I made through this platform helped me refine my menu. Our restaurant's popularity has soared!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>3 Restaurants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.7 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 5 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Meera Reddy</h4>
                        <p className="text-sm text-muted-foreground">Recipe Developer</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "I've developed over 200 fusion recipes inspired by the regional techniques. The community feedback has been invaluable!"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>200+ Recipes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-5 fill-yellow-400 text-yellow-400" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Story 6 Duplicate */}
                  <div className="flex-shrink-0 w-[320px] rounded-xl border border-border bg-card p-6 shadow-soft">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Leaf className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Kavita Menon</h4>
                        <p className="text-sm text-muted-foreground">Cooking Instructor</p>
                      </div>
                    </div>
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <p className="mb-4 text-muted-foreground italic">
                      "My cooking classes are always full now! The platform's structured approach to teaching Indian cuisine is unmatched."
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>500+ Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="rounded-xl border border-border bg-card p-8 shadow-soft">
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Join Our Success Story Community
                </h3>
                <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                  Start your culinary journey today and become part of our growing community of passionate food lovers
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button
                    onClick={() => navigate('/recipes')}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90"
                  >
                    <Utensils className="h-5 w-5" />
                    Explore Recipes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chefs Section */}
        <section id="chefs" className="bg-secondary/30 py-16">
          <div className="container">
            {/* Section Header */}
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                Meet The Experts
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Featured Chefs
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Learn from India's finest culinary masters, each bringing decades of experience 
                and regional expertise to your kitchen
              </p>
            </div>

            {/* Chef Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chefs.slice(0, 3).map((chef, index) => (
                <ChefCard key={chef.id} chef={chef} index={index} />
              ))}
            </div>
            
            {/* Meet Chefs Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/chefs')}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-foreground font-medium transition-colors hover:bg-secondary"
              >
                <Users className="h-5 w-5" />
                Meet All Chefs
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center md:px-12 md:py-16">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -left-4 -top-4 h-40 w-40 rounded-full bg-primary-foreground" />
                <div className="absolute -bottom-8 -right-8 h-60 w-60 rounded-full bg-primary-foreground" />
              </div>

              <div className="relative z-10">
                <h2 className="mb-4 font-display text-2xl font-bold text-primary-foreground md:text-3xl">
                  Ready to Start Your Culinary Journey?
                </h2>
                <p className="mx-auto mb-6 max-w-xl text-primary-foreground/80">
                  Join thousands of food enthusiasts who have discovered their favorite Indian 
                  recipes through Chef Recipe Hunter
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => navigate('/auth')}
                    className="rounded-lg bg-primary-foreground px-6 py-3 font-medium text-primary transition-opacity hover:opacity-90"
                  >
                    Create Free Account
                  </button>
                  <button onClick={() => navigate('/auth')} className="rounded-lg border border-primary-foreground/30 bg-transparent px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                    Browse as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;