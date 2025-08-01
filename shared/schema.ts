import { z } from 'zod';

// Destination schema
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
    weatherCondition: z.string()
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
  aiRecommendations: z.array(z.string()).optional()
});

// Photo Guide schema
export const photoGuideSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  spotName: z.string(),
  category: z.enum(['scenic', 'architectural', 'cultural', 'adventure', 'food', 'sunset']),
  difficulty: z.enum(['easy', 'moderate', 'challenging']),
  influencerRating: z.string(),
  viralPotential: z.string(),
  poseInstructions: z.array(z.string()),
  cameraSettings: z.object({
    bestTime: z.string(),
    lighting: z.string(),
    angle: z.string(),
    equipment: z.string(),
    aperture: z.string().optional()
  }),
  tips: z.array(z.string()),
  hashtags: z.array(z.string()),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string(),
    photographer: z.string()
  }))
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

// User Interaction schema
export const userInteractionSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  destinationId: z.string().optional(),
  action: z.enum(['view', 'like', 'save', 'share', 'ar_view', 'vr_experience']),
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
  timestamp: z.date()
});

// Export types
export type Destination = z.infer<typeof destinationSchema>;
export type PhotoGuide = z.infer<typeof photoGuideSchema>;
export type TravelPlan = z.infer<typeof travelPlanSchema>;
export type UserInteraction = z.infer<typeof userInteractionSchema>;