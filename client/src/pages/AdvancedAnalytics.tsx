import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { Users, Eye, Heart, Share, TrendingUp, Globe, Camera, Headphones, Brain, Cpu, Wifi, Activity, Zap, Target, Network, Layers, BarChart3, Smartphone } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState(null);

  // Fetch real-time analytics data
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/interactions');
        const data = await response.json();
        setRealTimeData(data);
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Enhanced analytics data with AI/ML insights
  const aiModelPerformance = [
    { model: 'Recommendation Engine', accuracy: 87.3, latency: 45, throughput: 1250 },
    { model: 'Sentiment Analysis', accuracy: 94.1, latency: 23, throughput: 2100 },
    { model: 'Computer Vision', accuracy: 92.8, latency: 78, throughput: 850 },
    { model: 'Swarm Optimization', accuracy: 89.5, latency: 156, throughput: 320 },
    { model: 'NLP Processor', accuracy: 91.7, latency: 34, throughput: 1800 }
  ];

  const iotSensorMetrics = [
    { sensor: 'Air Quality', status: 'online', accuracy: 96.2, batteryLevel: 78 },
    { sensor: 'Noise Level', status: 'online', accuracy: 94.8, batteryLevel: 85 },
    { sensor: 'Traffic Flow', status: 'online', accuracy: 91.5, batteryLevel: 72 },
    { sensor: 'Crowd Density', status: 'maintenance', accuracy: 88.9, batteryLevel: 23 },
    { sensor: 'Weather Station', status: 'online', accuracy: 98.1, batteryLevel: 91 }
  ];

  const swarmIntelligenceMetrics = [
    { algorithm: 'Particle Swarm', convergence: 92.4, efficiency: 87.1, participants: 156 },
    { algorithm: 'Ant Colony', convergence: 89.7, efficiency: 91.3, participants: 234 },
    { algorithm: 'Bee Colony', convergence: 94.2, efficiency: 85.8, participants: 189 },
    { algorithm: 'Firefly', convergence: 88.3, efficiency: 89.6, participants: 145 }
  ];

  const predictiveAnalytics = [
    { date: '2025-08-02', crowdLevel: 68, weatherScore: 85, bookingPrediction: 234 },
    { date: '2025-08-03', crowdLevel: 72, weatherScore: 78, bookingPrediction: 267 },
    { date: '2025-08-04', crowdLevel: 89, weatherScore: 91, bookingPrediction: 312 },
    { date: '2025-08-05', crowdLevel: 45, weatherScore: 67, bookingPrediction: 189 },
    { date: '2025-08-06', crowdLevel: 56, weatherScore: 82, bookingPrediction: 223 }
  ];

  const nlpSentimentTrends = [
    { time: '00:00', positive: 68, neutral: 25, negative: 7 },
    { time: '06:00', positive: 72, neutral: 22, negative: 6 },
    { time: '12:00', positive: 81, neutral: 15, negative: 4 },
    { time: '18:00', positive: 89, neutral: 9, negative: 2 },
    { time: '24:00', positive: 75, neutral: 20, negative: 5 }
  ];

  const userBehaviorPatterns = [
    { behavior: 'Exploration', percentage: 34.2 },
    { behavior: 'Photo Capture', percentage: 28.7 },
    { behavior: 'VR Experience', percentage: 18.5 },
    { behavior: 'Route Planning', percentage: 12.1 },
    { behavior: 'Social Sharing', percentage: 6.5 }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#6bc016] hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Accuracy rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ffd700] hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IoT Sensors</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Online sensors</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swarm Optimizations</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,394</div>
            <p className="text-xs text-muted-foreground">Active swarms</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NLP Processed</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground">Text analyses</p>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Predictive Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={predictiveAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="crowdLevel" stackId="1" stroke="#6bc016" fill="#6bc016" fillOpacity={0.6} />
              <Area type="monotone" dataKey="weatherScore" stackId="2" stroke="#ffd700" fill="#ffd700" fillOpacity={0.6} />
              <Area type="monotone" dataKey="bookingPrediction" stackId="3" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderAITab = () => (
    <div className="space-y-8">
      {/* AI Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Machine Learning Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={aiModelPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="accuracy" name="Accuracy %" />
              <YAxis dataKey="latency" name="Latency (ms)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Models" dataKey="throughput" fill="#6bc016" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NLP Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={nlpSentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#22c55e" fill="#22c55e" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#fbbf24" fill="#fbbf24" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderIoTTab = () => (
    <div className="space-y-8">
      {/* IoT Sensor Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {iotSensorMetrics.map((sensor, index) => (
          <Card key={index} className={`border-l-4 ${sensor.status === 'online' ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                {sensor.sensor}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  sensor.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {sensor.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy:</span>
                  <span className="font-bold">{sensor.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Battery:</span>
                  <span className={`font-bold ${sensor.batteryLevel < 30 ? 'text-red-500' : 'text-green-500'}`}>
                    {sensor.batteryLevel}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* IoT Data Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Real-time IoT Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={iotSensorMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sensor" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#6bc016" strokeWidth={2} />
              <Line type="monotone" dataKey="batteryLevel" stroke="#ffd700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderSwarmTab = () => (
    <div className="space-y-8">
      {/* Swarm Intelligence Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Swarm Intelligence Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={swarmIntelligenceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="algorithm" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="convergence" fill="#6bc016" />
              <Bar dataKey="efficiency" fill="#ffd700" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Behavior Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Collective Behavior Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userBehaviorPatterns}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {userBehaviorPatterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6bc016', '#ffd700', '#ff6b6b', '#4ecdc4', '#95a5a6'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Advanced <span className="text-[#6bc016]">Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            AI-powered insights with machine learning, IoT sensors, swarm intelligence, and predictive analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'ai', label: 'AI/ML Models', icon: Brain },
            { id: 'iot', label: 'IoT Sensors', icon: Wifi },
            { id: 'swarm', label: 'Swarm Intelligence', icon: Network }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'outline'}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 ${
                activeTab === id 
                  ? 'bg-[#6bc016] hover:bg-[#5aa014] text-white' 
                  : 'hover:bg-[#6bc016]/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in-50 duration-300">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'ai' && renderAITab()}
          {activeTab === 'iot' && renderIoTTab()}
          {activeTab === 'swarm' && renderSwarmTab()}
        </div>

        {/* Real-time Status Bar */}
        <Card className="bg-gradient-to-r from-[#6bc016]/10 to-[#ffd700]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#6bc016] animate-pulse" />
                <span className="font-medium">Real-time Status:</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#6bc016]">98.7%</div>
                <div className="text-xs">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ffd700]">847</div>
                <div className="text-xs">Active Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">1,234</div>
                <div className="text-xs">Live Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">5.2TB</div>
                <div className="text-xs">Data Processed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;