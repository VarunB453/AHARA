import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { User, Camera, Save, ChefHat, Heart, Clock, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface CookingStats {
  favoriteCount: number;
  memberSince: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<CookingStats>({ favoriteCount: 0, memberSince: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileData) {
          setProfile({
            username: profileData.username,
            avatar_url: profileData.avatar_url,
          });
        }

        // Fetch favorite count
        const { count, error: favError } = await supabase
          .from("favorites")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (favError) throw favError;

        // Calculate member since
        const createdAt = new Date(user.created_at);
        const memberSince = createdAt.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        setStats({
          favoriteCount: count || 0,
          memberSince,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Profile - AHARA</title>
        <meta name="description" content="Manage your AHARA profile, update your username and avatar, and view your cooking statistics." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isVegMode={false} onToggleVegMode={() => {}} />

        <main className="flex-1 container py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Your Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and view your cooking journey
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your username and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {profile.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground">
                        <Camera className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="avatar_url">Avatar URL</Label>
                      <Input
                        id="avatar_url"
                        placeholder="https://example.com/avatar.jpg"
                        value={profile.avatar_url || ""}
                        onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a URL to your profile picture
                      </p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Your display name"
                      value={profile.username || ""}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Save Button */}
                  <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-primary" />
                      Cooking Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.favoriteCount}</p>
                        <p className="text-xs text-muted-foreground">Favorite Recipes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="p-2 rounded-full bg-secondary">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{stats.memberSince}</p>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10">
                      <div className="p-2 rounded-full bg-amber-500/20">
                        <Award className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {stats.favoriteCount >= 10 ? "Recipe Master" : stats.favoriteCount >= 5 ? "Food Explorer" : "Beginner Chef"}
                        </p>
                        <p className="text-xs text-muted-foreground">Achievement Level</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
