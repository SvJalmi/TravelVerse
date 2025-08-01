import { useState, useEffect, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Camera, 
  Smartphone, 
  Info, 
  MapPin, 
  Compass, 
  Zap,
  Eye,
  QrCode,
  Navigation,
  Clock,
  Thermometer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ARView() {
  const [, params] = useRoute('/ar/:destinationId');
  const destinationId = params?.destinationId;
  const [isARActive, setIsARActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { trackInteraction } = useUserInteraction();
  const { toast } = useToast();

  const { data: destination } = useQuery({
    queryKey: [`/api/destinations/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: arFeatures } = useQuery({
    queryKey: [`/api/ar-features/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: weather } = useQuery({
    queryKey: [`/api/weather/${destinationId}`],
    enabled: !!destinationId,
  });

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  // Track AR usage
  useEffect(() => {
    if (destinationId && isARActive) {
      trackInteraction({
        action: 'ar_view',
        destinationId,
        duration: 30,
      });
    }
  }, [destinationId, isARActive, trackInteraction]);

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately

      // Request location permission
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationPermission('granted');
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => setLocationPermission('denied')
        );
      }
    } catch (error) {
      setCameraPermission('denied');
    }
  };

  const startAR = async () => {
    if (cameraPermission !== 'granted') {
      await requestPermissions();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsARActive(true);
        
        toast({
          title: 'AR Activated',
          description: 'Point your camera at landmarks to see AR information',
        });

        trackInteraction({
          action: 'ar_view',
          destinationId,
          coordinates: userLocation,
        });
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopAR = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistanceToDestination = () => {
    if (!userLocation || !destination) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );
  };

  if (!destination || !arFeatures) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Loading AR Experience...</h1>
          <p className="text-muted-foreground">Preparing augmented reality features.</p>
        </div>
      </div>
    );
  }

  const distance = getDistanceToDestination();

  return (
    <div className="min-h-screen bg-background">
      {/* AR Camera View */}
      {isARActive ? (
        <div className="relative w-full h-screen overflow-hidden bg-black">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {/* AR Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* AR Information Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Distance Indicator */}
            {distance && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  {distance.toFixed(1)} km to {destination.name}
                </div>
              </div>
            )}

            {/* AR Feature Hotspots */}
            <div className="absolute top-1/3 left-1/4 pointer-events-auto">
              <div 
                className="ar-info-panel cursor-pointer"
                onClick={() => setSelectedFeature('historical')}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="font-medium">Historical Timeline</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn about the rich history of this location
                </p>
              </div>
            </div>

            <div className="absolute top-1/2 right-1/4 pointer-events-auto">
              <div 
                className="ar-info-panel cursor-pointer"
                onClick={() => setSelectedFeature('architecture')}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="font-medium">Architecture Details</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Discover architectural insights and building details
                </p>
              </div>
            </div>

            <div className="absolute bottom-1/3 left-1/3 pointer-events-auto">
              <div 
                className="ar-info-panel cursor-pointer"
                onClick={() => setSelectedFeature('culture')}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="font-medium">Cultural Insights</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore local culture and traditions
                </p>
              </div>
            </div>

            {/* Weather Overlay */}
            {weather && (
              <div className="absolute top-4 right-4 pointer-events-auto">
                <div className="bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Thermometer className="h-4 w-4" />
                    <span className="font-medium">{weather.current?.temperature}°C</span>
                  </div>
                  <p className="text-sm text-white/70">{weather.current?.condition}</p>
                </div>
              </div>
            )}

            {/* Compass */}
            <div className="absolute bottom-20 right-4 pointer-events-auto">
              <div className="bg-black/80 text-white p-3 rounded-full backdrop-blur-sm">
                <Compass className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* AR Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={stopAR}
                variant="secondary"
                className="bg-black/80 text-white border-white/20 hover:bg-black/60"
              >
                Stop AR
              </Button>
              <Button
                variant="secondary"
                className="bg-black/80 text-white border-white/20 hover:bg-black/60"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
              <Button
                variant="secondary"
                className="bg-black/80 text-white border-white/20 hover:bg-black/60"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>

          {/* Feature Details Modal */}
          {selectedFeature && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
              <Card className="max-w-md bg-background/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    {selectedFeature === 'historical' && 'Historical Timeline'}
                    {selectedFeature === 'architecture' && 'Architecture Details'}
                    {selectedFeature === 'culture' && 'Cultural Insights'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFeature === 'historical' && (
                    <div className="space-y-3">
                      <p className="text-sm">{destination.history}</p>
                      <div className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Historical period: Ancient to Modern
                      </div>
                    </div>
                  )}
                  {selectedFeature === 'architecture' && (
                    <div className="space-y-3">
                      <p className="text-sm">Architectural style details and construction information.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          Ancient Architecture
                        </span>
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                          UNESCO Heritage
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedFeature === 'culture' && (
                    <div className="space-y-3">
                      <p className="text-sm">Local cultural practices and traditions.</p>
                      <div className="space-y-1">
                        <div className="text-xs"><strong>Language:</strong> {destination.culture.language}</div>
                        <div className="text-xs"><strong>Currency:</strong> {destination.culture.currency}</div>
                        <div className="text-xs">
                          <strong>Traditions:</strong> {destination.culture.traditions.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={() => setSelectedFeature(null)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
                  <Eye className="mr-3 h-10 w-10 text-blue-500" />
                  Augmented Reality View
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience {destination.name} through immersive AR overlays with real-time information
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Permission Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  AR Setup
                </CardTitle>
                <CardDescription>
                  Check your device permissions and start the AR experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      cameraPermission === 'granted' ? 'bg-green-500' : 
                      cameraPermission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                    )} />
                    <span className="text-sm">
                      Camera Access: {cameraPermission === 'granted' ? 'Granted' : 
                                    cameraPermission === 'denied' ? 'Denied' : 'Required'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      locationPermission === 'granted' ? 'bg-green-500' : 
                      locationPermission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                    )} />
                    <span className="text-sm">
                      Location Access: {locationPermission === 'granted' ? 'Granted' : 
                                      locationPermission === 'denied' ? 'Denied' : 'Required'}
                    </span>
                  </div>
                </div>

                {distance && (
                  <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center">
                      <Navigation className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">
                        You are {distance.toFixed(1)} km away from {destination.name}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={startAR}
                  disabled={cameraPermission === 'denied'}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Start AR Experience
                </Button>

                {cameraPermission === 'denied' && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Camera permission is required for AR features. Please enable it in your browser settings.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* AR Features */}
            <Card>
              <CardHeader>
                <CardTitle>Available AR Features</CardTitle>
                <CardDescription>
                  Interactive augmented reality overlays for {destination.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {arFeatures.features.map((feature: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{feature.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {feature.triggers.map((trigger: string, triggerIndex: number) => (
                          <span 
                            key={triggerIndex}
                            className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                          >
                            {trigger.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">System Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {arFeatures.requirements}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {arFeatures.supportedPlatforms.map((platform: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>How to Use AR</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Allow camera and location permissions when prompted</li>
                  <li>Point your device camera at landmarks or QR codes</li>
                  <li>Tap on AR hotspots to view detailed information</li>
                  <li>Use the compass for navigation assistance</li>
                  <li>Capture screenshots of your AR experience</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}