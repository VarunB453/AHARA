import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Clock } from 'lucide-react';
import { animationVariants } from '@/lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'motion' | 'combined';
  hoverEffect?: boolean;
  entranceDelay?: number;
  onClick?: () => void;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(({
  children,
  className = '',
  animationType = 'combined',
  hoverEffect = true,
  entranceDelay = 0,
  onClick
}, ref) => {
  const motionProps = {
    variants: animationVariants.item,
    initial: 'initial',
    animate: 'animate',
    whileHover: hoverEffect ? 'whileHover' : undefined,
    transition: { delay: entranceDelay, duration: 0.5 }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      {...motionProps}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <Card className={`
        h-full transition-all duration-300
        ${hoverEffect ? 'hover:shadow-2xl' : 'shadow-lg'}
        ${animationType === 'combined' ? 'backdrop-blur-sm' : ''}
      `}>
        <CardContent className="relative p-6">
          {children}
          
          {animationType === 'combined' && (
            <>
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full"
                animate={{
                  y: [-5, 5, -5],
                  x: [-3, 3, -3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

export const AnimatedRecipeCard: React.FC<{
  recipe: {
    id: string;
    title: string;
    description: string;
    image: string;
    cookingTime: number;
    spiceLevel: 'mild' | 'medium' | 'hot';
    rating: number;
    isVeg: boolean;
    region: string;
    chef?: { name: string; avatar: string };
  };
  animationType?: 'motion' | 'combined';
  index?: number;
}> = ({ recipe, animationType = 'combined', index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.rating * 10);

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <AnimatedCard
      className="group cursor-pointer"
      animationType={animationType}
      entranceDelay={index * 0.1}
      hoverEffect={true}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <motion.img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.div
          className="absolute top-2 right-2"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Badge variant={recipe.isVeg ? 'default' : 'secondary'}>
            {recipe.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
          </Badge>
        </motion.div>

        <motion.div
          className="absolute bottom-2 left-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${recipe.spiceLevel === 'hot' ? 'bg-red-500 text-white' : 
              recipe.spiceLevel === 'medium' ? 'bg-orange-500 text-white' : 
              'bg-green-500 text-white'}
          `}>
            {'🌶'.repeat(recipe.spiceLevel === 'hot' ? 3 : recipe.spiceLevel === 'medium' ? 2 : 1)}
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <motion.h3
          className="font-bold text-lg line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {recipe.title}
        </motion.h3>

        <motion.p
          className="text-sm text-muted-foreground line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {recipe.description}
        </motion.p>

        <motion.div
          className="flex items-center justify-between text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{recipe.cookingTime}min</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </motion.div>

        {recipe.chef && (
          <motion.div
            className="flex items-center gap-2 pt-2 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={recipe.chef.avatar}
                alt={recipe.chef.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium">{recipe.chef.name}</span>
          </motion.div>
        )}

        <motion.div
          className="pt-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`w-full gap-2 ${isLiked ? 'text-red-500' : ''}`}
          >
            <motion.div
              animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.div>
            <motion.span
              animate={{ 
                scale: likeCount > (recipe.rating * 10) ? [1, 1.1, 1] : 1 
              }}
              transition={{ duration: 0.3 }}
            >
              {likeCount}
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </AnimatedCard>
  );
};

export default AnimatedCard;
