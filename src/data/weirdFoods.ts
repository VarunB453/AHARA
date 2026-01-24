export interface WeirdFoodRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  is_veg: boolean;
  image_url: string;
  views_count: number;
  likes_count: number;
  created_at: string;
}

export interface WeirdFoodReview {
  id: string;
  recipe_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const weirdFoodRecipes: WeirdFoodRecipe[] = [
  {
    id: 'weird-1',
    title: 'Chocolate Samosa',
    description: 'A revolutionary fusion dessert that combines the traditional Indian samosa with a rich chocolate filling. Crispy golden pastry meets molten chocolate in this unexpected sweet treat that challenges culinary boundaries.',
    ingredients: [
      '2 cups all-purpose flour',
      '4 tbsp ghee',
      '1 cup dark chocolate chips',
      '1/2 cup heavy cream',
      '2 tbsp powdered sugar',
      '1 tsp cardamom powder',
      'Oil for deep frying',
      'Pinch of salt'
    ],
    instructions: 'Step 1: Prepare the dough by mixing flour, ghee, and salt. Add water gradually to form a stiff dough. Rest for 30 minutes.\nStep 2: Make the chocolate ganache by heating heavy cream and pouring over dark chocolate chips. Add cardamom powder and mix until smooth.\nStep 3: Divide dough into small balls and roll into oval shapes. Cut into half to form semi-circles.\nStep 4: Fill each semi-circle with chocolate ganache, seal edges carefully to prevent leakage.\nStep 5: Deep fry in medium-hot oil until golden brown and crispy.\nStep 6: Serve hot with powdered sugar dusting and extra chocolate drizzle.',
    cooking_time: 45,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1714799263348-41c7245cd714?q=80&w=1100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1250,
    likes_count: 89,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'weird-2',
    title: 'Paneer Ice Cream',
    description: 'A bizarre yet surprisingly delicious frozen dessert featuring crumbled paneer blended with cream, saffron, and nuts. This Indian twist on ice cream combines savory cottage cheese with sweet flavors for a unique texture and taste experience.',
    ingredients: [
      '250 grams fresh paneer',
      '2 cups heavy cream',
      '1 cup condensed milk',
      '1/4 cup crushed pistachios',
      '1/4 cup almonds',
      '1 tsp saffron strands',
      '1/2 tsp cardamom powder',
      '2 tbsp honey'
    ],
    instructions: 'Step 1: Crumble fresh paneer into small pieces and blend until smooth.\nStep 2: In a separate bowl, whip heavy cream until soft peaks form.\nStep 3: Add condensed milk to the whipped cream and fold gently.\nStep 4: Mix the blended paneer with saffron, cardamom powder, and honey.\nStep 5: Combine the paneer mixture with the cream mixture gently.\nStep 6: Add crushed nuts and fold in. Freeze for 6 hours or until set.\nStep 7: Serve garnished with extra pistachios and saffron strands.',
    cooking_time: 240,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1650419741906-1cdead9c9b4f?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 980,
    likes_count: 67,
    created_at: '2024-01-14T15:30:00Z'
  },
  {
    id: 'weird-3',
    title: 'Spicy Mango Maggi',
    description: 'An unconventional monsoon special that combines the comfort of Maggi noodles with raw mango slices and extra spices. This tangy, spicy, and sweet creation is perfect for those who love to experiment with their favorite instant noodles.',
    ingredients: [
      '2 packets Maggi noodles',
      '1 raw mango',
      '1 onion',
      '2 green chilies',
      '1 tsp mustard seeds',
      '1/2 tsp turmeric powder',
      '1 tbsp red chili powder',
      '2 tbsp oil',
      'Coriander leaves for garnish',
      'Lemon wedges'
    ],
    instructions: 'Step 1: Thinly slice the raw mango and onion. Slit green chilies lengthwise.\nStep 2: Heat oil in a pan, add mustard seeds and let them splutter.\nStep 3: Add onions and sauté until translucent. Add green chilies and mango slices.\nStep 4: Add turmeric powder, red chili powder, and salt. Cook for 2-3 minutes.\nStep 5: Add 2 cups water and bring to boil. Add Maggi noodles and tastemaker.\nStep 6: Cook for 2-3 minutes, stirring occasionally. Garnish with coriander.\nStep 7: Serve hot with lemon wedges on the side.',
    cooking_time: 15,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1692273212247-f5efb3fc9b87?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1567,
    likes_count: 123,
    created_at: '2024-01-13T12:45:00Z'
  },
  {
    id: 'weird-4',
    title: 'Omelette Dosa',
    description: 'A protein-packed breakfast fusion that marries South Indian dosa with a fluffy omelette. The dosa batter is cooked with eggs directly on the tawa, creating a unique combination that\'s crispy on the outside and soft on the inside.',
    ingredients: [
      '2 cups dosa batter',
      '3 eggs',
      '1 onion finely chopped',
      '2 green chilies',
      '1/4 cup coriander leaves',
      '1/2 tsp pepper powder',
      'Salt to taste',
      '2 tbsp oil',
      '1 tsp mustard seeds'
    ],
    instructions: 'Step 1: Beat eggs with chopped onions, green chilies, coriander leaves, pepper, and salt.\nStep 2: Heat a tawa and pour a ladleful of dosa batter, spreading it thin.\nStep 3: Immediately pour half of the egg mixture over the dosa while the batter is still wet.\nStep 4: Drizzle oil around the edges and cover with a lid.\nStep 5: Cook on medium heat until the bottom is golden and the egg is set.\nStep 6: Fold the dosa and serve hot with coconut chutney or sambar.',
    cooking_time: 20,
    is_veg: false,
    image_url: 'https://images.unsplash.com/photo-1700324673015-52cddc228533?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1890,
    likes_count: 156,
    created_at: '2024-01-12T09:20:00Z'
  },
  {
    id: 'weird-5',
    title: 'Jalebi Pizza',
    description: 'A dessert pizza that replaces traditional pizza toppings with crispy jalebis, rabri, and nuts. This sweet innovation combines Italian pizza base with Indian mithai for an unforgettable dessert experience.',
    ingredients: [
      '1 pizza base',
      '1 cup maida',
      '1/2 cup yogurt',
      '1/2 cup sugar',
      '1/4 tsp saffron',
      '1 cup sugar for syrup',
      '1 cup water',
      '1/2 cup rabri',
      '1/4 cup mixed nuts',
      'Ghee for frying',
      'Cardamom powder'
    ],
    instructions: 'Step 1: Prepare jalebi batter by mixing maida, yogurt, and saffron water. Ferment for 6-8 hours.\nStep 2: Prepare sugar syrup with sugar, water, and cardamom powder.\nStep 3: Heat ghee and pipe jalebis, fry until golden and crispy.\nStep 4: Soak hot jalebis in sugar syrup for 2-3 minutes.\nStep 5: Bake the pizza base until golden.\nStep 6: Arrange jalebis on the pizza base, drizzle with rabri.\nStep 7: Garnish with mixed nuts and serve immediately.',
    cooking_time: 60,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1566843972705-1aad0ee32f88?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 2100,
    likes_count: 198,
    created_at: '2024-01-11T18:00:00Z'
  },
  {
    id: 'weird-6',
    title: 'Curd Rice Pancake',
    description: 'A breakfast innovation that transforms traditional South Indian curd rice into fluffy pancakes. These savory pancakes combine the cooling properties of curd with the comfort of rice, creating a unique breakfast option.',
    ingredients: [
      '1 cup cooked rice',
      '1/2 cup curd',
      '1/2 cup rice flour',
      '1 onion finely chopped',
      '2 green chilies',
      '1/4 cup coriander leaves',
      '1/2 tsp cumin seeds',
      '1/2 tsp baking soda',
      'Salt to taste',
      '2 tbsp oil'
    ],
    instructions: 'Step 1: Mash cooked rice well and mix with curd to form a smooth paste.\nStep 2: Add rice flour, chopped onions, green chilies, coriander leaves, and cumin seeds.\nStep 3: Add salt and baking soda. Mix well to form a thick batter.\nStep 4: Heat a non-stick pan and pour a ladleful of batter.\nStep 5: Spread gently to form a pancake shape. Cook on medium heat.\nStep 6: Drizzle oil around the edges and cook until golden brown on both sides.\nStep 7: Serve hot with pickle or chutney.',
    cooking_time: 25,
    is_veg: true,
    image_url: '/weird-foods/curd-rice-pancake.jpg',
    views_count: 890,
    likes_count: 76,
    created_at: '2024-01-10T07:15:00Z'
  },
  {
    id: 'weird-7',
    title: 'Pizza Dosa',
    description: 'A fusion marvel that transforms the traditional South Indian dosa into a pizza-like experience with tomato sauce, cheese, and toppings, all cooked on a tawa for a crispy base.',
    ingredients: [
      '2 cups dosa batter',
      '1/2 cup pizza sauce',
      '1 cup mozzarella cheese',
      '1/4 cup bell peppers',
      '1/4 cup onions',
      '1/4 cup olives',
      '1 tsp oregano',
      '1 tsp chili flakes',
      '2 tbsp oil',
      'Fresh basil leaves'
    ],
    instructions: 'Step 1: Heat a tawa and pour a ladleful of dosa batter, spreading it thick like a pizza base.\nStep 2: Cook until the bottom is golden and the top is partially set.\nStep 3: Spread pizza sauce evenly over the dosa.\nStep 4: Sprinkle mozzarella cheese generously.\nStep 5: Add toppings: bell peppers, onions, and olives.\nStep 6: Sprinkle oregano and chili flakes.\nStep 7: Drizzle oil around edges and cover with lid.\nStep 8: Cook until cheese melts and base is crispy. Garnish with basil.',
    cooking_time: 25,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1692737580547-b45bb4a02356?q=80&w=915&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1450,
    likes_count: 112,
    created_at: '2024-01-09T14:30:00Z'
  },
  {
    id: 'weird-8',
    title: 'Ice Cream Samosa',
    description: 'A frozen twist on the traditional samosa, featuring a crispy pastry shell filled with vanilla ice cream and topped with chocolate sauce and nuts for a dessert that defies expectations.',
    ingredients: [
      '2 cups all-purpose flour',
      '4 tbsp ghee',
      '1 liter vanilla ice cream',
      '1/2 cup chocolate sauce',
      '1/4 cup mixed nuts',
      '1 tsp cardamom powder',
      'Oil for frying',
      'Pinch of salt',
      'Honey for drizzle'
    ],
    instructions: 'Step 1: Prepare samosa dough with flour, ghee, and salt. Rest for 30 minutes.\nStep 2: Divide dough into small portions and roll into triangles.\nStep 3: Fill each samosa with a scoop of frozen ice cream.\nStep 4: Seal edges carefully to prevent leakage.\nStep 5: Freeze filled samosas for 2 hours.\nStep 6: Deep fry in hot oil for 30 seconds until golden.\nStep 7: Serve immediately with chocolate sauce, nuts, and honey drizzle.',
    cooking_time: 180,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1737218087115-eeda5a61dc47?q=80&w=700&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1780,
    likes_count: 145,
    created_at: '2024-01-08T16:45:00Z'
  },
  {
    id: 'weird-9',
    title: 'Chai Pasta',
    description: 'An unconventional pasta dish infused with Indian chai spices, creating a creamy, aromatic sauce that combines Italian pasta with the comforting flavors of masala chai.',
    ingredients: [
      '250 grams penne pasta',
      '2 cups milk',
      '1 tea bag or 2 tsp tea leaves',
      '1 inch cinnamon stick',
      '2 cardamom pods',
      '1/4 tsp nutmeg',
      '1/4 cup cream',
      '2 tbsp butter',
      '1 tbsp sugar',
      'Salt to taste'
    ],
    instructions: 'Step 1: Cook pasta al dente according to package instructions.\nStep 2: In a pan, heat milk with tea bag, cinnamon, and cardamom.\nStep 3: Simmer for 5 minutes to infuse chai flavors.\nStep 4: Remove tea bag and spices. Add cream and butter.\nStep 5: Add nutmeg, sugar, and salt. Simmer until slightly thickened.\nStep 6: Add cooked pasta to the chai sauce.\nStep 7: Toss well and serve hot with grated cheese.',
    cooking_time: 30,
    is_veg: true,
    image_url: 'https://plus.unsplash.com/premium_photo-1726750882741-f9c81841fd8b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1320,
    likes_count: 98,
    created_at: '2024-01-07T11:20:00Z'
  },
  {
    id: 'weird-10',
    title: 'Burger Biryani',
    description: 'A street food fusion that combines the juicy patty of a burger with aromatic biryani rice, creating a layered dish where burger patties are cooked with basmati rice and spices.',
    ingredients: [
      '4 burger patties',
      '2 cups basmati rice',
      '1 cup yogurt',
      '2 onions',
      '2 tomatoes',
      '1 tsp ginger-garlic paste',
      '1/2 cup mint leaves',
      '1/2 cup coriander leaves',
      'Biryani masala',
      '4 tbsp ghee'
    ],
    instructions: 'Step 1: Soak basmati rice for 30 minutes.\nStep 2: Fry burger patties until golden and set aside.\nStep 3: In a pot, layer half the rice, then patties, then remaining rice.\nStep 4: Mix yogurt with biryani masala and pour over layers.\nStep 5: Top with fried onions, tomatoes, mint, and coriander.\nStep 6: Drizzle ghee and cover tightly.\nStep 7: Cook on low heat for 20 minutes. Serve with raita.',
    cooking_time: 45,
    is_veg: false,
    image_url: '/weird-foods/burger-biryani.jpg',
    views_count: 1890,
    likes_count: 167,
    created_at: '2024-01-06T19:30:00Z'
  },
  {
    id: 'weird-11',
    title: 'Samosa Taco',
    description: 'A Mexican-Indian fusion where traditional samosa filling is served in crispy taco shells, topped with salsa, cheese, and sour cream for a cross-cultural culinary experience.',
    ingredients: [
      '6 taco shells',
      '2 potatoes',
      '1 cup peas',
      '2 onions',
      '1 tsp cumin seeds',
      '1 tsp garam masala',
      '1 cup cheese',
      '1 cup salsa',
      '1/2 cup sour cream',
      'Coriander leaves'
    ],
    instructions: 'Step 1: Boil and mash potatoes. Cook peas separately.\nStep 2: Heat oil, add cumin seeds and onions.\nStep 3: Add mashed potatoes, peas, and garam masala.\nStep 4: Cook until mixture is dry and well combined.\nStep 5: Fill taco shells with samosa mixture.\nStep 6: Top with cheese and bake until melted.\nStep 7: Serve with salsa, sour cream, and coriander.',
    cooking_time: 35,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1730878423239-0fd430bbac37?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1567,
    likes_count: 134,
    created_at: '2024-01-05T13:15:00Z'
  },
  {
    id: 'weird-12',
    title: 'Idli Soup',
    description: 'A comforting soup where soft idlis are simmered in a flavorful broth with vegetables and spices, transforming the traditional South Indian breakfast into a warming soup experience.',
    ingredients: [
      '8 idlis',
      '4 cups vegetable broth',
      '1 cup mixed vegetables',
      '1 onion',
      '2 tomatoes',
      '1 tsp ginger-garlic paste',
      '1/2 tsp turmeric',
      '1 tbsp lemon juice',
      'Coriander leaves',
      'Salt to taste'
    ],
    instructions: 'Step 1: Cut idlis into small cubes.\nStep 2: Heat oil and sauté onions until translucent.\nStep 3: Add ginger-garlic paste and tomatoes.\nStep 4: Add vegetables and cook for 5 minutes.\nStep 5: Pour vegetable broth and bring to boil.\nStep 6: Add idli cubes and simmer for 3 minutes.\nStep 7: Add lemon juice, garnish with coriander, and serve hot.',
    cooking_time: 25,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1548722104-856e02d9b6b1?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 980,
    likes_count: 76,
    created_at: '2024-01-04T10:45:00Z'
  },
  {
    id: 'weird-13',
    title: 'Gulab Jamun Burger',
    description: 'A dessert burger that replaces the patty with two large gulab jamuns, served in a sweet bun with rabri cream, nuts, and rose syrup for the ultimate Indian dessert experience.',
    ingredients: [
      '6 large gulab jamuns',
      '4 sweet buns',
      '1 cup rabri',
      '1/4 cup mixed nuts',
      '2 tbsp rose syrup',
      '1/4 cup whipped cream',
      '1 tsp cardamom powder',
      'Saffron strands',
      'Silver leaf (optional)'
    ],
    instructions: 'Step 1: Cut sweet buns in half and lightly toast.\nStep 2: Slice gulab jamuns horizontally.\nStep 3: Spread rabri on bottom bun halves.\nStep 4: Place gulab jamun halves on rabri.\nStep 5: Drizzle with rose syrup and sprinkle nuts.\nStep 6: Add whipped cream and cardamom powder.\nStep 7: Top with bun halves, garnish with saffron and silver leaf.',
    cooking_time: 20,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1740838535532-5f9ce109dc1c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 2100,
    likes_count: 189,
    created_at: '2024-01-03T17:00:00Z'
  },
  {
    id: 'weird-14',
    title: 'Coconut Paneer Steak',
    description: 'A unique preparation where paneer is marinated in coconut milk and spices, then grilled to perfection, creating a steak-like texture with tropical flavors.',
    ingredients: [
      '250 grams paneer',
      '1 cup coconut milk',
      '2 tbsp ginger-garlic paste',
      '1 tsp turmeric',
      '1 tsp red chili powder',
      '1 tbsp lemon juice',
      '1/4 cup grated coconut',
      '2 tbsp oil',
      'Salt to taste',
      'Fresh coriander'
    ],
    instructions: 'Step 1: Cut paneer into thick steak-like pieces.\nStep 2: Marinate paneer in coconut milk, ginger-garlic paste, turmeric, chili powder, and lemon juice for 2 hours.\nStep 3: Heat a grill pan with oil.\nStep 4: Grill marinated paneer for 3-4 minutes per side until golden.\nStep 5: Sprinkle grated coconut on top.\nStep 6: Serve hot with coriander garnish.\nStep 7: Pair with coconut rice or salad.',
    cooking_time: 150,
    is_veg: true,
    image_url: 'https://images.unsplash.com/photo-1571062891107-cb8852017de8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    views_count: 1234,
    likes_count: 101,
    created_at: '2024-01-02T15:30:00Z'
  },
  {
    id: 'weird-15',
    title: 'Mutton Cake',
    description: 'A savory cake that layers spiced mutton mince with potato sheets, creating a cake-like structure that combines the richness of mutton with the comfort of a baked dish.',
    ingredients: [
      '500 grams mutton mince',
      '4 large potatoes',
      '2 onions',
      '1 cup yogurt',
      '2 tbsp ginger-garlic paste',
      '1 tsp garam masala',
      '1/2 cup cream',
      '1/4 cup cheese',
      '3 eggs',
      'Fresh mint leaves'
    ],
    instructions: 'Step 1: Cook mutton mince with onions, ginger-garlic, and spices until dry.\nStep 2: Slice potatoes thinly and boil until tender.\nStep 3: Grease a cake tin and layer with potato slices.\nStep 4: Add a layer of cooked mutton mince.\nStep 5: Repeat layers, ending with potatoes.\nStep 6: Beat eggs with cream and cheese, pour over layers.\nStep 7: Bake at 180°C for 30 minutes. Garnish with mint.',
    cooking_time: 90,
    is_veg: false,
    image_url: '/weird-foods/mutton-cake.jpg',
    views_count: 1678,
    likes_count: 143,
    created_at: '2024-01-01T12:00:00Z'
  }
];

export const weirdFoodReviews: WeirdFoodReview[] = [
  {
    id: 'review-1',
    recipe_id: 'weird-1',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Absolutely mind-blowing! The combination of crispy samosa with molten chocolate is genius. Sweet and savory perfection!',
    created_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 'review-2',
    recipe_id: 'weird-1',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Great fusion concept! A bit too sweet for my taste but definitely worth trying.',
    created_at: '2024-01-15T12:30:00Z'
  },
  {
    id: 'review-3',
    recipe_id: 'weird-2',
    reviewer_name: 'Food Explorer',
    rating: 3,
    comment: 'Interesting concept but the texture was a bit grainy. The flavor was unique though.',
    created_at: '2024-01-14T16:00:00Z'
  },
  {
    id: 'review-4',
    recipe_id: 'weird-2',
    reviewer_name: 'Culinary Adventurer',
    rating: 2,
    comment: 'Sorry, but this didn\'t work for me. The paneer texture in ice cream felt odd.',
    created_at: '2024-01-14T17:30:00Z'
  },
  {
    id: 'review-5',
    recipe_id: 'weird-3',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Perfect monsoon comfort food! The tangy mango with spicy Maggi is surprisingly addictive.',
    created_at: '2024-01-13T13:00:00Z'
  },
  {
    id: 'review-6',
    recipe_id: 'weird-3',
    reviewer_name: 'Culinary Adventurer',
    rating: 5,
    comment: 'This is now my favorite Maggi variation! The raw mango adds the perfect tangy kick.',
    created_at: '2024-01-13T14:15:00Z'
  },
  {
    id: 'review-7',
    recipe_id: 'weird-4',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Breakfast game changer! Protein-packed and delicious. My kids love it!',
    created_at: '2024-01-12T09:45:00Z'
  },
  {
    id: 'review-8',
    recipe_id: 'weird-4',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Brilliant combination! Saves time and tastes amazing. Perfect for busy mornings.',
    created_at: '2024-01-12T10:30:00Z'
  },
  {
    id: 'review-9',
    recipe_id: 'weird-5',
    reviewer_name: 'Food Explorer',
    rating: 4,
    comment: 'Dessert dreams come true! So innovative and tasty. A must-try for sweet lovers.',
    created_at: '2024-01-11T18:30:00Z'
  },
  {
    id: 'review-10',
    recipe_id: 'weird-5',
    reviewer_name: 'Culinary Adventurer',
    rating: 3,
    comment: 'Creative but very heavy on sweetness. Good for special occasions.',
    created_at: '2024-01-11T19:45:00Z'
  },
  {
    id: 'review-11',
    recipe_id: 'weird-6',
    reviewer_name: 'Food Explorer',
    rating: 3,
    comment: 'Healthy and tasty breakfast option. The curd makes it very soft and fluffy.',
    created_at: '2024-01-10T07:45:00Z'
  },
  {
    id: 'review-12',
    recipe_id: 'weird-6',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Light and healthy! Great way to use leftover curd rice. Kids loved it too!',
    created_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 'review-13',
    recipe_id: 'weird-7',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Brilliant fusion! The crispy dosa base with melted cheese is amazing. Italian meets Indian perfectly!',
    created_at: '2024-01-09T15:00:00Z'
  },
  {
    id: 'review-14',
    recipe_id: 'weird-7',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Creative and delicious! Kids loved it. Great way to make dosas more interesting.',
    created_at: '2024-01-09T16:15:00Z'
  },
  {
    id: 'review-15',
    recipe_id: 'weird-8',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Mind-blowing dessert! Hot crispy samosa with cold ice cream is the perfect contrast. Must try!',
    created_at: '2024-01-08T17:00:00Z'
  },
  {
    id: 'review-16',
    recipe_id: 'weird-8',
    reviewer_name: 'Culinary Adventurer',
    rating: 3,
    comment: 'Interesting concept but tricky to make. The ice cream melts quickly if not frozen properly.',
    created_at: '2024-01-08T18:30:00Z'
  },
  {
    id: 'review-17',
    recipe_id: 'weird-9',
    reviewer_name: 'Food Explorer',
    rating: 2,
    comment: 'Sorry, but this didn\'t work for me. Chai flavor in pasta felt odd and the taste was confusing.',
    created_at: '2024-01-07T12:00:00Z'
  },
  {
    id: 'review-18',
    recipe_id: 'weird-9',
    reviewer_name: 'Culinary Adventurer',
    rating: 3,
    comment: 'Bold experiment! The aroma is amazing but the flavor combination is an acquired taste.',
    created_at: '2024-01-07T13:30:00Z'
  },
  {
    id: 'review-19',
    recipe_id: 'weird-10',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Incredible fusion! The best of both worlds - juicy burgers and aromatic biryani in one dish!',
    created_at: '2024-01-06T20:00:00Z'
  },
  {
    id: 'review-20',
    recipe_id: 'weird-10',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Hearty and satisfying! Great for parties. Everyone loved this unique combination.',
    created_at: '2024-01-06T21:15:00Z'
  },
  {
    id: 'review-21',
    recipe_id: 'weird-11',
    reviewer_name: 'Food Explorer',
    rating: 4,
    comment: 'Perfect fusion! Mexican tacos with Indian samosa filling - why didn\'t anyone think of this before?',
    created_at: '2024-01-05T14:00:00Z'
  },
  {
    id: 'review-22',
    recipe_id: 'weird-11',
    reviewer_name: 'Culinary Adventurer',
    rating: 5,
    comment: 'Absolutely delicious! The combination is amazing. Great party food that everyone enjoys.',
    created_at: '2024-01-05T15:30:00Z'
  },
  {
    id: 'review-23',
    recipe_id: 'weird-12',
    reviewer_name: 'Food Explorer',
    rating: 4,
    comment: 'Comforting and innovative! Perfect for cold days. The idlis soak up the flavors beautifully.',
    created_at: '2024-01-04T11:00:00Z'
  },
  {
    id: 'review-24',
    recipe_id: 'weird-12',
    reviewer_name: 'Culinary Adventurer',
    rating: 3,
    comment: 'Interesting twist on idli. Good for using leftover idlis. The soup is quite flavorful.',
    created_at: '2024-01-04T12:30:00Z'
  },
  {
    id: 'review-25',
    recipe_id: 'weird-13',
    reviewer_name: 'Food Explorer',
    rating: 5,
    comment: 'Dessert heaven! The ultimate Indian sweet burger. Rich, decadent, and absolutely divine!',
    created_at: '2024-01-03T18:00:00Z'
  },
  {
    id: 'review-26',
    recipe_id: 'weird-13',
    reviewer_name: 'Culinary Adventurer',
    rating: 4,
    comment: 'Incredibly sweet and rich! Perfect for special occasions. A bit heavy but worth every bite.',
    created_at: '2024-01-03T19:30:00Z'
  },
  {
    id: 'review-27',
    recipe_id: 'weird-14',
    reviewer_name: 'Food Explorer',
    rating: 4,
    comment: 'Unique preparation! The coconut marinade makes the paneer incredibly flavorful and tender.',
    created_at: '2024-01-02T16:00:00Z'
  },
  {
    id: 'review-28',
    recipe_id: 'weird-14',
    reviewer_name: 'Culinary Adventurer',
    rating: 5,
    comment: 'Restaurant-quality dish! The grilling technique is perfect. Tropical flavors work beautifully.',
    created_at: '2024-01-02T17:30:00Z'
  },
  {
    id: 'review-29',
    recipe_id: 'weird-15',
    reviewer_name: 'Food Explorer',
    rating: 4,
    comment: 'Hearty and delicious! Perfect for meat lovers. The layered texture is amazing.',
    created_at: '2024-01-01T13:00:00Z'
  },
  {
    id: 'review-30',
    recipe_id: 'weird-15',
    reviewer_name: 'Culinary Adventurer',
    rating: 3,
    comment: 'Interesting concept! Takes time to prepare but the result is satisfying. Good for special dinners.',
    created_at: '2024-01-01T14:30:00Z'
  }
];

export const getWeirdFoodById = (id: string): WeirdFoodRecipe | undefined => {
  return weirdFoodRecipes.find(recipe => recipe.id === id);
};

export const getReviewsForWeirdFood = (recipeId: string): WeirdFoodReview[] => {
  return weirdFoodReviews.filter(review => review.recipe_id === recipeId);
};

export const getAverageRatingForWeirdFood = (recipeId: string): number => {
  const reviews = getReviewsForWeirdFood(recipeId);
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};
