export interface RecipeDetail {
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: {
    step: number;
    title: string;
    description: string;
    time?: number;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  tips: string[];
  videoUrl?: string;
}

export const recipeDetails: Record<string, RecipeDetail> = {
  '1': {
    ingredients: [
      { name: 'Chicken', quantity: '500', unit: 'g' },
      { name: 'Butter', quantity: '4', unit: 'tbsp' },
      { name: 'Onion', quantity: '2', unit: 'medium' },
      { name: 'Tomato Puree', quantity: '1', unit: 'cup' },
      { name: 'Heavy Cream', quantity: '1/2', unit: 'cup' },
      { name: 'Ginger-Garlic Paste', quantity: '2', unit: 'tbsp' },
      { name: 'Kashmiri Red Chili', quantity: '2', unit: 'tsp' },
      { name: 'Garam Masala', quantity: '1', unit: 'tsp' },
      { name: 'Kasuri Methi', quantity: '1', unit: 'tbsp' },
      { name: 'Salt', quantity: 'to', unit: 'taste' },
      { name: 'Sugar', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { step: 1, title: 'Marinate the Chicken', description: 'Cut chicken into pieces and marinate with yogurt, ginger-garlic paste, and spices for 30 minutes.', time: 30 },
      { step: 2, title: 'Cook the Chicken', description: 'Heat butter in a pan and cook marinated chicken until golden brown. Set aside.', time: 10 },
      { step: 3, title: 'Prepare the Gravy', description: 'In the same pan, add more butter, sauté onions until golden, then add tomato puree and spices.', time: 15 },
      { step: 4, title: 'Simmer Together', description: 'Add cooked chicken to the gravy, pour in cream, and simmer on low heat for 10 minutes.', time: 10 },
      { step: 5, title: 'Final Touches', description: 'Add kasuri methi, adjust salt and sugar, garnish with cream and serve hot with naan.', time: 5 },
    ],
    nutrition: { calories: 450, protein: 32, carbs: 12, fat: 28, fiber: 2, sodium: 680 },
    tips: ['Use kasuri methi for authentic flavor', 'Let the gravy simmer to develop rich taste', 'Best served with butter naan or jeera rice'],
  },
  '2': {
    ingredients: [
      { name: 'Paneer', quantity: '400', unit: 'g' },
      { name: 'Bell Peppers', quantity: '2', unit: 'medium' },
      { name: 'Onion', quantity: '2', unit: 'large' },
      { name: 'Tomatoes', quantity: '3', unit: 'medium' },
      { name: 'Yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Ginger-Garlic Paste', quantity: '1', unit: 'tbsp' },
      { name: 'Tikka Masala', quantity: '2', unit: 'tbsp' },
      { name: 'Cream', quantity: '1/4', unit: 'cup' },
      { name: 'Oil', quantity: '3', unit: 'tbsp' },
      { name: 'Kasuri Methi', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { step: 1, title: 'Prepare Paneer', description: 'Cut paneer into cubes and marinate with yogurt, tikka masala, and salt for 20 minutes.', time: 20 },
      { step: 2, title: 'Grill Paneer', description: 'Grill or pan-fry the paneer cubes until slightly charred. Set aside.', time: 8 },
      { step: 3, title: 'Make Gravy Base', description: 'Sauté onions until golden, add ginger-garlic paste, then tomatoes. Cook until oil separates.', time: 12 },
      { step: 4, title: 'Add Spices', description: 'Add remaining tikka masala, bell peppers, and grilled paneer to the gravy.', time: 5 },
      { step: 5, title: 'Finish', description: 'Pour cream, sprinkle kasuri methi, simmer for 5 minutes and serve.', time: 5 },
    ],
    nutrition: { calories: 380, protein: 18, carbs: 15, fat: 26, fiber: 3, sodium: 520 },
    tips: ['Don\'t overcook paneer to keep it soft', 'Char the paneer for smoky flavor', 'Add cream at the end for best texture'],
  },
  '3': {
    ingredients: [
      { name: 'Basmati Rice', quantity: '2', unit: 'cups' },
      { name: 'Lamb/Chicken', quantity: '500', unit: 'g' },
      { name: 'Yogurt', quantity: '1', unit: 'cup' },
      { name: 'Onion', quantity: '3', unit: 'large' },
      { name: 'Saffron', quantity: '1/4', unit: 'tsp' },
      { name: 'Warm Milk', quantity: '1/4', unit: 'cup' },
      { name: 'Biryani Masala', quantity: '2', unit: 'tbsp' },
      { name: 'Ghee', quantity: '4', unit: 'tbsp' },
      { name: 'Mint Leaves', quantity: '1/2', unit: 'cup' },
      { name: 'Fried Onions', quantity: '1/2', unit: 'cup' },
    ],
    instructions: [
      { step: 1, title: 'Marinate Meat', description: 'Mix meat with yogurt, biryani masala, ginger-garlic paste, and half the mint. Marinate for 2 hours.', time: 120 },
      { step: 2, title: 'Prepare Rice', description: 'Soak basmati rice for 30 min, then parboil with whole spices until 70% cooked.', time: 35 },
      { step: 3, title: 'Cook Meat', description: 'In a heavy-bottomed pot, cook marinated meat until half done.', time: 25 },
      { step: 4, title: 'Layer the Biryani', description: 'Layer partially cooked rice over meat, add saffron milk, ghee, and fried onions.', time: 10 },
      { step: 5, title: 'Dum Cooking', description: 'Seal pot with dough, cook on low heat (dum) for 25-30 minutes.', time: 30 },
    ],
    nutrition: { calories: 520, protein: 28, carbs: 58, fat: 22, fiber: 3, sodium: 780 },
    tips: ['Dum cooking is essential for authentic flavor', 'Use quality basmati rice', 'Let biryani rest 5 min before opening'],
  },
  '4': {
    ingredients: [
      { name: 'Dosa Batter', quantity: '2', unit: 'cups' },
      { name: 'Potatoes', quantity: '4', unit: 'medium' },
      { name: 'Onion', quantity: '1', unit: 'large' },
      { name: 'Mustard Seeds', quantity: '1', unit: 'tsp' },
      { name: 'Curry Leaves', quantity: '10', unit: 'leaves' },
      { name: 'Turmeric', quantity: '1/2', unit: 'tsp' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Oil', quantity: '4', unit: 'tbsp' },
      { name: 'Salt', quantity: 'to', unit: 'taste' },
    ],
    instructions: [
      { step: 1, title: 'Make Potato Filling', description: 'Boil and mash potatoes. Sauté mustard seeds, curry leaves, onions, and add turmeric and mashed potatoes.', time: 15 },
      { step: 2, title: 'Heat the Tawa', description: 'Heat a non-stick tawa or cast iron pan on medium-high heat.', time: 3 },
      { step: 3, title: 'Spread the Batter', description: 'Pour a ladleful of batter and spread in circular motion to form thin crepe.', time: 2 },
      { step: 4, title: 'Crisp the Dosa', description: 'Drizzle oil around edges, cook until golden and crispy.', time: 3 },
      { step: 5, title: 'Add Filling & Serve', description: 'Place potato filling in center, fold dosa, serve with coconut chutney and sambar.', time: 2 },
    ],
    nutrition: { calories: 280, protein: 8, carbs: 42, fat: 9, fiber: 4, sodium: 380 },
    tips: ['Fermented batter makes crispier dosas', 'Cast iron gives best results', 'Serve immediately for crispy texture'],
  },
  '5': {
    ingredients: [
      { name: 'Chicken', quantity: '500', unit: 'g' },
      { name: 'Coconut', quantity: '1/2', unit: 'cup' },
      { name: 'Fennel Seeds', quantity: '1', unit: 'tbsp' },
      { name: 'Black Pepper', quantity: '1', unit: 'tbsp' },
      { name: 'Red Chilies', quantity: '8', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Onion', quantity: '2', unit: 'large' },
      { name: 'Oil', quantity: '4', unit: 'tbsp' },
      { name: 'Star Anise', quantity: '2', unit: 'pieces' },
    ],
    instructions: [
      { step: 1, title: 'Roast Spices', description: 'Dry roast fennel, pepper, red chilies, and coconut until aromatic. Grind to paste.', time: 10 },
      { step: 2, title: 'Sauté Aromatics', description: 'Heat oil, add curry leaves, star anise, and sliced onions. Cook until golden.', time: 8 },
      { step: 3, title: 'Add Chicken', description: 'Add chicken pieces, cook until sealed on all sides.', time: 10 },
      { step: 4, title: 'Add Spice Paste', description: 'Add the ground spice paste, salt, and little water. Mix well.', time: 5 },
      { step: 5, title: 'Cook Until Done', description: 'Cover and cook on medium heat until chicken is tender and gravy thickens.', time: 20 },
    ],
    nutrition: { calories: 420, protein: 35, carbs: 8, fat: 28, fiber: 3, sodium: 620 },
    tips: ['Freshly ground spices make all the difference', 'Use bone-in chicken for more flavor', 'Adjust red chilies based on preference'],
  },
  '6': {
    ingredients: [
      { name: 'Paneer', quantity: '300', unit: 'g' },
      { name: 'Spinach', quantity: '500', unit: 'g' },
      { name: 'Onion', quantity: '1', unit: 'medium' },
      { name: 'Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Cream', quantity: '2', unit: 'tbsp' },
      { name: 'Cumin Seeds', quantity: '1', unit: 'tsp' },
      { name: 'Butter', quantity: '2', unit: 'tbsp' },
      { name: 'Salt', quantity: 'to', unit: 'taste' },
    ],
    instructions: [
      { step: 1, title: 'Blanch Spinach', description: 'Blanch spinach in boiling water for 2 minutes, then transfer to ice water. Drain and blend.', time: 5 },
      { step: 2, title: 'Prepare Paneer', description: 'Cut paneer into cubes and lightly fry until golden. Set aside.', time: 5 },
      { step: 3, title: 'Make Base', description: 'Heat butter, add cumin, garlic, and onions. Sauté until soft.', time: 5 },
      { step: 4, title: 'Add Spinach', description: 'Add blended spinach, green chilies, and cook for 5 minutes.', time: 5 },
      { step: 5, title: 'Finish', description: 'Add paneer cubes, cream, and simmer for 5 minutes. Serve hot.', time: 5 },
    ],
    nutrition: { calories: 320, protein: 16, carbs: 10, fat: 24, fiber: 5, sodium: 450 },
    tips: ['Blanching keeps spinach vibrant green', 'Don\'t overcook spinach', 'Add cream at the end'],
  },
  '7': {
    ingredients: [
      { name: 'Fish Fillets', quantity: '500', unit: 'g' },
      { name: 'Coconut Milk', quantity: '1', unit: 'cup' },
      { name: 'Kokum', quantity: '4', unit: 'pieces' },
      { name: 'Onion', quantity: '1', unit: 'large' },
      { name: 'Tomato', quantity: '2', unit: 'medium' },
      { name: 'Red Chilies', quantity: '4', unit: 'pieces' },
      { name: 'Tamarind', quantity: '1', unit: 'tbsp' },
      { name: 'Coriander Seeds', quantity: '1', unit: 'tbsp' },
      { name: 'Turmeric', quantity: '1/2', unit: 'tsp' },
    ],
    instructions: [
      { step: 1, title: 'Grind Masala', description: 'Grind soaked red chilies, coriander seeds, and coconut into smooth paste.', time: 5 },
      { step: 2, title: 'Cook Base', description: 'Sauté onions until soft, add tomatoes and cook until mushy.', time: 8 },
      { step: 3, title: 'Add Masala', description: 'Add ground masala paste, turmeric, and cook for 5 minutes.', time: 5 },
      { step: 4, title: 'Add Coconut Milk', description: 'Pour coconut milk, add kokum and tamarind. Bring to simmer.', time: 5 },
      { step: 5, title: 'Cook Fish', description: 'Gently add fish fillets, cover and cook for 10-12 minutes until done.', time: 12 },
    ],
    nutrition: { calories: 350, protein: 28, carbs: 12, fat: 22, fiber: 3, sodium: 520 },
    tips: ['Use fresh fish for best results', 'Kokum adds authentic Goan flavor', 'Don\'t stir too much after adding fish'],
  },
  '8': {
    ingredients: [
      { name: 'Chickpeas', quantity: '2', unit: 'cups' },
      { name: 'All-Purpose Flour', quantity: '2', unit: 'cups' },
      { name: 'Onion', quantity: '2', unit: 'large' },
      { name: 'Tomatoes', quantity: '3', unit: 'medium' },
      { name: 'Chole Masala', quantity: '2', unit: 'tbsp' },
      { name: 'Tea Bags', quantity: '2', unit: 'bags' },
      { name: 'Ginger', quantity: '1', unit: 'inch' },
      { name: 'Yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Oil', quantity: '5', unit: 'tbsp' },
    ],
    instructions: [
      { step: 1, title: 'Soak Chickpeas', description: 'Soak chickpeas overnight with tea bags for dark color.', time: 480 },
      { step: 2, title: 'Pressure Cook', description: 'Pressure cook chickpeas until soft, about 4-5 whistles.', time: 20 },
      { step: 3, title: 'Make Gravy', description: 'Sauté onions, add tomatoes, ginger, and chole masala. Cook until oil separates.', time: 15 },
      { step: 4, title: 'Add Chickpeas', description: 'Add cooked chickpeas with some cooking liquid. Simmer for 15 minutes.', time: 15 },
      { step: 5, title: 'Make Bhature', description: 'Knead flour with yogurt into soft dough, rest, then deep fry into puffy breads.', time: 20 },
    ],
    nutrition: { calories: 480, protein: 15, carbs: 68, fat: 18, fiber: 12, sodium: 680 },
    tips: ['Tea gives authentic dark color', 'Rest bhature dough for fluffier results', 'Serve with pickled onions'],
  },
};

// Generate default details for recipes without specific data
export const getRecipeDetail = (recipeId: string): RecipeDetail => {
  if (recipeDetails[recipeId]) {
    return recipeDetails[recipeId];
  }
  
  // Return default template for recipes without specific data
  return {
    ingredients: [
      { name: 'Main Ingredient', quantity: '500', unit: 'g' },
      { name: 'Onion', quantity: '2', unit: 'medium' },
      { name: 'Tomatoes', quantity: '2', unit: 'medium' },
      { name: 'Ginger-Garlic Paste', quantity: '1', unit: 'tbsp' },
      { name: 'Spices', quantity: 'as', unit: 'required' },
      { name: 'Oil', quantity: '3', unit: 'tbsp' },
      { name: 'Salt', quantity: 'to', unit: 'taste' },
      { name: 'Fresh Coriander', quantity: 'for', unit: 'garnish' },
    ],
    instructions: [
      { step: 1, title: 'Preparation', description: 'Prepare and chop all ingredients. Keep spices ready.', time: 10 },
      { step: 2, title: 'Sauté Aromatics', description: 'Heat oil, add onions and sauté until golden brown.', time: 8 },
      { step: 3, title: 'Add Spices', description: 'Add ginger-garlic paste, spices, and tomatoes. Cook well.', time: 10 },
      { step: 4, title: 'Cook Main Ingredient', description: 'Add the main ingredient and cook until done.', time: 15 },
      { step: 5, title: 'Garnish & Serve', description: 'Garnish with fresh coriander and serve hot.', time: 2 },
    ],
    nutrition: { calories: 350, protein: 20, carbs: 25, fat: 18, fiber: 4, sodium: 550 },
    tips: ['Use fresh ingredients for best taste', 'Adjust spices to your preference', 'Serve hot with rice or bread'],
  };
};
