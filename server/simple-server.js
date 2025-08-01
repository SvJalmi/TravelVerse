const express = require('express');
const cors = require('cors');
const path = require('path');
const { AIServices, IoTService, SwarmIntelligenceService, NLPService } = require('./ai-services');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize AI/ML Services
const aiServices = new AIServices();
const iotService = new IoTService();
const swarmService = new SwarmIntelligenceService();
const nlpService = new NLPService();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockDestinations = [
  {
    id: '1',
    name: 'Taj Mahal',
    country: 'India',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    description: 'An iconic white marble mausoleum built by Emperor Shah Jahan as a tomb for his wife Mumtaz Mahal. One of the Seven Wonders of the World.',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
    ],
    climate: {
      temperature: 28,
      humidity: 65,
      weatherCondition: 'Partly Cloudy'
    },
    activities: ['Photography', 'Historical Tours', 'Architecture Appreciation', 'Sunrise Viewing'],
    history: 'Built between 1632 and 1653, the Taj Mahal represents the finest architectural achievement in Indo-Islamic architecture.',
    culture: {
      language: 'Hindi, Urdu',
      currency: 'Indian Rupee (INR)',
      traditions: ['Mughal Heritage', 'Islamic Architecture', 'Royal History'],
      festivals: ['Taj Mahotsav', 'Holi', 'Diwali']
    },
    travelInfo: {
      bestTimeToVisit: 'October to March (cooler weather)',
      averageCost: '$50-100 per day',
      visa: 'Tourist visa required for most countries',
      safety: 'Generally safe with normal precautions'
    },
    photoSpots: [
      {
        name: 'Main Gate View',
        coordinates: { lat: 27.1738, lng: 78.0421 },
        description: 'Classic framed view of the Taj Mahal through the main entrance',
        bestTime: 'Early morning',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'
      }
    ],
    accommodation: [
      {
        name: 'The Oberoi Amarvilas',
        type: 'Luxury Hotel',
        priceRange: '$400-600/night',
        rating: 4.8
      }
    ],
    aiRecommendations: [
      'Visit during golden hour for the best photography',
      'Book skip-the-line tickets in advance'
    ],
    
    // Enhanced AI/ML/IoT fields
    aiPopularityScore: 0.95,
    sentimentScore: 0.89,
    trendingScore: 0.91,
    mlPredictions: {
      nextWeekCrowdLevel: 'medium',
      optimalVisitTime: '6:30-7:30 AM for minimal crowds',
      weatherForecast: [
        { date: '2025-08-02', condition: 'sunny', temperature: 29, confidence: 0.88 },
        { date: '2025-08-03', condition: 'partly cloudy', temperature: 27, confidence: 0.85 }
      ],
      priceFluctuations: [
        { period: 'next_week', estimatedCost: 55, confidence: 0.82 },
        { period: 'next_month', estimatedCost: 48, confidence: 0.75 }
      ]
    },
    realTimeIoT: {
      airQuality: { pm25: 42, pm10: 68, co2: 410, timestamp: new Date().toISOString() },
      noise: { decibels: 58, timestamp: new Date().toISOString() },
      traffic: { vehicleCount: 145, averageSpeed: 25, congestionLevel: 'medium', timestamp: new Date().toISOString() },
      footfall: { currentCount: 234, peakHours: ['08:00', '17:00'], timestamp: new Date().toISOString() },
      environmental: { lighting: 650, humidity: 68, temperature: 28, timestamp: new Date().toISOString() }
    },
    swarmInsights: {
      collectiveBehavior: {
        averageGroupSize: 3.2,
        commonMovementPatterns: ['main_gate_to_monument', 'sunset_viewing_route'],
        socialInteractionLevel: 'high',
        emergentRoutes: [
          { path: [{ lat: 27.1738, lng: 78.0421 }, { lat: 27.1751, lng: 78.0421 }], popularity: 0.89, efficiency: 0.92 }
        ]
      },
      crowdWisdom: {
        consensusRating: 4.7,
        collectiveRecommendations: ['Early morning visits for best lighting', 'Hire local guide for cultural insights'],
        emergentPreferences: {
          activities: ['Photography', 'Cultural Tours'],
          timing: ['Dawn', 'Golden Hour'],
          budget: ['Premium Experience']
        }
      },
      swarmOptimization: {
        bestPhotoSpots: [
          { location: { lat: 27.1738, lng: 78.0421 }, score: 0.94, crowdValidated: true }
        ],
        optimalRoutes: [
          { waypoints: [{ lat: 27.1735, lng: 78.0420 }, { lat: 27.1751, lng: 78.0421 }], efficiency: 0.91, satisfaction: 0.88 }
        ]
      }
    },
    nlpEnhancements: {
      semanticTags: ['heritage', 'architecture', 'romance', 'unesco', 'marble', 'mughal'],
      emotionalProfile: { joy: 0.85, excitement: 0.78, tranquility: 0.72, adventure: 0.45, cultural: 0.92 },
      languageVariants: {
        descriptions: {
          'hi': 'ताज महल एक प्रतिष्ठित सफेद संगमरमर का मकबरा है',
          'ur': 'تاج محل ایک مشہور سفید سنگ مرمر کا مقبرہ ہے'
        },
        culturalNuances: {
          'hi': ['Remove shoes before entering', 'Respect prayer times', 'Photography restrictions in main chamber'],
          'ur': ['Islamic architectural significance', 'Proper dress code required']
        }
      },
      intelligentSummary: {
        oneMinuteRead: 'UNESCO World Heritage site built by Shah Jahan as eternal love symbol. Best visited at sunrise for crowds and lighting.',
        keyHighlights: ['Architectural Marvel', 'Love Story', 'UNESCO Heritage', 'Photography Paradise'],
        personalizedInsights: ['Perfect for romantic travelers', 'History enthusiasts must-see', 'Architecture photographers dream']
      }
    }
  },
  {
    id: '2',
    name: 'Eiffel Tower',
    country: 'France',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    description: 'Iconic iron lattice tower built for the 1889 World\'s Fair, now the symbol of Paris and France.',
    images: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800'
    ],
    climate: {
      temperature: 15,
      humidity: 70,
      weatherCondition: 'Cloudy'
    },
    activities: ['Tower Ascent', 'Seine River Cruise', 'Fine Dining', 'Night Photography'],
    history: 'Designed by Gustave Eiffel, completed in 1889. Initially criticized but now beloved worldwide symbol.',
    culture: {
      language: 'French',
      currency: 'Euro (EUR)',
      traditions: ['French Cuisine', 'Art & Fashion', 'Romance'],
      festivals: ['Bastille Day', 'Fête de la Musique', 'Paris Fashion Week']
    },
    travelInfo: {
      bestTimeToVisit: 'April to June, September to October',
      averageCost: '$100-200 per day',
      visa: 'Schengen visa required for non-EU citizens',
      safety: 'Very safe with standard urban precautions'
    },
    photoSpots: [
      {
        name: 'Trocadéro Gardens',
        coordinates: { lat: 48.8629, lng: 2.2885 },
        description: 'Best panoramic view of the Eiffel Tower',
        bestTime: 'Sunset',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400'
      }
    ],
    accommodation: [
      {
        name: 'Le Meurice',
        type: 'Luxury Hotel',
        priceRange: '$800-1200/night',
        rating: 4.9
      }
    ],
    aiRecommendations: [
      'Book Eiffel Tower tickets online to skip queues',
      'Visit both day and night for different experiences'
    ]
  }
];

const mockPhotoGuides = [
  {
    id: '1',
    destinationId: '1',
    spotName: 'Taj Mahal Golden Hour',
    category: 'architectural',
    difficulty: 'easy',
    influencerRating: '4.9',
    viralPotential: '0.95',
    poseInstructions: [
      'Stand at the main entrance facing the monument',
      'Extend one arm toward the Taj Mahal creating depth',
      'Tilt your head slightly and smile naturally'
    ],
    cameraSettings: {
      bestTime: 'Golden hour (6:30-7:30 AM)',
      lighting: 'Natural golden sunlight',
      angle: 'Low angle, slight upward tilt',
      equipment: 'Wide-angle lens, tripod recommended',
      aiOptimalSettings: {
        iso: 200,
        shutterSpeed: '1/125s',
        focusMode: 'single-point AF',
        whiteBalance: 'daylight',
        exposureCompensation: -0.3
      },
      weatherAdaptations: [
        { condition: 'cloudy', adjustments: { iso: '400', exposure: '+0.7' } },
        { condition: 'sunny', adjustments: { iso: '100', exposure: '-0.3' } }
      ]
    },
    tips: [
      'Arrive early to avoid crowds',
      'Use symmetry in your composition'
    ],
    hashtags: ['#TajMahal', '#India', '#GoldenHour', '#Architecture'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
        caption: 'Perfect golden hour framing',
        photographer: '@travel_guru',
        aiAnalysis: {
          compositionScore: 0.91,
          lightingQuality: 0.94,
          aestheticAppeal: 0.88,
          detectedObjects: [
            { object: 'taj_mahal', confidence: 0.97, bbox: [0.2, 0.15, 0.6, 0.8] },
            { object: 'person', confidence: 0.85, bbox: [0.1, 0.6, 0.25, 0.95] },
            { object: 'sky', confidence: 0.92, bbox: [0.0, 0.0, 1.0, 0.4] }
          ],
          dominantColors: ['#f4f1e8', '#8b7355', '#e8dcc0', '#2c5aa0'],
          mood: 'romantic',
          technicalQuality: {
            sharpness: 0.89,
            exposure: 0.91,
            colorBalance: 0.87,
            noise: 0.08
          }
        },
        socialMetrics: {
          likes: 2847,
          shares: 394,
          saves: 1205,
          viralityScore: 0.92
        }
      }
    ],
    crowdSourcedOptimization: {
      bestTimeSlots: [
        { timeRange: '6:30-7:30 AM', qualityScore: 0.95, crowdLevel: 'low', weatherCompatibility: 0.88 },
        { timeRange: '5:30-6:30 PM', qualityScore: 0.87, crowdLevel: 'medium', weatherCompatibility: 0.92 }
      ],
      seasonalRecommendations: [
        { season: 'winter', advantages: ['Clear skies', 'Comfortable temperature'], challenges: ['Fog in early morning'], bestMonths: ['November', 'December', 'January'] }
      ],
      collectiveWisdom: {
        consensusBestAngle: 'slightly low angle with monument centered',
        popularPoses: ['classic pointing pose', 'reflection silhouette', 'architectural framing'],
        crowdApprovedTips: ['Use leading lines from pathways', 'Include cypress trees for framing', 'Capture reflection in water features']
      }
    },
    personalizedRecommendations: {
      skillLevelAdaptation: {
        beginner: ['Use auto mode initially', 'Focus on composition over technical settings', 'Take multiple shots for variety'],
        intermediate: ['Experiment with manual exposure', 'Try different perspectives', 'Use bracketing for HDR'],
        advanced: ['Focus stacking for maximum sharpness', 'Long exposure for crowd removal', 'Color grading techniques']
      },
      equipmentAlternatives: [
        { equipment: 'DSLR + 24-70mm', alternatives: ['smartphone with wide lens', 'mirrorless + 16-35mm'], tradeoffs: 'Slightly reduced image quality but better portability' }
      ],
      styleVariations: [
        { style: 'minimalist', modifications: ['remove foreground elements', 'use negative space'], examples: ['clean architectural lines', 'sky-dominant composition'] }
      ]
    }
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.get('/api/destinations', (req, res) => {
  res.json(mockDestinations);
});

app.get('/api/destinations/:id', (req, res) => {
  const destination = mockDestinations.find(d => d.id === req.params.id);
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(destination);
});

app.get('/api/photo-guides', (req, res) => {
  res.json(mockPhotoGuides);
});

app.get('/api/photo-guides/destination/:destinationId', (req, res) => {
  const guides = mockPhotoGuides.filter(g => g.destinationId === req.params.destinationId);
  res.json(guides);
});

app.get('/api/weather/:destinationId', (req, res) => {
  const destination = mockDestinations.find(d => d.id === req.params.destinationId);
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  res.json({
    current: {
      temperature: destination.climate.temperature,
      condition: destination.climate.weatherCondition,
      humidity: destination.climate.humidity,
      windSpeed: Math.floor(Math.random() * 20 + 5)
    }
  });
});

app.get('/api/vr-content/:destinationId', (req, res) => {
  res.json({
    scenes: [
      {
        name: 'Main Entrance',
        url: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/city.jpg',
        description: 'Walk through the grand entrance gates',
        duration: '3 minutes',
        interactiveElements: ['info_hotspots', 'audio_guide', '360_rotation']
      }
    ],
    metadata: {
      totalScenes: 1,
      estimatedDuration: '3 minutes',
      supportedDevices: ['VR Headsets', 'Mobile', 'Desktop'],
      requirements: 'WebXR compatible browser, good internet connection'
    }
  });
});

app.get('/api/ar-features/:destinationId', (req, res) => {
  res.json({
    features: [
      {
        name: 'Historical Timeline',
        description: 'See construction phases overlaid on the monument',
        triggers: ['qr_code', 'image_recognition', 'gps_location']
      }
    ],
    supportedPlatforms: ['iOS Safari', 'Android Chrome', 'WebXR'],
    requirements: 'Camera access, location services, modern browser'
  });
});

// AI Recommendations
app.post('/api/ai/recommendations', (req, res) => {
  const { preferences, budget, duration, interests, destinations } = req.body;

  const recommendations = mockDestinations
    .filter(d => destinations.includes(d.id))
    .map(d => ({
      ...d,
      aiScore: Math.random() * 0.3 + 0.7,
      reasonWhy: `Perfect match for ${preferences} travelers interested in ${interests.slice(0, 2).join(' and ')}`
    }))
    .sort((a, b) => b.aiScore - a.aiScore);

  res.json({
    aiInsights: `Based on your ${preferences} travel style and ${budget} budget, I've found ${recommendations.length} perfect destinations.`,
    recommendations: recommendations.slice(0, 3)
  });
});

// Travel Plans
app.post('/api/travel-plans', (req, res) => {
  const planData = req.body;
  
  const plan = {
    id: Math.random().toString(36).substr(2, 9),
    userId: 'anonymous',
    destinations: planData.destinations,
    duration: planData.duration,
    budget: planData.budget,
    preferences: planData.preferences,
    itinerary: planData.itinerary,
    createdAt: new Date(),
    estimatedCost: Math.floor(Math.random() * 2000 + 1000),
    carbonFootprint: Math.floor(Math.random() * 500 + 200),
    aiConfidenceScore: (Math.random() * 0.2 + 0.8).toString(),
    aiInsights: `Your optimized ${planData.duration}-day itinerary balances ${planData.travelStyle} experiences with your budget preferences.`
  };

  res.json(plan);
});

// Interactions tracking
app.post('/api/interactions', (req, res) => {
  console.log('User interaction tracked:', req.body);
  res.json({ success: true, id: Math.random().toString(36).substr(2, 9) });
});

app.get('/api/interactions', (req, res) => {
  const mockInteractions = Array.from({ length: 50 }, (_, i) => ({
    id: i.toString(),
    sessionId: `session_${Math.floor(i / 10)}`,
    destinationId: mockDestinations[i % mockDestinations.length].id,
    action: ['view', 'like', 'share', 'vr_experience', 'ar_view'][i % 5],
    duration: Math.floor(Math.random() * 300 + 30),
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
  }));

  res.json(mockInteractions);
});

// Advanced AI/ML Search with NLP
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.query.category;

    if (!query) {
      return res.json({ destinations: [], photoGuides: [], nlpAnalysis: null });
    }

    // NLP Analysis of search query
    const nlpAnalysis = await nlpService.processText(query, 'query');
    
    const searchTerm = query.toLowerCase();
    
    // Enhanced semantic search using NLP insights
    const destinationResults = mockDestinations.filter(d => {
      const basicMatch = d.name.toLowerCase().includes(searchTerm) ||
                        d.country.toLowerCase().includes(searchTerm) ||
                        d.description.toLowerCase().includes(searchTerm);
      
      // Semantic matching using NLP entities and topics
      const semanticMatch = nlpAnalysis.semanticAnalysis.namedEntities.some(entity => 
        d.name.toLowerCase().includes(entity.entity.toLowerCase()) ||
        d.country.toLowerCase().includes(entity.entity.toLowerCase())
      );
      
      return basicMatch || semanticMatch;
    });

    const photoGuideResults = mockPhotoGuides.filter(g =>
      g.spotName.toLowerCase().includes(searchTerm) ||
      g.category.toLowerCase().includes(searchTerm) ||
      (!category || g.category === category)
    );

    // Add ML-based result ranking
    const rankedDestinations = destinationResults
      .map(d => ({
        ...d,
        relevanceScore: calculateRelevanceScore(d, query, nlpAnalysis),
        aiInsights: generateSearchInsights(d, nlpAnalysis)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      destinations: rankedDestinations,
      photoGuides: photoGuideResults,
      totalResults: rankedDestinations.length + photoGuideResults.length,
      nlpAnalysis: {
        intent: nlpAnalysis.semanticAnalysis.intentDetection,
        sentiment: nlpAnalysis.sentimentAnalysis.overallSentiment,
        keyPhrases: nlpAnalysis.semanticAnalysis.keyPhrases,
        suggestedRefinements: generateSearchRefinements(nlpAnalysis)
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ error: 'Search processing failed' });
  }
});

function calculateRelevanceScore(destination, query, nlpAnalysis) {
  let score = 0.5; // Base score
  
  // Text matching
  const queryLower = query.toLowerCase();
  if (destination.name.toLowerCase().includes(queryLower)) score += 0.3;
  if (destination.description.toLowerCase().includes(queryLower)) score += 0.2;
  
  // Sentiment compatibility
  if (nlpAnalysis.sentimentAnalysis.overallSentiment === 'positive' && destination.sentimentScore > 0.7) {
    score += 0.2;
  }
  
  // Popularity and trending scores
  score += destination.aiPopularityScore * 0.1;
  score += destination.trendingScore * 0.1;
  
  return Math.min(1, score);
}

function generateSearchInsights(destination, nlpAnalysis) {
  const insights = [];
  
  if (nlpAnalysis.semanticAnalysis.intentDetection.intent === 'booking') {
    insights.push(`Best booking window: ${destination.travelInfo.bestTimeToVisit}`);
  }
  
  if (nlpAnalysis.sentimentAnalysis.emotions.joy > 0.5) {
    insights.push('Perfect for creating joyful memories');
  }
  
  return insights;
}

function generateSearchRefinements(nlpAnalysis) {
  const refinements = [];
  
  nlpAnalysis.semanticAnalysis.keyPhrases.forEach(phrase => {
    if (phrase.category === 'location') {
      refinements.push(`Explore more destinations in ${phrase.phrase}`);
    }
  });
  
  return refinements;
}

// Advanced IoT Sensor Data API
app.get('/api/iot/sensors/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const sensorType = req.query.type;
    
    const sensorData = await iotService.getSensorData(destinationId, sensorType);
    const predictions = await iotService.predictSensorValues(destinationId);
    
    res.json({
      sensors: sensorData,
      predictions,
      summary: {
        totalSensors: sensorData.length,
        onlineSensors: sensorData.filter(s => s.isOnline).length,
        avgBatteryLevel: sensorData.reduce((acc, s) => acc + s.batteryLevel, 0) / sensorData.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('IoT sensor data error:', error);
    res.status(500).json({ error: 'Sensor data retrieval failed' });
  }
});

// Swarm Intelligence Photo Optimization
app.post('/api/swarm/photo-optimization', async (req, res) => {
  try {
    const { destinationId, participants, preferences } = req.body;
    
    const swarmResult = await swarmService.optimizePhotoSpots(destinationId, participants);
    
    res.json(swarmResult);
  } catch (error) {
    console.error('Swarm optimization error:', error);
    res.status(500).json({ error: 'Swarm optimization failed' });
  }
});

// Swarm Intelligence Route Optimization
app.post('/api/swarm/route-optimization', async (req, res) => {
  try {
    const { destinationId, waypoints, preferences } = req.body;
    
    const routeOptimization = await swarmService.optimizeRoute(destinationId, waypoints, preferences);
    
    res.json({
      optimizedRoute: routeOptimization,
      swarmMetrics: {
        participantCount: waypoints.length,
        algorithmUsed: routeOptimization.algorithm,
        convergenceTime: `${routeOptimization.swarmMetrics.convergenceRate * 100}% in 2.3s`,
        efficiency: routeOptimization.route.efficiency
      }
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ error: 'Route optimization failed' });
  }
});

// ML-Enhanced Computer Vision Analysis
app.post('/api/ai/analyze-image', async (req, res) => {
  try {
    const { imageUrl, analysisType = 'comprehensive' } = req.body;
    
    const analysis = await aiServices.analyzeImage(imageUrl);
    
    res.json({
      analysis,
      recommendations: {
        improvementSuggestions: generateImprovementSuggestions(analysis),
        similarImages: await findSimilarImages(analysis),
        viralPotential: calculateViralPotential(analysis)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Image analysis failed' });
  }
});

function generateImprovementSuggestions(analysis) {
  const suggestions = [];
  
  if (analysis.lightingQuality < 0.7) {
    suggestions.push('Consider shooting during golden hour for better lighting');
  }
  
  if (analysis.compositionScore < 0.8) {
    suggestions.push('Apply rule of thirds for stronger composition');
  }
  
  if (analysis.technicalQuality.noise > 0.2) {
    suggestions.push('Use lower ISO settings to reduce noise');
  }
  
  return suggestions;
}

async function findSimilarImages(analysis) {
  // Simulate finding similar images based on visual features
  return [
    { url: 'similar1.jpg', similarity: 0.87, reason: 'Similar composition and lighting' },
    { url: 'similar2.jpg', similarity: 0.82, reason: 'Matching color palette and mood' }
  ];
}

function calculateViralPotential(analysis) {
  let potential = 0.5; // Base score
  
  potential += analysis.aestheticAppeal * 0.3;
  potential += analysis.lightingQuality * 0.2;
  potential += analysis.compositionScore * 0.2;
  
  if (analysis.mood === 'dramatic' || analysis.mood === 'romantic') {
    potential += 0.1;
  }
  
  return Math.min(1, potential);
}

// Advanced NLP Text Analysis
app.post('/api/nlp/analyze', async (req, res) => {
  try {
    const { text, contentType = 'review', targetLanguage } = req.body;
    
    const analysis = await nlpService.processText(text, contentType);
    
    // Generate smart responses
    const smartResponse = generateSmartResponse(analysis);
    
    res.json({
      analysis,
      smartResponse,
      actionableInsights: generateActionableInsights(analysis),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NLP analysis error:', error);
    res.status(500).json({ error: 'NLP analysis failed' });
  }
});

function generateSmartResponse(analysis) {
  const sentiment = analysis.sentimentAnalysis.overallSentiment;
  const intent = analysis.semanticAnalysis.intentDetection.intent;
  
  if (intent === 'information_seeking') {
    return {
      type: 'informational',
      response: 'I can help you find detailed information about destinations, activities, and travel tips.',
      suggestedActions: ['Explore destinations', 'View photo guides', 'Check weather conditions']
    };
  }
  
  if (intent === 'booking') {
    return {
      type: 'booking_assistance',
      response: 'I can assist you with planning and booking your travel experience.',
      suggestedActions: ['Create itinerary', 'Compare prices', 'Check availability']
    };
  }
  
  return {
    type: 'general',
    response: 'How can I assist you with your travel planning today?',
    suggestedActions: ['Browse destinations', 'Get recommendations']
  };
}

function generateActionableInsights(analysis) {
  const insights = [];
  
  if (analysis.sentimentAnalysis.overallSentiment === 'negative') {
    insights.push({
      type: 'concern_resolution',
      message: 'I noticed some concerns in your message. Let me help address them.',
      actions: ['Provide alternatives', 'Offer support']
    });
  }
  
  analysis.semanticAnalysis.namedEntities.forEach(entity => {
    if (entity.type === 'LOCATION') {
      insights.push({
        type: 'location_insight',
        message: `I found information about ${entity.entity}`,
        actions: [`Explore ${entity.entity}`, 'Get recommendations']
      });
    }
  });
  
  return insights;
}

// Static file serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TravelVerse Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 API endpoints available at http://0.0.0.0:${PORT}/api`);
  console.log(`🏥 Health check at http://0.0.0.0:${PORT}/health`);
});