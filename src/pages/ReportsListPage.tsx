import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Calendar, AlertCircle } from 'lucide-react';

// Mock data - will be replaced with Supabase data
const mockReports = [
  {
    id: '1',
    type: 'pothole',
    description: 'Large pothole causing traffic issues',
    coordinates: [-74.0066, 40.7135],
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    image: null,
  },
  {
    id: '2',
    type: 'waterlogging',
    description: 'Street floods during heavy rain',
    coordinates: [-74.0096, 40.7095],
    status: 'in-progress',
    createdAt: '2024-01-19T15:45:00Z',
    image: null,
  },
  {
    id: '3',
    type: 'broken-road',
    description: 'Road surface completely damaged',
    coordinates: [-74.0106, 40.7165],
    status: 'resolved',
    createdAt: '2024-01-18T09:15:00Z',
    image: null,
  },
];

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

const getIssueTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    'pothole': 'Pothole',
    'waterlogging': 'Waterlogging',
    'broken-road': 'Broken Road',
    'broken-streetlight': 'Broken Streetlight',
    'damaged-signage': 'Damaged Signage',
    'blocked-drain': 'Blocked Drain',
    'other': 'Other',
  };
  return types[type] || type;
};

const ReportsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getIssueTypeLabel(report.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Community Reports</h1>
          <p className="text-muted-foreground">
            View and track infrastructure issues reported by the community.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="waterlogging">Waterlogging</SelectItem>
                    <SelectItem value="broken-road">Broken Road</SelectItem>
                    <SelectItem value="broken-streetlight">Broken Streetlight</SelectItem>
                    <SelectItem value="damaged-signage">Damaged Signage</SelectItem>
                    <SelectItem value="blocked-drain">Blocked Drain</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reports found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getIssueTypeLabel(report.type)}
                      </Badge>
                      <Badge 
                        variant={getStatusColor(report.status) as any}
                        className="capitalize"
                      >
                        {report.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  
                  <p className="text-foreground mb-3">{report.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {report.coordinates[1].toFixed(4)}, {report.coordinates[0].toFixed(4)}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default ReportsListPage;