import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Brain, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Zap, 
  Clock,
  Plane,
  Camera,
  Utensils,
  Bed,
  Car,
  Lightbulb,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

const budgetRanges = [
  { value: 'budget', label: 'Budget ($50-100/day)', icon: '💰' },
  { value: 'moderate', label: 'Moderate ($100-200/day)', icon: '💎' },
  { value: 'luxury', label: 'Luxury ($200+/day)', icon: '👑' },
];

const travelStyles = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'foodie', label: 'Foodie', icon: '🍜' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌃' },
];

const interests = [
  'Nature & Wildlife', 'Architecture', 'Museums', 'Food & Dining', 
  'Adventure Sports', 'Beaches', 'Mountains', 'History', 
  'Art & Culture', 'Shopping', 'Nightlife', 'Photography',
  'Wellness & Spa', 'Local Markets', 'Festivals', 'Temples & Churches'
];

export default function AIPlanner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destinations: [] as string[],
    duration: 7,
    budget: 'moderate',
    travelStyle: 'balanced',
    groupSize: 2,
    interests: [] as string[],
    accessibility: [] as string[],
    preferences: {
      accommodation: 'hotel',
      transportation: 'mixed',
      mealStyle: 'local',
      pacePreference: 'moderate'
    }
  });
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  const { trackInteraction } = useUserInteraction();
  const { toast } = useToast();

  const { data: destinations } = useQuery({
    queryKey: ['/api/destinations'],
  });

  const recommendationsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      setAiRecommendations(data);
      setStep(3);
      trackInteraction({ action: 'view', duration: 60 });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate AI recommendations',
        variant: 'destructive',
      });
    },
  });

  const planMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/travel-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      setGeneratedPlan(data);
      setStep(4);
      trackInteraction({ action: 'view', duration: 120 });
      toast({
        title: 'Plan Created!',
        description: 'Your personalized travel plan is ready',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create travel plan',
        variant: 'destructive',
      });
    },
  });

  const handleNext = () => {
    if (step === 1) {
      if (formData.destinations.length === 0) {
        toast({
          title: 'Please select destinations',
          description: 'Choose at least one destination for your trip',
          variant: 'destructive',
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Generate AI recommendations
      recommendationsMutation.mutate({
        preferences: formData.travelStyle,
        budget: formData.budget,
        duration: formData.duration,
        interests: formData.interests,
        destinations: formData.destinations,
      });
    }
  };

  const handleCreatePlan = () => {
    const planData = {
      destinations: formData.destinations,
      duration: formData.duration,
      budget: formData.budget,
      preferences: formData.interests,
      travelStyle: formData.travelStyle,
      groupSize: formData.groupSize,
      itinerary: generateItinerary(),
    };
    
    planMutation.mutate(planData);
  };

  const generateItinerary = () => {
    // Generate a sample itinerary based on selections
    const activities = [
      'Morning: Explore historic city center',
      'Afternoon: Visit local museum',
      'Evening: Traditional dinner experience',
      'Morning: Nature hike and photography',
      'Afternoon: Local market tour',
      'Evening: Sunset viewing spot',
      'Morning: Adventure activity',
      'Afternoon: Cultural site visit',
      'Evening: Local entertainment'
    ];

    return Array.from({ length: formData.duration }, (_, day) => ({
      day: day + 1,
      activities: activities.slice(day * 3, (day + 1) * 3).map((activity, index) => ({
        time: ['9:00 AM', '2:00 PM', '7:00 PM'][index],
        activity,
        location: 'Various locations',
        duration: ['3 hours', '4 hours', '2 hours'][index],
        cost: ['$25', '$35', '$45'][index],
        bookingRequired: index === 2
      }))
    }));
  };

  const toggleDestination = (destId: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destId)
        ? prev.destinations.filter(id => id !== destId)
        : [...prev.destinations, destId]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Brain className="mr-3 h-10 w-10 text-primary" />
              AI Travel Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized travel recommendations powered by advanced AI and machine learning
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step >= stepNum 
                    ? "bg-primary text-white" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={cn(
                    "w-12 h-1 mx-2 transition-colors",
                    step > stepNum ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Step 1: Destination Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-6 w-6" />
                Choose Your Destinations
              </CardTitle>
              <CardDescription>
                Select the destinations you'd like to visit. Our AI will optimize your itinerary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {destinations?.map((destination: any) => (
                  <div
                    key={destination.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                      formData.destinations.includes(destination.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleDestination(destination.id)}
                  >
                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold">{destination.name}</h3>
                    <p className="text-sm text-muted-foreground">{destination.country}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <Zap className="h-3 w-3 mr-1 text-accent" />
                      {destination.activities.length} activities
                    </div>
                  </div>
                ))}
              </div>

              {/* Basic Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Group Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.groupSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.icon} {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={formData.destinations.length === 0}>
                  Next: Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell Us Your Preferences</CardTitle>
              <CardDescription>
                Help our AI understand your travel style and interests for better recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Travel Style */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Travel Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {travelStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.value }))}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all hover:shadow-md",
                        formData.travelStyle === style.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Interests</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-3 py-2 rounded-full text-sm transition-colors",
                        formData.interests.includes(interest)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-primary/10"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={recommendationsMutation.isPending}
                >
                  {recommendationsMutation.isPending ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Recommendations...
                    </>
                  ) : (
                    <>
                      Get AI Recommendations
                      <Zap className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Recommendations */}
        {step === 3 && aiRecommendations && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-6 w-6 text-accent" />
                  AI Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {aiRecommendations.aiInsights}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiRecommendations.recommendations.map((dest: any) => (
                    <Card key={dest.id} className="border-2 border-primary/20">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={dest.images[0]}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                          <Star className="inline h-3 w-3 mr-1" />
                          {(dest.aiScore * 10).toFixed(1)}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{dest.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {dest.reasonWhy}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary font-medium">
                            {dest.climate.temperature}°C
                          </span>
                          <span className="text-muted-foreground">
                            {dest.activities.length} activities
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Preferences
              </Button>
              <Button 
                onClick={handleCreatePlan}
                disabled={planMutation.isPending}
              >
                {planMutation.isPending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Plan...
                  </>
                ) : (
                  'Create Detailed Itinerary'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Generated Plan */}
        {step === 4 && generatedPlan && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-primary" />
                  Your Personalized Travel Plan
                </CardTitle>
                <CardDescription>
                  AI-optimized {formData.duration}-day itinerary for {formData.groupSize} traveler(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Estimated Cost</div>
                    <div className="text-sm text-muted-foreground">
                      ${generatedPlan.estimatedCost}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <Plane className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="font-semibold">Carbon Footprint</div>
                    <div className="text-sm text-muted-foreground">
                      {generatedPlan.carbonFootprint} kg CO₂
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">AI Confidence</div>
                    <div className="text-sm text-muted-foreground">
                      {(parseFloat(generatedPlan.aiConfidenceScore) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedPlan.itinerary.map((day: any) => (
                    <Card key={day.day}>
                      <CardHeader>
                        <CardTitle className="text-lg">Day {day.day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {day.activities.map((activity: any, index: number) => (
                            <div key={index} className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                              <div className="text-sm font-medium text-primary min-w-20">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{activity.activity}</div>
                                <div className="text-sm text-muted-foreground">
                                  {activity.location} • {activity.duration}
                                </div>
                                {activity.bookingRequired && (
                                  <div className="text-xs text-accent mt-1">
                                    ⚠️ Advance booking recommended
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium">
                                {activity.cost}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4 text-accent" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedPlan.aiInsights}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => setStep(1)}>
                Plan Another Trip
              </Button>
              <Button variant="outline">
                Download PDF
              </Button>
              <Button variant="outline">
                Share Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}