# Contributing to AHARA

Thank you for improving AHARA. This guide documents the practical contribution workflow for the current repository.

## Before You Start

- Use Node.js 18 or newer.
- Use npm as the primary package manager.
- Review the current code structure in `src/` before introducing new abstractions.
- Keep changes scoped to the feature, fix, or documentation update you are making.

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

## Development Checks

Run these before opening a pull request:

```bash
npm run lint
npm run build
```

There is no configured test command yet. If your contribution adds tests, include the required dependencies and document the new command.

## Branch Workflow

1. Create a focused branch from `main`.
2. Make small, reviewable changes.
3. Keep unrelated refactors out of feature branches.
4. Run lint and build checks.
5. Open a pull request with a clear summary and screenshots for UI changes.

## Code Guidelines

- Prefer existing components and hooks before adding new patterns.
- Keep UI components responsive and accessible.
- Use the `@/` path alias for source imports.
- Keep Supabase service calls in `src/services/` and UI-facing behavior in hooks.
- Do not commit secrets, service-role keys, or local environment files.

## Pull Request Checklist

- [ ] The change has a clear purpose.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] UI changes include screenshots or a short visual description.
- [ ] Supabase changes include migration notes.
- [ ] Documentation is updated when behavior changes.

## Existing Contribution Docs

The repository also contains [CONTRIBUTE.md](CONTRIBUTE.md), which may include broader project contribution guidance.
