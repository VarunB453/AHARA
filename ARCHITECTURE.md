# AHARA Architecture

AHARA is a client-rendered Vite application with optional Supabase-backed data operations.

## System Overview

```mermaid
flowchart LR
    User["User Browser"] --> ViteApp["React SPA"]
    ViteApp --> Routes["React Router Routes"]
    Routes --> Pages["Page Components"]
    Pages --> UI["Reusable Components"]
    Pages --> StaticData["Static Recipe Data"]
    Pages --> Hooks["Custom Hooks"]
    Hooks --> BrowserStorage["localStorage"]
    Hooks --> Supabase["Supabase SDK"]
    Supabase --> Postgres["PostgreSQL"]
    Supabase --> Storage["Storage Bucket"]
    Supabase --> Functions["RPC Functions"]
```

## Frontend Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Entry | `src/main.tsx` | Mounts the React app. |
| App shell | `src/App.tsx` | Providers, routing, lazy-loaded pages, global toasts. |
| Pages | `src/pages/` | Route-level UI. |
| Components | `src/components/` | Reusable app components and `ui/` primitives. |
| Hooks | `src/hooks/` | UI state, persistence, language, dark mode, Supabase adapters. |
| Data | `src/data/` | Static recipes, recipe details, weird foods, reviews, chefs, regions. |
| Services | `src/services/` | Supabase data and storage operations. |
| Integrations | `src/integrations/supabase/` | Supabase client and generated database types. |

## Routing

```mermaid
flowchart TD
    App["App.tsx"] --> Home["/"]
    App --> Recipes["/recipes"]
    App --> RecipeDetail["/recipes/:id"]
    App --> CrazyRecipes["/crazy-recipes"]
    App --> CrazyDetail["/crazy-recipes/:id"]
    App --> Chefs["/chefs"]
    App --> Regions["/regions"]
    App --> Contact["/contact"]
    App --> NotFound["*"]
```

## Data Model

Traditional recipes are static TypeScript objects. Fusion recipes have both static local data and Supabase-backed service operations.

```mermaid
erDiagram
    crazy_recipes {
        uuid id PK
        text title
        text description
        text_array ingredients
        text instructions
        integer cooking_time
        boolean is_veg
        text image_url
        uuid author_id FK
        text author_name
        text author_email
        boolean is_approved
        integer views_count
        integer likes_count
        timestamptz created_at
        timestamptz updated_at
    }

    crazy_recipe_reviews {
        uuid id PK
        uuid recipe_id FK
        uuid reviewer_id FK
        text reviewer_name
        integer rating
        text comment
        timestamptz created_at
    }

    crazy_recipes ||--o{ crazy_recipe_reviews : has
```

## Supabase Capabilities

The migrations define:

- `crazy_recipes`
- `crazy_recipe_reviews`
- Row Level Security policies
- indexes for author, approval state, created date, recipe reviews, and reviewer IDs
- RPC functions for view and like counters
- a `crazy-recipe-images` storage bucket
- account deletion helper functions

## Current Architecture Gaps

- No custom backend server or REST API exists.
- No automated tests are configured.
- Some Supabase write flows exist in `recipeService.ts` but are disabled in `useRecipeService.ts`.
- Production deployment details are not pinned to a specific platform.
- Supabase local development commands are not documented in existing scripts.
