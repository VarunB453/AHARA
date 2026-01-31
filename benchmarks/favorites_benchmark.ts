
// favorites_benchmark.ts

const NUM_RECIPES = 10000;
const NUM_FAVORITES = 1000;
const ITERATIONS = 1000;

// Generate mock data
const allRecipeIds = Array.from({ length: NUM_RECIPES }, (_, i) => `recipe-${i}`);
const favoriteIds = Array.from({ length: NUM_FAVORITES }, () => `recipe-${Math.floor(Math.random() * NUM_RECIPES)}`);

// Setup implementations
const favoritesArray = [...favoriteIds];
const favoritesSet = new Set(favoriteIds);

console.log(`Benchmarking with ${NUM_RECIPES} recipes and ${NUM_FAVORITES} favorites over ${ITERATIONS} iterations.`);

// Benchmark Array.includes
const startArray = performance.now();
let arrayMatches = 0;
for (let i = 0; i < ITERATIONS; i++) {
  for (const recipeId of allRecipeIds) {
    if (favoritesArray.includes(recipeId)) {
      arrayMatches++;
    }
  }
}
const endArray = performance.now();
const timeArray = endArray - startArray;

// Benchmark Set.has
const startSet = performance.now();
let setMatches = 0;
for (let i = 0; i < ITERATIONS; i++) {
  for (const recipeId of allRecipeIds) {
    if (favoritesSet.has(recipeId)) {
      setMatches++;
    }
  }
}
const endSet = performance.now();
const timeSet = endSet - startSet;

console.log(`Array.includes time: ${timeArray.toFixed(2)}ms`);
console.log(`Set.has time:        ${timeSet.toFixed(2)}ms`);
console.log(`Speedup:             ${(timeArray / timeSet).toFixed(2)}x`);
