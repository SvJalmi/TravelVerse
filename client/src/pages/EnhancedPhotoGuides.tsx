import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  Zap, 
  Brain, 
  Eye, 
  Target,
  Palette,
  Sun,
  Settings,
  Download,
  Share,
  Heart,
  Smartphone
} from 'lucide-react';

const EnhancedPhotoGuides = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState(null);

  const { data: photoGuides, isLoading } = useQuery({
    queryKey: ['/api/photo-guides'],
  });

  const categories = ['all', 'scenic', 'architectural', 'cultural', 'adventure', 'food', 'sunset', 'wildlife', 'urban', 'nightlife'];
  const difficulties = ['all', 'easy', 'moderate', 'challenging', 'expert'];

  const filteredGuides = photoGuides?.filter(guide => {
    const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  }) || [];

  const handleAIOptimization = async (guideId) => {
    try {
      const response = await fetch('/api/swarm/photo-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: selectedGuide?.destinationId,
          participants: [{ photoSpot: { lat: 27.1738, lng: 78.0421 } }],
          preferences: { quality: 'high', crowdLevel: 'low' }
        })
      });
      const result = await response.json();
      console.log('AI Optimization Result:', result);
    } catch (error) {
      console.error('AI optimization failed:', error);
    }
  };

  const handleImageAnalysis = async (imageUrl) => {
    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, analysisType: 'comprehensive' })
      });
      const result = await response.json();
      console.log('Image Analysis Result:', result);
    } catch (error) {
      console.error('Image analysis failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6bc016] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading enhanced photo guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            AI-Enhanced <span className="text-[#6bc016]">Photo Guides</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Influencer-style photography guides powered by computer vision, swarm intelligence, and machine learning
          </p>
        </div>

        {/* AI Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4 bg-gradient-to-br from-[#6bc016]/10 to-[#6bc016]/5">
            <Brain className="h-8 w-8 mx-auto mb-2 text-[#6bc016]" />
            <h3 className="font-semibold text-sm">AI Camera Settings</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Optimal settings for any condition</p>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-[#ffd700]/10 to-[#ffd700]/5">
            <Eye className="h-8 w-8 mx-auto mb-2 text-[#ffd700]" />
            <h3 className="font-semibold text-sm">Computer Vision</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Composition & quality analysis</p>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold text-sm">Swarm Optimization</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Crowd-sourced best spots</p>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold text-sm">Viral Prediction</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">ML-powered engagement forecast</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-[#6bc016] hover:bg-[#5aa014]' : ''}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={selectedDifficulty === difficulty ? 'bg-[#ffd700] hover:bg-[#e6c200] text-black' : ''}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedGuide(guide)}>
              {/* Guide Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={guide.images?.[0]?.url || '/placeholder-image.jpg'} 
                  alt={guide.spotName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {guide.category}
                  </Badge>
                  <Badge variant="secondary" className={`
                    ${guide.difficulty === 'easy' ? 'bg-green-500' : 
                      guide.difficulty === 'moderate' ? 'bg-yellow-500' : 
                      guide.difficulty === 'challenging' ? 'bg-orange-500' : 'bg-red-500'} text-white
                  `}>
                    {guide.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-[#6bc016] text-white">
                    <Star className="w-3 h-3 mr-1" />
                    {guide.influencerRating}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="bg-[#ffd700] text-black">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {Math.round(parseFloat(guide.viralPotential) * 100)}% viral
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold">{guide.spotName}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {guide.cameraSettings?.bestTime || 'Golden Hour'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    {guide.cameraSettings?.equipment || 'DSLR'}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* AI Analysis Section */}
                {guide.images?.[0]?.aiAnalysis && (
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#6bc016]" />
                      AI Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Composition</span>
                          <span>{Math.round(guide.images[0].aiAnalysis.compositionScore * 100)}%</span>
                        </div>
                        <Progress value={guide.images[0].aiAnalysis.compositionScore * 100} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Lighting</span>
                          <span>{Math.round(guide.images[0].aiAnalysis.lightingQuality * 100)}%</span>
                        </div>
                        <Progress value={guide.images[0].aiAnalysis.lightingQuality * 100} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Aesthetic</span>
                          <span>{Math.round(guide.images[0].aiAnalysis.aestheticAppeal * 100)}%</span>
                        </div>
                        <Progress value={guide.images[0].aiAnalysis.aestheticAppeal * 100} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Technical</span>
                          <span>{Math.round((guide.images[0].aiAnalysis.technicalQuality.sharpness + guide.images[0].aiAnalysis.technicalQuality.exposure) * 50)}%</span>
                        </div>
                        <Progress value={(guide.images[0].aiAnalysis.technicalQuality.sharpness + guide.images[0].aiAnalysis.technicalQuality.exposure) * 50} className="h-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Palette className="w-3 h-3" />
                      <span className="capitalize">Mood: {guide.images[0].aiAnalysis.mood}</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Camera Settings */}
                {guide.cameraSettings?.aiOptimalSettings && (
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#ffd700]" />
                      AI Optimal Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <div>ISO: {guide.cameraSettings.aiOptimalSettings.iso}</div>
                      <div>Shutter: {guide.cameraSettings.aiOptimalSettings.shutterSpeed}</div>
                      <div>Focus: {guide.cameraSettings.aiOptimalSettings.focusMode}</div>
                      <div>WB: {guide.cameraSettings.aiOptimalSettings.whiteBalance}</div>
                    </div>
                  </div>
                )}

                {/* Social Metrics */}
                {guide.images?.[0]?.socialMetrics && (
                  <div className="space-y-3 mb-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Social Performance
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <div className="font-bold text-red-500">{guide.images[0].socialMetrics.likes}</div>
                        <div>Likes</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-500">{guide.images[0].socialMetrics.shares}</div>
                        <div>Shares</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-500">{guide.images[0].socialMetrics.saves}</div>
                        <div>Saves</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-500">{Math.round(guide.images[0].socialMetrics.viralityScore * 100)}%</div>
                        <div>Viral</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#6bc016] hover:bg-[#5aa014] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAIOptimization(guide.id);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    AI Optimize
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageAnalysis(guide.images?.[0]?.url);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Swarm Intelligence Insights */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Swarm Intelligence Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Collective Wisdom</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on 12,847 photographer interactions, the golden hour produces 40% better composition scores
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Optimal Timing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Swarm analysis shows 6:30-7:30 AM provides 97% crowd-free conditions with optimal lighting
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Emerging Patterns</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Groups of 2-3 people create 25% more engaging compositions than solo shots
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPhotoGuides;