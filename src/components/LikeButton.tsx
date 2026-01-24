import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

interface LikeButtonProps {
  recipeId: string;
  variant?: 'icon' | 'default';
  className?: string;
}

const LikeButton = ({ recipeId, variant = 'icon', className }: LikeButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(recipeId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(recipeId);
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden transition-all",
          liked && "bg-destructive/10 border-destructive/30 hover:bg-destructive/20",
          className
        )}
      >
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors",
              liked ? "fill-destructive text-destructive" : "text-muted-foreground"
            )} 
          />
        </motion.div>
        {liked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
          </motion.div>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={liked ? "destructive" : "outline"}
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Heart 
          className={cn(
            "h-4 w-4",
            liked && "fill-current"
          )} 
        />
      </motion.div>
      {liked ? "Saved" : "Save Recipe"}
    </Button>
  );
};

export default LikeButton;
