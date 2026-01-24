import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerSide = "top" | "bottom" | "left" | "right";

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: DrawerSide;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within an AnimatedDrawer");
  }
  return context;
};

interface AnimatedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  children: React.ReactNode;
}

const slideVariants = {
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
};

const sizeClasses: Record<DrawerSide, string> = {
  top: "inset-x-0 top-0 h-auto max-h-[85vh]",
  bottom: "inset-x-0 bottom-0 h-auto max-h-[85vh]",
  left: "inset-y-0 left-0 w-[85vw] max-w-md",
  right: "inset-y-0 right-0 w-[85vw] max-w-md",
};

const AnimatedDrawer = ({ 
  open, 
  onOpenChange, 
  side = "right", 
  children 
}: AnimatedDrawerProps) => {
  // Close on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <DrawerContext.Provider value={{ open, onOpenChange, side }}>
      {children}
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = useDrawer();
  
  return (
    <button
      ref={ref}
      onClick={(e) => {
        onOpenChange(true);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = useDrawer();
  
  return (
    <button
      ref={ref}
      onClick={(e) => {
        onOpenChange(false);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
DrawerClose.displayName = "DrawerClose";

interface DrawerPortalProps {
  children: React.ReactNode;
}

const DrawerPortal = ({ children }: DrawerPortalProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

interface DrawerOverlayProps {
  className?: string;
}

const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps
>(({ className, ...props }, ref) => {
  const { onOpenChange } = useDrawer();
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

const DrawerContent = ({ className, children }: DrawerContentProps) => {
  const { open, onOpenChange, side } = useDrawer();
  const variants = slideVariants[side];

  return (
    <DrawerPortal>
      <AnimatePresence>
        {open && (
          <>
            <DrawerOverlay />
            <motion.div
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300 
              }}
              className={cn(
                "fixed z-50 flex flex-col bg-background shadow-elevated border-border",
                side === "top" && "rounded-b-xl border-b",
                side === "bottom" && "rounded-t-xl border-t",
                side === "left" && "rounded-r-xl border-r",
                side === "right" && "rounded-l-xl border-l",
                sizeClasses[side],
                className
              )}
              >
                {/* Close button */}
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DrawerPortal>
    );
};
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-6 pb-0 text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-6 pt-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-xl font-display font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  AnimatedDrawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
