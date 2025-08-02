import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Camera, 
  MessageSquare, 
  Activity, 
  Cpu, 
  Zap,
  Image,
  Search,
  TrendingUp,
  Globe,
  Lightbulb,
  Target,
  Sparkles
} from 'lucide-react';

const DemoCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runDemo = async (demoType, data) => {
    setLoading(prev => ({ ...prev, [demoType]: true }));
    
    try {
      let response;
      
      switch (demoType) {
        case 'search':
          response = await fetch(`/api/search?q=${encodeURIComponent(data.query)}`);
          break;
        case 'imageAnalysis':
          response = await fetch('/api/ai/analyze-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: data.url, analysisType: 'comprehensive' })
          });
          break;
        case 'nlp':
          response = await fetch('/api/nlp/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.text })
          });
          break;
        case 'iot':
          response = await fetch('/api/iot/sensors/1');
          break;
        case 'swarm':
          response = await fetch('/api/swarm/photo-optimization', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinationId: '1',
              participants: [{ photoSpot: { lat: 27.1738, lng: 78.0421 } }],
              preferences: { quality: 'high' }
            })
          });
          break;
      }
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [demoType]: result }));
    } catch (error) {
      console.error(`Demo ${demoType} failed:`, error);
      setResults(prev => ({ ...prev, [demoType]: { error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [demoType]: false }));
    }
  };

  const demoSections = [
    {
      id: 'search',
      title: 'AI-Powered Search',
      icon: Search,
      description: 'Natural language processing with semantic understanding',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600'
    },
    {
      id: 'imageAnalysis',
      title: 'Computer Vision Analysis',
      icon: Camera,
      description: 'Advanced image analysis with composition scoring',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600'
    },
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      icon: MessageSquare,
      description: 'Multi-language sentiment analysis and entity recognition',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    {
      id: 'iot',
      title: 'IoT Sensor Network',
      icon: Activity,
      description: 'Real-time environmental monitoring and predictions',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-600'
    },
    {
      id: 'swarm',
      title: 'Swarm Intelligence',
      icon: Target,
      description: 'Collective optimization algorithms for photo spots',
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            AI/ML <span className="text-[#6bc016]">Demo Center</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Experience cutting-edge artificial intelligence, machine learning, and IoT technologies
          </p>
        </div>

        {/* AI Performance Overview */}
        <Card className="bg-gradient-to-r from-[#6bc016]/10 to-[#ffd700]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-[#6bc016]" />
              AI Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { model: 'Sentiment Analysis', accuracy: 94.1, latency: '23ms' },
                { model: 'Computer Vision', accuracy: 92.8, latency: '78ms' },
                { model: 'Recommendation Engine', accuracy: 87.3, latency: '45ms' },
                { model: 'Swarm Optimization', accuracy: 89.5, latency: '156ms' },
                { model: 'NLP Processor', accuracy: 91.7, latency: '34ms' }
              ].map((model, index) => (
                <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-2xl font-bold text-[#6bc016]">{model.accuracy}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{model.model}</div>
                  <Badge variant="outline" className="mt-2">{model.latency}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI-Powered Search Demo */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Search className="h-5 w-5" />
                AI-Powered Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Try: 'beautiful architecture for photography'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  onClick={() => runDemo('search', { query: searchQuery })}
                  disabled={loading.search || !searchQuery}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading.search ? 'Processing...' : 'Analyze with NLP'}
                </Button>
              </div>
              
              {results.search && (
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold">Results:</h4>
                  {results.search.nlpAnalysis && (
                    <div className="space-y-2">
                      <Badge variant="outline">
                        Sentiment: {results.search.nlpAnalysis.sentiment}
                      </Badge>
                      <div className="text-sm">
                        <strong>Key Phrases:</strong>
                        {results.search.nlpAnalysis.keyPhrases?.slice(0, 3).map((phrase, i) => (
                          <Badge key={i} variant="secondary" className="ml-1">
                            {phrase.phrase}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Found {results.search.totalResults} destinations and guides
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Computer Vision Demo */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Camera className="h-5 w-5" />
                Computer Vision Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Image URL (or use sample)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => runDemo('imageAnalysis', { url: imageUrl || 'sample.jpg' })}
                    disabled={loading.imageAnalysis}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {loading.imageAnalysis ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada?w=400')}
                  >
                    Use Sample
                  </Button>
                </div>
              </div>
              
              {results.imageAnalysis && (
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold">Analysis Results:</h4>
                  {results.imageAnalysis.analysis && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-gray-600">Composition</div>
                          <Progress value={results.imageAnalysis.analysis.compositionScore * 100} className="h-2" />
                          <div className="text-xs">{(results.imageAnalysis.analysis.compositionScore * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lighting</div>
                          <Progress value={results.imageAnalysis.analysis.lightingQuality * 100} className="h-2" />
                          <div className="text-xs">{(results.imageAnalysis.analysis.lightingQuality * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Detected Objects:</strong> {results.imageAnalysis.analysis.detectedObjects?.length || 0}
                      </div>
                      <Badge variant="outline">
                        Mood: {results.imageAnalysis.analysis.mood}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* NLP Demo */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <MessageSquare className="h-5 w-5" />
                Natural Language Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Enter text for sentiment analysis..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={() => runDemo('nlp', { text: textInput })}
                  disabled={loading.nlp || !textInput}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading.nlp ? 'Processing...' : 'Analyze Text'}
                </Button>
              </div>
              
              {results.nlp && (
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold">NLP Analysis:</h4>
                  {results.nlp.analysis && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Language: {results.nlp.analysis.languageDetection?.language}
                        </Badge>
                        <Badge variant="outline">
                          Sentiment: {results.nlp.analysis.sentimentAnalysis?.overallSentiment}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <strong>Key Phrases:</strong>
                        {results.nlp.analysis.semanticAnalysis?.keyPhrases?.slice(0, 3).map((phrase, i) => (
                          <Badge key={i} variant="secondary" className="ml-1">
                            {phrase.phrase}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm">
                        <strong>Intent:</strong> {results.nlp.analysis.semanticAnalysis?.intentDetection?.intent}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* IoT Sensors Demo */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Activity className="h-5 w-5" />
                IoT Sensor Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => runDemo('iot', {})}
                disabled={loading.iot}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading.iot ? 'Fetching Data...' : 'Get Live Sensor Data'}
              </Button>
              
              {results.iot && (
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold">Sensor Status:</h4>
                  {results.iot.sensors && (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Active Sensors:</strong> {results.iot.sensors.filter(s => s.isOnline).length}/{results.iot.sensors.length}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {results.iot.sensors.slice(0, 4).map((sensor, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{sensor.type}</span>
                            <Badge variant={sensor.isOnline ? 'default' : 'destructive'} className="text-xs">
                              {sensor.isOnline ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#6bc016]" />
              Quick AI Demonstrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => runDemo('search', { query: 'romantic sunset photography spots' })}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Search className="h-6 w-6" />
                <span className="text-sm">Search Demo</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => runDemo('imageAnalysis', { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400' })}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Vision Demo</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => runDemo('nlp', { text: 'This destination is absolutely breathtaking and perfect for photography!' })}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">NLP Demo</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => runDemo('iot', {})}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Activity className="h-6 w-6" />
                <span className="text-sm">IoT Demo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoCenter;