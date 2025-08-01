import express from 'express';
import type { IStorage } from './storage.js';
import type { Destination, PhotoGuide, TravelPlan, UserInteraction } from '@shared/schema.js';

export function createRoutes(storage: IStorage) {
  const router = express.Router();

  // Mock data for comprehensive travel platform
  const mockDestinations: Destination[] = [
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
        },
        {
          name: 'Reflection Pool',
          coordinates: { lat: 27.1751, lng: 78.0421 },
          description: 'Perfect reflection shot with the marble monument',
          bestTime: 'Sunrise',
          imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400'
        }
      ],
      accommodation: [
        {
          name: 'The Oberoi Amarvilas',
          type: 'Luxury Hotel',
          priceRange: '$400-600/night',
          rating: 4.8
        },
        {
          name: 'Hotel Taj Resorts',
          type: 'Heritage Hotel',
          priceRange: '$150-250/night',
          rating: 4.2
        }
      ],
      aiRecommendations: [
        'Visit during golden hour for the best photography',
        'Book skip-the-line tickets in advance',
        'Explore nearby Agra Fort for complete Mughal experience',
        'Try local Agra specialties like petha and dal moth'
      ]
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
        },
        {
          name: 'Pont de Bir-Hakeim',
          coordinates: { lat: 48.8537, lng: 2.2891 },
          description: 'Unique bridge perspective with tower backdrop',
          bestTime: 'Blue hour',
          imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400'
        }
      ],
      accommodation: [
        {
          name: 'Le Meurice',
          type: 'Luxury Hotel',
          priceRange: '$800-1200/night',
          rating: 4.9
        },
        {
          name: 'Hotel des Invalides',
          type: 'Boutique Hotel',
          priceRange: '$200-350/night',
          rating: 4.4
        }
      ],
      aiRecommendations: [
        'Book Eiffel Tower tickets online to skip queues',
        'Visit both day and night for different experiences',
        'Explore nearby Invalides and Champs-Élysées',
        'Try authentic French pastries at local patisseries'
      ]
    },
    {
      id: '3',
      name: 'Machu Picchu',
      country: 'Peru',
      coordinates: { lat: -13.1631, lng: -72.5450 },
      description: 'Ancient Incan citadel perched high in the Andes Mountains, one of the New Seven Wonders of the World.',
      images: [
        'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'
      ],
      climate: {
        temperature: 18,
        humidity: 80,
        weatherCondition: 'Misty'
      },
      activities: ['Hiking', 'Archaeological Tours', 'Photography', 'Spiritual Experiences'],
      history: 'Built around 1450 by the Inca Empire, abandoned during Spanish conquest, rediscovered in 1911.',
      culture: {
        language: 'Spanish, Quechua',
        currency: 'Peruvian Sol (PEN)',
        traditions: ['Inca Heritage', 'Andean Culture', 'Shamanic Practices'],
        festivals: ['Inti Raymi', 'Corpus Christi', 'Virgen del Carmen']
      },
      travelInfo: {
        bestTimeToVisit: 'May to September (dry season)',
        averageCost: '$80-150 per day',
        visa: 'No visa required for most countries (up to 90 days)',
        safety: 'Safe with guided tours and proper preparation'
      },
      photoSpots: [
        {
          name: 'Classic Postcard View',
          coordinates: { lat: -13.1631, lng: -72.5450 },
          description: 'Iconic view of the entire citadel with Huayna Picchu backdrop',
          bestTime: 'Early morning',
          imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400'
        },
        {
          name: 'Huayna Picchu Summit',
          coordinates: { lat: -13.1558, lng: -72.5464 },
          description: 'Aerial view of Machu Picchu from the sacred peak',
          bestTime: 'Mid-morning',
          imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400'
        }
      ],
      accommodation: [
        {
          name: 'Sanctuary Lodge',
          type: 'Luxury Lodge',
          priceRange: '$1200-1800/night',
          rating: 4.7
        },
        {
          name: 'Inkaterra Machu Picchu',
          type: 'Eco-Lodge',
          priceRange: '$400-700/night',
          rating: 4.5
        }
      ],
      aiRecommendations: [
        'Book entrance tickets months in advance',
        'Consider the Inca Trail for full experience',
        'Acclimatize in Cusco before visiting',
        'Bring layers for changing mountain weather'
      ]
    }
  ];

  const mockPhotoGuides: PhotoGuide[] = [
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
        'Tilt your head slightly and smile naturally',
        'Use the marble columns for framing'
      ],
      cameraSettings: {
        bestTime: 'Golden hour (6:30-7:30 AM)',
        lighting: 'Natural golden sunlight',
        angle: 'Low angle, slight upward tilt',
        equipment: 'Wide-angle lens, tripod recommended',
        aperture: 'f/8-f/11 for sharpness'
      },
      tips: [
        'Arrive early to avoid crowds',
        'Use symmetry in your composition',
        'Include reflections from the water channel',
        'Wear light colors to complement the white marble'
      ],
      hashtags: ['#TajMahal', '#India', '#GoldenHour', '#Architecture', '#UNESCO', '#Travel'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
          caption: 'Perfect golden hour framing',
          photographer: '@travel_guru'
        }
      ]
    },
    {
      id: '2',
      destinationId: '2',
      spotName: 'Eiffel Tower Night Magic',
      category: 'sunset',
      difficulty: 'moderate',
      influencerRating: '4.8',
      viralPotential: '0.92',
      poseInstructions: [
        'Position yourself at Trocadéro for best angle',
        'Create silhouette poses during blue hour',
        'Use tower\'s sparkle for dramatic backdrop',
        'Try jumping shots for dynamic energy'
      ],
      cameraSettings: {
        bestTime: 'Blue hour and hourly sparkles',
        lighting: 'Mixed artificial and ambient',
        angle: 'Eye level with tower base',
        equipment: 'Fast lens for low light',
        aperture: 'f/2.8-f/4 for night photography'
      },
      tips: [
        'Check tower lighting schedule',
        'Use manual focus for sharp night shots',
        'Bring tripod for long exposures',
        'Layer clothing for evening temperatures'
      ],
      hashtags: ['#EiffelTower', '#Paris', '#NightPhotography', '#BlueHour', '#Romance', '#France'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
          caption: 'Magical blue hour composition',
          photographer: '@paris_explorer'
        }
      ]
    }
  ];

  // Sample VR content
  const mockVRContent = {
    '1': {
      scenes: [
        {
          name: 'Main Entrance',
          url: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/city.jpg',
          description: 'Walk through the grand entrance gates',
          duration: '3 minutes',
          interactiveElements: ['info_hotspots', 'audio_guide', '360_rotation']
        },
        {
          name: 'Inner Courtyard',
          url: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg',
          description: 'Experience the marble courtyard',
          duration: '5 minutes',
          interactiveElements: ['architectural_details', 'historical_timeline', 'photo_spots']
        }
      ],
      metadata: {
        totalScenes: 2,
        estimatedDuration: '8 minutes',
        supportedDevices: ['VR Headsets', 'Mobile', 'Desktop'],
        requirements: 'WebXR compatible browser, good internet connection'
      }
    }
  };

  // Sample AR features
  const mockARFeatures = {
    '1': {
      features: [
        {
          name: 'Historical Timeline',
          description: 'See construction phases overlaid on the monument',
          triggers: ['qr_code', 'image_recognition', 'gps_location']
        },
        {
          name: 'Architecture Details',
          description: 'Interactive information about Islamic architecture',
          triggers: ['object_detection', 'proximity_sensor']
        }
      ],
      supportedPlatforms: ['iOS Safari', 'Android Chrome', 'WebXR'],
      requirements: 'Camera access, location services, modern browser'
    }
  };

  // API Routes

  // Destinations
  router.get('/api/destinations', (req, res) => {
    res.json(mockDestinations);
  });

  router.get('/api/destinations/:id', (req, res) => {
    const destination = mockDestinations.find(d => d.id === req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  });

  router.get('/api/destinations/search', (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    
    const results = mockDestinations.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(results);
  });

  // Photo Guides
  router.get('/api/photo-guides', (req, res) => {
    res.json(mockPhotoGuides);
  });

  router.get('/api/photo-guides/destination/:destinationId', (req, res) => {
    const guides = mockPhotoGuides.filter(g => g.destinationId === req.params.destinationId);
    res.json(guides);
  });

  // Weather (mock data)
  router.get('/api/weather/:destinationId', (req, res) => {
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
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: destination.climate.temperature + Math.floor(Math.random() * 10 - 5),
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
      }))
    });
  });

  // News (mock data)
  router.get('/api/news/:destinationId', (req, res) => {
    const destination = mockDestinations.find(d => d.id === req.params.destinationId);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json({
      news: [
        {
          title: `${destination.name} announces new visitor facilities`,
          description: 'Enhanced amenities and digital guides now available',
          source: 'Travel News',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          url: '#'
        },
        {
          title: 'Cultural festival celebrating local heritage',
          description: 'Annual celebration showcasing traditional arts and crafts',
          source: 'Local Tourism Board',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          url: '#'
        }
      ]
    });
  });

  // VR Content
  router.get('/api/vr-content/:destinationId', (req, res) => {
    const content = mockVRContent[req.params.destinationId as keyof typeof mockVRContent];
    if (!content) {
      return res.status(404).json({ error: 'VR content not found' });
    }
    res.json(content);
  });

  // AR Features
  router.get('/api/ar-features/:destinationId', (req, res) => {
    const features = mockARFeatures[req.params.destinationId as keyof typeof mockARFeatures];
    if (!features) {
      return res.status(404).json({ error: 'AR features not found' });
    }
    res.json(features);
  });

  // AI Recommendations
  router.post('/api/ai/recommendations', (req, res) => {
    const { preferences, budget, duration, interests, destinations } = req.body;

    // AI-powered recommendation logic (simplified)
    const recommendations = mockDestinations
      .filter(d => destinations.includes(d.id))
      .map(d => ({
        ...d,
        aiScore: Math.random() * 0.3 + 0.7, // 0.7-1.0 score
        reasonWhy: `Perfect match for ${preferences} travelers interested in ${interests.slice(0, 2).join(' and ')}`
      }))
      .sort((a, b) => b.aiScore - a.aiScore);

    res.json({
      aiInsights: `Based on your ${preferences} travel style and ${budget} budget, I've found ${recommendations.length} perfect destinations that match your interests in ${interests.slice(0, 3).join(', ')}. These locations offer the best combination of experiences for your ${duration}-day trip.`,
      recommendations: recommendations.slice(0, 3)
    });
  });

  // Travel Plans
  router.post('/api/travel-plans', (req, res) => {
    const planData = req.body;
    
    const plan: TravelPlan = {
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
      aiConfidenceScore: (Math.random() * 0.2 + 0.8).toString(), // 0.8-1.0
      aiInsights: `Your optimized ${planData.duration}-day itinerary balances ${planData.travelStyle} experiences with your budget preferences. The AI has sequenced activities for optimal flow and minimal travel time.`
    };

    res.json(plan);
  });

  // User Interactions (Analytics)
  router.post('/api/interactions', (req, res) => {
    const interaction: UserInteraction = {
      id: Math.random().toString(36).substr(2, 9),
      sessionId: req.body.sessionId,
      destinationId: req.body.destinationId,
      action: req.body.action,
      duration: req.body.duration,
      preferences: req.body.preferences,
      coordinates: req.body.coordinates,
      timestamp: new Date()
    };

    // In a real app, save to database
    console.log('User interaction tracked:', interaction);
    
    res.json({ success: true, id: interaction.id });
  });

  router.get('/api/interactions', (req, res) => {
    // Mock interaction data for analytics
    const mockInteractions = Array.from({ length: 50 }, (_, i) => ({
      id: i.toString(),
      sessionId: `session_${Math.floor(i / 10)}`,
      destinationId: mockDestinations[i % mockDestinations.length].id,
      action: ['view', 'like', 'share', 'vr_experience', 'ar_view'][i % 5] as any,
      duration: Math.floor(Math.random() * 300 + 30),
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
    }));

    res.json(mockInteractions);
  });

  // Search functionality
  router.get('/api/search', (req, res) => {
    const query = req.query.q as string;
    const category = req.query.category as string;

    if (!query) {
      return res.json({ destinations: [], photoGuides: [] });
    }

    const searchTerm = query.toLowerCase();
    
    const destinationResults = mockDestinations.filter(d => 
      d.name.toLowerCase().includes(searchTerm) ||
      d.country.toLowerCase().includes(searchTerm) ||
      d.description.toLowerCase().includes(searchTerm) ||
      d.activities.some(a => a.toLowerCase().includes(searchTerm))
    );

    const photoGuideResults = mockPhotoGuides.filter(g =>
      g.spotName.toLowerCase().includes(searchTerm) ||
      g.category.toLowerCase().includes(searchTerm) ||
      (!category || g.category === category)
    );

    res.json({
      destinations: destinationResults,
      photoGuides: photoGuideResults,
      totalResults: destinationResults.length + photoGuideResults.length
    });
  });

  return router;
}