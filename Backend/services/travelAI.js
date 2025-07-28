import { GoogleGenerativeAI } from '@google/generative-ai';
import TravelScraper from './travelScraper.js';

class TravelAI {
  constructor() {
    // Use Google Gemini instead of OpenAI
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');
    this.model = this.gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.scraper = new TravelScraper();
    this.conversationHistory = new Map();
  }

  // Main method to process travel queries
  async processQuery(userId, sessionId, userMessage) {
    try {
      // Analyze the user's intent
      const intent = await this.analyzeIntent(userMessage);
      
      // Get conversation context
      const context = this.getConversationContext(sessionId);
      
      let response;
      let travelData = null;

      switch (intent.type) {
        case 'flight_search':
          travelData = await this.handleFlightSearch(intent.parameters, userMessage);
          response = await this.generateFlightResponse(travelData, userMessage);
          break;
          
        case 'hotel_search':
          travelData = await this.handleHotelSearch(intent.parameters, userMessage);
          response = await this.generateHotelResponse(travelData, userMessage);
          break;
          
        case 'destination_info':
          travelData = await this.handleDestinationInfo(intent.parameters, userMessage);
          response = await this.generateDestinationResponse(travelData, userMessage);
          break;
          
        case 'travel_planning':
          travelData = await this.handleTravelPlanning(intent.parameters, userMessage);
          response = await this.generateTravelPlanResponse(travelData, userMessage);
          break;
          
        case 'general_travel':
          response = await this.generateGeneralTravelResponse(userMessage, context);
          break;
          
        default:
          response = await this.generateGeneralResponse(userMessage, context);
      }

      // Update conversation context
      this.updateConversationContext(sessionId, userMessage, response, travelData);

      return {
        response: response,
        data: travelData,
        intent: intent.type
      };

    } catch (error) {
      console.error('TravelAI processing error:', error);
      return {
        response: "I apologize for the technical difficulty. Let me help you with your travel planning. Could you please rephrase your question?",
        data: null,
        intent: 'error'
      };
    }
  }

  // Analyze user intent using OpenAI or fallback logic
  async analyzeIntent(userMessage) {
    try {
      const prompt = `
        Analyze this travel-related message and determine the user's intent and extract relevant parameters:
        
        Message: "${userMessage}"
        
        Respond with JSON in this format:
        {
          "type": "flight_search|hotel_search|destination_info|travel_planning|general_travel|other",
          "parameters": {
            "origin": "extracted origin city/airport",
            "destination": "extracted destination",
            "dates": "extracted travel dates",
            "budget": "extracted budget if mentioned",
            "travelers": "number of travelers",
            "preferences": "any specific preferences mentioned"
          },
          "confidence": 0.8
        }
        
        Intent types:
        - flight_search: Looking for flights
        - hotel_search: Looking for accommodation
        - destination_info: Asking about a destination
        - travel_planning: General trip planning
        - general_travel: Travel advice/tips
        - other: Not travel related
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response - remove code blocks and extra formatting
      const cleanText = text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        .trim();
      
      console.log('🤖 AI Response (cleaned):', cleanText.substring(0, 200) + '...');
      
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Intent analysis error:', error);
      // Fallback to simple keyword-based intent detection
      return this.fallbackIntentAnalysis(userMessage);
    }
  }

  // Simple fallback intent analysis without OpenAI
  fallbackIntentAnalysis(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Extract destination
    const destination = this.extractDestination(userMessage);
    
    // Extract budget
    const budgetMatch = userMessage.match(/(\d+)\s*(jod|dollars?|usd|\$)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;
    
    // Extract travelers
    const travelersMatch = userMessage.match(/(\d+)\s*(people|person|traveler|passenger)/i);
    const travelers = travelersMatch ? parseInt(travelersMatch[1]) : null;

    let type = 'general_travel';
    
    if (lowerMessage.includes('flight') || lowerMessage.includes('plane') || lowerMessage.includes('airline')) {
      type = 'flight_search';
    } else if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
      type = 'hotel_search';
    } else if (destination && (lowerMessage.includes('about') || lowerMessage.includes('visit') || lowerMessage.includes('travel to'))) {
      type = 'destination_info';
    } else if (lowerMessage.includes('plan') || lowerMessage.includes('trip') || lowerMessage.includes('itinerary')) {
      type = 'travel_planning';
    }

    return {
      type: type,
      parameters: {
        destination: destination,
        budget: budget,
        travelers: travelers,
        origin: null,
        dates: null,
        preferences: null
      },
      confidence: 0.7
    };
  }

  // Handle flight search queries
  async handleFlightSearch(parameters, userMessage) {
    try {
      const origin = parameters.origin || 'Amman';
      const destination = parameters.destination || this.extractDestination(userMessage);
      const departureDate = parameters.dates || new Date().toISOString().split('T')[0];

      if (!destination) {
        return { error: 'Please specify a destination for your flight search.' };
      }

      const flights = await this.scraper.scrapeFlights(origin, destination, departureDate);
      const weather = await this.scraper.scrapeWeather(destination, departureDate);

      return {
        type: 'flights',
        flights: flights,
        weather: weather,
        searchParams: { origin, destination, departureDate }
      };
    } catch (error) {
      console.error('Flight search error:', error);
      return { error: 'Unable to fetch flight information at the moment.' };
    }
  }

  // Handle hotel search queries
  async handleHotelSearch(parameters, userMessage) {
    try {
      const destination = parameters.destination || this.extractDestination(userMessage);
      const checkIn = parameters.dates || new Date().toISOString().split('T')[0];
      const checkOut = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const guests = parameters.travelers || 2;

      if (!destination) {
        return { error: 'Please specify a destination for your hotel search.' };
      }

      const hotels = await this.scraper.scrapeHotels(destination, checkIn, checkOut, guests);
      const attractions = await this.scraper.scrapeAttractions(destination);

      return {
        type: 'hotels',
        hotels: hotels,
        attractions: attractions.slice(0, 5), // Top 5 attractions
        searchParams: { destination, checkIn, checkOut, guests }
      };
    } catch (error) {
      console.error('Hotel search error:', error);
      return { error: 'Unable to fetch hotel information at the moment.' };
    }
  }

  // Handle destination information queries
  async handleDestinationInfo(parameters, userMessage) {
    try {
      const destination = parameters.destination || this.extractDestination(userMessage);

      if (!destination) {
        return { error: 'Please specify which destination you want to know about.' };
      }

      const attractions = await this.scraper.scrapeAttractions(destination);
      const weather = await this.scraper.scrapeWeather(destination, new Date().toISOString().split('T')[0]);
      const hotels = await this.scraper.scrapeHotels(destination, 
        new Date().toISOString().split('T')[0], 
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      );

      return {
        type: 'destination',
        destination: destination,
        attractions: attractions,
        weather: weather,
        accommodationRange: {
          budget: Math.min(...hotels.map(h => h.pricePerNight)),
          luxury: Math.max(...hotels.map(h => h.pricePerNight))
        }
      };
    } catch (error) {
      console.error('Destination info error:', error);
      return { error: 'Unable to fetch destination information at the moment.' };
    }
  }

  // Handle comprehensive travel planning
  async handleTravelPlanning(parameters, userMessage) {
    try {
      const destination = parameters.destination || this.extractDestination(userMessage);
      const origin = parameters.origin || 'Amman';
      const budget = parameters.budget || 1000;
      const travelers = parameters.travelers || 2;
      const departureDate = parameters.dates || new Date().toISOString().split('T')[0];
      const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (!destination) {
        return { error: 'Please specify your travel destination for planning.' };
      }

      // Get all travel data
      const [flights, hotels, attractions, weather] = await Promise.all([
        this.scraper.scrapeFlights(origin, destination, departureDate, returnDate),
        this.scraper.scrapeHotels(destination, departureDate, returnDate, travelers),
        this.scraper.scrapeAttractions(destination),
        this.scraper.scrapeWeather(destination, departureDate)
      ]);

      // Calculate budget breakdown
      const budgetBreakdown = this.calculateBudgetBreakdown(flights, hotels, attractions, budget);

      return {
        type: 'travel_plan',
        destination: destination,
        flights: flights.slice(0, 3), // Top 3 flight options
        hotels: hotels.slice(0, 4), // Top 4 hotel options
        attractions: attractions.slice(0, 8), // Top 8 attractions
        weather: weather,
        budgetBreakdown: budgetBreakdown,
        recommendations: this.generateRecommendations(destination, budget, travelers)
      };
    } catch (error) {
      console.error('Travel planning error:', error);
      return { error: 'Unable to create travel plan at the moment.' };
    }
  }

  // Generate flight search response
  async generateFlightResponse(travelData, userMessage) {
    if (travelData.error) {
      return travelData.error;
    }

    const prompt = `
      Generate a helpful response about flight options based on this data:
      
      Search: ${JSON.stringify(travelData.searchParams)}
      Flights found: ${travelData.flights.length}
      Cheapest flight: ${travelData.flights[0]?.price} JOD
      Weather at destination: ${travelData.weather?.temperature}
      
      User asked: "${userMessage}"
      
      Provide a conversational response highlighting the best options, prices, and any relevant travel tips.
      Keep it concise but informative. Include weather information if relevant.
    `;

    return await this.generateGeminiResponse(prompt);
  }

  // Generate hotel search response
  async generateHotelResponse(travelData, userMessage) {
    if (travelData.error) {
      return travelData.error;
    }

    const prompt = `
      Generate a helpful response about hotel options based on this data:
      
      Search: ${JSON.stringify(travelData.searchParams)}
      Hotels found: ${travelData.hotels.length}
      Price range: ${Math.min(...travelData.hotels.map(h => h.pricePerNight))} - ${Math.max(...travelData.hotels.map(h => h.pricePerNight))} JOD per night
      Top attractions nearby: ${travelData.attractions.slice(0, 3).map(a => a.name).join(', ')}
      
      User asked: "${userMessage}"
      
      Provide a conversational response highlighting the best options, locations, and nearby attractions.
      Keep it helpful and engaging.
    `;

    return await this.generateGeminiResponse(prompt);
  }

  // Generate destination information response
  async generateDestinationResponse(travelData, userMessage) {
    if (travelData.error) {
      return travelData.error;
    }

    const prompt = `
      Generate an informative response about this destination:
      
      Destination: ${travelData.destination}
      Weather: ${travelData.weather?.temperature}, ${travelData.weather?.condition}
      Top attractions: ${travelData.attractions.slice(0, 5).map(a => a.name).join(', ')}
      Accommodation range: ${travelData.accommodationRange.budget} - ${travelData.accommodationRange.luxury} JOD per night
      
      User asked: "${userMessage}"
      
      Provide an engaging overview of the destination including what to see, do, and expect.
      Include practical travel information and tips.
    `;

    return await this.generateGeminiResponse(prompt);
  }

  // Generate comprehensive travel plan response
  async generateTravelPlanResponse(travelData, userMessage) {
    if (travelData.error) {
      return travelData.error;
    }

    const prompt = `
      Generate a comprehensive travel plan response based on this data:
      
      Destination: ${travelData.destination}
      Flight options: ${travelData.flights.length} (cheapest: ${travelData.flights[0]?.price} JOD)
      Hotel options: ${travelData.hotels.length} (range: ${Math.min(...travelData.hotels.map(h => h.pricePerNight))} - ${Math.max(...travelData.hotels.map(h => h.pricePerNight))} JOD/night)
      Activities: ${travelData.attractions.slice(0, 5).map(a => a.name).join(', ')}
      Weather: ${travelData.weather?.temperature}
      Budget breakdown: ${JSON.stringify(travelData.budgetBreakdown)}
      
      User asked: "${userMessage}"
      
      Create a structured travel plan with recommendations for flights, accommodation, activities, and budget tips.
      Make it exciting and informative!
    `;

    return await this.generateGeminiResponse(prompt);
  }

  // Generate general travel advice
  async generateGeneralTravelResponse(userMessage, context) {
    // Try Gemini first, fallback to simple response
    try {
      const prompt = `
        As a travel expert, respond to this travel question: "${userMessage}"
        
        Previous context: ${JSON.stringify(context)}
        
        Provide helpful, accurate travel advice. If it's about a specific destination,
        include practical tips. If it's general travel advice, be comprehensive but concise.
      `;

      return await this.generateGeminiResponse(prompt);
    } catch (error) {
      // Simple fallback for general travel questions
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('best time') || lowerMessage.includes('when to visit')) {
        return "The best time to visit depends on your destination's climate and your preferences. Generally, shoulder seasons (spring and fall) offer good weather with fewer crowds and better prices.";
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
        return "Travel costs vary by destination, season, and travel style. I recommend setting aside 40% for flights, 35% for accommodation, 15% for food, and 10% for activities and shopping.";
      } else if (lowerMessage.includes('what to pack') || lowerMessage.includes('packing')) {
        return "Pack light and versatile clothing, comfortable walking shoes, essential documents, universal adapter, and any necessary medications. Check the weather forecast before your trip!";
      } else {
        return "I'm here to help with your travel planning! I can assist with finding flights, hotels, destination information, and creating complete travel itineraries. What would you like to know about your trip?";
      }
    }
  }

  // Generate general response for non-travel queries
  async generateGeneralResponse(userMessage, context) {
    return "I'm your travel planning assistant! I can help you with flights, hotels, destinations, travel advice, and creating complete travel itineraries. What would you like to know about your next trip?";
  }

  // Helper method to generate Gemini AI responses with fallback
  async generateGeminiResponse(prompt) {
    try {
      const systemPrompt = "You are a knowledgeable and friendly travel assistant. Provide helpful, accurate, and engaging travel information.\n\n" + prompt;
      
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini response error:', error);
      // Return fallback response based on prompt content
      return this.generateFallbackResponse(prompt);
    }
  }

  // Generate fallback responses without OpenAI
  generateFallbackResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('flight')) {
      return "I found several flight options for your destination. The search results show flights from multiple airlines with competitive pricing. Check the flight details above for departure times, airlines, and prices. I recommend booking in advance for better deals!";
    } else if (lowerPrompt.includes('hotel')) {
      return "I've found great accommodation options in your destination ranging from budget-friendly to luxury hotels. Each option includes amenities, location details, and pricing. Consider factors like location, amenities, and guest reviews when making your choice.";
    } else if (lowerPrompt.includes('destination')) {
      return "This is a wonderful destination with rich culture, amazing attractions, and great experiences waiting for you! The search results show top-rated activities, local attractions, and current weather information to help you plan your visit.";
    } else if (lowerPrompt.includes('travel plan')) {
      return "I've created a comprehensive travel plan for you including flights, accommodation, and activities. This plan considers your budget, travel dates, and preferences. Feel free to adjust any part of the itinerary to better suit your needs!";
    } else {
      return "I'm here to help you plan your perfect trip! I can assist with finding flights, hotels, destinations, and creating complete travel itineraries. Feel free to ask me about any aspect of your travel planning.";
    }
  }

  // Helper methods
  extractDestination(text) {
    // Simple destination extraction - could be enhanced with NLP
    const destinations = [
      'Istanbul', 'Dubai', 'Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam',
      'Cairo', 'Bangkok', 'Tokyo', 'Singapore', 'Mumbai', 'New York', 'Los Angeles'
    ];
    
    const lowerText = text.toLowerCase();
    for (const dest of destinations) {
      if (lowerText.includes(dest.toLowerCase())) {
        return dest;
      }
    }
    
    return null;
  }

  calculateBudgetBreakdown(flights, hotels, attractions, totalBudget) {
    try {
      // Safe flight calculation
      const flightPrices = flights && flights.length > 0 ? flights.map(f => f.price || 0).filter(p => p > 0) : [];
      const cheapestFlight = flightPrices.length > 0 ? Math.min(...flightPrices) * 2 : Math.round(totalBudget * 0.4);
      
      // Safe hotel calculation  
      const midRangeHotel = hotels && hotels.length > 0 ? 
        (hotels.find(h => h.rating === 3)?.pricePerNight * 3) || 
        (hotels[0]?.pricePerNight * 3) || 
        Math.round(totalBudget * 0.35) : Math.round(totalBudget * 0.35);
      
      // Safe activities calculation
      const activities = attractions && attractions.length > 0 ? 
        attractions.slice(0, 3).reduce((sum, a) => sum + (a.price || 0), 0) : 
        Math.round(totalBudget * 0.1);
      
      const transportation = Math.round(totalBudget * 0.4);
      const accommodation = Math.round(totalBudget * 0.35);
      const food = Math.round(totalBudget * 0.15);
      const activitiesAndShopping = Math.round(totalBudget * 0.1);

      return {
        transportation: { amount: transportation, percentage: 40 },
        accommodation: { amount: accommodation, percentage: 35 },
        food: { amount: food, percentage: 15 },
        activities: { amount: activitiesAndShopping, percentage: 10 }
      };
    } catch (error) {
      console.error('Budget breakdown error:', error);
      // Fallback budget breakdown
      return {
        transportation: { amount: Math.round(totalBudget * 0.4), percentage: 40 },
        accommodation: { amount: Math.round(totalBudget * 0.35), percentage: 35 },
        food: { amount: Math.round(totalBudget * 0.15), percentage: 15 },
        activities: { amount: Math.round(totalBudget * 0.1), percentage: 10 }
      };
    }
  }

  generateRecommendations(destination, budget, travelers) {
    const recommendations = {
      bestTimeToVisit: this.getBestTimeToVisit(destination),
      budgetTips: this.getBudgetTips(budget),
      packingTips: this.getPackingTips(destination),
      localTips: this.getLocalTips(destination)
    };

    return recommendations;
  }

  getBestTimeToVisit(destination) {
    const timing = {
      'Istanbul': 'April-May and September-October for mild weather',
      'Dubai': 'November-March for cooler temperatures',
      'Paris': 'April-June and September-October for pleasant weather',
      'London': 'May-September for warmer weather and longer days',
      'Rome': 'April-June and September-October for comfortable temperatures'
    };

    return timing[destination] || 'Research the local climate and seasons for the best experience';
  }

  getBudgetTips(budget) {
    if (budget < 500) {
      return ['Book flights early', 'Consider hostels or budget hotels', 'Use public transportation', 'Eat at local restaurants'];
    } else if (budget < 1500) {
      return ['Compare flight prices', 'Mix of hotels and experiences', 'Try local cuisine', 'Book activities in advance'];
    } else {
      return ['Consider premium airlines', 'Stay at well-located hotels', 'Try fine dining', 'Book unique experiences'];
    }
  }

  getPackingTips(destination) {
    return ['Check weather forecast', 'Pack comfortable walking shoes', 'Bring appropriate adapters', 'Consider local dress codes'];
  }

  getLocalTips(destination) {
    const tips = {
      'Istanbul': ['Learn basic Turkish phrases', 'Try Turkish breakfast', 'Use the metro system', 'Visit both European and Asian sides'],
      'Dubai': ['Respect local customs', 'Stay hydrated', 'Use metro and taxis', 'Visit both modern and traditional areas'],
      'Paris': ['Learn basic French', 'Buy museum passes', 'Use metro efficiently', 'Try local bakeries'],
    };

    return tips[destination] || ['Learn basic local phrases', 'Respect local customs', 'Use public transportation', 'Try local cuisine'];
  }

  // Conversation context management
  getConversationContext(sessionId) {
    return this.conversationHistory.get(sessionId) || { messages: [], preferences: {} };
  }

  updateConversationContext(sessionId, userMessage, aiResponse, travelData) {
    const context = this.getConversationContext(sessionId);
    
    context.messages.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: new Date(),
      data: travelData
    });

    // Keep only last 10 messages for context
    if (context.messages.length > 10) {
      context.messages = context.messages.slice(-10);
    }

    // Extract and update preferences
    if (travelData) {
      if (travelData.searchParams?.destination) {
        context.preferences.lastDestination = travelData.searchParams.destination;
      }
      if (travelData.searchParams?.budget) {
        context.preferences.budgetRange = travelData.searchParams.budget;
      }
    }

    this.conversationHistory.set(sessionId, context);
  }
}

export default TravelAI; 