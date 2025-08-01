import { pgTable, text, integer, decimal, boolean, timestamp, jsonb, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Destinations table with advanced geospatial and analytics features
export const destinations = pgTable('destinations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  region: varchar('region', { length: 100 }),
  coordinates: jsonb('coordinates').$type<{ lat: number; lng: number }>().notNull(),
  description: text('description').notNull(),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  photoSpots: jsonb('photo_spots').$type<Array<{
    name: string;
    coordinates: { lat: number; lng: number };
    description: string;
    poseInstructions: string;
    bestTime: string;
    imageUrl: string;
  }>>().notNull().default([]),
  climate: jsonb('climate').$type<{
    temperature: number;
    humidity: number;
    weatherCondition: string;
    season: string;
  }>().notNull(),
  culture: jsonb('culture').$type<{
    language: string;
    currency: string;
    traditions: string[];
    festivals: string[];
  }>().notNull(),
  history: text('history').notNull(),
  travelInfo: jsonb('travel_info').$type<{
    bestTimeToVisit: string;
    averageCost: string;
    visa: string;
    safety: string;
  }>().notNull(),
  activities: jsonb('activities').$type<string[]>().notNull().default([]),
  accommodation: jsonb('accommodation').$type<Array<{
    name: string;
    type: string;
    priceRange: string;
    rating: number;
  }>>().notNull().default([]),
  news: jsonb('news').$type<Array<{
    title: string;
    description: string;
    date: string;
    source: string;
  }>>().notNull().default([]),
  vrExperience: jsonb('vr_experience').$type<{
    available: boolean;
    scenes: string[];
  }>().default({ available: false, scenes: [] }),
  arFeatures: jsonb('ar_features').$type<string[]>().default([]),
  aiRecommendations: jsonb('ai_recommendations').$type<string[]>().default([]),
  popularityScore: decimal('popularity_score', { precision: 4, scale: 2 }).default('0'),
  sustainabilityRating: integer('sustainability_rating').default(5),
  crowdLevel: integer('crowd_level').default(3), // 1-5 scale
  averageStayDuration: decimal('average_stay_duration', { precision: 3, scale: 1 }).default('2.5'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  countryIdx: index('destinations_country_idx').on(table.country),
  popularityIdx: index('destinations_popularity_idx').on(table.popularityScore),
  nameIdx: index('destinations_name_idx').on(table.name),
}));

// Travel plans with AI-powered recommendations
export const travelPlans = pgTable('travel_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  destinations: jsonb('destinations').$type<string[]>().notNull(),
  duration: integer('duration').notNull(),
  budget: varchar('budget', { length: 50 }),
  preferences: jsonb('preferences').$type<string[]>().notNull().default([]),
  travelStyle: varchar('travel_style', { length: 50 }).default('balanced'),
  groupSize: integer('group_size').default(1),
  itinerary: jsonb('itinerary').$type<Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      duration: string;
      cost?: string;
      bookingRequired?: boolean;
    }>;
  }>>().notNull().default([]),
  aiInsights: text('ai_insights'),
  aiConfidenceScore: decimal('ai_confidence_score', { precision: 3, scale: 2 }).default('0.85'),
  carbonFootprint: decimal('carbon_footprint', { precision: 8, scale: 2 }),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }).default('draft'), // draft, active, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('travel_plans_user_idx').on(table.userId),
  sessionIdx: index('travel_plans_session_idx').on(table.sessionId),
  statusIdx: index('travel_plans_status_idx').on(table.status),
}));

// Advanced user interaction tracking for ML/AI personalization
export const userInteractions = pgTable('user_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }),
  destinationId: uuid('destination_id').references(() => destinations.id),
  action: varchar('action', { length: 50 }).notNull(),
  duration: integer('duration'), // in seconds
  deviceType: varchar('device_type', { length: 20 }),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  coordinates: jsonb('coordinates').$type<{ lat: number; lng: number }>(),
  preferences: jsonb('preferences').$type<{
    interests: string[];
    budgetRange: string;
    travelStyle: string;
    accessibility?: string[];
  }>(),
  sentiment: varchar('sentiment', { length: 20 }), // positive, negative, neutral
  engagement_score: decimal('engagement_score', { precision: 3, scale: 2 }),
  conversionProbability: decimal('conversion_probability', { precision: 3, scale: 2 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index('user_interactions_session_idx').on(table.sessionId),
  destinationIdx: index('user_interactions_destination_idx').on(table.destinationId),
  actionIdx: index('user_interactions_action_idx').on(table.action),
  timestampIdx: index('user_interactions_timestamp_idx').on(table.timestamp),
}));

// Enhanced photo guides with influencer content
export const photoGuides = pgTable('photo_guides', {
  id: uuid('id').primaryKey().defaultRandom(),
  destinationId: uuid('destination_id').references(() => destinations.id).notNull(),
  creatorId: varchar('creator_id', { length: 255 }),
  spotName: varchar('spot_name', { length: 255 }).notNull(),
  coordinates: jsonb('coordinates').$type<{ lat: number; lng: number }>().notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  subcategory: varchar('subcategory', { length: 50 }),
  poseInstructions: jsonb('pose_instructions').$type<string[]>().notNull(),
  cameraSettings: jsonb('camera_settings').$type<{
    bestTime: string;
    lighting: string;
    angle: string;
    equipment: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
  }>().notNull(),
  hashtags: jsonb('hashtags').$type<string[]>().notNull(),
  difficulty: varchar('difficulty', { length: 20 }).notNull(),
  accessibility: varchar('accessibility', { length: 50 }).default('moderate'),
  crowdFactor: integer('crowd_factor').default(3), // 1-5 scale
  images: jsonb('images').$type<Array<{
    url: string;
    caption: string;
    photographer: string;
    likes?: number;
    featured?: boolean;
  }>>().notNull(),
  videos: jsonb('videos').$type<Array<{
    url: string;
    title: string;
    duration: string;
    views?: number;
  }>>().default([]),
  tips: jsonb('tips').$type<string[]>().notNull(),
  seasonality: varchar('seasonality', { length: 100 }),
  weatherDependency: boolean('weather_dependency').default(false),
  permitsRequired: boolean('permits_required').default(false),
  safetyNotes: jsonb('safety_notes').$type<string[]>().default([]),
  influencerRating: decimal('influencer_rating', { precision: 3, scale: 2 }).default('4.5'),
  viralPotential: decimal('viral_potential', { precision: 3, scale: 2 }).default('0.5'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  destinationIdx: index('photo_guides_destination_idx').on(table.destinationId),
  categoryIdx: index('photo_guides_category_idx').on(table.category),
  difficultyIdx: index('photo_guides_difficulty_idx').on(table.difficulty),
  ratingIdx: index('photo_guides_rating_idx').on(table.influencerRating),
}));

// Real-time analytics and insights
export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  destinationId: uuid('destination_id').references(() => destinations.id),
  date: timestamp('date').defaultNow().notNull(),
  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  averageEngagement: decimal('average_engagement', { precision: 4, scale: 2 }).default('0'),
  bounceRate: decimal('bounce_rate', { precision: 4, scale: 2 }).default('0'),
  conversionRate: decimal('conversion_rate', { precision: 4, scale: 2 }).default('0'),
  topActions: jsonb('top_actions').$type<Array<{ action: string; count: number }>>().default([]),
  demographicData: jsonb('demographic_data').$type<{
    ageGroups: { [key: string]: number };
    countries: { [key: string]: number };
    devices: { [key: string]: number };
  }>().default({}),
  seasonalTrends: jsonb('seasonal_trends').$type<{ [month: string]: number }>().default({}),
  sentimentAnalysis: jsonb('sentiment_analysis').$type<{
    positive: number;
    negative: number;
    neutral: number;
  }>().default({ positive: 0, negative: 0, neutral: 0 }),
}, (table) => ({
  destinationDateIdx: index('analytics_destination_date_idx').on(table.destinationId, table.date),
  dateIdx: index('analytics_date_idx').on(table.date),
}));

// IoT sensor data for real-time destination conditions
export const sensorData = pgTable('sensor_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  destinationId: uuid('destination_id').references(() => destinations.id).notNull(),
  sensorType: varchar('sensor_type', { length: 50 }).notNull(), // weather, crowd, air_quality, noise
  sensorId: varchar('sensor_id', { length: 100 }).notNull(),
  location: jsonb('location').$type<{ lat: number; lng: number; altitude?: number }>().notNull(),
  readings: jsonb('readings').$type<{
    temperature?: number;
    humidity?: number;
    airQuality?: number;
    noiseLevel?: number;
    crowdDensity?: number;
    visibility?: number;
    uvIndex?: number;
    windSpeed?: number;
    precipitation?: number;
  }>().notNull(),
  quality: varchar('quality', { length: 20 }).default('good'), // good, fair, poor
  batteryLevel: integer('battery_level'),
  lastMaintenance: timestamp('last_maintenance'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  destinationSensorIdx: index('sensor_data_destination_sensor_idx').on(table.destinationId, table.sensorType),
  timestampIdx: index('sensor_data_timestamp_idx').on(table.timestamp),
  sensorIdx: index('sensor_data_sensor_idx').on(table.sensorId),
}));

// Define relations
export const destinationsRelations = relations(destinations, ({ many }) => ({
  photoGuides: many(photoGuides),
  userInteractions: many(userInteractions),
  analytics: many(analytics),
  sensorData: many(sensorData),
}));

export const photoGuidesRelations = relations(photoGuides, ({ one }) => ({
  destination: one(destinations, {
    fields: [photoGuides.destinationId],
    references: [destinations.id],
  }),
}));

export const userInteractionsRelations = relations(userInteractions, ({ one }) => ({
  destination: one(destinations, {
    fields: [userInteractions.destinationId],
    references: [destinations.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  destination: one(destinations, {
    fields: [analytics.destinationId],
    references: [destinations.id],
  }),
}));

export const sensorDataRelations = relations(sensorData, ({ one }) => ({
  destination: one(destinations, {
    fields: [sensorData.destinationId],
    references: [destinations.id],
  }),
}));