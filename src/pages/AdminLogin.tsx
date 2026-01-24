import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVegMode, setIsVegMode] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

  // No animations - using CSS transitions instead

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!adminLoading && user && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [user, isAdmin, adminLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Transform ID to a valid email format for Supabase
    const transformIdToEmail = (id: string) => {
      // Replace @ with _at_ to ensure valid email structure
      const safeId = id.replace(/@/g, '_at_');
      return `${safeId}@spiceroute.admin`;
    };

    const authEmail = transformIdToEmail(adminId);

    try {
      if (isLogin) {
        // First, check if the admin ID exists (by checking the associated email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (error) {
          throw error;
        }

        // Check if the user is actually an admin
        const { data: adminProfile, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', data.user.id)
          .single();

        if (adminError || !adminProfile?.is_admin) {
          // Not an admin, sign out immediately
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "This account does not have administrator privileges.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Admin Access Granted",
            description: "Welcome back, Administrator.",
          });
          navigate('/admin-dashboard');
        }
      } else {
        // Register new admin account
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              username: adminId, // Store original ID as username
            },
          },
        });

        if (error) throw error;

        // The trigger will automatically make this user an admin if the email matches
        
        if (data.user) {
          // If session is null, it means email confirmation is required (but our trigger should fix this)
          if (!data.session) {
             toast({
              title: "Account Created",
              description: "Please sign in now. (Auto-confirmation applied)",
            });
          } else {
            toast({
              title: "Account Created & Logged In",
              description: "Welcome to the Admin Dashboard.",
            });
            navigate('/admin-dashboard'); // Auto-redirect if session exists
            return;
          }
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error(error);
      
      let errorMessage = error.message || "Invalid credentials or system error.";
      
      if (errorMessage.includes("Email not confirmed")) {
        errorMessage = "Account created but not confirmed. Please retry login in a moment.";
      }

      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Navbar isVegMode={isVegMode} onToggleVegMode={() => setIsVegMode(!isVegMode)} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-md border-border/50 shadow-xl backdrop-blur-sm bg-card/90 transition-all duration-300 hover:shadow-2xl hover:scale-105">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? 'Admin Access' : 'Initialize Admin'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your administrator credentials to continue' 
                : 'Set up your administrative account'}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="Enter Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full gap-2 group" 
                disabled={loading}
              >
                {loading ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Enter Dashboard' : 'Create Admin Account'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center w-full">
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-muted-foreground hover:text-primary"
                >
                  {isLogin 
                    ? "First time? Initialize Admin Account" 
                    : "Already have an account? Login"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
