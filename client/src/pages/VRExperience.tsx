import { useState, useEffect, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCcw,
  Info,
  Headphones,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VRExperience() {
  const [, params] = useRoute('/vr/:destinationId');
  const destinationId = params?.destinationId;
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [vrSupported, setVrSupported] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  
  const { trackInteraction } = useUserInteraction();
  const { toast } = useToast();

  const { data: destination } = useQuery({
    queryKey: [`/api/destinations/${destinationId}`],
    enabled: !!destinationId,
  });

  const { data: vrContent } = useQuery({
    queryKey: [`/api/vr-content/${destinationId}`],
    enabled: !!destinationId,
  });

  // Check VR support
  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setVrSupported(supported);
      }).catch(() => setVrSupported(false));
    }
  }, []);

  // Track VR experience usage
  useEffect(() => {
    if (destinationId) {
      trackInteraction({
        action: 'vr_experience',
        destinationId,
        duration: 0,
      });
    }
  }, [destinationId, trackInteraction]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      trackInteraction({
        action: 'vr_experience',
        destinationId,
        duration: 30,
      });
    }
  };

  const handleSceneChange = (sceneIndex: number) => {
    setCurrentScene(sceneIndex);
    trackInteraction({
      action: 'view',
      destinationId,
    });
  };

  const handleFullscreen = () => {
    if (!isFullscreen && sceneRef.current) {
      sceneRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const enterVR = async () => {
    if (!vrSupported) {
      toast({
        title: 'VR Not Supported',
        description: 'Your device does not support WebXR VR experiences',
        variant: 'destructive',
      });
      return;
    }

    try {
      const session = await (navigator as any).xr.requestSession('immersive-vr');
      toast({
        title: 'VR Mode Activated',
        description: 'Put on your VR headset to begin the immersive experience',
      });
      trackInteraction({
        action: 'vr_experience',
        destinationId,
        duration: 120,
      });
    } catch (error) {
      toast({
        title: 'VR Error',
        description: 'Could not start VR session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!destination || !vrContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Loading VR Experience...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your virtual journey.</p>
        </div>
      </div>
    );
  }

  const currentSceneData = vrContent.scenes[currentScene];

  return (
    <div className="min-h-screen bg-black">
      {/* VR Viewer */}
      <div 
        ref={sceneRef}
        className="relative w-full h-screen overflow-hidden"
        onMouseMove={() => setShowControls(true)}
      >
        {/* A-Frame VR Scene */}
        <div className="w-full h-full">
          <a-scene
            background={`color: #000; src: ${currentSceneData?.url || 'https://aframe.io/360-image-gallery-boilerplate/img/city.jpg'}`}
            vr-mode-ui="enabled: true"
            cursor="rayOrigin: mouse"
            stats={false}
          >
            <a-sky 
              src={currentSceneData?.url || 'https://aframe.io/360-image-gallery-boilerplate/img/city.jpg'}
              rotation="0 -130 0"
            />
            
            {/* Interactive Hotspots */}
            <a-entity
              geometry="primitive: sphere; radius: 0.1"
              material="color: #ffcc00; emissive: #ffcc00; opacity: 0.8"
              position="2 1 -3"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
              cursor-listener
            />
            
            <a-entity
              geometry="primitive: sphere; radius: 0.1"
              material="color: #00ccff; emissive: #00ccff; opacity: 0.8"
              position="-2 2 -4"
              animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 2000"
              cursor-listener
            />

            {/* Information Panels */}
            <a-text
              value={destination.name}
              position="0 3 -5"
              align="center"
              color="#ffffff"
              font="roboto"
              geometry="primitive: plane; width: 6; height: 1"
              material="color: rgba(0,0,0,0.7)"
            />

            <a-camera
              look-controls="enabledTouchMove: true"
              wasd-controls="enabled: false"
              cursor="fuse: false; rayOrigin: mouse"
            />
          </a-scene>
        </div>

        {/* VR Controls Overlay */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
            <Card className="bg-black/80 border-white/20 text-white backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  {destination.name}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {currentSceneData?.description}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex space-x-2">
              {vrSupported && (
                <Button
                  size="sm"
                  onClick={enterVR}
                  className="bg-primary/90 hover:bg-primary backdrop-blur-sm"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Enter VR
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            {/* Scene Selection */}
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2 bg-black/80 rounded-lg p-2 backdrop-blur-sm">
                {vrContent.scenes.map((scene: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSceneChange(index)}
                    className={cn(
                      "px-3 py-2 rounded text-sm transition-colors",
                      currentScene === index
                        ? "bg-primary text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {scene.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Controls */}
            <div className="flex items-center justify-center space-x-4 bg-black/80 rounded-lg p-3 backdrop-blur-sm">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePlay}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCurrentScene(0)}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="text-white text-sm">
                Scene {currentScene + 1} of {vrContent.scenes.length}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
            <Card className="bg-black/80 border-white/20 text-white backdrop-blur-sm max-w-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Scene Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/70">Duration:</span> {currentSceneData?.duration}
                  </div>
                  <div>
                    <span className="text-white/70">Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentSceneData?.interactiveElements?.map((element: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary rounded text-xs"
                        >
                          {element.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
            <Card className="bg-black/90 border-white/20 text-white text-center max-w-md">
              <CardContent className="p-8">
                <Eye className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-bold mb-2">Virtual Reality Experience</h2>
                <p className="text-white/70 mb-6">
                  Immerse yourself in a 360° virtual tour of {destination.name}. 
                  Use your mouse to look around or put on a VR headset for the full experience.
                </p>
                <div className="space-y-3">
                  <Button onClick={handlePlay} className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start VR Experience
                  </Button>
                  {vrSupported && (
                    <Button 
                      variant="outline" 
                      onClick={enterVR}
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Headphones className="mr-2 h-4 w-4" />
                      Enter VR Mode
                    </Button>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-4">
                  Best viewed with a VR headset or in fullscreen mode
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* VR Information Panel */}
      <div className="bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>VR Experience Details</CardTitle>
              <CardDescription>
                Technical information about this virtual reality experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Total Scenes</h3>
                  <p className="text-muted-foreground">{vrContent.metadata.totalScenes}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Estimated Duration</h3>
                  <p className="text-muted-foreground">{vrContent.metadata.estimatedDuration}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Supported Devices</h3>
                  <div className="flex flex-wrap gap-1">
                    {vrContent.metadata.supportedDevices.map((device: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                      >
                        {device}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  System Requirements
                </h3>
                <p className="text-sm text-muted-foreground">
                  {vrContent.metadata.requirements}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}