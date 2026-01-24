import { ChefHat, Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin, Heart, Star, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AHARA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover authentic Indian recipes from master chefs across all regions. 
              Your journey through Indian cuisine starts here.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Made with Love
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                4.8 Rating
              </Badge>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-display font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/recipes" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  All Recipes
                </Link>
              </li>
              <li>
                <Link to="/recipes?filter=vegetarian" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-veg" />
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link to="/recipes?filter=non-vegetarian" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-nonveg" />
                  Non-Vegetarian
                </Link>
              </li>
              <li>
                <Link to="/regions" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Regional Cuisine
                </Link>
              </li>
              <li>
                <Link to="/recipes?filter=quick" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Quick Recipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Chefs */}
          <div>
            <h4 className="mb-4 font-display font-semibold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Chefs
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/chefs" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Featured Chefs
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Become a Chef
                </Link>
              </li>
              <li>
                <Link to="/chef-guidelines" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Chef Guidelines
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-display font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              © {currentYear} AHARA. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-red-500" />
              <span>Made with ❤️ for Indian food lovers</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              1K+ Recipes
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              50+ Chefs
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              4.8 Rating
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
