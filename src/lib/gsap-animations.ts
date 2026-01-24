import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

// GSAP Animation Utilities - Only for Auth route
export const useGSAPAnimation = <T extends HTMLElement = HTMLElement>() => {
  const elementRef = useRef<T>(null);

  const animateEntrance = (options?: {
    duration?: number;
    delay?: number;
    ease?: string;
  }) => {
    if (!elementRef.current) return;
    
    const { duration = 0.8, delay = 0, ease = 'power3.out' } = options || {};
    
    gsap.fromTo(elementRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease
      }
    );
  };

  const animateHover = (hoverScale = 1.05, hoverY = -8) => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: hoverScale,
        y: hoverY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  return { elementRef, animateEntrance, animateHover };
};
