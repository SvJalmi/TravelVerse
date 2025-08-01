import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Camera, 
  Search, 
  Filter, 
  Heart, 
  Share, 
  Play,
  Clock,
  Star,
  MapPin,
  Aperture,
  Sun,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { PhotoGuide } from '@shared/schema';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'scenic', label: 'Scenic Views' },
  { value: 'architectural', label: 'Architecture' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'sunset', label: 'Sunrise/Sunset' },
];

const difficulties = [
  { value: '', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
];

export default function PhotoGuides() {
  const [, params] = useRoute('/photo-guides/:destinationId?');
  const destinationId = params?.destinationId;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<PhotoGuide | null>(null);
  const { trackInteraction } = useUserInteraction();
  const { toast } = useToast();

  const { data: photoGuides, isLoading } = useQuery({
    queryKey: destinationId 
      ? [`/api/photo-guides/destination/${destinationId}`]
      : ['/api/photo-guides'],
  });

  const { data: destinations } = useQuery({
    queryKey: ['/api/destinations'],
    select: (data: any[]) => data.reduce((acc, dest) => {
      acc[dest.id] = dest;
      return acc;
    }, {}),
  });

  useEffect(() => {
    trackInteraction({ action: 'view' });
  }, [trackInteraction]);

  const filteredGuides = photoGuides?.filter((guide: PhotoGuide) => {
    if (searchQuery && !guide.spotName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && guide.category !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty && guide.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const handleLikeGuide = (guide: PhotoGuide) => {
    trackInteraction({ 
      action: 'like', 
      destinationId: guide.destinationId 
    });
    toast({
      title: 'Added to favorites!',
      description: `Photo guide for ${guide.spotName} saved`,
    });
  };

  const handleShareGuide = async (guide: PhotoGuide) => {
    try {
      await navigator.clipboard.writeText(
        `Check out this amazing photo spot: ${guide.spotName}\n${window.location.origin}/photo-guides`
      );
      trackInteraction({ 
        action: 'share', 
        destinationId: guide.destinationId 
      });
      toast({
        title: 'Link copied!',
        description: 'Photo guide link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Could not copy link',
        variant: 'destructive',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'challenging': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Influencer Photo Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master the art of travel photography with professional tips, pose instructions, 
              and camera settings from top travel influencers.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search photo spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary w-80"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredGuides?.length || 0} photo guides found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3 mb-4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides?.map((guide: PhotoGuide) => {
              const destination = destinations?.[guide.destinationId];
              
              return (
                <Card 
                  key={guide.id} 
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer photo-guide-card"
                  onClick={() => setSelectedGuide(guide)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={guide.images[0]?.url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'}
                      alt={guide.spotName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-white text-sm rounded-full backdrop-blur-sm capitalize">
                      {guide.category}
                    </div>
                    
                    {/* Difficulty badge */}
                    <div className={cn(
                      "absolute top-4 right-4 px-3 py-1 text-sm rounded-full backdrop-blur-sm capitalize",
                      getDifficultyColor(guide.difficulty)
                    )}>
                      {guide.difficulty}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-16 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeGuide(guide);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareGuide(guide);
                        }}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Bottom info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-2">{guide.spotName}</h3>
                      {destination && (
                        <p className="text-sm opacity-90 flex items-center mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {destination.name}, {destination.country}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {guide.influencerRating}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {(parseFloat(guide.viralPotential || '0.5') * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {guide.cameraSettings.bestTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detailed Guide Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="relative">
                <img
                  src={selectedGuide.images[0]?.url}
                  alt={selectedGuide.spotName}
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedGuide(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedGuide.spotName}</h2>
                  <p className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {destinations?.[selectedGuide.destinationId]?.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pose Instructions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="mr-2 h-5 w-5" />
                        Pose Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedGuide.poseInstructions.map((instruction, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="w-6 h-6 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Camera Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Aperture className="mr-2 h-5 w-5" />
                        Camera Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Best Time</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedGuide.cameraSettings.bestTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Lighting</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedGuide.cameraSettings.lighting}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Angle</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedGuide.cameraSettings.angle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Equipment</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedGuide.cameraSettings.equipment}
                        </span>
                      </div>
                      {selectedGuide.cameraSettings.aperture && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Aperture</span>
                          <span className="text-sm text-muted-foreground">
                            {selectedGuide.cameraSettings.aperture}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pro Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedGuide.tips.map((tip, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <Star className="h-3 w-3 mr-2 mt-1 text-accent flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Hashtags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Hashtags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.hashtags.map((hashtag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* All Images */}
                {selectedGuide.images.length > 1 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Example Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedGuide.images.map((image, index) => (
                          <div key={index} className="space-y-2">
                            <img
                              src={image.url}
                              alt={image.caption}
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="text-xs text-muted-foreground">{image.caption}</p>
                            <p className="text-xs text-muted-foreground">By {image.photographer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}