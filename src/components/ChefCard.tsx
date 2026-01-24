import { MapPin, Star, Users, BookOpen, BadgeCheck } from 'lucide-react';
import { Chef } from '@/data/recipes';
import { Button } from '@/components/ui/button';

interface ChefCardProps {
  chef: Chef;
  index?: number;
}

const ChefCard = ({ chef, index = 0 }: ChefCardProps) => {

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <article 
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
    >
      {/* Avatar */}
      <div className="relative mx-auto mb-4 h-24 w-24">
        <img
          src={chef.avatar}
          alt={chef.name}
          className="h-full w-full rounded-full object-cover ring-4 ring-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        />
        {chef.isVerified && (
          <div className="absolute -right-1 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-lg">
            <BadgeCheck className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Name & Location */}
      <div className="mb-3 text-center">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {chef.name}
        </h3>
        <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{chef.region}</span>
        </div>
      </div>

      {/* Specialty Badge */}
      <div className="mb-4 flex justify-center">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {chef.specialty}
        </span>
      </div>

      {/* Bio */}
      <p className="mb-4 line-clamp-2 text-center text-sm text-muted-foreground">
        {chef.bio}
      </p>

      {/* Stats */}
      <div className="mb-4 flex items-center justify-center gap-6 text-center">
        <div>
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 fill-spice-mild text-spice-mild" />
            <span className="font-semibold text-foreground">{chef.rating}</span>
          </div>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="flex items-center justify-center gap-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{chef.recipesCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Recipes</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="flex items-center justify-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{formatFollowers(chef.followers)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
      </div>

      {/* Action Button */}
      <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105 active:scale-95" size="sm">
        View Profile
      </Button>
    </article>
  );
};

export default ChefCard;
