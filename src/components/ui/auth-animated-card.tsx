import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useGSAPAnimation } from '@/lib/gsap-animations';
import { animationVariants } from '@/lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'gsap' | 'motion' | 'combined';
  hoverEffect?: boolean;
  entranceDelay?: number;
  onClick?: () => void;
}

const AuthAnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(({
  children,
  className = '',
  animationType = 'combined',
  hoverEffect = true,
  entranceDelay = 0,
  onClick
}, ref) => {
  const { elementRef, animateEntrance, animateHover } = useGSAPAnimation<HTMLDivElement>();
  const internalRef = useRef<HTMLDivElement>(null);
  
  // Function to merge refs
  const setRefs = (element: HTMLDivElement | null) => {
    internalRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
    // Also update the elementRef for GSAP animations
    if (elementRef) {
      (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (animationType === 'gsap' || animationType === 'combined') {
      animateEntrance({ delay: entranceDelay });
    }
    
    if (hoverEffect && (animationType === 'gsap' || animationType === 'combined')) {
      return animateHover();
    }
    
    setIsLoaded(true);
  }, [animationType, entranceDelay, hoverEffect]);

  const motionProps = animationType === 'motion' || animationType === 'combined' ? {
    variants: animationVariants.item,
    initial: 'initial',
    animate: isLoaded ? 'animate' : 'initial',
    whileHover: hoverEffect ? 'whileHover' : undefined
  } : {};

  return (
    <motion.div
      ref={setRefs}
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
          
          {animationType === 'combined' && isLoaded && (
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

AuthAnimatedCard.displayName = 'AuthAnimatedCard';

export default AuthAnimatedCard;
