import React, { useState } from 'react';
import Map from '@/components/Map';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, AlertCircle, Navigation as NavigationIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data - will be replaced with Supabase data
const mockNearbyReports = [
  {
    id: '1',
    type: 'pothole',
    coordinates: [-74.0066, 40.7135] as [number, number],
    status: 'pending',
    description: 'Large pothole causing traffic issues',
  },
  {
    id: '2',
    type: 'waterlogging',
    coordinates: [-74.0096, 40.7095] as [number, number],
    status: 'in-progress',
    description: 'Street floods during heavy rain',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  React.useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">GeoSurveyX</h1>
              <p className="text-primary-foreground/80">Community Infrastructure Reporting</p>
            </div>
            <NavigationIcon className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Quick Action */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Report an Issue</h2>
                <p className="text-sm text-muted-foreground">
                  Help improve your community infrastructure
                </p>
              </div>
              <Button onClick={() => navigate('/report')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Community Reports Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Map 
                    reports={mockNearbyReports}
                    showTokenInput={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nearby Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Nearby Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockNearbyReports.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No nearby reports found
                    </p>
                  ) : (
                    mockNearbyReports.map((report) => (
                      <div key={report.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {report.type.replace('-', ' ')}
                          </Badge>
                          <Badge 
                            variant={getStatusColor(report.status) as any}
                            className="text-xs capitalize"
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-2">{report.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {report.coordinates[1].toFixed(4)}, {report.coordinates[0].toFixed(4)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/reports')}
                >
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reports</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolved Issues</span>
                    <span className="font-semibold text-success">125</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="font-semibold">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
