// Framer Motion Animation Variants
export const animationVariants = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: 'easeInOut' }
  },

  cardHover: {
    whileHover: { 
      scale: 1.05, 
      y: -8,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    tap: { scale: 0.95 }
  },

  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  item: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOutExpo' }
  },

  modal: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  },

  button: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },

  floating: {
    animate: { 
      y: [-10, 10, -10],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
};
