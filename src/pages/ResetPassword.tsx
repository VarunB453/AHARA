import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, ChefHat, ArrowLeft, Shield, Key, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
    };

    checkSession();
  }, []);

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 8) return 'medium';
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      toast({
        title: 'Error',
        description: updateError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password updated successfully!',
        description: 'You can now sign in with your new password.',
      });
      navigate('/auth');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl animate-pulse delay-500" />
      </div>

      <Helmet>
        <title>Reset Password - AHARA</title>
        <meta name="description" content="Set a new password for your AHARA account." />
      </Helmet>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Reset Password Card */}
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <div className="relative">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Key className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse" />
                <Shield className="absolute -top-2 -right-2 h-3 w-3 text-white animate-spin" />
              </div>
            </div>
            <CardTitle className="font-display text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Set a new password
            </CardTitle>
            <CardDescription className="text-base">
              {hasSession
                ? 'Choose a strong password for your account.'
                : 'This reset link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            {hasSession ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <Badge 
                        variant={passwordStrength === 'weak' ? 'destructive' : passwordStrength === 'medium' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {passwordStrength?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <div className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      )} />
                      <div className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwordStrength === 'medium' || passwordStrength === 'strong' ? 
                          (passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-300'
                      )} />
                      <div className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={cn("pl-10 pr-10 transition-all duration-200 focus:scale-[1.02]", error && "border-destructive focus:ring-destructive")}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      className={cn("pl-10 pr-10 transition-all duration-200 focus:scale-[1.02]", error && "border-destructive focus:ring-destructive")}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-3">
                      <Shield className="h-3 w-3 mr-1" />
                      Security Tips
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Use at least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Include uppercase letters and numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span>Avoid common passwords</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group" 
                  size="lg" 
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This reset link is invalid or has expired. Please request a new password reset link.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={() => navigate('/forgot-password')} 
                  className="w-full" 
                  size="lg"
                >
                  Request a new reset link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-300" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-700" />
            <span>Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
