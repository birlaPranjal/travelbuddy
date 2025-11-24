/**
 * Enhanced Custom NLP Model for Travel-Related Queries
 * Trained with extensive patterns and improved algorithms for better precision
 */

// Travel Intent Types
export enum TravelIntent {
  DESTINATION_INFO = 'destination_info',
  BEST_TIME_TO_VISIT = 'best_time',
  FOOD_CUISINE = 'food_cuisine',
  ACCOMMODATION = 'accommodation',
  TRANSPORTATION = 'transportation',
  CULTURE_TIPS = 'culture_tips',
  ITINERARY_PLANNING = 'itinerary',
  BUDGET_COST = 'budget',
  ATTRACTIONS = 'attractions',
  SAFETY_TIPS = 'safety',
  WEATHER = 'weather',
  FESTIVALS = 'festivals',
  SHOPPING = 'shopping',
  GREETING = 'greeting',
  GENERAL = 'general'
}

// Extended Indian Destinations Knowledge Base
const DESTINATIONS: Record<string, {
  description: string;
  bestTime: string;
  attractions: string[];
  cuisine: string[];
  tips: string[];
  synonyms: string[]; // Alternative names
}> = {
  'goa': {
    description: 'Goa is a coastal paradise known for its pristine beaches, vibrant nightlife, and Portuguese heritage. It offers a perfect blend of relaxation and adventure.',
    bestTime: 'November to February (winter season) - perfect weather, 15-30°C, ideal for beach activities',
    attractions: ['Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Spice Plantations', 'Old Goa'],
    cuisine: ['Fish Curry', 'Bebinca', 'Prawn Balchão', 'Goan Sausages', 'Feni', 'Sorpotel', 'Xacuti'],
    tips: ['Rent a scooter for beach hopping', 'Try water sports at Baga Beach', 'Visit spice plantations', 'Respect beach regulations', 'Book accommodation in advance during peak season'],
    synonyms: ['goa beaches', 'goan', 'panaji', 'panjim']
  },
  'kerala': {
    description: 'Kerala, "God\'s Own Country", is famous for backwaters, tea plantations, Ayurvedic treatments, and rich cultural heritage.',
    bestTime: 'October to March - pleasant weather, ideal for backwaters and sightseeing, 20-32°C',
    attractions: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Kochi Fort', 'Wayanad Wildlife', 'Periyar National Park', 'Kovalam Beach', 'Varkala Beach'],
    cuisine: ['Appam with Stew', 'Kerala Sadya', 'Karimeen Pollichathu', 'Puttu', 'Kerala Parotta', 'Idiyappam', 'Kerala Fish Curry'],
    tips: ['Book houseboat in advance', 'Try Ayurvedic treatments', 'Visit during Onam festival', 'Carry light cotton clothes', 'Experience traditional Kathakali dance'],
    synonyms: ['god\'s own country', 'kerala backwaters', 'alleppey', 'munnar', 'kochi', 'cochin']
  },
  'rajasthan': {
    description: 'Rajasthan is the land of kings with magnificent palaces, forts, desert landscapes, and vibrant culture.',
    bestTime: 'October to March - avoid summer heat, 10-25°C, perfect for sightseeing',
    attractions: ['Jaipur City Palace', 'Udaipur Lake Palace', 'Jaisalmer Fort', 'Pushkar Camel Fair', 'Ranthambore National Park', 'Amber Fort', 'Hawa Mahal'],
    cuisine: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri', 'Mawa Kachori', 'Pyaaz Kachori', 'Ghevar'],
    tips: ['Wear comfortable walking shoes', 'Book heritage hotels', 'Attend cultural shows', 'Bargain at local markets', 'Experience camel safari in Jaisalmer'],
    synonyms: ['rajasthani', 'jaipur', 'udaipur', 'jaisalmer', 'pushkar', 'pink city']
  },
  'delhi': {
    description: 'Delhi, India\'s capital, blends ancient history with modern culture, offering a rich tapestry of experiences.',
    bestTime: 'October to March - pleasant weather, avoid monsoon (July-September), 10-25°C',
    attractions: ['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple', 'Akshardham Temple', 'Chandni Chowk', 'Humayun\'s Tomb', 'Jama Masjid'],
    cuisine: ['Chole Bhature', 'Butter Chicken', 'Parathas', 'Chaat', 'Kebabs', 'Dahi Bhalla', 'Nihari', 'Kulfi'],
    tips: ['Use metro for transportation', 'Try street food carefully', 'Visit early morning for monuments', 'Bargain at markets', 'Explore Old Delhi on foot'],
    synonyms: ['new delhi', 'old delhi', 'dilli', 'capital']
  },
  'mumbai': {
    description: 'Mumbai, the financial capital, offers beaches, Bollywood, vibrant street food, and a bustling city life.',
    bestTime: 'November to February - cool and pleasant, avoid monsoon (June-September), 20-30°C',
    attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Bollywood Studios', 'Colaba Causeway', 'Juhu Beach', 'Siddhivinayak Temple'],
    cuisine: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Sev Puri', 'Bombay Duck Curry', 'Misal Pav', 'Ragda Pattice'],
    tips: ['Use local trains for commute', 'Try street food at Juhu Beach', 'Visit during Ganesh Chaturthi', 'Book hotels in advance', 'Explore Colaba and Fort area'],
    synonyms: ['bombay', 'mumbai city', 'bollywood']
  },
  'varanasi': {
    description: 'Varanasi, the spiritual capital, is one of the oldest continuously inhabited cities, known for Ganga ghats and temples.',
    bestTime: 'October to March - avoid extreme heat, pleasant for spiritual activities, 15-30°C',
    attractions: ['Ganga Ghats', 'Kashi Vishwanath Temple', 'Sarnath', 'Evening Aarti', 'Boat rides on Ganges', 'Dashashwamedh Ghat', 'Manikarnika Ghat'],
    cuisine: ['Kachori Sabzi', 'Malaiyo', 'Banarasi Paan', 'Thandai', 'Lassi', 'Tamatar Chaat', 'Banarasi Thandai'],
    tips: ['Attend morning Ganga Aarti', 'Respect religious customs', 'Take boat ride at sunrise', 'Wear modest clothing', 'Experience the spiritual atmosphere'],
    synonyms: ['banaras', 'kashi', 'varanasi ghats', 'spiritual capital']
  },
  'himachal pradesh': {
    description: 'Himachal Pradesh offers stunning mountain landscapes, hill stations, adventure sports, and serene natural beauty.',
    bestTime: 'March to June and September to November - pleasant weather, avoid monsoon and extreme winter, 10-25°C',
    attractions: ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley', 'Kasol', 'Rohtang Pass', 'Dalhousie', 'Kullu'],
    cuisine: ['Siddu', 'Dham', 'Thukpa', 'Momos', 'Tudkiya Bhath', 'Aktori', 'Babru'],
    tips: ['Carry warm clothes', 'Check road conditions', 'Acclimatize to altitude', 'Book accommodation in advance', 'Try adventure sports'],
    synonyms: ['himachal', 'shimla', 'manali', 'dharamshala', 'spiti', 'kasol', 'hill station']
  },
  'taj mahal': {
    description: 'The Taj Mahal in Agra is one of the Seven Wonders of the World, a symbol of eternal love and architectural marvel.',
    bestTime: 'October to March - best weather, early morning visits recommended for best lighting, 10-25°C',
    attractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Itmad-ud-Daulah Tomb', 'Mehtab Bagh'],
    cuisine: ['Petha', 'Bedai', 'Mughlai Cuisine', 'Tandoori dishes', 'Agra Ka Petha', 'Dalmoth'],
    tips: ['Visit at sunrise for best photos', 'Book tickets online', 'Hire a guide', 'Avoid Mondays (closed)', 'Spend 2-3 hours exploring'],
    synonyms: ['agra', 'taj', 'tajmahal', 'wonder of the world']
  },
  'ladakh': {
    description: 'Ladakh is a high-altitude desert region known for stunning landscapes, Buddhist monasteries, and adventure activities.',
    bestTime: 'May to September - best weather, roads accessible, 5-20°C',
    attractions: ['Pangong Lake', 'Nubra Valley', 'Leh Palace', 'Hemis Monastery', 'Magnetic Hill', 'Khardung La Pass'],
    cuisine: ['Thukpa', 'Momos', 'Butter Tea', 'Skyu', 'Chutagi', 'Khambir'],
    tips: ['Acclimatize for 2-3 days', 'Carry warm clothes and sunscreen', 'Get Inner Line Permit', 'Stay hydrated', 'Respect local culture'],
    synonyms: ['leh', 'ladakh region', 'pangong', 'nubra']
  },
  'darjeeling': {
    description: 'Darjeeling is a charming hill station famous for tea plantations, mountain views, and the Darjeeling Himalayan Railway.',
    bestTime: 'March to May and October to November - pleasant weather, clear mountain views, 10-20°C',
    attractions: ['Tiger Hill', 'Darjeeling Himalayan Railway', 'Tea Plantations', 'Batasia Loop', 'Peace Pagoda', 'Observatory Hill'],
    cuisine: ['Momos', 'Thukpa', 'Darjeeling Tea', 'Aloo Dum', 'Churpee', 'Sel Roti'],
    tips: ['Book toy train in advance', 'Wake up early for sunrise at Tiger Hill', 'Visit tea gardens', 'Carry warm clothes', 'Try local tea'],
    synonyms: ['darjeeling tea', 'hill station darjeeling', 'toy train']
  },
  'ooty': {
    description: 'Ooty (Ootacamund) is a popular hill station in Tamil Nadu, known for tea gardens, botanical gardens, and pleasant climate.',
    bestTime: 'April to June and September to November - pleasant weather, avoid monsoon, 15-25°C',
    attractions: ['Ooty Botanical Gardens', 'Ooty Lake', 'Doddabetta Peak', 'Tea Museum', 'Rose Garden', 'Pykara Falls'],
    cuisine: ['Ooty Varkey', 'Homemade Chocolates', 'Tea', 'Idli Dosa', 'South Indian Cuisine'],
    tips: ['Book accommodation in advance', 'Try homemade chocolates', 'Visit tea gardens', 'Take toy train ride', 'Carry light woolens'],
    synonyms: ['ootacamund', 'udagamandalam', 'queen of hills']
  }
};

// Enhanced Training Patterns with Synonyms and Variations
const TRAINING_PATTERNS: Array<{
  patterns: string[]; // Multiple ways to ask the same thing
  intent: TravelIntent;
  response: string;
  weight: number; // Confidence weight
}> = [
  {
    patterns: ['hello', 'hi', 'hey', 'namaste', 'greetings', 'good morning', 'good afternoon', 'good evening', 'hii', 'hey there'],
    intent: TravelIntent.GREETING,
    response: 'Namaste! 🙏 I\'m Gantavya AI, your travel companion for exploring India! How can I help you plan your journey today? 🌍✈️',
    weight: 1.0
  },
  {
    patterns: ['best time', 'when to visit', 'weather', 'season', 'climate', 'when should i visit', 'best season', 'ideal time', 'good time to visit', 'when is the best time'],
    intent: TravelIntent.BEST_TIME_TO_VISIT,
    response: 'The best time to visit most parts of India is during **October to March** (winter season) when the weather is pleasant. For hill stations, **March to June** and **September to November** are ideal. Avoid **June to September** (monsoon) and **April to June** (extreme heat in plains). 🌤️',
    weight: 0.95
  },
  {
    patterns: ['food', 'cuisine', 'restaurant', 'eat', 'dish', 'street food', 'local food', 'what to eat', 'best food', 'famous food', 'must try food', 'local cuisine', 'traditional food'],
    intent: TravelIntent.FOOD_CUISINE,
    response: 'Indian cuisine is incredibly diverse! Each region has unique flavors. Try **street food** in Delhi (Chaat, Parathas), **seafood** in Goa and Kerala, **Mughlai** in North India, and **South Indian** dosas and idlis. Always eat at busy places and drink bottled water! 🍛🍜',
    weight: 0.95
  },
  {
    patterns: ['hotel', 'stay', 'accommodation', 'lodging', 'resort', 'where to stay', 'place to stay', 'hotels', 'hostel', 'guesthouse'],
    intent: TravelIntent.ACCOMMODATION,
    response: 'India offers diverse accommodation options: **Heritage hotels** in Rajasthan, **beach resorts** in Goa, **houseboats** in Kerala, and **budget hostels** everywhere. Book in advance during peak season (Dec-Feb). Use trusted booking platforms and read reviews! 🏨',
    weight: 0.9
  },
  {
    patterns: ['transport', 'travel', 'flight', 'train', 'bus', 'how to reach', 'how to go', 'transportation', 'getting there', 'way to reach', 'how do i reach'],
    intent: TravelIntent.TRANSPORTATION,
    response: 'India has excellent connectivity! **Trains** (IRCTC) are affordable and scenic. **Flights** connect major cities. **Buses** are good for short distances. **Auto-rickshaws** and **taxis** (Ola/Uber) for local travel. Book trains 2-3 months in advance! 🚂✈️🚌',
    weight: 0.9
  },
  {
    patterns: ['culture', 'custom', 'tradition', 'etiquette', 'dress', 'clothing', 'what to wear', 'cultural tips', 'local customs', 'traditions'],
    intent: TravelIntent.CULTURE_TIPS,
    response: 'Respect local customs: **Dress modestly** (cover shoulders/knees at religious sites), **remove shoes** at temples, **use right hand** for eating/greeting, **avoid public displays of affection**. Learn basic Hindi phrases - locals appreciate it! 🙏',
    weight: 0.9
  },
  {
    patterns: ['budget', 'cost', 'price', 'expensive', 'cheap', 'money', 'how much', 'cost of', 'trip cost', 'travel cost', 'expenses', 'spending'],
    intent: TravelIntent.BUDGET_COST,
    response: 'India is budget-friendly! **Budget travel**: ₹1000-2000/day (hostels, street food, local transport). **Mid-range**: ₹3000-5000/day (hotels, restaurants, taxis). **Luxury**: ₹8000+/day. Major expenses: accommodation and flights. Street food is very affordable! 💰',
    weight: 0.9
  },
  {
    patterns: ['safety', 'safe', 'security', 'danger', 'crime', 'is it safe', 'safety tips', 'travel safe', 'secure'],
    intent: TravelIntent.SAFETY_TIPS,
    response: 'India is generally safe for travelers! **Tips**: Avoid isolated areas at night, use registered taxis, keep valuables secure, drink bottled water, be cautious with street food initially, and respect local customs. Trust your instincts and stay aware! 🛡️',
    weight: 0.9
  },
  {
    patterns: ['festival', 'celebration', 'holi', 'diwali', 'dussehra', 'festivals', 'cultural festival', 'religious festival'],
    intent: TravelIntent.FESTIVALS,
    response: 'India celebrates festivals year-round! **Holi** (March) - colors and joy, **Diwali** (Oct-Nov) - lights and fireworks, **Dussehra** (Sep-Oct) - victory celebrations, **Onam** (Kerala), **Durga Puja** (Bengal). Plan visits during festivals for unique experiences! 🎉',
    weight: 0.85
  },
  {
    patterns: ['shopping', 'buy', 'market', 'souvenir', 'handicraft', 'what to buy', 'shopping places', 'best shopping'],
    intent: TravelIntent.SHOPPING,
    response: 'India is a shopper\'s paradise! **Buy**: Spices, textiles, handicrafts, jewelry, tea, Ayurvedic products. **Best places**: Delhi (Chandni Chowk), Jaipur (bazaars), Goa (flea markets), Kerala (spices). Always **bargain** at local markets (start at 50% of asking price)! 🛍️',
    weight: 0.85
  },
  {
    patterns: ['itinerary', 'plan', 'trip plan', 'travel plan', 'schedule', 'route', 'what to see', 'places to visit', 'sightseeing'],
    intent: TravelIntent.ITINERARY_PLANNING,
    response: 'I can help you plan your itinerary! Tell me:\n- **Duration** of your trip\n- **Destinations** you want to visit\n- **Interests** (beaches, mountains, culture, etc.)\n- **Budget** range\n\nI\'ll create a personalized plan for you! 📝',
    weight: 0.8
  },
  {
    patterns: ['attraction', 'places to see', 'sightseeing', 'tourist spot', 'monument', 'temple', 'palace', 'fort', 'what to see', 'must visit'],
    intent: TravelIntent.ATTRACTIONS,
    response: 'India has countless attractions! From **Taj Mahal** in Agra to **beaches** in Goa, **palaces** in Rajasthan to **backwaters** in Kerala. Each region offers unique experiences. Which destination interests you? 🏛️',
    weight: 0.8
  }
];

/**
 * Enhanced Text Processing with Better Algorithms
 */
class TextProcessor {
  static normalize(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static extractKeywords(text: string): string[] {
    const normalized = this.normalize(text);
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 
      'will', 'would', 'should', 'could', 'can', 'may', 'might', 'what', 'where', 'when', 
      'why', 'how', 'which', 'who', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 
      'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 
      'her', 'its', 'our', 'their', 'tell', 'me', 'about', 'please', 'help'
    ]);
    
    return normalized
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  // Enhanced similarity calculation using Jaccard and word order
  static calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(this.extractKeywords(text1));
    const words2 = new Set(this.extractKeywords(text2));
    
    const words1Array = Array.from(words1);
    const intersection = new Set(words1Array.filter(x => words2.has(x)));
    const union = new Set([...words1Array, ...Array.from(words2)]);
    
    // Jaccard similarity
    const jaccard = union.size > 0 ? intersection.size / union.size : 0;
    
    // Phrase matching bonus
    const normalized1 = this.normalize(text1);
    const normalized2 = this.normalize(text2);
    let phraseBonus = 0;
    
    // Check for 2-word phrases
    const words1List = normalized1.split(' ').filter(w => w.length > 2);
    
    for (let i = 0; i < words1List.length - 1; i++) {
      const phrase = `${words1List[i]} ${words1List[i + 1]}`;
      if (normalized2.includes(phrase)) {
        phraseBonus += 0.2;
      }
    }
    
    return Math.min(jaccard + phraseBonus, 1.0);
  }

  // Check if query contains question words
  static isQuestion(query: string): boolean {
    const questionWords = ['what', 'where', 'when', 'why', 'how', 'which', 'who', 'can', 'should', 'could', 'would'];
    const normalized = this.normalize(query);
    return questionWords.some(word => normalized.startsWith(word) || normalized.includes(` ${word} `));
  }
}

/**
 * Enhanced Intent Classifier with Better Training
 */
class IntentClassifier {
  static classify(query: string): { intent: TravelIntent; confidence: number } {
    const normalized = TextProcessor.normalize(query);
    
    // Priority 1: Check for destination mentions (highest priority)
    for (const [dest, info] of Object.entries(DESTINATIONS)) {
      if (normalized.includes(dest)) {
        return { intent: TravelIntent.DESTINATION_INFO, confidence: 0.95 };
      }
      // Check synonyms
      for (const synonym of info.synonyms) {
        if (normalized.includes(synonym)) {
          return { intent: TravelIntent.DESTINATION_INFO, confidence: 0.9 };
        }
      }
    }

    // Priority 2: Pattern matching with training data
    let bestMatch = { intent: TravelIntent.GENERAL, confidence: 0 };
    
    for (const pattern of TRAINING_PATTERNS) {
      for (const trainingPattern of pattern.patterns) {
        // Exact match
        if (normalized.includes(trainingPattern)) {
          const confidence = pattern.weight;
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent: pattern.intent, confidence };
          }
        }
        
        // Similarity match
        const similarity = TextProcessor.calculateSimilarity(query, trainingPattern);
        const weightedSimilarity = similarity * pattern.weight;
        if (weightedSimilarity > bestMatch.confidence) {
          bestMatch = { intent: pattern.intent, confidence: weightedSimilarity };
        }
      }
    }

    // Priority 3: Keyword-based classification
    const keywords = TextProcessor.extractKeywords(query);
    
    // Multi-keyword matching for better accuracy
    const keywordMatches: Record<TravelIntent, number> = {} as Record<TravelIntent, number>;
    
    for (const pattern of TRAINING_PATTERNS) {
      let matchScore = 0;
      for (const trainingPattern of pattern.patterns) {
        const patternWords = TextProcessor.extractKeywords(trainingPattern);
        const commonWords = patternWords.filter(w => keywords.includes(w));
        if (commonWords.length > 0) {
          matchScore += (commonWords.length / patternWords.length) * pattern.weight;
        }
      }
      if (matchScore > 0) {
        keywordMatches[pattern.intent] = (keywordMatches[pattern.intent] || 0) + matchScore;
      }
    }
    
    // Find best keyword match
    for (const [intent, score] of Object.entries(keywordMatches)) {
      if (score > bestMatch.confidence) {
        bestMatch = { intent: intent as TravelIntent, confidence: Math.min(score, 0.95) };
      }
    }

    // Return best match or general with confidence
    return bestMatch.confidence > 0.4 ? bestMatch : { intent: TravelIntent.GENERAL, confidence: 0.6 };
  }
}

/**
 * Enhanced Response Generator with Context Awareness
 */
class ResponseGenerator {
  static generateResponse(query: string, intent: TravelIntent, confidence: number): string {
    const normalized = TextProcessor.normalize(query);
    const keywords = TextProcessor.extractKeywords(query);

    // Extract destination from query with synonym support
    let destination: string | null = null;
    for (const [dest, info] of Object.entries(DESTINATIONS)) {
      if (normalized.includes(dest)) {
        destination = dest;
        break;
      }
      // Check synonyms
      for (const synonym of info.synonyms) {
        if (normalized.includes(synonym)) {
          destination = dest;
          break;
        }
      }
      if (destination) break;
    }

    // Handle specific intents with enhanced responses
    switch (intent) {
      case TravelIntent.GREETING:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.GREETING)?.response || 
               'Namaste! 🙏 How can I help you explore India today?';

      case TravelIntent.DESTINATION_INFO:
        if (destination && DESTINATIONS[destination]) {
          const destInfo = DESTINATIONS[destination];
          const destName = destination.charAt(0).toUpperCase() + destination.slice(1);
          let response = `**${destName}** 🏛️\n\n`;
          response += `${destInfo.description}\n\n`;
          
          // Smart context detection - what specific info is requested
          const wantsTime = keywords.some(k => ['time', 'when', 'season', 'weather', 'climate'].includes(k));
          const wantsAttractions = keywords.some(k => ['see', 'visit', 'attraction', 'place', 'sight', 'monument', 'temple', 'palace'].includes(k));
          const wantsFood = keywords.some(k => ['food', 'eat', 'cuisine', 'dish', 'restaurant', 'local food'].includes(k));
          const wantsTips = keywords.some(k => ['tip', 'advice', 'suggest', 'recommend', 'should', 'must'].includes(k));
          const wantsAccommodation = keywords.some(k => ['hotel', 'stay', 'accommodation', 'resort', 'lodging'].includes(k));
          
          if (wantsTime) {
            response += `**Best Time to Visit**: ${destInfo.bestTime}\n\n`;
          }
          if (wantsAttractions) {
            response += `**Top Attractions**: ${destInfo.attractions.slice(0, 6).join(', ')}\n\n`;
          }
          if (wantsFood) {
            response += `**Must-Try Food**: ${destInfo.cuisine.slice(0, 5).join(', ')}\n\n`;
          }
          if (wantsTips) {
            response += `**Travel Tips**: ${destInfo.tips.slice(0, 4).join('. ')}\n\n`;
          }
          if (wantsAccommodation) {
            response += `**Accommodation**: Book in advance, especially during peak season. Heritage hotels and resorts are popular choices.\n\n`;
          }
          
          // If no specific request, provide comprehensive overview
          if (!wantsTime && !wantsAttractions && !wantsFood && !wantsTips && !wantsAccommodation) {
            response += `**Best Time**: ${destInfo.bestTime}\n\n`;
            response += `**Top Attractions**: ${destInfo.attractions.slice(0, 4).join(', ')}\n\n`;
            response += `**Must-Try Food**: ${destInfo.cuisine.slice(0, 4).join(', ')}\n\n`;
            response += `**Travel Tips**: ${destInfo.tips.slice(0, 3).join('. ')}\n\n`;
          }
          
          response += `Feel free to ask me more specific questions about ${destName}! 😊`;
          return response;
        }
        return 'I\'d love to help you with destination information! Which place in India are you interested in? Some popular destinations: Goa, Kerala, Rajasthan, Delhi, Mumbai, Varanasi, Ladakh, and more! 🗺️';

      case TravelIntent.BEST_TIME_TO_VISIT:
        if (destination && DESTINATIONS[destination]) {
          const destName = destination.charAt(0).toUpperCase() + destination.slice(1);
          return `**Best Time to Visit ${destName}**:\n\n${DESTINATIONS[destination].bestTime}\n\nPlan your trip accordingly for the best experience! 📅`;
        }
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.BEST_TIME_TO_VISIT)?.response || 
               'The best time to visit India is October to March for most regions!';

      case TravelIntent.FOOD_CUISINE:
        if (destination && DESTINATIONS[destination]) {
          const destName = destination.charAt(0).toUpperCase() + destination.slice(1);
          return `**Food in ${destName}**:\n\nMust-try dishes: ${DESTINATIONS[destination].cuisine.join(', ')}\n\nEach region has unique flavors - explore local street food and restaurants! 🍛`;
        }
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.FOOD_CUISINE)?.response || 
               'Indian cuisine is diverse and delicious! What region are you interested in?';

      case TravelIntent.ACCOMMODATION:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.ACCOMMODATION)?.response || 
               'India offers great accommodation options for every budget!';

      case TravelIntent.TRANSPORTATION:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.TRANSPORTATION)?.response || 
               'India has excellent transportation networks!';

      case TravelIntent.CULTURE_TIPS:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.CULTURE_TIPS)?.response || 
               'Respect local customs and traditions for a great experience!';

      case TravelIntent.BUDGET_COST:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.BUDGET_COST)?.response || 
               'India is very budget-friendly for travelers!';

      case TravelIntent.SAFETY_TIPS:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.SAFETY_TIPS)?.response || 
               'India is generally safe - follow basic travel safety tips!';

      case TravelIntent.FESTIVALS:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.FESTIVALS)?.response || 
               'India celebrates amazing festivals throughout the year!';

      case TravelIntent.SHOPPING:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.SHOPPING)?.response || 
               'India is a shopper\'s paradise with unique handicrafts!';

      case TravelIntent.ATTRACTIONS:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.ATTRACTIONS)?.response || 
               'India has countless attractions! Which destination interests you?';

      case TravelIntent.ITINERARY_PLANNING:
        return TRAINING_PATTERNS.find(e => e.intent === TravelIntent.ITINERARY_PLANNING)?.response || 
               'I can help you plan your itinerary! Tell me your preferences.';

      default:
        // Enhanced fallback with helpful suggestions
        if (confidence < 0.5) {
          return 'I\'m Gantavya AI, your travel companion for India! 🇮🇳\n\nI can help you with:\n• Destination information (Goa, Kerala, Rajasthan, etc.)\n• Best time to visit\n• Food and cuisine\n• Accommodation\n• Transportation\n• Culture and tips\n• Itinerary planning\n• Budget and costs\n\nWhat would you like to know? Ask me about any place in India! ✈️';
        }
        return 'That\'s interesting! Could you tell me more about what you\'d like to know? I specialize in helping travelers explore India! 🗺️';
    }
  }
}

/**
 * Main NLP Processing Function
 */
export function processTravelQuery(query: string): string {
  if (!query || query.trim().length === 0) {
    return 'Please ask me something about travel in India! 🗺️';
  }

  // Classify intent with enhanced algorithm
  const { intent, confidence } = IntentClassifier.classify(query);

  // Generate response
  const response = ResponseGenerator.generateResponse(query, intent, confidence);

  return response;
}

/**
 * Enhanced travel-related query detection
 */
export function isTravelRelated(query: string): boolean {
  const travelKeywords = [
    'travel', 'trip', 'visit', 'destination', 'tour', 'journey', 'vacation', 'holiday',
    'goa', 'kerala', 'delhi', 'mumbai', 'rajasthan', 'varanasi', 'taj mahal', 'ladakh', 'darjeeling', 'ooty',
    'hotel', 'food', 'cuisine', 'beach', 'mountain', 'temple', 'palace', 'fort',
    'india', 'indian', 'itinerary', 'budget', 'flight', 'train', 'bus', 'transport',
    'attraction', 'sightseeing', 'monument', 'culture', 'festival', 'shopping'
  ];

  const normalized = TextProcessor.normalize(query);
  return travelKeywords.some(keyword => normalized.includes(keyword));
}
