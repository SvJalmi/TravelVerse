import { eq, ilike, and, desc, asc, sql, inArray } from 'drizzle-orm';
import { db } from './connection.js';
import { destinations, travelPlans, userInteractions, photoGuides, analytics, sensorData } from './schema.js';
import { IStorage } from '../storage.js';
import { 
  Destination, 
  TravelPlan, 
  UserInteraction, 
  PhotoGuide,
  InsertDestination,
  InsertTravelPlan,
  InsertUserInteraction,
  InsertPhotoGuide
} from '../../shared/schema.js';

export class PostgreSQLStorage implements IStorage {
  // Destination operations with advanced analytics
  async getDestinations(): Promise<Destination[]> {
    const results = await db
      .select()
      .from(destinations)
      .orderBy(desc(destinations.popularityScore), asc(destinations.name));
    
    return results as Destination[];
  }

  async getDestination(id: string): Promise<Destination | null> {
    const results = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, id))
      .limit(1);
    
    if (results.length === 0) return null;
    
    // Update analytics - track view
    await this.trackAnalytics(id, 'view');
    
    return results[0] as Destination;
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const results = await db
      .select()
      .from(destinations)
      .where(
        sql`
          LOWER(${destinations.name}) LIKE ${searchTerm} OR 
          LOWER(${destinations.country}) LIKE ${searchTerm} OR 
          LOWER(${destinations.description}) LIKE ${searchTerm} OR
          EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${destinations.activities}) AS activity 
            WHERE LOWER(activity) LIKE ${searchTerm}
          )
        `
      )
      .orderBy(desc(destinations.popularityScore));
    
    return results as Destination[];
  }

  async getDestinationsByCountry(country: string): Promise<Destination[]> {
    const results = await db
      .select()
      .from(destinations)
      .where(ilike(destinations.country, country))
      .orderBy(desc(destinations.popularityScore));
    
    return results as Destination[];
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const results = await db
      .insert(destinations)
      .values({
        ...destination,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return results[0] as Destination;
  }

  async updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | null> {
    const results = await db
      .update(destinations)
      .set({
        ...destination,
        updatedAt: new Date(),
      })
      .where(eq(destinations.id, id))
      .returning();
    
    return results.length > 0 ? (results[0] as Destination) : null;
  }

  // Advanced destination recommendations using ML-style scoring
  async getRecommendations(preferences: {
    interests?: string[];
    budgetRange?: string;
    travelStyle?: string;
    previousDestinations?: string[];
  }): Promise<Destination[]> {
    let query = db.select().from(destinations);
    
    // Filter out previously visited destinations
    if (preferences.previousDestinations?.length) {
      query = query.where(sql`${destinations.id} NOT IN ${preferences.previousDestinations}`);
    }
    
    // Apply ML-style scoring based on preferences
    const results = await query
      .orderBy(
        sql`
          CASE 
            WHEN ${preferences.budgetRange} = 'budget' AND ${destinations.travelInfo}->>'averageCost' LIKE '%$%' THEN 2
            WHEN ${preferences.budgetRange} = 'luxury' AND ${destinations.travelInfo}->>'averageCost' LIKE '%$$%' THEN 2
            ELSE 1
          END * ${destinations.popularityScore} DESC
        `,
        desc(destinations.sustainabilityRating)
      )
      .limit(10);
    
    return results as Destination[];
  }

  // Travel plan operations with AI insights
  async getTravelPlans(): Promise<TravelPlan[]> {
    const results = await db
      .select()
      .from(travelPlans)
      .orderBy(desc(travelPlans.createdAt));
    
    return results as TravelPlan[];
  }

  async getTravelPlan(id: string): Promise<TravelPlan | null> {
    const results = await db
      .select()
      .from(travelPlans)
      .where(eq(travelPlans.id, id))
      .limit(1);
    
    return results.length > 0 ? (results[0] as TravelPlan) : null;
  }

  async createTravelPlan(plan: InsertTravelPlan): Promise<TravelPlan> {
    // Calculate AI insights and cost estimates
    const destinations_data = await db
      .select()
      .from(destinations)
      .where(inArray(destinations.id, plan.destinations));
    
    const estimatedCost = this.calculateTripCost(destinations_data, plan.duration, plan.budget);
    const carbonFootprint = this.calculateCarbonFootprint(destinations_data);
    const aiInsights = this.generateAIInsights(destinations_data, plan);
    
    const results = await db
      .insert(travelPlans)
      .values({
        ...plan,
        estimatedCost,
        carbonFootprint,
        aiInsights,
        aiConfidenceScore: '0.85',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return results[0] as TravelPlan;
  }

  // User interaction tracking for personalization
  async getUserInteractions(): Promise<UserInteraction[]> {
    const results = await db
      .select()
      .from(userInteractions)
      .orderBy(desc(userInteractions.timestamp));
    
    return results as UserInteraction[];
  }

  async getUserInteractionsBySession(sessionId: string): Promise<UserInteraction[]> {
    const results = await db
      .select()
      .from(userInteractions)
      .where(eq(userInteractions.sessionId, sessionId))
      .orderBy(desc(userInteractions.timestamp));
    
    return results as UserInteraction[];
  }

  async createUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    // Calculate engagement score based on action and duration
    const engagementScore = this.calculateEngagementScore(interaction.action, interaction.duration);
    
    const results = await db
      .insert(userInteractions)
      .values({
        ...interaction,
        engagement_score: engagementScore.toString(),
        sentiment: 'neutral', // Would integrate with sentiment analysis API
        timestamp: new Date(),
      })
      .returning();
    
    return results[0] as UserInteraction;
  }

  // Photo guide operations with influencer features
  async getPhotoGuides(): Promise<PhotoGuide[]> {
    const results = await db
      .select()
      .from(photoGuides)
      .orderBy(desc(photoGuides.influencerRating), desc(photoGuides.viralPotential));
    
    return results as PhotoGuide[];
  }

  async getPhotoGuidesByDestination(destinationId: string): Promise<PhotoGuide[]> {
    const results = await db
      .select()
      .from(photoGuides)
      .where(eq(photoGuides.destinationId, destinationId))
      .orderBy(desc(photoGuides.influencerRating));
    
    return results as PhotoGuide[];
  }

  async createPhotoGuide(guide: InsertPhotoGuide): Promise<PhotoGuide> {
    // Calculate viral potential based on various factors
    const viralPotential = this.calculateViralPotential(guide);
    
    const results = await db
      .insert(photoGuides)
      .values({
        ...guide,
        viralPotential: viralPotential.toString(),
        influencerRating: '4.5',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return results[0] as PhotoGuide;
  }

  // Analytics and IoT data operations
  async trackAnalytics(destinationId: string, action: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if analytics record exists for today
    const existing = await db
      .select()
      .from(analytics)
      .where(
        and(
          eq(analytics.destinationId, destinationId),
          eq(analytics.date, today)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing record
      await db
        .update(analytics)
        .set({
          views: sql`${analytics.views} + 1`,
          averageEngagement: sql`(${analytics.averageEngagement} + 1) / 2`, // Simple average
        })
        .where(eq(analytics.id, existing[0].id));
    } else {
      // Create new record
      await db
        .insert(analytics)
        .values({
          destinationId,
          date: today,
          views: 1,
          uniqueVisitors: 1,
          averageEngagement: '1',
        });
    }
  }

  async getSensorData(destinationId: string, sensorType?: string): Promise<any[]> {
    let query = db
      .select()
      .from(sensorData)
      .where(eq(sensorData.destinationId, destinationId));
    
    if (sensorType) {
      query = query.where(eq(sensorData.sensorType, sensorType));
    }
    
    const results = await query
      .orderBy(desc(sensorData.timestamp))
      .limit(100);
    
    return results;
  }

  async addSensorReading(reading: {
    destinationId: string;
    sensorType: string;
    sensorId: string;
    location: { lat: number; lng: number };
    readings: any;
  }): Promise<void> {
    await db
      .insert(sensorData)
      .values({
        ...reading,
        quality: 'good',
        timestamp: new Date(),
      });
  }

  // AI and ML helper methods
  private calculateTripCost(destinations: any[], duration: number, budget: string): string {
    // Simulate cost calculation based on destinations and duration
    const baseCost = destinations.reduce((sum, dest) => {
      const costMatch = dest.travelInfo?.averageCost?.match(/\$(\d+)-(\d+)/);
      if (costMatch) {
        return sum + (parseInt(costMatch[1]) + parseInt(costMatch[2])) / 2;
      }
      return sum + 100; // Default cost
    }, 0);
    
    return (baseCost * duration).toFixed(2);
  }

  private calculateCarbonFootprint(destinations: any[]): string {
    // Simulate carbon footprint calculation
    const avgFootprint = destinations.length * 500; // kg CO2 per destination
    return avgFootprint.toFixed(2);
  }

  private generateAIInsights(destinations: any[], plan: any): string {
    const insights = [
      `Your ${plan.duration}-day trip covers ${destinations.length} destinations`,
      `Best time to visit: ${destinations[0]?.travelInfo?.bestTimeToVisit || 'Year-round'}`,
      `Cultural highlights: ${destinations.map(d => d.culture?.language).filter(Boolean).join(', ')}`,
      `Recommended activities: ${destinations.flatMap(d => d.activities || []).slice(0, 3).join(', ')}`
    ];
    
    return insights.join('. ') + '.';
  }

  private calculateEngagementScore(action: string, duration?: number): number {
    const baseScores: { [key: string]: number } = {
      'view': 1,
      'like': 2,
      'save': 3,
      'share': 4,
      'ar_view': 5,
      'vr_experience': 6
    };
    
    let score = baseScores[action] || 1;
    
    // Boost score based on duration
    if (duration && duration > 30) {
      score *= 1.5;
    }
    
    return Math.min(score, 10); // Cap at 10
  }

  private calculateViralPotential(guide: any): number {
    let score = 0.5; // Base score
    
    // Factor in category popularity
    const popularCategories = ['scenic', 'sunset', 'adventure'];
    if (popularCategories.includes(guide.category)) {
      score += 0.2;
    }
    
    // Factor in difficulty (easier = more viral)
    if (guide.difficulty === 'easy') {
      score += 0.2;
    }
    
    // Factor in number of images
    if (guide.images?.length > 3) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  }
}