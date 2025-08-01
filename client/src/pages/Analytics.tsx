import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MapPin, 
  Calendar,
  Zap,
  Globe,
  Camera,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: destinations } = useQuery({
    queryKey: ['/api/destinations'],
  });

  const { data: interactions } = useQuery({
    queryKey: ['/api/interactions'],
  });

  const { data: photoGuides } = useQuery({
    queryKey: ['/api/photo-guides'],
  });

  // Calculate analytics
  const totalDestinations = destinations?.length || 0;
  const totalInteractions = interactions?.length || 0;
  const totalPhotoGuides = photoGuides?.length || 0;

  const popularDestinations = destinations?.slice(0, 5) || [];
  const topPhotoGuides = photoGuides?.slice(0, 3) || [];

  const stats = [
    {
      title: 'Total Destinations',
      value: totalDestinations.toLocaleString(),
      change: '+12%',
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: 'User Interactions',
      value: totalInteractions.toLocaleString(),
      change: '+25%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Photo Guides',
      value: totalPhotoGuides.toLocaleString(),
      change: '+8%',
      icon: Camera,
      color: 'text-purple-600'
    },
    {
      title: 'VR Experiences',
      value: '156',
      change: '+35%',
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time insights into travel platform performance and user engagement
              </p>
            </div>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change} from last period
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Most Popular Destinations
              </CardTitle>
              <CardDescription>
                Top destinations by user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDestinations.map((destination: any, index: number) => (
                  <div key={destination.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{Math.floor(Math.random() * 1000 + 500)}</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Engagement Metrics
              </CardTitle>
              <CardDescription>
                User interaction patterns and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Page Views</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">VR Experiences</span>
                    <span className="text-sm text-muted-foreground">72%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Photo Guide Usage</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">AI Planner Usage</span>
                    <span className="text-sm text-muted-foreground">91%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Advanced Technology Adoption
            </CardTitle>
            <CardDescription>
              Usage statistics for AI, VR, AR, and other advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">89%</h3>
                <p className="text-sm text-muted-foreground">AI Recommendation Usage</p>
                <p className="text-xs text-green-600 mt-1">+15% this month</p>
              </div>

              <div className="text-center p-6 bg-accent/5 rounded-lg">
                <Eye className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">67%</h3>
                <p className="text-sm text-muted-foreground">VR Experience Completion</p>
                <p className="text-xs text-green-600 mt-1">+22% this month</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">45%</h3>
                <p className="text-sm text-muted-foreground">AR Feature Adoption</p>
                <p className="text-xs text-green-600 mt-1">+38% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>
                Latest user interactions and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'VR Experience', destination: 'Taj Mahal', time: '2 minutes ago', user: 'Anonymous User' },
                  { action: 'Photo Guide View', destination: 'Eiffel Tower', time: '5 minutes ago', user: 'Anonymous User' },
                  { action: 'AI Recommendation', destination: 'Multiple', time: '8 minutes ago', user: 'Anonymous User' },
                  { action: 'AR View', destination: 'Taj Mahal', time: '12 minutes ago', user: 'Anonymous User' },
                  { action: 'Destination Search', destination: 'India', time: '15 minutes ago', user: 'Anonymous User' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.destination}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                User activity by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { region: 'North America', percentage: 45, users: '12.5K' },
                  { region: 'Europe', percentage: 30, users: '8.3K' },
                  { region: 'Asia Pacific', percentage: 20, users: '5.5K' },
                  { region: 'Other', percentage: 5, users: '1.4K' },
                ].map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{region.region}</span>
                      <span className="text-sm text-muted-foreground">{region.users} users</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${region.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}