import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Map, List, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInteraction } from '@/providers/UserInteractionProvider';
import { cn } from '@/lib/utils';
import type { Destination } from '@shared/schema';

// Import mapbox-gl dynamically to avoid SSR issues
let mapboxgl: any = null;
if (typeof window !== 'undefined') {
  import('mapbox-gl').then(module => {
    mapboxgl = module.default;
  });
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');
  const [selectedCountry, setSelectedCountry] = useState('');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const { trackInteraction } = useUserInteraction();

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['/api/destinations'],
  });

  const { data: searchResults } = useQuery({
    queryKey: ['/api/destinations/search', { q: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  const displayDestinations = searchQuery.length > 2 ? searchResults : destinations;

  // Initialize map
  useEffect(() => {
    if (viewMode === 'map' && mapContainer.current && !map.current && mapboxgl) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [0, 20],
        zoom: 2,
        accessToken: 'pk.eyJ1IjoidHJhdmVsdmVyc2UiLCJhIjoiY2x6ajJwZGFmMTFjMzJrcGF5dGNhb2hpZSJ9.placeholder'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());
    }
  }, [viewMode]);

  // Add markers to map
  useEffect(() => {
    if (map.current && displayDestinations && viewMode === 'map') {
      // Clear existing markers
      const existingMarkers = document.querySelectorAll('.destination-marker');
      existingMarkers.forEach(marker => marker.remove());

      displayDestinations.forEach((destination: Destination) => {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.innerHTML = '<div class="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg"></div>';
        
        el.addEventListener('click', () => {
          trackInteraction({ 
            action: 'view', 
            destinationId: destination.id 
          });
          window.location.href = `/destination/${destination.id}`;
        });

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${destination.name}</h3>
                  <p class="text-sm text-gray-600">${destination.country}</p>
                  <p class="text-xs mt-1">${destination.description.slice(0, 100)}...</p>
                </div>
              `)
          )
          .addTo(map.current);
      });
    }
  }, [displayDestinations, viewMode, trackInteraction]);

  const countries = destinations ? [...new Set(destinations.map((d: Destination) => d.country))] : [];

  const filteredDestinations = displayDestinations?.filter((destination: Destination) =>
    !selectedCountry || destination.country === selectedCountry
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Explore Destinations</h1>
              <p className="text-muted-foreground mt-1">
                Discover amazing places around the world with AI-powered insights
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Countries</option>
                {countries.map((country: string) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <div className="flex rounded-lg border border-border bg-background">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'map' ? (
          <div className="h-[600px] rounded-lg overflow-hidden border border-border">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${filteredDestinations?.length || 0} destinations found`}
              </p>
            </div>

            {/* Grid View */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
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
                {filteredDestinations?.map((destination: Destination) => (
                  <Card 
                    key={destination.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => {
                      trackInteraction({ 
                        action: 'view', 
                        destinationId: destination.id 
                      });
                      window.location.href = `/destination/${destination.id}`;
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm">
                        <Star className="inline h-3 w-3 mr-1" />
                        {(Math.random() * 2 + 3).toFixed(1)}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {destination.climate.temperature}°C
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {destination.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mb-4 flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        {destination.country}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {destination.activities.length} Activities
                          </span>
                          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            {destination.photoSpots.length} Photo Spots
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}