import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Mock data - will be replaced with Supabase data
const mockStats = {
  totalReports: 156,
  pendingReports: 23,
  inProgressReports: 8,
  resolvedReports: 125,
  totalUsers: 89,
  reportsThisWeek: 12,
};

const mockRecentReports = [
  {
    id: '1',
    type: 'pothole',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    priority: 'high',
  },
  {
    id: '2',
    type: 'waterlogging',
    status: 'in-progress',
    createdAt: '2024-01-20T09:15:00Z',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'broken-streetlight',
    status: 'pending',
    createdAt: '2024-01-20T08:45:00Z',
    priority: 'low',
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'in-progress':
      return <AlertTriangle className="h-4 w-4" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const AdminPage: React.FC = () => {
  const handleExportData = () => {
    // This will be implemented with Supabase
    console.log('Exporting data...');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage community infrastructure reports.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{mockStats.totalReports}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{mockStats.pendingReports}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-info">{mockStats.inProgressReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-success">{mockStats.resolvedReports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <p className="font-medium text-sm">{report.type.replace('-', ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getPriorityColor(report.priority) as any}
                        className="text-xs"
                      >
                        {report.priority}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Export Data</h4>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download reports as GeoJSON or CSV format for analysis.
                  </p>
                  <Button onClick={handleExportData} variant="outline" className="w-full">
                    Export All Reports
                  </Button>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">User Management</h4>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Total users: {mockStats.totalUsers}
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Users
                  </Button>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Analytics</h4>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mockStats.reportsThisWeek} reports this week
                  </p>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default AdminPage;