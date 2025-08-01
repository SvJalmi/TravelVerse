import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wifi, 
  Activity, 
  Thermometer, 
  Wind, 
  Car, 
  Users, 
  Volume2, 
  Lightbulb,
  Battery,
  AlertTriangle,
  CheckCircle,
  Signal,
  Zap,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const IoTDashboard = () => {
  const [selectedDestination, setSelectedDestination] = useState('1');
  const [sensorData, setSensorData] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/iot/sensors/${selectedDestination}`);
        const data = await response.json();
        setSensorData(data.sensors || []);
        setPredictions(data.predictions || {});
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [selectedDestination]);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'air_quality': return Wind;
      case 'noise': return Volume2;
      case 'traffic': return Car;
      case 'crowd_density': return Users;
      case 'weather': return Thermometer;
      case 'lighting': return Lightbulb;
      default: return Activity;
    }
  };

  const getSensorColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-500 bg-green-50 border-green-200';
      case 'good': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const formatSensorValue = (type, value, unit) => {
    switch (type) {
      case 'air_quality':
        return `${Math.round(value)} ${unit}`;
      case 'noise':
        return `${Math.round(value)} ${unit}`;
      case 'traffic':
        return `${Math.round(value)} ${unit}`;
      case 'crowd_density':
        return `${Math.round(value)} ${unit}`;
      case 'weather':
        return `${Math.round(value)}°C`;
      case 'lighting':
        return `${Math.round(value)} ${unit}`;
      default:
        return `${Math.round(value)} ${unit}`;
    }
  };

  const destinations = [
    { id: '1', name: 'Taj Mahal', location: 'Agra, India' },
    { id: '2', name: 'Eiffel Tower', location: 'Paris, France' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6bc016] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Connecting to IoT sensors...</p>
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
            IoT <span className="text-[#6bc016]">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Real-time environmental data from smart sensors with predictive analytics
          </p>
        </div>

        {/* Destination Selector */}
        <div className="flex justify-center gap-4">
          {destinations.map(dest => (
            <Button
              key={dest.id}
              variant={selectedDestination === dest.id ? 'default' : 'outline'}
              onClick={() => setSelectedDestination(dest.id)}
              className={`flex items-center gap-2 ${
                selectedDestination === dest.id 
                  ? 'bg-[#6bc016] hover:bg-[#5aa014] text-white' 
                  : 'hover:bg-[#6bc016]/10'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{dest.name}</div>
                <div className="text-xs opacity-75">{dest.location}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* System Status Overview */}
        <Card className="bg-gradient-to-r from-[#6bc016]/10 to-[#ffd700]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signal className="h-5 w-5 text-[#6bc016]" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#6bc016]">
                  {sensorData.filter(s => s.isOnline).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Online Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ffd700]">
                  {sensorData.length > 0 ? 
                    Math.round(sensorData.reduce((acc, s) => acc + s.batteryLevel, 0) / sensorData.length) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Battery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {sensorData.length > 0 ? 
                    Math.round(sensorData.reduce((acc, s) => acc + (s.lastReading?.confidence || 0), 0) / sensorData.length * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Data Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">
                  <Clock className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensorData.map((sensor, index) => {
            const IconComponent = getSensorIcon(sensor.type);
            const qualityColor = getSensorColor(sensor.lastReading?.quality);
            
            return (
              <Card key={index} className={`border-l-4 ${sensor.isOnline ? 'border-l-green-500' : 'border-l-red-500'} hover:shadow-lg transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${sensor.isOnline ? 'text-[#6bc016]' : 'text-gray-400'}`} />
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {sensor.type.replace('_', ' ')}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sensor ID: {sensor.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sensor.isOnline ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={sensor.isOnline ? 'default' : 'destructive'}>
                        {sensor.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Current Reading */}
                  <div className={`p-4 rounded-lg border ${qualityColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Reading</span>
                      <Badge variant="outline" className={qualityColor}>
                        {sensor.lastReading?.quality || 'unknown'}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold">
                      {sensor.lastReading ? 
                        formatSensorValue(sensor.type, sensor.lastReading.value, sensor.lastReading.unit) : 
                        'No data'
                      }
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Confidence: {sensor.lastReading ? Math.round(sensor.lastReading.confidence * 100) : 0}%
                    </div>
                  </div>

                  {/* Battery Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Battery className="h-4 w-4" />
                        Battery Level
                      </span>
                      <span className={`text-sm font-bold ${
                        sensor.batteryLevel < 20 ? 'text-red-500' : 
                        sensor.batteryLevel < 50 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {sensor.batteryLevel}%
                      </span>
                    </div>
                    <Progress 
                      value={sensor.batteryLevel} 
                      className={`h-2 ${
                        sensor.batteryLevel < 20 ? '[&>div]:bg-red-500' : 
                        sensor.batteryLevel < 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>

                  {/* Historical Trend */}
                  {sensor.historicalData && sensor.historicalData.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        24h Trend
                      </span>
                      <div className="flex items-end gap-1 h-12">
                        {sensor.historicalData.slice(-12).map((data, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t ${data.anomaly ? 'bg-red-300' : 'bg-[#6bc016]'} opacity-70`}
                            style={{ 
                              height: `${Math.max(10, (data.value / Math.max(...sensor.historicalData.map(d => d.value))) * 100)}%` 
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prediction */}
                  {predictions[sensor.type] && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">AI Prediction</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Next Hour: {formatSensorValue(sensor.type, predictions[sensor.type].nextHour, sensor.lastReading?.unit || '')}</div>
                        <div>Next Day: {formatSensorValue(sensor.type, predictions[sensor.type].nextDay, sensor.lastReading?.unit || '')}</div>
                        <div className="flex items-center gap-2">
                          <span>Trend:</span>
                          <Badge variant="outline" className="text-xs">
                            {predictions[sensor.type].weeklyTrend}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Environmental Quality Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Environmental Quality Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-green-700 dark:text-green-300">Excellent Conditions</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Air quality and noise levels are optimal for outdoor activities
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">Moderate Traffic</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  Higher than usual vehicle count. Consider alternative routes
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">Optimal Crowd Level</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  Perfect time for photography with minimal crowd interference
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IoTDashboard;