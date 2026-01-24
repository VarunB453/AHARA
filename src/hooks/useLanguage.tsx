import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'english' | 'hindi' | 'marathi' | 'telugu' | 'malayalam' | 'punjabi' | 'gujarati';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Navigation
    'nav.home': 'Home',
    'nav.recipes': 'Recipes',
    'nav.chefs': 'Chefs',
    'nav.regions': 'Regions',
    'nav.crazy': 'Crazy',
    'nav.contact': 'Contact',
    'nav.favorites': 'Favorites',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',
    'nav.signIn': 'Sign In',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.rating': 'Rating',
    'common.time': 'Time',
    'common.servings': 'Servings',
    'common.spiceLevel': 'Spice Level',
    'common.region': 'Region',
    
    // Recipe
    'recipe.title': 'Recipe',
    'recipes.title': 'Recipes',
    'recipe.cookingTime': 'Cooking Time',
    'recipe.description': 'Description',
    'recipe.ingredients': 'Ingredients',
    'recipe.instructions': 'Instructions',
    'recipe.chef': 'Chef',
    'recipe.addedToFavorites': 'Added to favorites',
    'recipe.removedFromFavorites': 'Removed from favorites',
    
    // Favorites
    'favorites.title': 'My Favorites',
    'favorites.empty': 'No favorites yet',
    'favorites.emptyDescription': 'Start exploring and save your favorite recipes to see them here!',
    'favorites.noResults': 'No recipes match your filters',
    'favorites.noResultsDescription': 'Try adjusting your filters or search terms',
    'favorites.count': 'favorite recipes',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile Settings',
    'settings.security': 'Security',
    'settings.appearance': 'Appearance',
    'settings.dataPrivacy': 'Data & Privacy',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.darkModeDescription': 'Toggle dark theme for the interface',
    'settings.languageDescription': 'Select your preferred language',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.welcomeBack': 'Welcome back',
    
    // Errors
    'error.required': 'This field is required',
    'error.invalidEmail': 'Please enter a valid email',
    'error.network': 'Network error. Please try again.',
  },
  
  hindi: {
    // Navigation
    'nav.home': 'होम',
    'nav.recipes': 'रेसिपीज़',
    'nav.chefs': 'शेफ़',
    'nav.regions': 'क्षेत्र',
    'nav.crazy': 'क्रेज़ी',
    'nav.contact': 'संपर्क',
    'nav.favorites': 'पसंदीदा',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.settings': 'सेटिंग्स',
    'nav.signOut': 'साइन आउट',
    'nav.signIn': 'साइन इन',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.rating': 'रेटिंग',
    'common.time': 'समय',
    'common.servings': 'परोस',
    'common.spiceLevel': 'मसाला स्तर',
    'common.region': 'क्षेत्र',
    
    // Recipe
    'recipe.title': 'रेसिपी',
    'recipes.title': 'रेसिपीज़',
    'recipe.cookingTime': 'खाना बनाने का समय',
    'recipe.description': 'विवरण',
    'recipe.ingredients': 'सामग्री',
    'recipe.instructions': 'निर्देश',
    'recipe.chef': 'शेफ़',
    'recipe.addedToFavorites': 'पसंदीदा में जोड़ा गया',
    'recipe.removedFromFavorites': 'पसंदीदा से हटाया गया',
    
    // Favorites
    'favorites.title': 'मेरे पसंदीदा',
    'favorites.empty': 'अभी तक कोई पसंदीदा नहीं',
    'favorites.emptyDescription': 'अन्वेषण शुरू करें और अपनी पसंदीदा रेसिपीज़ को यहां देखने के लिए सेव करें!',
    'favorites.noResults': 'कोई रेसिपी आपके फ़िल्टर से मेल नहीं खाती',
    'favorites.noResultsDescription': 'अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें',
    'favorites.count': 'पसंदीदा रेसिपीज़',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.profile': 'प्रोफ़ाइल सेटिंग्स',
    'settings.security': 'सुरक्षा',
    'settings.appearance': 'दिखावट',
    'settings.dataPrivacy': 'डेटा और गोपनीयता',
    'settings.darkMode': 'डार्क मोड',
    'settings.language': 'भाषा',
    'settings.darkModeDescription': 'इंटरफ़ेस के लिए डार्क थीम टॉगल करें',
    'settings.languageDescription': 'अपनी पसंदीदा भाषा चुनें',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.welcomeBack': 'वापसी पर स्वागत है',
    
    // Errors
    'error.required': 'यह फ़ील्ड आवश्यक है',
    'error.invalidEmail': 'कृपया एक वैध ईमेल दर्ज करें',
    'error.network': 'नेटवर्क त्रुटि। कृपया फिर से कोशिश करें।',
  },
  
  marathi: {
    // Navigation
    'nav.home': 'होम',
    'nav.recipes': 'रेसिपी',
    'nav.chefs': 'शेफ',
    'nav.regions': 'प्रदेश',
    'nav.crazy': 'विचित्र',
    'nav.contact': 'संपर्क',
    'nav.favorites': 'आवडते',
    'nav.profile': 'प्रोफाइल',
    'nav.settings': 'सेटिंग्स',
    'nav.signOut': 'बाहेर पडा',
    'nav.signIn': 'साइन इन',
    
    // Common
    'common.loading': 'लोड होत आहे...',
    'common.search': 'शोधा',
    'common.filter': 'फिल्टर',
    'common.save': 'जतन करा',
    'common.cancel': 'रद्द करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.view': 'पहा',
    'common.rating': 'रेटिंग',
    'common.time': 'वेळ',
    'common.servings': 'वाढणी',
    'common.spiceLevel': 'मसाला पातळी',
    'common.region': 'प्रदेश',
    
    // Recipe
    'recipe.title': 'रेसिपी',
    'recipes.title': 'रेसिपी',
    'recipe.cookingTime': 'शिजवण्याची वेळ',
    'recipe.description': 'वर्णन',
    'recipe.ingredients': 'साहित्य',
    'recipe.instructions': 'सूचना',
    'recipe.chef': 'शेफ',
    'recipe.addedToFavorites': 'आवडत्यात जोडले',
    'recipe.removedFromFavorites': 'आवडत्यातून काढले',
    
    // Favorites
    'favorites.title': 'माझे आवडते',
    'favorites.empty': 'अजून कोणतेही आवडते नाहीत',
    'favorites.emptyDescription': 'शोध घ्या आणि आपल्या आवडत्या रेसिपी येथे पाहण्यासाठी जतन करा!',
    'favorites.noResults': 'कोणतीही रेसिपी आपल्या फिल्टरशी जुळत नाही',
    'favorites.noResultsDescription': 'आपले फिल्टर किंवा शोद शब्द समायोजित करण्याचा प्रयत्न करा',
    'favorites.count': 'आवडत्या रेसिपी',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.profile': 'प्रोफाइल सेटिंग्स',
    'settings.security': 'सुरक्षा',
    'settings.appearance': 'दर्शनीयता',
    'settings.dataPrivacy': 'डेटा आणि गोपनीयता',
    'settings.darkMode': 'डार्क मोड',
    'settings.language': 'भाषा',
    'settings.darkModeDescription': 'इंटरफेससाठी डार्क थीम टॉगल करा',
    'settings.languageDescription': 'आपली पसंतीची भाषा निवडा',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.forgotPassword': 'पासवर्ड विसरलात?',
    'auth.welcomeBack': 'पुन्हा स्वागत',
    
    // Errors
    'error.required': 'हे फील्ड आवश्यक आहे',
    'error.invalidEmail': 'कृपया वैध ईमेल प्रविष्ट करा',
    'error.network': 'नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.',
  },

  telugu: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.recipes': 'రెసిపీలు',
    'nav.chefs': 'షెఫ్‌లు',
    'nav.regions': 'ప్రాంతాలు',
    'nav.crazy': 'పిచ్చి',
    'nav.contact': 'సంప్రదింపులు',
    'nav.favorites': 'ఇష్టాలు',
    'nav.profile': 'ప్రొఫైల్',
    'nav.settings': 'సెట్టింగ్‌లు',
    'nav.signOut': 'సైన్ అవుట్',
    'nav.signIn': 'సైన్ ఇన్',
    
    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.search': 'వెతకండి',
    'common.filter': 'ఫిల్టర్',
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.delete': 'తొలగించండి',
    'common.edit': 'ఎడిట్ చేయండి',
    'common.view': 'చూడండి',
    'common.rating': 'రేటింగ్',
    'common.time': 'సమయం',
    'common.servings': 'సర్వింగ్‌లు',
    'common.spiceLevel': 'మసాలా స్థాయి',
    'common.region': 'ప్రాంతం',
    
    // Recipe
    'recipe.title': 'రెసిపీ',
    'recipes.title': 'రెసిపీలు',
    'recipe.cookingTime': 'వంట సమయం',
    'recipe.description': 'వివరణ',
    'recipe.ingredients': 'పదార్థాలు',
    'recipe.instructions': 'సూచనలు',
    'recipe.chef': 'షెఫ్',
    'recipe.addedToFavorites': 'ఇష్టాలలో జోడించబడింది',
    'recipe.removedFromFavorites': 'ఇష్టాల నుండి తీసివేయబడింది',
    
    // Favorites
    'favorites.title': 'నా ఇష్టాలు',
    'favorites.empty': 'ఇంకా ఇష్టాలు లేవు',
    'favorites.emptyDescription': 'అన్వేషించండి మరియు మీ ఇష్టమైన రెసిపీలను ఇక్కడ చూడటానికి సేవ్ చేయండి!',
    'favorites.noResults': 'మీ ఫిల్టర్‌కు సరిపోయే రెసిపీలు లేవు',
    'favorites.noResultsDescription': 'మీ ఫిల్టర్‌లు లేదా శోధ పదాలను సర్దుబాటు చేయండి',
    'favorites.count': 'ఇష్టమైన రెసిపీలు',
    
    // Settings
    'settings.title': 'సెట్టింగ్‌లు',
    'settings.profile': 'ప్రొఫైల్ సెట్టింగ్‌లు',
    'settings.security': 'భద్రత',
    'settings.appearance': 'రూపు',
    'settings.dataPrivacy': 'డేటా మరియు గోప్యత',
    'settings.darkMode': 'డార్క్ మోడ్',
    'settings.language': 'భాష',
    'settings.darkModeDescription': 'ఇంటర్‌ఫేస్ కోసం డార్క్ థీమ్‌ను టాగుల్ చేయండి',
    'settings.languageDescription': 'మీ ఇష్టమైన భాషను ఎంచుకోండి',
    
    // Auth
    'auth.signIn': 'సైన్ ఇన్',
    'auth.signUp': 'సైన్ అప్',
    'auth.email': 'ఇమెయిల్',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.forgotPassword': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'auth.welcomeBack': 'తిరిగి స్వాగతం',
    
    // Errors
    'error.required': 'ఈ ఫీల్డ్ అవసరం',
    'error.invalidEmail': 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్‌ను నమోదు చేయండి',
    'error.network': 'నెట్‌వర్క్ లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },

  malayalam: {
    // Navigation
    'nav.home': 'ഹോം',
    'nav.recipes': 'റെസിപ്പികൾ',
    'nav.chefs': 'ഷെഫുകൾ',
    'nav.regions': 'പ്രദേശങ്ങൾ',
    'nav.crazy': 'ക്രേസി',
    'nav.contact': 'ബന്ധപ്പെടുക',
    'nav.favorites': 'പ്രിയപ്പെട്ടവ',
    'nav.profile': 'പ്രൊഫൈൽ',
    'nav.settings': 'ക്രമീകരണങ്ങൾ',
    'nav.signOut': 'സൈൻ ഔട്ട്',
    'nav.signIn': 'സൈൻ ഇൻ',
    
    // Common
    'common.loading': 'ലോഡ് ചെയ്യുന്നു...',
    'common.search': 'തിരയുക',
    'common.filter': 'ഫിൽട്ടർ',
    'common.save': 'സംരക്ഷിക്കുക',
    'common.cancel': 'റദ്ദാക്കുക',
    'common.delete': 'ഇല്ലാതാക്കുക',
    'common.edit': 'എഡിറ്റ് ചെയ്യുക',
    'common.view': 'കാണുക',
    'common.rating': 'റേറ്റിംഗ്',
    'common.time': 'സമയം',
    'common.servings': 'വിളക്കുകൾ',
    'common.spiceLevel': 'സ്പൈസ് ലെവൽ',
    'common.region': 'പ്രദേശം',
    
    // Recipe
    'recipe.title': 'റെസിപ്പി',
    'recipes.title': 'റെസിപ്പികൾ',
    'recipe.cookingTime': 'പാചക സമയം',
    'recipe.description': 'വിവരണം',
    'recipe.ingredients': 'ചേരുവകൾ',
    'recipe.instructions': 'നിർദ്ദേശങ്ങൾ',
    'recipe.chef': 'ഷെഫ്',
    'recipe.addedToFavorites': 'പ്രിയപ്പെട്ടവയിൽ ചേർത്തു',
    'recipe.removedFromFavorites': 'പ്രിയപ്പെട്ടവയിൽ നിന്ന് നീക്കം ചെയ്തു',
    
    // Favorites
    'favorites.title': 'എന്റെ പ്രിയപ്പെട്ടവ',
    'favorites.empty': 'ഇതുവരെ പ്രിയപ്പെട്ടവയൊന്നുമില്ല',
    'favorites.emptyDescription': 'അന്വേഷിക്കുകയും നിങ്ങളുടെ പ്രിയപ്പെട്ട റെസിപ്പികൾ ഇവിടെ കാണാൻ സംരക്ഷിക്കുകയും ചെയ്യുക!',
    'favorites.noResults': 'നിങ്ങളുടെ ഫിൽട്ടറുമായി പൊരുത്തമുള്ള റെസിപ്പികളൊന്നുമില്ല',
    'favorites.noResultsDescription': 'നിങ്ങളുടെ ഫിൽട്ടറുകൾ അല്ലെങ്കിൽ തിരച്ചിൽ വാക്കുകൾ ക്രമീകരിക്കുക',
    'favorites.count': 'പ്രിയപ്പെട്ട റെസിപ്പികൾ',
    
    // Settings
    'settings.title': 'ക്രമീകരണങ്ങൾ',
    'settings.profile': 'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ',
    'settings.security': 'സുരക്ഷ',
    'settings.appearance': 'രൂപഭാവം',
    'settings.dataPrivacy': 'ഡാറ്റയും സ്വകാര്യതയും',
    'settings.darkMode': 'ഡാർക്ക് മോഡ്',
    'settings.language': 'ഭാഷ',
    'settings.darkModeDescription': 'ഇന്റർഫേസിനായി ഡാർക്ക് തീം ടോഗിൾ ചെയ്യുക',
    'settings.languageDescription': 'നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Auth
    'auth.signIn': 'സൈൻ ഇൻ',
    'auth.signUp': 'സൈൻ അപ്പ്',
    'auth.email': 'ഇമെയിൽ',
    'auth.password': 'പാസ്‌വേഡ്',
    'auth.forgotPassword': 'പാസ്‌വേഡ് മറന്നോ?',
    'auth.welcomeBack': 'തിരിച്ചുവരവിൽ സ്വാഗതം',
    
    // Errors
    'error.required': 'ഈ ഫീൽഡ് നിർബന്ധമാണ്',
    'error.invalidEmail': 'ദയവായി സാധുവായ ഇമെയിൽ നൽകുക',
    'error.network': 'നെറ്റ്‌വർക്ക് പിശക്. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
  },

  punjabi: {
    // Navigation
    'nav.home': 'ਹੋਮ',
    'nav.recipes': 'ਰੈਸਪੀਆਂ',
    'nav.chefs': 'ਸ਼ੈਫ',
    'nav.regions': 'ਖੇਤਰ',
    'nav.crazy': 'ਪਾਗਲ',
    'nav.contact': 'ਸੰਪਰਕ',
    'nav.favorites': 'ਮਨਪਸੰਦ',
    'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
    'nav.settings': 'ਸੈਟਿੰਗਾਂ',
    'nav.signOut': 'ਸਾਈਨ ਆਊਟ',
    'nav.signIn': 'ਸਾਈਨ ਇਨ',
    
    // Common
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.search': 'ਖੋਜੋ',
    'common.filter': 'ਫਿਲਟਰ',
    'common.save': 'ਸੇਵ ਕਰੋ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.delete': 'ਹਟਾਓ',
    'common.edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
    'common.view': 'ਵੇਖੋ',
    'common.rating': 'ਰੇਟਿੰਗ',
    'common.time': 'ਸਮਾਂ',
    'common.servings': 'ਸਰਵਿੰਗਜ਼',
    'common.spiceLevel': 'ਮਸਾਲਾ ਪੱਧਰ',
    'common.region': 'ਖੇਤਰ',
    
    // Recipe
    'recipe.title': 'ਰੈਸਪੀ',
    'recipes.title': 'ਰੈਸਪੀਆਂ',
    'recipe.cookingTime': 'ਪਕਾਉਣ ਦਾ ਸਮਾਂ',
    'recipe.description': 'ਵੇਰਵਾ',
    'recipe.ingredients': 'ਸਮੱਗਰੀ',
    'recipe.instructions': 'ਹਦਾਇਤਾਂ',
    'recipe.chef': 'ਸ਼ੈਫ',
    'recipe.addedToFavorites': 'ਮਨਪਸੰਦ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ',
    'recipe.removedFromFavorites': 'ਮਨਪਸੰਦ ਤੋਂ ਹਟਾਇਆ ਗਿਆ',
    
    // Favorites
    'favorites.title': 'ਮੇਰੇ ਮਨਪਸੰਦ',
    'favorites.empty': 'ਹਾਲੇ ਤੱਕ ਕੋਈ ਮਨਪਸੰਦ ਨਹੀਂ ਹੈ',
    'favorites.emptyDescription': 'ਖੋਜ ਕਰੋ ਅਤੇ ਆਪਣੀਆਂ ਮਨਪਸੰਦ ਰੈਸਪੀਆਂ ਨੂੰ ਇੱਥੇ ਵੇਖਣ ਲਈ ਸੇਵ ਕਰੋ!',
    'favorites.noResults': 'ਤੁਹਾਡੇ ਫਿਲਟਰ ਨਾਲ ਮੇਲ ਖਾਂਦੀਆਂ ਰੈਸਪੀਆਂ ਨਹੀਂ ਹਨ',
    'favorites.noResultsDescription': 'ਆਪਣੇ ਫਿਲਟਰ ਜਾਂ ਖੋਜ ਸ਼ਬਦਾਂ ਨੂੰ ਅਨੁਕੂਲ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    'favorites.count': 'ਮਨਪਸੰਦ ਰੈਸਪੀਆਂ',
    
    // Settings
    'settings.title': 'ਸੈਟਿੰਗਾਂ',
    'settings.profile': 'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ',
    'settings.security': 'ਸੁਰੱਖਿਆ',
    'settings.appearance': 'ਦਿੱਖ',
    'settings.dataPrivacy': 'ਡੇਟਾ ਅਤੇ ਪ੍ਰਾਈਵੇਸੀ',
    'settings.darkMode': 'ਡਾਰਕ ਮੋਡ',
    'settings.language': 'ਭਾਸ਼ਾ',
    'settings.darkModeDescription': 'ਇੰਟਰਫੇਸ ਲਈ ਡਾਰਕ ਥੀਮ ਟਾਗਲ ਕਰੋ',
    'settings.languageDescription': 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    
    // Auth
    'auth.signIn': 'ਸਾਈਨ ਇਨ',
    'auth.signUp': 'ਸਾਈਨ ਅੱਪ',
    'auth.email': 'ਈਮੇਲ',
    'auth.password': 'ਪਾਸਵਰਡ',
    'auth.forgotPassword': 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    'auth.welcomeBack': 'ਵਾਪਸੀ ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ',
    
    // Errors
    'error.required': 'ਇਹ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹੈ',
    'error.invalidEmail': 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਈਮੇਲ ਦਾਖਲ ਕਰੋ',
    'error.network': 'ਨੈੱਟਵਰਕ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  },

  gujarati: {
    // Navigation
    'nav.home': 'હોમ',
    'nav.recipes': 'રેસિપીઓ',
    'nav.chefs': 'શેફ',
    'nav.regions': 'પ્રદેશો',
    'nav.crazy': 'પાગલ',
    'nav.contact': 'સંપર્ક',
    'nav.favorites': 'મનપસંદ',
    'nav.profile': 'પ્રોફાઇલ',
    'nav.settings': 'સેટિંગ્સ',
    'nav.signOut': 'સાઇન આઉટ',
    'nav.signIn': 'સાઇન ઇન',
    
    // Common
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.search': 'શોધો',
    'common.filter': 'ફિલ્ટર',
    'common.save': 'સેવ કરો',
    'common.cancel': 'રદ કરો',
    'common.delete': 'કાઢી નાખો',
    'common.edit': 'સંપાદિત કરો',
    'common.view': 'જુઓ',
    'common.rating': 'રેટિંગ',
    'common.time': 'સમય',
    'common.servings': 'સર્વિંગ્સ',
    'common.spiceLevel': 'મસાલા સ્તર',
    'common.region': 'પ્રદેશ',
    
    // Recipe
    'recipe.title': 'રેસિપી',
    'recipes.title': 'રેસિપીઓ',
    'recipe.cookingTime': 'રાંધવાનો સમય',
    'recipe.description': 'વર્ણન',
    'recipe.ingredients': 'સામગ્રી',
    'recipe.instructions': 'સૂચનાઓ',
    'recipe.chef': 'શેફ',
    'recipe.addedToFavorites': 'મનપસંદમાં ઉમેરાયેલ',
    'recipe.removedFromFavorites': 'મનપસંદમાંથી દૂર કરાયેલ',
    
    // Favorites
    'favorites.title': 'મારા મનપસંદ',
    'favorites.empty': 'હજી સુધી કોઈ મનપસંદ નથી',
    'favorites.emptyDescription': 'શોધો અને તમારી મનપસંદ રેસિપીઓ અહીં જોવા માટે સેવ કરો!',
    'favorites.noResults': 'તમારા ફિલ્ટર સાથે બંધબેસતી રેસિપીઓ નથી',
    'favorites.noResultsDescription': 'તમારા ફિલ્ટર અથવા શોધ શબ્દોને સમાયોજિત કરવાનો પ્રયાસ કરો',
    'favorites.count': 'મનપસંદ રેસિપીઓ',
    
    // Settings
    'settings.title': 'સેટિંગ્સ',
    'settings.profile': 'પ્રોફાઇલ સેટિંગ્સ',
    'settings.security': 'સુરક્ષા',
    'settings.appearance': 'દેખાવ',
    'settings.dataPrivacy': 'ડેટા અને ગોપનીયતા',
    'settings.darkMode': 'ડાર્ક મોડ',
    'settings.language': 'ભાષા',
    'settings.darkModeDescription': 'ઇન્ટરફેસ માટે ડાર્ક થીમ ટૉગલ કરો',
    'settings.languageDescription': 'તમારી પસંદગીની ભાષા પસંદ કરો',
    
    // Auth
    'auth.signIn': 'સાઇન ઇન',
    'auth.signUp': 'સાઇન અપ',
    'auth.email': 'ઇમેલ',
    'auth.password': 'પાસવર્ડ',
    'auth.forgotPassword': 'પાસવર્ડ ભૂલી ગયા?',
    'auth.welcomeBack': 'પાછા આવવામાં સ્વાગત છે',
    
    // Errors
    'error.required': 'આ ફીલ્ડ આવશ્યક છે',
    'error.invalidEmail': 'કૃપા કરીને માન્ય ઇમેલ દાખલ કરો',
    'error.network': 'નેટવર્ક ભૂલ. કૃપા કરીને ફરીથી પ્રયાસ કરો.',
  },
  
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('english');

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['english', 'hindi', 'marathi', 'telugu', 'malayalam', 'punjabi', 'gujarati'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    return translation || key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
