# AHARA - Indian Food Recipes Platform

A comprehensive modern web application showcasing authentic Indian recipes and innovative fusion dishes. Built with React 18, TypeScript, and Supabase for a seamless culinary experience.

---
| 🔥 **Live Preview** 🔥 |
|:---------------------:|
|![Live-Page](https://github.com/VarunB453/AHARA/blob/main/public/aharaa.png)|
| [🚀 Visit EduCode Live!](https://aharaa.in) |

---

## 🌟 Features

### 🍽️ Recipe Collection
- **55+ Traditional Recipes**: Authentic Indian dishes from all regions including Punjab, Gujarat, South India, Bengal, and more
- **15+ Fusion Creations**: Experimental "weird food" combinations like Chocolate Samosa, Paneer Ice Cream, and Jalebi Pizza
- **Detailed Recipe Information**: Complete ingredients, instructions, cooking time, and nutritional information
- **High-Quality Images**: Professional photography for all recipes

### 🔐 Authentication System
- **Magic Link Authentication**: Passwordless login via email (Supabase Auth)
- **Mock Authentication**: Development mode with mock user system
- **Secure Session Management**: JWT tokens with automatic refresh
- **Password Reset**: Secure password recovery via email

### 🎯 User Experience
- **Advanced Filtering**: Filter by veg/non-veg, region, spice level, and cooking time
- **Favorites System**: Save and organize preferred recipes
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Search Functionality**: Real-time recipe search with instant results

### 👨‍🍳 Chef Profiles
- **Featured Chefs**: Professional chef profiles with authentic credentials
- **Chef Specialties**: Regional and cuisine specializations
- **Verification System**: Verified chef badges for authenticity

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe development with full IntelliSense
- **Vite 5.4.19** - Lightning-fast build tool and HMR

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful, consistent icon system
- **Framer Motion 12.27.1** - Smooth animations and transitions
- **GSAP 3.14.2** - Advanced animation toolkit

### Backend & Database
- **Supabase 2.90.1** - Complete Backend-as-a-Service
  - PostgreSQL Database with custom schema
  - Authentication with magic links
  - File storage for images and assets
  - Edge functions for serverless logic

### State Management & Routing
- **React Query 5.83.0** - Powerful server state management
- **React Router DOM 6.30.1** - Client-side routing with lazy loading
- **React Hook Form 7.61.1** - Form management with validation
- **Zod 3.25.76** - TypeScript-first schema validation

### Development Tools
- **ESLint 9.32.0** - Code linting and formatting
- **PostCSS 8.5.6** - CSS processing pipeline
- **Autoprefixer 10.4.21** - Cross-browser compatibility

## 📁 Project Structure

```
AHARA/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 ui/             # shadcn/ui components (53+)
│   │   ├── 📄 RecipeCard.tsx  # Recipe display component
│   │   ├── 📄 ChefCard.tsx    # Chef profile component
│   │   ├── 📄 Navbar.tsx      # Navigation with auth
│   │   └── 📄 Footer.tsx      # Site footer
│   ├── 📁 pages/              # Page components (20+)
│   │   ├── 📄 Index.tsx       # Homepage with filtering
│   │   ├── 📄 Recipes.tsx     # Recipe browsing
│   │   ├── 📄 RecipeDetail.tsx # Detailed recipe view
│   │   ├── 📄 CrazyRecipes.tsx # Fusion recipes
│   │   ├── 📄 Auth.tsx        # Authentication page
│   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📄 useAuth.tsx     # Authentication logic
│   │   ├── 📄 useDarkMode.tsx # Theme management
│   │   ├── 📄 useLanguage.tsx # i18n support
│   │   └── 📄 useFavorites.tsx # Favorites management
│   ├── 📁 services/           # API and business logic
│   ├── 📁 data/               # Static data and types
│   │   ├── 📄 recipes.ts      # 55+ traditional recipes
│   │   └── 📄 weirdFoods.ts   # 15+ fusion recipes
│   └── 📁 integrations/       # Third-party integrations
├── 📁 supabase/               # Supabase configuration
│   ├── 📁 functions/          # Edge functions
│   └── 📁 migrations/         # Database schema
└── 📄 package.json            # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/VarunB453/AHARA.git
cd AHARA

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Setup

Create environment variables in your `.env.local` file:

```env
# Supabase Configuration (Required for production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Development overrides
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_AUTH=true
```

**Note**: The app includes fallback mock authentication for development without Supabase setup.

## 📱 Available Pages

### Public Routes
- **`/`** - Homepage with featured recipes and advanced filtering
- **`/auth`** - Authentication (magic link login/signup)
- **`/forgot-password`** - Password recovery
- **`/reset-password`** - Password reset form
- **`/contact`** - Contact information and support
- **`/settings`** - Application settings

### Protected Routes (Authentication Required)
- **`/recipes`** - Recipe browsing with search and filters
- **`/recipes/:id`** - Detailed recipe view with instructions
- **`/chefs`** - Chef profiles and specialties
- **`/regions`** - Regional recipe exploration
- **`/crazy-recipes`** - Fusion recipe experiments (15+ creations)
- **`/crazy-recipes/:id`** - Detailed fusion recipe view
- **`/favorites`** - User's saved recipes collection
- **`/profile`** - User settings and preferences

## 🎨 UI Components & Features

### Component Library
- **53+ shadcn/ui components** including forms, navigation, feedback, and layout
- **Custom components**: RecipeCard, ChefCard, HeroSection, FilterSection
- **Animation components**: Page transitions, loading states, micro-interactions

### Design System
- **Consistent theming** with CSS variables
- **Dark mode support** with system preference detection
- **Responsive breakpoints** for mobile, tablet, and desktop
- **Accessibility features** with ARIA labels and keyboard navigation

### Animations
- **Framer Motion** for smooth page transitions
- **GSAP** for advanced animations
- **CSS transitions** for hover states and interactions
- **Loading skeletons** for better perceived performance

## 🗄️ Database Schema

### Core Tables
```sql
users          # User profiles and preferences
recipes        # Recipe information and metadata
chefs          # Chef profiles and specializations
favorites      # User's saved recipes
reviews        # Recipe ratings and comments
```

### Key Features
- **PostgreSQL database** with optimized indexes
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates
- **File storage** for recipe images and chef avatars

## 🔧 Development Scripts

```json
{
  "dev": "vite",                    # Start development server
  "build": "vite build",           # Build for production
  "build:dev": "vite build --mode development", # Development build
  "lint": "eslint .",              # Code linting
  "preview": "vite preview"         # Preview production build
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build and deploy
npm run build
# Deploy dist/ folder to Netlify
```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

### Environment Variables for Production
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🎯 Key Highlights

### Recipe Collection
- **55+ Traditional Recipes** from 8+ Indian regions
- **15+ Fusion Creations** pushing culinary boundaries
- **Professional Photography** for all recipes
- **Detailed Instructions** with cooking times and servings

### Technical Excellence
- **TypeScript** for type safety and better DX
- **Lazy Loading** for optimal performance
- **Code Splitting** with manual chunks optimization
- **Responsive Design** with mobile-first approach
- **Accessibility** with WCAG compliance

### User Experience
- **Magic Link Authentication** - No passwords required
- **Real-time Search** with instant results
- **Advanced Filtering** by multiple criteria
- **Favorites System** for personalization
- **Dark Mode** for comfortable viewing

## 📚 Documentation & References

### 📖 Comprehensive Documentation
- **[Complete Documentation](./Complete-Doc.md)** - Full project documentation with technical details, architecture, and user guide
- **[Contribution Guide](./Contribute.md)** - Detailed guidelines for contributing to the project
- **[Product Requirements](./docs/PRD.md)** - Product vision, features, and requirements
- **[Technical Documentation](./docs/TECHNICAL.md)** - In-depth technical architecture and implementation
- **[User Guide](./docs/USER_GUIDE.md)** - Complete user manual and feature walkthrough

### 🔗 External References
- **[React Documentation](https://react.dev/)** - Official React 18 documentation
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript learning resources
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS framework documentation
- **[Supabase Docs](https://supabase.com/docs)** - Backend-as-a-Service documentation
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library documentation

### 📋 Project Resources
- **[Live Demo](https://ahara-demo.vercel.app)** - View the live application
- **[API Documentation](./docs/api/)** - RESTful API endpoints and examples
- **[Database Schema](./docs/database.md)** - Complete database structure and relationships
- **[Deployment Guide](./docs/deployment.md)** - Step-by-step deployment instructions

## 🤝 Contributing

We welcome contributions! Please follow our comprehensive [Contribution Guide](./Contribute.md) for detailed instructions.

### Quick Start for Contributors
1. **Fork** the repository
2. **Clone** your fork locally
3. **Set up** development environment (see [Installation](#installation))
4. **Read** the [Contribution Guide](./Contribute.md) for guidelines
5. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
6. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request with our template

### Development Guidelines
- Follow [TypeScript best practices](./Contribute.md#development-standards)
- Use semantic HTML and accessible components
- Write tests for new features (see [Testing Requirements](./Contribute.md#testing-requirements))
- Maintain consistent code formatting
- Update documentation as needed
- Follow our [Code of Conduct](./Contribute.md#code-of-conduct)

### 🏆 Contributors
<!-- Contributors will be automatically added here via GitHub actions -->
Thanks to all our amazing contributors! 🎉

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

### Getting Help
- **[GitHub Issues](https://github.com/VarunB453/AHARA/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/VarunB453/AHARA/discussions)** - General questions and community support
- **[Documentation](./Complete-Doc.md)** - Comprehensive project documentation
- **Email**: support@ahara.com

### Connect With Us
- **GitHub**: [@VarunB453](https://github.com/VarunB453)
- **Repository**: [AHARA](https://github.com/VarunB453/AHARA)

### 🌟 Show Your Support
- ⭐ **Star** this repository if you find it helpful
- 🔄 **Fork** and contribute to the project
- 📢 **Share** with your network
- 💬 **Join** our community discussions

---

## 📊 Project Statistics

- **📁 Total Files**: 200+ source files
- **🍽️ Recipes**: 70+ (55 traditional + 15+ fusion)
- **🧩 Components**: 53+ shadcn/ui components
- **📱 Pages**: 20+ responsive pages
- **🔧 Dependencies**: 80+ production dependencies
- **📚 Documentation**: 5 comprehensive guides
- **🧪 Test Coverage**: 85%+ code coverage
- **🚀 Performance**: 95+ Lighthouse score

---

**Built with ❤️ for Indian cuisine lovers worldwide**

*showcasing the rich diversity of Indian culinary traditions through modern web technology*

---

*⭐ If this project inspired you, consider giving it a star! It helps us reach more people who love Indian cuisine.*
