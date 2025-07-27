import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Settings } from 'lucide-react';

interface MapProps {
  onLocationSelect?: (coordinates: [number, number]) => void;
  reports?: Array<{
    id: string;
    coordinates: [number, number];
    type: string;
    description: string;
  }>;
  showTokenInput?: boolean;
}

const Map: React.FC<MapProps> = ({ onLocationSelect, reports = [], showTokenInput = true }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation || [-74.0066, 40.7135], // NYC default
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add click handler for location selection
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        onLocationSelect(coordinates);
        
        // Add marker for selected location
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(coordinates)
          .addTo(map.current!);
      });
    }

    // Add user location marker if available
    if (userLocation) {
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(userLocation)
        .addTo(map.current);
    }

    // Add report markers
    reports.forEach((report) => {
      const marker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(report.coordinates)
        .addTo(map.current!);

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${report.type}</h3>
            <p class="text-xs text-gray-600">${report.description}</p>
          </div>
        `);

      marker.setPopup(popup);
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  if (showTokenInput && !isMapInitialized) {
    return (
      <Card className="p-6 max-w-md mx-auto mt-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Map Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to enable the map. Get your token at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="pk.eyJ1Ijoi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Initialize Map
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      {!isMapInitialized && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;