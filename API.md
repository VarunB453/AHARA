# AHARA API Documentation

AHARA does not include a custom HTTP API server. It uses the Supabase JavaScript SDK directly from the React app.

## Client Configuration

Source:

```text
src/integrations/supabase/client.ts
```

Environment variables:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Public anon key. |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Fallback public key name. |
| `VITE_SUPABASE_PUBLIC_ANON_KEY` | Fallback public key name. |

## Service Map

Source:

```text
src/services/recipeService.ts
```

| Function | Type | Supabase target |
| --- | --- | --- |
| `getAllRecipes()` | Read | `crazy_recipes` |
| `getRecipeById(id)` | Read | `crazy_recipes` |
| `getRecipesByUser(userId, includeUnapproved)` | Read | `crazy_recipes` |
| `getRecipesByAuthorName(authorName)` | Read | `crazy_recipes` |
| `searchRecipes(searchTerm, approvedOnly)` | Read | `crazy_recipes` |
| `filterRecipesByType(isVeg, approvedOnly)` | Read | `crazy_recipes` |
| `getRecipesWithPagination(page, pageSize, approvedOnly)` | Read | `crazy_recipes` |
| `createRecipe(recipeData)` | Write | `crazy_recipes` |
| `createRecipeWithImage(recipeData, imageFile)` | Write/storage | `crazy_recipes`, `crazy-recipe-images` |
| `updateRecipe(id, recipeData)` | Write | `crazy_recipes` |
| `updateRecipeWithImage(id, recipeData, imageFile)` | Write/storage | `crazy_recipes`, `crazy-recipe-images` |
| `approveRecipe(id)` | Write | `crazy_recipes` |
| `updateRecipeStats(id, stats)` | Write | `crazy_recipes` |
| `deleteRecipe(id)` | Delete | `crazy_recipes`, storage cleanup |
| `incrementRecipeViews(recipeId)` | RPC | `increment_recipe_views` |
| `incrementRecipeLikes(recipeId)` | RPC | `increment_recipe_likes` |
| `decrementRecipeLikes(recipeId)` | RPC | `decrement_recipe_likes` |
| `getRecipeStats(userId)` | Read/count | `crazy_recipes` |
| `bulkUpdateApproval(recipeIds, approved)` | Write | `crazy_recipes` |
| `getRecipeReviews(recipeId)` | Read | `crazy_recipe_reviews` |
| `submitReview(review)` | Write | `crazy_recipe_reviews` |
| `getReviewsByReviewers(reviewerNames)` | Read | `crazy_recipe_reviews` |

## UI Availability

`src/hooks/useRecipeService.ts` currently disables these user-facing flows:

- create recipe
- update recipe
- delete recipe
- submit review

The lower-level service functions still exist. Re-enable them only after confirming authentication, RLS policies, validation, moderation, and production storage behavior.

## Static Data APIs

Traditional recipe data is imported from local TypeScript modules:

| Module | Contents |
| --- | --- |
| `src/data/recipes.ts` | Recipe list, chefs, regions. |
| `src/data/recipeDetails.ts` | Detailed traditional recipe content. |
| `src/data/weirdFoods.ts` | Static fusion recipes and reviews. |

## Missing API Documentation

- Exact Supabase CLI migration workflow.
- Generated OpenAPI/PostgREST endpoint references.
- Error response taxonomy for UI-level failures.
- Authentication/session lifecycle documentation.
- Admin authorization model for approval operations.
