import React, { useState } from 'react';
import ReportForm from '@/components/ReportForm';
import Map from '@/components/Map';
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Camera } from 'lucide-react';

const ReportPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const handleLocationSelect = (coordinates: [number, number]) => {
    setSelectedLocation(coordinates);
  };

  const handleReportSubmit = (report: {
    coordinates: [number, number] | null;
    image: File | null;
    type: string;
    description: string;
  }) => {
    console.log('Report submitted:', report);
    // Note: Backend integration will be implemented with Supabase
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Infrastructure Issue</h1>
          <p className="text-muted-foreground">
            Help improve your community by reporting infrastructure problems.
          </p>
        </div>

        <Tabs defaultValue="form" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Report Form
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Select Location
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <ReportForm 
              onSubmit={handleReportSubmit}
              selectedLocation={selectedLocation}
            />
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Issue Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Map 
                    onLocationSelect={handleLocationSelect}
                    showTokenInput={true}
                  />
                </div>
                {selectedLocation && (
                  <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-md">
                    <p className="text-sm text-success-foreground">
                      ✓ Location selected: {selectedLocation[1].toFixed(6)}, {selectedLocation[0].toFixed(6)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
};

export default ReportPage;