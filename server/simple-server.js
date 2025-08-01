const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
      equipment: 'Wide-angle lens, tripod recommended'
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
        photographer: '@travel_guru'
      }
    ]
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

// Search
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const category = req.query.category;

  if (!query) {
    return res.json({ destinations: [], photoGuides: [] });
  }

  const searchTerm = query.toLowerCase();
  
  const destinationResults = mockDestinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm) ||
    d.country.toLowerCase().includes(searchTerm) ||
    d.description.toLowerCase().includes(searchTerm)
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