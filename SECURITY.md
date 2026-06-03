# AHARA Security Policy

## Supported Scope

This document covers the current repository: a React/Vite frontend with optional Supabase-backed data operations.

## Key Security Considerations

## Environment Variables

- Never commit `.env.local`.
- Never expose Supabase service-role keys in frontend code.
- Use only public anon keys in Vite environment variables.
- Rotate keys if secrets are accidentally committed.

## Supabase Row Level Security

The migrations enable RLS for `crazy_recipes` and `crazy_recipe_reviews`. Before production, verify every policy against the intended user model.

Important checks:

- Public users should only read approved recipes unless the product intentionally allows broader reads.
- Authenticated users should only modify their own content.
- Admin approval functions need a verified admin authorization path.
- Review uniqueness and ownership should be enforced at the database level.

## User-Generated Content

Write flows exist in `recipeService.ts`, but several are disabled in `useRecipeService.ts`. If re-enabled:

- validate recipe title, description, ingredients, and instructions
- enforce image upload size and MIME restrictions
- moderate recipe and review content
- avoid rendering unsafe HTML from user input
- log abuse signals without storing unnecessary personal data

## Storage

The `crazy-recipe-images` bucket should enforce:

- allowed image MIME types
- maximum file size
- ownership-aware upload paths
- cleanup for deleted recipes

## Browser Storage

Favorites, language, and theme are stored in `localStorage`. Do not store credentials, tokens outside Supabase-managed session storage, private profile data, or sensitive preferences in custom localStorage keys.

## Dependency Hygiene

Recommended maintenance:

```bash
npm audit
npm outdated
```

Review updates before applying them, especially for UI primitives, build tooling, and Supabase SDK changes.

## Reporting Vulnerabilities

No dedicated security contact is documented in the repository. Add a project-specific security email or GitHub Security Advisory workflow before public production use.
