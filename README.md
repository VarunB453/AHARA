# AHARA - Indian Food Recipes

A comprehensive Indian culinary platform featuring traditional recipes and innovative fusion dishes.

## 🚀 Features

- **55+ Traditional Recipes**: Authentic Indian dishes from all regions
- **15+ Fusion Creations**: Experimental "weird food" combinations
- **User Authentication**: Secure email-based login with magic links
- **Favorites System**: Save and organize your preferred recipes
- **Chef Profiles**: Featured chefs with authentic credentials
- **Advanced Search**: Filter by region, spice level, dietary preferences
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query
- **Animations**: Framer Motion, GSAP

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/VarunB453/AHARA.git
cd AHARA

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your Supabase credentials in .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Environment variables are auto-configured from `vercel.json`

### Netlify
1. Connect your GitHub repository to Netlify
2. Environment variables are auto-configured from `netlify.toml`

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 📱 Pages

- `/` - Homepage with featured recipes
- `/recipes` - Recipe browsing and search
- `/recipes/:id` - Detailed recipe view
- `/chefs` - Chef profiles and specialties
- `/regions` - Regional recipe exploration
- `/crazy-recipes` - Fusion recipe experiments
- `/favorites` - User's saved recipes
- `/profile` - User settings and preferences
- `/auth` - Authentication (login/signup)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- GitHub: [@VarunB453](https://github.com/VarunB453)
- Repository: [AHARA](https://github.com/VarunB453/AHARA)

---

**Built with ❤️ for Indian cuisine lovers**
