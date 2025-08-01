import type { Destination, PhotoGuide, TravelPlan, UserInteraction } from '@shared/schema.js';

export interface IStorage {
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | null>;
  createDestination(destination: Omit<Destination, 'id'>): Promise<Destination>;
  updateDestination(id: string, updates: Partial<Destination>): Promise<Destination | null>;
  deleteDestination(id: string): Promise<boolean>;
  searchDestinations(query: string): Promise<Destination[]>;

  // Photo Guides
  getPhotoGuides(): Promise<PhotoGuide[]>;
  getPhotoGuide(id: string): Promise<PhotoGuide | null>;
  getPhotoGuidesByDestination(destinationId: string): Promise<PhotoGuide[]>;
  createPhotoGuide(guide: Omit<PhotoGuide, 'id'>): Promise<PhotoGuide>;
  updatePhotoGuide(id: string, updates: Partial<PhotoGuide>): Promise<PhotoGuide | null>;
  deletePhotoGuide(id: string): Promise<boolean>;

  // Travel Plans
  getTravelPlans(): Promise<TravelPlan[]>;
  getTravelPlan(id: string): Promise<TravelPlan | null>;
  getTravelPlansByUser(userId: string): Promise<TravelPlan[]>;
  createTravelPlan(plan: Omit<TravelPlan, 'id'>): Promise<TravelPlan>;
  updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan | null>;
  deleteTravelPlan(id: string): Promise<boolean>;

  // User Interactions
  getUserInteractions(): Promise<UserInteraction[]>;
  getUserInteraction(id: string): Promise<UserInteraction | null>;
  getInteractionsBySession(sessionId: string): Promise<UserInteraction[]>;
  createUserInteraction(interaction: Omit<UserInteraction, 'id'>): Promise<UserInteraction>;
  getAnalytics(timeRange: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private destinations: Map<string, Destination> = new Map();
  private photoGuides: Map<string, PhotoGuide> = new Map();
  private travelPlans: Map<string, TravelPlan> = new Map();
  private userInteractions: Map<string, UserInteraction> = new Map();

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | null> {
    return this.destinations.get(id) || null;
  }

  async createDestination(destination: Omit<Destination, 'id'>): Promise<Destination> {
    const id = Math.random().toString(36).substr(2, 9);
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  async updateDestination(id: string, updates: Partial<Destination>): Promise<Destination | null> {
    const existing = this.destinations.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    this.destinations.set(id, updated);
    return updated;
  }

  async deleteDestination(id: string): Promise<boolean> {
    return this.destinations.delete(id);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(d =>
      d.name.toLowerCase().includes(searchTerm) ||
      d.country.toLowerCase().includes(searchTerm) ||
      d.description.toLowerCase().includes(searchTerm)
    );
  }

  // Photo Guides
  async getPhotoGuides(): Promise<PhotoGuide[]> {
    return Array.from(this.photoGuides.values());
  }

  async getPhotoGuide(id: string): Promise<PhotoGuide | null> {
    return this.photoGuides.get(id) || null;
  }

  async getPhotoGuidesByDestination(destinationId: string): Promise<PhotoGuide[]> {
    return Array.from(this.photoGuides.values()).filter(g => g.destinationId === destinationId);
  }

  async createPhotoGuide(guide: Omit<PhotoGuide, 'id'>): Promise<PhotoGuide> {
    const id = Math.random().toString(36).substr(2, 9);
    const newGuide: PhotoGuide = { ...guide, id };
    this.photoGuides.set(id, newGuide);
    return newGuide;
  }

  async updatePhotoGuide(id: string, updates: Partial<PhotoGuide>): Promise<PhotoGuide | null> {
    const existing = this.photoGuides.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    this.photoGuides.set(id, updated);
    return updated;
  }

  async deletePhotoGuide(id: string): Promise<boolean> {
    return this.photoGuides.delete(id);
  }

  // Travel Plans
  async getTravelPlans(): Promise<TravelPlan[]> {
    return Array.from(this.travelPlans.values());
  }

  async getTravelPlan(id: string): Promise<TravelPlan | null> {
    return this.travelPlans.get(id) || null;
  }

  async getTravelPlansByUser(userId: string): Promise<TravelPlan[]> {
    return Array.from(this.travelPlans.values()).filter(p => p.userId === userId);
  }

  async createTravelPlan(plan: Omit<TravelPlan, 'id'>): Promise<TravelPlan> {
    const id = Math.random().toString(36).substr(2, 9);
    const newPlan: TravelPlan = { ...plan, id };
    this.travelPlans.set(id, newPlan);
    return newPlan;
  }

  async updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan | null> {
    const existing = this.travelPlans.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    this.travelPlans.set(id, updated);
    return updated;
  }

  async deleteTravelPlan(id: string): Promise<boolean> {
    return this.travelPlans.delete(id);
  }

  // User Interactions
  async getUserInteractions(): Promise<UserInteraction[]> {
    return Array.from(this.userInteractions.values());
  }

  async getUserInteraction(id: string): Promise<UserInteraction | null> {
    return this.userInteractions.get(id) || null;
  }

  async getInteractionsBySession(sessionId: string): Promise<UserInteraction[]> {
    return Array.from(this.userInteractions.values()).filter(i => i.sessionId === sessionId);
  }

  async createUserInteraction(interaction: Omit<UserInteraction, 'id'>): Promise<UserInteraction> {
    const id = Math.random().toString(36).substr(2, 9);
    const newInteraction: UserInteraction = { ...interaction, id };
    this.userInteractions.set(id, newInteraction);
    return newInteraction;
  }

  async getAnalytics(timeRange: string): Promise<any> {
    const interactions = Array.from(this.userInteractions.values());
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const filteredInteractions = interactions.filter(i => i.timestamp >= cutoffDate);

    return {
      totalInteractions: filteredInteractions.length,
      uniqueSessions: new Set(filteredInteractions.map(i => i.sessionId)).size,
      topActions: this.getTopActions(filteredInteractions),
      topDestinations: this.getTopDestinations(filteredInteractions),
      averageDuration: this.calculateAverageDuration(filteredInteractions)
    };
  }

  private getTopActions(interactions: UserInteraction[]) {
    const actionCounts: Record<string, number> = {};
    interactions.forEach(i => {
      actionCounts[i.action] = (actionCounts[i.action] || 0) + 1;
    });
    
    return Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }

  private getTopDestinations(interactions: UserInteraction[]) {
    const destinationCounts: Record<string, number> = {};
    interactions.forEach(i => {
      if (i.destinationId) {
        destinationCounts[i.destinationId] = (destinationCounts[i.destinationId] || 0) + 1;
      }
    });
    
    return Object.entries(destinationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }

  private calculateAverageDuration(interactions: UserInteraction[]) {
    const durations = interactions.filter(i => i.duration).map(i => i.duration!);
    return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  }
}