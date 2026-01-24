import { HelpCircle, Book, MessageCircle, Search, ChefHat, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Help = () => {
  const helpCategories = [
    {
      icon: <Book className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn how to navigate AHARA and discover amazing recipes",
      articles: [
        "Creating your account",
        "Setting up your profile", 
        "Understanding the recipe interface",
        "Saving favorite recipes"
      ]
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Recipes & Cooking",
      description: "Everything about finding and using our recipe collection",
      articles: [
        "Searching for recipes",
        "Using filters effectively",
        "Understanding spice levels",
        "Cooking time estimates",
        "Ingredient substitutions"
      ]
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community & Chefs",
      description: "Connect with chefs and food enthusiasts",
      articles: [
        "Following your favorite chefs",
        "Leaving reviews and ratings",
        "Sharing your own recipes",
        "Chef verification process"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Account & Privacy",
      description: "Manage your account and privacy settings",
      articles: [
        "Updating your profile",
        "Privacy settings",
        "Data security",
        "Deleting your account"
      ]
    }
  ];

  const popularArticles = [
    "How to filter recipes by dietary preferences",
    "Understanding regional Indian cuisines",
    "Tips for perfect spice measurements",
    "How to become a verified chef",
    "Troubleshooting common cooking issues"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={true} onToggleVegMode={() => {}} />
      
      <main className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions, learn how to use AHARA effectively, 
            and get the most out of your culinary journey.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Button variant="outline" className="h-auto p-6 flex flex-col gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="font-medium">Live Chat Support</span>
            <span className="text-sm text-muted-foreground">Chat with our team</span>
          </Button>
          
          <Button variant="outline" className="h-auto p-6 flex flex-col gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <span className="font-medium">Email Support</span>
            <span className="text-sm text-muted-foreground">Get response within 24h</span>
          </Button>
          
          <Button variant="outline" className="h-auto p-6 flex flex-col gap-3">
            <Book className="h-8 w-8 text-primary" />
            <span className="font-medium">Video Tutorials</span>
            <span className="text-sm text-muted-foreground">Watch and learn</span>
          </Button>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {helpCategories.map((category, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6 hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <button className="text-sm text-primary hover:underline text-left">
                            {article}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Popular Articles</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {popularArticles.map((article, index) => (
                <button key={index} className="flex items-center gap-3 text-left p-3 rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm text-foreground">{article}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center rounded-2xl bg-primary p-8 text-primary-foreground">
          <h2 className="font-display text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our support team is here to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Email Support
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
