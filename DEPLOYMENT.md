# AHARA Deployment Guide

AHARA builds to static files and can be deployed to any static hosting platform that supports single-page applications.

## Build

```bash
npm install
npm run build
```

Deploy the generated:

```text
dist/
```

## Static Hosting Requirements

- Serve `index.html` for unknown routes.
- Set `VITE_SUPABASE_URL` and a public Supabase anon key when enabling backend features.
- Use HTTPS in production.
- Configure cache headers for static assets.

## Netlify

The repository includes:

```text
public/_redirects
```

with an SPA fallback:

```text
/*    /index.html   200
```

Recommended Netlify settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` or newer |

## Vercel

Recommended Vercel settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

Add rewrites if needed so client-side routes resolve to `index.html`.

## Supabase Deployment

The repo includes migrations but does not document a complete production Supabase rollout.

Before production:

- Confirm the target Supabase project.
- Apply migrations in order.
- Verify RLS policies.
- Confirm the `crazy-recipe-images` bucket exists.
- Generate and commit updated Supabase TypeScript types if schema changes.
- Use only public anon keys in frontend environment variables.

## CI/CD

`.github/workflows/webpack.yml` currently:

- runs on pushes and pull requests to `main`
- tests Node 18, 20, and 22
- installs dependencies
- runs `npm run build`

It does not currently run lint, tests, or deploy.

Recommended CI improvements:

- Use `npm ci` instead of `npm install`.
- Add `npm run lint`.
- Add tests once configured.
- Upload build artifacts.
- Add deployment only after production hosting is selected.
