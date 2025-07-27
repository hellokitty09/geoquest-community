import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportFormProps {
  onSubmit: (report: {
    coordinates: [number, number] | null;
    image: File | null;
    type: string;
    description: string;
  }) => void;
  selectedLocation?: [number, number] | null;
}

const issueTypes = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'waterlogging', label: 'Waterlogging' },
  { value: 'broken-road', label: 'Broken Road' },
  { value: 'broken-streetlight', label: 'Broken Streetlight' },
  { value: 'damaged-signage', label: 'Damaged Signage' },
  { value: 'blocked-drain', label: 'Blocked Drain' },
  { value: 'other', label: 'Other' },
];

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, selectedLocation }) => {
  const [image, setImage] = useState<File | null>(null);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const getCurrentLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let coordinates = selectedLocation;
      
      if (!coordinates) {
        coordinates = await getCurrentLocation();
      }

      onSubmit({
        coordinates,
        image,
        type,
        description,
      });

      toast({
        title: "Report Submitted",
        description: "Your infrastructure issue has been reported successfully.",
      });

      // Reset form
      setImage(null);
      setType('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get your location. Please select a location on the map.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Report Infrastructure Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Display */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {selectedLocation
                  ? `${selectedLocation[1].toFixed(6)}, ${selectedLocation[0].toFixed(6)}`
                  : 'Auto-detect or select on map'
                }
              </span>
            </div>
          </div>

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Issue Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((issueType) => (
                  <SelectItem key={issueType.value} value={issueType.value}>
                    {issueType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleImageCapture}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                {image ? 'Change Photo' : 'Take Photo'}
              </Button>
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Issue preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 bg-success text-success-foreground px-2 py-1 rounded text-xs">
                    ✓ Photo captured
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Upload className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;