import { z } from 'zod';

// Enhanced Destination schema with AI/ML/IoT features
export const destinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  description: z.string(),
  images: z.array(z.string()),
  climate: z.object({
    temperature: z.number(),
    humidity: z.number(),
    weatherCondition: z.string(),
    airQuality: z.number(),
    uvIndex: z.number(),
    seasonalTrends: z.array(z.object({
      month: z.string(),
      avgTemp: z.number(),
      rainfall: z.number(),
      crowdLevel: z.enum(['low', 'medium', 'high'])
    }))
  }),
  activities: z.array(z.string()),
  history: z.string(),
  culture: z.object({
    language: z.string(),
    currency: z.string(),
    traditions: z.array(z.string()),
    festivals: z.array(z.string())
  }),
  travelInfo: z.object({
    bestTimeToVisit: z.string(),
    averageCost: z.string(),
    visa: z.string(),
    safety: z.string()
  }),
  photoSpots: z.array(z.object({
    name: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }),
    description: z.string(),
    bestTime: z.string(),
    imageUrl: z.string()
  })),
  accommodation: z.array(z.object({
    name: z.string(),
    type: z.string(),
    priceRange: z.string(),
    rating: z.number()
  })),
  
  // AI/ML Enhancement Fields
  aiPopularityScore: z.number().default(0),
  sentimentScore: z.number().default(0),
  trendingScore: z.number().default(0),
  mlPredictions: z.object({
    nextWeekCrowdLevel: z.enum(['low', 'medium', 'high']),
    optimalVisitTime: z.string(),
    weatherForecast: z.array(z.object({
      date: z.string(),
      condition: z.string(),
      temperature: z.number(),
      confidence: z.number()
    })),
    priceFluctuations: z.array(z.object({
      period: z.string(),
      estimatedCost: z.number(),
      confidence: z.number()
    }))
  }).optional(),
  
  // IoT Sensor Data
  realTimeIoT: z.object({
    airQuality: z.object({
      pm25: z.number(),
      pm10: z.number(),
      co2: z.number(),
      timestamp: z.string()
    }),
    noise: z.object({
      decibels: z.number(),
      timestamp: z.string()
    }),
    traffic: z.object({
      vehicleCount: z.number(),
      averageSpeed: z.number(),
      congestionLevel: z.enum(['low', 'medium', 'high']),
      timestamp: z.string()
    }),
    footfall: z.object({
      currentCount: z.number(),
      peakHours: z.array(z.string()),
      timestamp: z.string()
    }),
    environmental: z.object({
      lighting: z.number(),
      humidity: z.number(),
      temperature: z.number(),
      timestamp: z.string()
    })
  }).optional(),
  
  // Swarm Intelligence Data
  swarmInsights: z.object({
    collectiveBehavior: z.object({
      averageGroupSize: z.number(),
      commonMovementPatterns: z.array(z.string()),
      socialInteractionLevel: z.enum(['low', 'medium', 'high']),
      emergentRoutes: z.array(z.object({
        path: z.array(z.object({ lat: z.number(), lng: z.number() })),
        popularity: z.number(),
        efficiency: z.number()
      }))
    }),
    crowdWisdom: z.object({
      consensusRating: z.number(),
      collectiveRecommendations: z.array(z.string()),
      emergentPreferences: z.object({
        activities: z.array(z.string()),
        timing: z.array(z.string()),
        budget: z.array(z.string())
      })
    }),
    swarmOptimization: z.object({
      bestPhotoSpots: z.array(z.object({
        location: z.object({ lat: z.number(), lng: z.number() }),
        score: z.number(),
        crowdValidated: z.boolean()
      })),
      optimalRoutes: z.array(z.object({
        waypoints: z.array(z.object({ lat: z.number(), lng: z.number() })),
        efficiency: z.number(),
        satisfaction: z.number()
      }))
    })
  }).optional(),
  
  // NLP-Enhanced Content
  nlpEnhancements: z.object({
    semanticTags: z.array(z.string()),
    emotionalProfile: z.object({
      joy: z.number(),
      excitement: z.number(),
      tranquility: z.number(),
      adventure: z.number(),
      cultural: z.number()
    }),
    languageVariants: z.object({
      descriptions: z.record(z.string()), // language code -> description
      culturalNuances: z.record(z.array(z.string())) // language code -> cultural tips
    }),
    intelligentSummary: z.object({
      oneMinuteRead: z.string(),
      keyHighlights: z.array(z.string()),
      personalizedInsights: z.array(z.string())
    })
  }).optional(),
  
  aiRecommendations: z.array(z.string()).optional()
});

// Enhanced Photo Guide schema with Computer Vision and AI
export const photoGuideSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  spotName: z.string(),
  category: z.enum(['scenic', 'architectural', 'cultural', 'adventure', 'food', 'sunset', 'wildlife', 'urban', 'nightlife']),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'expert']),
  influencerRating: z.string(),
  viralPotential: z.string(),
  poseInstructions: z.array(z.string()),
  cameraSettings: z.object({
    bestTime: z.string(),
    lighting: z.string(),
    angle: z.string(),
    equipment: z.string(),
    aperture: z.string().optional(),
    // AI-Enhanced Camera Settings
    aiOptimalSettings: z.object({
      iso: z.number(),
      shutterSpeed: z.string(),
      focusMode: z.string(),
      whiteBalance: z.string(),
      exposureCompensation: z.number()
    }).optional(),
    weatherAdaptations: z.array(z.object({
      condition: z.string(),
      adjustments: z.record(z.string())
    })).optional()
  }),
  tips: z.array(z.string()),
  hashtags: z.array(z.string()),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string(),
    photographer: z.string(),
    // Computer Vision Analysis
    aiAnalysis: z.object({
      compositionScore: z.number(),
      lightingQuality: z.number(),
      aestheticAppeal: z.number(),
      detectedObjects: z.array(z.object({
        object: z.string(),
        confidence: z.number(),
        bbox: z.array(z.number()) // [x, y, width, height]
      })),
      dominantColors: z.array(z.string()),
      mood: z.enum(['serene', 'energetic', 'dramatic', 'romantic', 'adventurous', 'peaceful']),
      technicalQuality: z.object({
        sharpness: z.number(),
        exposure: z.number(),
        colorBalance: z.number(),
        noise: z.number()
      })
    }).optional(),
    socialMetrics: z.object({
      likes: z.number(),
      shares: z.number(),
      saves: z.number(),
      viralityScore: z.number()
    }).optional()
  })),
  
  // Swarm Intelligence for Optimal Timing
  crowdSourcedOptimization: z.object({
    bestTimeSlots: z.array(z.object({
      timeRange: z.string(),
      qualityScore: z.number(),
      crowdLevel: z.enum(['low', 'medium', 'high']),
      weatherCompatibility: z.number()
    })),
    seasonalRecommendations: z.array(z.object({
      season: z.string(),
      advantages: z.array(z.string()),
      challenges: z.array(z.string()),
      bestMonths: z.array(z.string())
    })),
    collectiveWisdom: z.object({
      consensusBestAngle: z.string(),
      popularPoses: z.array(z.string()),
      crowdApprovedTips: z.array(z.string())
    })
  }).optional(),
  
  // ML-Based Personalization
  personalizedRecommendations: z.object({
    skillLevelAdaptation: z.object({
      beginner: z.array(z.string()),
      intermediate: z.array(z.string()),
      advanced: z.array(z.string())
    }),
    equipmentAlternatives: z.array(z.object({
      equipment: z.string(),
      alternatives: z.array(z.string()),
      tradeoffs: z.string()
    })),
    styleVariations: z.array(z.object({
      style: z.string(),
      modifications: z.array(z.string()),
      examples: z.array(z.string())
    }))
  }).optional()
});

// Travel Plan schema
export const travelPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  destinations: z.array(z.string()),
  duration: z.number(),
  budget: z.string(),
  preferences: z.array(z.string()),
  itinerary: z.array(z.object({
    day: z.number(),
    activities: z.array(z.object({
      time: z.string(),
      activity: z.string(),
      location: z.string(),
      duration: z.string(),
      cost: z.string(),
      bookingRequired: z.boolean()
    }))
  })),
  createdAt: z.date(),
  estimatedCost: z.number(),
  carbonFootprint: z.number(),
  aiConfidenceScore: z.string(),
  aiInsights: z.string()
});

// Enhanced User Interaction schema with ML behavioral analysis
export const userInteractionSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  destinationId: z.string().optional(),
  action: z.enum(['view', 'like', 'save', 'share', 'ar_view', 'vr_experience', 'photo_capture', 'route_plan', 'ai_query', 'swarm_join']),
  duration: z.number().optional(),
  preferences: z.object({
    interests: z.array(z.string()),
    budgetRange: z.string(),
    travelStyle: z.string()
  }).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  
  // Behavioral Analytics
  behaviorMetrics: z.object({
    scrollPattern: z.array(z.object({
      position: z.number(),
      time: z.number(),
      direction: z.enum(['up', 'down'])
    })),
    clickHeatmap: z.array(z.object({
      x: z.number(),
      y: z.number(),
      element: z.string(),
      timestamp: z.number()
    })),
    deviceContext: z.object({
      screenSize: z.string(),
      orientation: z.string(),
      browser: z.string(),
      connectionSpeed: z.string()
    }),
    engagementLevel: z.enum(['low', 'medium', 'high', 'expert'])
  }).optional(),
  
  // ML Pattern Recognition
  predictiveInsights: z.object({
    nextLikelyAction: z.string(),
    interestVector: z.array(z.number()),
    personalityProfile: z.object({
      adventurous: z.number(),
      cultural: z.number(),
      relaxed: z.number(),
      social: z.number(),
      budget_conscious: z.number()
    }),
    recommendationCompatibility: z.number()
  }).optional(),
  
  timestamp: z.date()
});

// IoT Sensor Data schema
export const iotSensorDataSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  sensorType: z.enum(['air_quality', 'noise', 'traffic', 'crowd_density', 'weather', 'lighting', 'temperature']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    altitude: z.number().optional()
  }),
  currentReading: z.object({
    value: z.number(),
    unit: z.string(),
    quality: z.enum(['excellent', 'good', 'fair', 'poor']),
    confidence: z.number()
  }),
  historicalTrends: z.array(z.object({
    timestamp: z.string(),
    value: z.number(),
    anomaly: z.boolean()
  })),
  mlPredictions: z.object({
    nextHour: z.number(),
    nextDay: z.number(),
    weeklyTrend: z.enum(['increasing', 'decreasing', 'stable']),
    confidence: z.number()
  }).optional(),
  timestamp: z.date()
});

// Swarm Intelligence Behavior schema
export const swarmBehaviorSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  swarmType: z.enum(['photo_optimization', 'route_planning', 'crowd_management', 'experience_optimization']),
  participantCount: z.number(),
  
  // Collective Intelligence Metrics
  collectiveBehavior: z.object({
    consensus: z.number(), // 0-1 agreement level
    emergentPattern: z.string(),
    groupDynamics: z.enum(['cooperative', 'competitive', 'exploratory', 'conservative']),
    coordinationLevel: z.number(),
    adaptability: z.number()
  }),
  
  // Swarm Algorithms Results
  optimizationResults: z.object({
    algorithm: z.enum(['particle_swarm', 'ant_colony', 'bee_colony', 'firefly', 'genetic']),
    objective: z.string(),
    fitnessScore: z.number(),
    iterations: z.number(),
    convergenceTime: z.number(),
    solution: z.record(z.any())
  }),
  
  // Emergent Properties
  emergentInsights: z.object({
    unexpectedPatterns: z.array(z.string()),
    collectiveWisdom: z.array(z.string()),
    groupRecommendations: z.array(z.object({
      recommendation: z.string(),
      confidence: z.number(),
      supportingEvidence: z.array(z.string())
    }))
  }),
  
  timestamp: z.date()
});

// ML Model Performance schema
export const mlModelSchema = z.object({
  id: z.string(),
  modelName: z.string(),
  modelType: z.enum(['recommendation', 'sentiment_analysis', 'computer_vision', 'predictive', 'nlp', 'swarm_optimization']),
  version: z.string(),
  
  // Performance Metrics
  performance: z.object({
    accuracy: z.number(),
    precision: z.number(),
    recall: z.number(),
    f1Score: z.number(),
    auc: z.number().optional(),
    latency: z.number(), // ms
    throughput: z.number() // requests/sec
  }),
  
  // Training Data
  trainingInfo: z.object({
    datasetSize: z.number(),
    features: z.array(z.string()),
    lastTraining: z.date(),
    epochs: z.number(),
    hyperparameters: z.record(z.any())
  }),
  
  // Real-time Monitoring
  monitoring: z.object({
    driftDetection: z.number(), // 0-1, higher means more drift
    errorRate: z.number(),
    predictionConfidence: z.number(),
    retrainingRequired: z.boolean()
  }),
  
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// NLP Analysis Results schema
export const nlpAnalysisSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  contentType: z.enum(['review', 'description', 'comment', 'query']),
  originalText: z.string(),
  
  // Core NLP Analysis
  languageDetection: z.object({
    language: z.string(),
    confidence: z.number(),
    alternativeLanguages: z.array(z.object({
      language: z.string(),
      confidence: z.number()
    }))
  }),
  
  sentimentAnalysis: z.object({
    polarity: z.number(), // -1 to 1
    subjectivity: z.number(), // 0 to 1
    emotions: z.object({
      joy: z.number(),
      anger: z.number(),
      fear: z.number(),
      sadness: z.number(),
      surprise: z.number(),
      disgust: z.number(),
      trust: z.number(),
      anticipation: z.number()
    }),
    overallSentiment: z.enum(['very_negative', 'negative', 'neutral', 'positive', 'very_positive'])
  }),
  
  // Advanced NLP Features
  semanticAnalysis: z.object({
    keyPhrases: z.array(z.object({
      phrase: z.string(),
      relevance: z.number(),
      category: z.string()
    })),
    namedEntities: z.array(z.object({
      entity: z.string(),
      type: z.enum(['PERSON', 'LOCATION', 'ORGANIZATION', 'DATE', 'MONEY', 'ACTIVITY']),
      confidence: z.number()
    })),
    topics: z.array(z.object({
      topic: z.string(),
      probability: z.number(),
      keywords: z.array(z.string())
    })),
    intentDetection: z.object({
      intent: z.enum(['information_seeking', 'booking', 'comparison', 'complaint', 'recommendation']),
      confidence: z.number()
    })
  }),
  
  // Translation and Localization
  translations: z.record(z.string()).optional(), // language code -> translated text
  culturalContext: z.object({
    culturalNuances: z.array(z.string()),
    localReferences: z.array(z.string()),
    adaptationSuggestions: z.array(z.string())
  }).optional(),
  
  timestamp: z.date()
});

// Advanced Analytics schema
export const advancedAnalyticsSchema = z.object({
  id: z.string(),
  analysisType: z.enum(['user_behavior', 'destination_performance', 'ai_model_metrics', 'swarm_intelligence', 'iot_insights']),
  timeRange: z.object({
    start: z.date(),
    end: z.date(),
    granularity: z.enum(['hour', 'day', 'week', 'month'])
  }),
  
  // Data Science Insights
  statisticalAnalysis: z.object({
    descriptiveStats: z.object({
      mean: z.number(),
      median: z.number(),
      stdDev: z.number(),
      skewness: z.number(),
      kurtosis: z.number()
    }),
    correlationMatrix: z.record(z.record(z.number())),
    trendAnalysis: z.object({
      direction: z.enum(['increasing', 'decreasing', 'stable', 'volatile']),
      strength: z.number(),
      seasonality: z.boolean(),
      cyclicPatterns: z.array(z.string())
    })
  }),
  
  // Predictive Analytics
  predictions: z.object({
    shortTerm: z.array(z.object({
      metric: z.string(),
      predictedValue: z.number(),
      confidence: z.number(),
      timeframe: z.string()
    })),
    longTerm: z.array(z.object({
      trend: z.string(),
      impact: z.enum(['low', 'medium', 'high']),
      probability: z.number()
    }))
  }),
  
  // Actionable Insights
  recommendations: z.array(z.object({
    action: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    expectedImpact: z.number(),
    confidence: z.number(),
    timeline: z.string()
  })),
  
  // Anomaly Detection
  anomalies: z.array(z.object({
    timestamp: z.date(),
    metric: z.string(),
    actualValue: z.number(),
    expectedValue: z.number(),
    severity: z.enum(['low', 'medium', 'high']),
    possibleCauses: z.array(z.string())
  })),
  
  createdAt: z.date()
});

// Export types
export type Destination = z.infer<typeof destinationSchema>;
export type PhotoGuide = z.infer<typeof photoGuideSchema>;
export type TravelPlan = z.infer<typeof travelPlanSchema>;
export type UserInteraction = z.infer<typeof userInteractionSchema>;
export type IoTSensorData = z.infer<typeof iotSensorDataSchema>;
export type SwarmBehavior = z.infer<typeof swarmBehaviorSchema>;
export type MLModel = z.infer<typeof mlModelSchema>;
export type NLPAnalysis = z.infer<typeof nlpAnalysisSchema>;
export type AdvancedAnalytics = z.infer<typeof advancedAnalyticsSchema>;