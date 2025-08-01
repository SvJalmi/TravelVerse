import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Camera, 
  Thermometer, 
  Calendar, 
  Star, 
  Heart, 
  Share, 
  Eye,
  Play,
  Headphones,
  Navigation,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { useToast } from '@/hooks/use-toast';
import { shareContent } from '@/lib/utils';
import type { Destination, PhotoGuide } from '@shared/schema';

export default function DestinationPage() {
  const [, params] = useRoute('/destination/:id');
  const destinationId = params?.id;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVR, setShowVR] = useState(false);
  const { trackInteraction } = useUserInteraction();
  const { toast } = useToast();

  const { data: destination, isLoading } = useQuery({
    queryKey: [`/api/destinations/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: photoGuides } = useQuery({
    queryKey: [`/api/photo-guides/destination/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: weather } = useQuery({
    queryKey: [`/api/weather/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: news } = useQuery({
    queryKey: [`/api/news/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: vrContent } = useQuery({
    queryKey: [`/api/vr-content/${destinationId}`],
    enabled: !!destinationId,
  });

  useEffect(() => {
    if (destinationId) {
      trackInteraction({
        action: 'view',
        destinationId,
        duration: 30,
      });
    }
  }, [destinationId, trackInteraction]);

  const handleShare = async () => {
    if (!destination) return;
    
    try {
      await shareContent(
        destination.name,
        `Check out this amazing destination: ${destination.description.slice(0, 100)}...`,
        window.location.href
      );
      trackInteraction({ action: 'share', destinationId });
      toast({
        title: 'Shared successfully!',
        description: 'Destination details copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Could not share destination details',
        variant: 'destructive',
      });
    }
  };

  const handleLike = () => {
    trackInteraction({ action: 'like', destinationId });
    toast({
      title: 'Added to favorites!',
      description: `${destination?.name} has been saved to your favorites`,
    });
  };

  const handleVRExperience = () => {
    if (vrContent?.scenes?.length > 0) {
      trackInteraction({ action: 'vr_experience', destinationId });
      window.location.href = `/vr/${destinationId}`;
    }
  };

  const handleARView = () => {
    trackInteraction({ action: 'ar_view', destinationId });
    window.location.href = `/ar/${destinationId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-96 bg-muted" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-40 bg-muted rounded mb-6" />
                <div className="h-60 bg-muted rounded" />
              </div>
              <div className="h-80 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={destination.images[selectedImageIndex] || destination.images[0]}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Image Navigation */}
        {destination.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {destination.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary" onClick={handleLike}>
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleShare}>
            <Share className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
          <p className="text-lg opacity-90 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {destination.country}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleVRExperience} disabled={!vrContent?.scenes?.length}>
                <Eye className="mr-2 h-4 w-4" />
                VR Experience
              </Button>
              <Button variant="outline" onClick={handleARView}>
                <Navigation className="mr-2 h-4 w-4" />
                AR View
              </Button>
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Photo Guide
              </Button>
              <Button variant="outline">
                <Headphones className="mr-2 h-4 w-4" />
                Audio Guide
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {destination.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {destination.description}
                </p>
                
                {/* Activities */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Popular Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* History */}
                <div>
                  <h3 className="font-semibold mb-3">History & Culture</h3>
                  <p className="text-muted-foreground">{destination.history}</p>
                </div>
              </CardContent>
            </Card>

            {/* Photo Spots */}
            {destination.photoSpots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    Instagram-Worthy Spots
                  </CardTitle>
                  <CardDescription>Perfect locations for your travel photos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.photoSpots.map((spot, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h4 className="font-medium mb-2">{spot.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{spot.description}</p>
                        <div className="text-xs text-accent">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Best time: {spot.bestTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News & Updates */}
            {news?.news && news.news.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest News & Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news.news.map((item: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.source} • {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="mr-2 h-5 w-5" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary">
                    {weather?.current?.temperature || destination.climate.temperature}°C
                  </div>
                  <div className="text-muted-foreground">
                    {weather?.current?.condition || destination.climate.weatherCondition}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Humidity</span>
                    <span>{weather?.current?.humidity || destination.climate.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind Speed</span>
                    <span>{weather?.current?.windSpeed || '12'} km/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Information */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Best Time to Visit
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.travelInfo.bestTimeToVisit}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Average Cost</h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.travelInfo.averageCost}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Visa Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.travelInfo.visa}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Safety Information</h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.travelInfo.safety}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cultural Information */}
            <Card>
              <CardHeader>
                <CardTitle>Cultural Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Language</h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.culture.language}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Currency</h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.culture.currency}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Local Traditions</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.culture.traditions.map((tradition, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                      >
                        {tradition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Festivals</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.culture.festivals.map((festival, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {festival}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            {destination.aiRecommendations && destination.aiRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {destination.aiRecommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <Star className="h-3 w-3 mr-2 mt-0.5 text-accent flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Accommodation */}
            {destination.accommodation.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Stays</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {destination.accommodation.map((place, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-muted-foreground">{place.type}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium">{place.priceRange}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-accent mr-1" />
                            <span className="text-sm">{place.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}