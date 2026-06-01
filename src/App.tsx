import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DarkModeProvider } from "@/hooks/useDarkMode";
import { LanguageProvider } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Chefs = lazy(() => import("./pages/Chefs"));
const Regions = lazy(() => import("./pages/Regions"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const CrazyRecipes = lazy(() => import("./pages/CrazyRecipes"));
const CrazyRecipeDetail = lazy(() => import("./pages/CrazyRecipeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <DarkModeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Suspense fallback={<PageLoader />}><Index /></Suspense>} />
                  <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                  <Route path="/crazy-recipes" element={<Suspense fallback={<PageLoader />}><CrazyRecipes /></Suspense>} />
                  <Route path="/crazy-recipes/:id" element={<Suspense fallback={<PageLoader />}><CrazyRecipeDetail /></Suspense>} />
                  <Route path="/recipes" element={
                
                      <Suspense fallback={<PageLoader />}><Recipes /></Suspense>
                    
                  } />
                  <Route path="/recipes/:id" element={
                    <Suspense fallback={<PageLoader />}><RecipeDetail /></Suspense>
                  } />
                  <Route path="/chefs" element={
                   
                      <Suspense fallback={<PageLoader />}><Chefs /></Suspense>
                   
                  } />
                  <Route path="/regions" element={
                   
                      <Suspense fallback={<PageLoader />}><Regions /></Suspense>
                    
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </DarkModeProvider>
    </HelmetProvider>
  );
};

export default App;
