# AHARA Development Guide

## Requirements

- Node.js 18 or newer
- npm
- Git
- Optional: Supabase CLI for database work

## Setup

```bash
npm install
npm run dev
```

Development server:

```text
http://localhost:8080
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server. |
| `npm run build` | Build production static assets. |
| `npm run build:dev` | Build with Vite development mode. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview production build locally. |

## Source Conventions

- Use `@/` imports for files under `src/`.
- Put route-level UI in `src/pages/`.
- Put reusable UI in `src/components/`.
- Put shadcn/ui-style primitives in `src/components/ui/`.
- Put local catalog data in `src/data/`.
- Put Supabase SDK operations in `src/services/`.
- Put hook-level UI behavior in `src/hooks/`.

## Environment Variables

Use `.env.local` for local Supabase settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not commit `.env.local`.

## Database Development

Supabase migrations live in `supabase/migrations/`. The repository does not currently include npm scripts for Supabase CLI commands.

Recommended additions:

```json
{
  "supabase:start": "supabase start",
  "supabase:stop": "supabase stop",
  "supabase:types": "supabase gen types typescript --local > src/integrations/supabase/types.ts"
}
```

Add these only after confirming the intended local Supabase workflow.

## Testing

No test command is currently configured. A practical next step is Vitest plus React Testing Library for unit/component tests, followed by Playwright for end-to-end coverage.

Recommended test targets:

- recipe filtering and detail lookups
- favorites persistence
- dark mode persistence
- language switching
- Supabase service behavior with mocked clients
- main navigation flows
