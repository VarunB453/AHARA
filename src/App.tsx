import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DarkModeProvider } from "@/hooks/useDarkMode";
import { LanguageProvider } from "@/hooks/useLanguage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Chefs = lazy(() => import("./pages/Chefs"));
const Regions = lazy(() => import("./pages/Regions"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const Settings = lazy(() => import("./pages/Settings"));
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
                  <Route path="/auth" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
                  <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
                  <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
                  <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Settings /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/crazy-recipes" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><CrazyRecipes /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/crazy-recipes/:id" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><CrazyRecipeDetail /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/recipes" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Recipes /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/recipes/:id" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><RecipeDetail /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/chefs" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Chefs /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/regions" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Regions /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Profile /></Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}><Favorites /></Suspense>
                    </ProtectedRoute>
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
