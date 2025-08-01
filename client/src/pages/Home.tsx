import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Globe, 
  Camera, 
  Brain, 
  Eye, 
  MapPin, 
  Star, 
  Zap, 
  Users,
  ArrowRight,
  Play,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { cn } from '@/lib/utils';
import type { Destination } from '@shared/schema';

const features = [
  {
    icon: Globe,
    title: 'Global Destinations',
    description: 'Explore every corner of the world with detailed information about climate, culture, and attractions.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    description: 'Get personalized travel suggestions based on your preferences using advanced machine learning.',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    icon: Camera,
    title: 'Influencer Photo Guides',
    description: 'Learn how to capture stunning photos with pose instructions and camera settings from professionals.',
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  {
    icon: Eye,
    title: 'AR/VR Experiences',
    description: 'Immerse yourself in destinations before you visit with cutting-edge virtual and augmented reality.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
];

const stats = [
  { label: 'Destinations', value: '50K+', icon: MapPin },
  { label: 'Photo Guides', value: '100K+', icon: Camera },
  { label: 'AI Recommendations', value: '1M+', icon: Brain },
  { label: 'Happy Travelers', value: '250K+', icon: Users },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { trackInteraction } = useUserInteraction();

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['/api/destinations'],
    select: (data: Destination[]) => data.slice(0, 6), // Show top 6 destinations
  });

  const { data: photoGuides } = useQuery({
    queryKey: ['/api/photo-guides'],
    select: (data: any[]) => data.slice(0, 3), // Show top 3 photo guides
  });

  useEffect(() => {
    trackInteraction({ action: 'view' });
  }, [trackInteraction]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">Discover the</span>
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                World's Hidden Gems
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              AI-powered travel recommendations, immersive VR experiences, and influencer-style photo guides 
              for every destination on Earth. Your journey starts here.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search destinations worldwide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 bottom-1"
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-lg">
                <Link href="/explore">
                  <Globe className="mr-2 h-4 w-4" />
                  Start Exploring
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/vr/sample">
                  <Play className="mr-2 h-4 w-4" />
                  Try VR Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Revolutionary Travel Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of travel planning with AI, machine learning, IoT sensors, 
              and immersive technologies that bring destinations to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4", feature.bgColor)}>
                      <Icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Popular Destinations</h2>
              <p className="text-lg text-muted-foreground">
                Discover the world's most incredible places with AI-powered insights
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/explore">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations?.map((destination) => (
                <Link key={destination.id} href={`/destination/${destination.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm">
                        <Star className="inline h-3 w-3 mr-1" />
                        {(Math.random() * 2 + 3).toFixed(1)}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {destination.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mb-4">
                        {destination.country} • {destination.description.slice(0, 100)}...
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          {destination.climate.temperature}°C • {destination.climate.weatherCondition}
                        </span>
                        <Zap className="h-4 w-4 text-accent" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Guides Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Influencer Photo Guides</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master the art of travel photography with professional tips, pose instructions, 
              and camera settings from top influencers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {photoGuides?.map((guide, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={guide.images?.[0]?.url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'}
                    alt={guide.spotName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">{guide.spotName}</h3>
                    <p className="text-sm opacity-90 capitalize">{guide.category} • {guide.difficulty}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/photo-guides">
                Explore All Guides <Camera className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers who've discovered hidden gems and created unforgettable memories 
            with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/explore">
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link href="/ai-planner">
                Get AI Recommendations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}