import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
  'Korean', 'Arabic', 'Russian', 'Portuguese', 'Italian', 'Hindi'
];

const interests = [
  'Reading', 'Writing', 'Music', 'Movies', 'Sports', 'Cooking',
  'Travel', 'Photography', 'Art', 'Technology', 'Gaming', 'Fitness'
];

export default function NewUserPage() {
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      about: '',
      location: '',
    }
  });

  const detectLocation = async () => {
    setIsLocating(true);
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // In a real app, you'd use a geocoding service here
      // For demo purposes, we'll just use coordinates
      setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
      setValue('location', `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
    } catch (error) {
      setLocationError('Failed to detect location. Please enter manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    // Combine all form data
    const formData = {
      ...data,
      languages: selectedLanguages,
      interests: selectedInterests,
      image: previewImage
    };

    // Here you would typically send this data to your API
    console.log(formData);
    
    // For demo purposes, we'll just log it
    alert('Profile submitted successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <div className="relative h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image src={previewImage} alt="Preview" className="h-full w-full object-cover" layout="fill" />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 13, message: 'Must be at least 13 years old' }
                  })}
                />
                {errors.age && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.age.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value: string) => setValue('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    {...register('location')}
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                  />
                  <Button type="button" onClick={detectLocation} disabled={isLocating}>
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {locationError && (
                  <Alert>
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">About Yourself</Label>
              <Textarea
                id="about"
                {...register('about', { 
                  required: 'Please write a short description about yourself',
                  maxLength: { value: 500, message: 'Maximum 500 characters' }
                })}
              />
              {errors.about && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.about.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <Button
                    key={lang}
                    type="button"
                    variant={selectedLanguages.includes(lang) ? "default" : "outline" as "default" | "outline"}
                    onClick={() => {
                      setSelectedLanguages(prev => 
                        prev.includes(lang) 
                          ? prev.filter(l => l !== lang)
                          : [...prev, lang]
                      );
                    }}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <Button
                    key={interest}
                    type="button"
                    variant={selectedInterests.includes(interest) ? "default" : "outline" as "default" | "outline"}
                    onClick={() => {
                      setSelectedInterests(prev => 
                        prev.includes(interest) 
                          ? prev.filter(i => i !== interest)
                          : [...prev, interest]
                      );
                    }}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}