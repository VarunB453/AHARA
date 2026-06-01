import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChefHat, Mail, Map, Menu, Moon, Search, Sparkles, Sun, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useLanguage } from '@/hooks/useLanguage';

interface NavbarProps {
  isVegMode: boolean;
  onToggleVegMode: (isVeg: boolean) => void;
}

const Navbar = ({ isVegMode, onToggleVegMode }: NavbarProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/recipes', label: t('nav.recipes'), icon: BookOpen },
    { href: '/chefs', label: t('nav.chefs'), icon: Users },
    { href: '/regions', label: t('nav.regions'), icon: Map },
    { href: '/crazy-recipes', label: t('nav.crazy'), icon: Sparkles },
    { href: '/contact', label: t('nav.contact'), icon: Mail },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    const currentPath = location.pathname;
    if (currentPath === '/chefs') {
      navigate(`/chefs?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(`/recipes?search=${encodeURIComponent(query.trim())}`);
    }
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-display text-xl font-bold text-transparent sm:inline-block">
            AHARA
          </span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
          <span className={cn("text-xs font-semibold uppercase tracking-wide transition-colors", !isVegMode ? "text-nonveg" : "text-muted-foreground")}>
            Non-Veg
          </span>
          <Switch checked={isVegMode} onCheckedChange={onToggleVegMode} className="data-[state=checked]:bg-veg data-[state=unchecked]:bg-nonveg" />
          <span className={cn("text-xs font-semibold uppercase tracking-wide transition-colors", isVegMode ? "text-veg" : "text-muted-foreground")}>
            Veg
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-secondary/50",
                isActive(link.href) ? "border-b-2 border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => toggleDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold">AHARA</span>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </form>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        navigate(link.href);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                        isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className={cn("overflow-hidden border-t border-border/50 bg-card transition-all duration-300", isSearchOpen ? "max-h-20" : "max-h-0")}>
        <div className="container py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, chefs, or ingredients..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
