import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Heart, ChefHat, LogOut, Sparkles, Home, BookOpen, Users, Map, HelpCircle, Mail, Bell, Settings, Globe, Moon, Sun, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
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
  const [notifications, setNotifications] = useState(1);
  const [notificationMessage, setNotificationMessage] = useState('Happy new year');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Determine the best page to navigate to based on current page
      const currentPath = location.pathname;
      
      // If already on recipes page, just update the search
      if (currentPath === '/recipes') {
        navigate(`/recipes?search=${encodeURIComponent(query.trim())}`);
      } 
      // If on chefs page, search chefs
      else if (currentPath === '/chefs') {
        navigate(`/chefs?search=${encodeURIComponent(query.trim())}`);
      }
      // Default to recipes page for general search
      else {
        navigate(`/recipes?search=${encodeURIComponent(query.trim())}`);
      }
      
      setIsSearchOpen(false);
    }
  };

  // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Small delay to ensure the input is rendered and visible
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

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: Home, protected: false },
    { href: '/recipes', label: t('nav.recipes'), icon: BookOpen, protected: true },
    { href: '/chefs', label: t('nav.chefs'), icon: Users, protected: true },
    { href: '/regions', label: t('nav.regions'), icon: Map, protected: true },
    { href: '/crazy-recipes', label: t('nav.crazy'), icon: Sparkles, protected: true },
    { href: '/contact', label: t('nav.contact'), icon: Mail, protected: false },
  ];

  const handleNavigation = (href: string, isProtected: boolean) => {
    if (isProtected && !user) {
      navigate('/auth');
    } else {
      navigate(href);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="hidden font-display text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent sm:inline-block">
            AHARA
          </span>
        </Link>

        {/* Center Section - Veg/Non-Veg Toggle */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wide transition-colors",
            !isVegMode ? "text-nonveg" : "text-muted-foreground"
          )}>
            Non-Veg
          </span>
          <Switch
            checked={isVegMode}
            onCheckedChange={onToggleVegMode}
            className="data-[state=checked]:bg-veg data-[state=unchecked]:bg-nonveg"
          />
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wide transition-colors",
            isVegMode ? "text-veg" : "text-muted-foreground"
          )}>
            Veg
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigation(link.href, link.protected || false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary/50",
                isActive(link.href) ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => toggleDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Search Button - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <div className="flex items-center justify-between p-4">
                  <h4 className="font-medium">Notifications</h4>
                  {notifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setNotifications(0)}>
                      Clear all
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {/* Happy New Year Notification Card */}
                    <div className="p-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white shadow-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-white/20 rounded-full p-2">
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">Happy New Year 2026</h4>
                            {/* <p className="text-white/90 text-sm">
                              Wishing you a year filled with delicious recipes, culinary adventures, and memorable meals!
                            </p> */}
                            <div className="mt-3 flex items-center gap-1 text-xs text-white/80">
                              <span>Jan 1, 2026</span>
                              <span>•</span>
                              <span>New Year Celebration</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Profile Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden sm:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.user_metadata?.username || user.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t('nav.favorites')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  {t('nav.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" className="hidden gap-2 sm:flex" asChild>
              <Link to="/auth">
                <User className="h-4 w-4" />
                {t('nav.signIn')}
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                {/* Mobile Header */}
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold">AHARA</span>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="Search recipes... (⌘K)"
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        handleNavigation(link.href, link.protected || false);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                        isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </button>
                  ))}
                  
                  {/* Settings Item - After Contact */}
                  {user && (
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t('nav.settings')}</span>
                    </button>
                  )}
                  
                  {/* Favorites Item - After Contact */}
                  {user && (
                    <button
                      onClick={() => {
                        navigate('/favorites');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{t('nav.favorites')}</span>
                    </button>
                  )}
                </nav>

                {/* Mobile Auth */}
                <div className="flex flex-col gap-2">
                  {user ? (
                    <>
                      {/* Profile and Email Box - Clickable */}
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{user.user_metadata?.username || user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </button>
                      
                      <Button variant="outline" className="w-full gap-2" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button variant="default" className="w-full gap-2" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      <div className={cn(
        "overflow-hidden border-t border-border/50 bg-card transition-all duration-300",
        isSearchOpen ? "max-h-20" : "max-h-0"
      )}>
        <div className="container py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, chefs, or ingredients... (⌘K)"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;