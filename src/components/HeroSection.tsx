import { ArrowRight, Flame, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-food.jpg';

interface HeroSectionProps {
  isVegMode: boolean;
}

const HeroSection = ({ isVegMode }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Delicious Indian cuisine spread"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 backdrop-blur-sm animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            {isVegMode ? (
              <Leaf className="h-4 w-4 text-veg" />
            ) : (
              <Flame className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-primary-foreground">
              {isVegMode ? 'Pure Vegetarian Recipes' : 'Authentic Indian Flavors'}
            </span>
          </div>

          {/* Heading */}
          <h1 
            className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Discover the Soul of{' '}
            <span className="text-primary">Indian Cooking</span>
          </h1>

          {/* Description */}
          <p 
            className="text-lg text-primary-foreground/80 md:text-xl animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            Explore authentic recipes from master chefs across India. From aromatic biryanis 
            to creamy curries, find your next favorite dish.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button 
              size="lg" 
              className="gap-2 shadow-elevated"
              onClick={() => navigate('/recipes')}
            >
              Explore Recipes
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => navigate('/chefs')}
            >
              Meet Our Chefs
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap gap-8 pt-4 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div>
              <p className="font-display text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/60">Recipes</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-primary-foreground">50+</p>
              <p className="text-sm text-primary-foreground/60">Expert Chefs</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-primary-foreground">28</p>
              <p className="text-sm text-primary-foreground/60">Indian States</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
