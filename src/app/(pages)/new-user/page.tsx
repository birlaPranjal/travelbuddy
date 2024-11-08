"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


const languages = [
  'English', 'Hindi', 'French', 'German', 'Spanish', 'Mandarin', 'Japanese',
  'Korean', 'Arabic', 'Russian', 'Portuguese', 'Italian', 'Dutch', 'Thai'
];

const interests = [
  'Adventure Travel', 'Cultural Exploration', 'Food & Cuisine', 'Photography',
  'Hiking & Trekking', 'Historical Sites', 'Beach Life', 'City Exploration',
  'Nature & Wildlife', 'Local Markets', 'Architecture', 'Festivals',
  'Backpacking', 'Luxury Travel', 'Spiritual Places', 'Art Galleries'
];

const travelStyles = [
  'Budget Explorer', 'Luxury Seeker', 'Adventure Enthusiast', 'Cultural Immersion',
  'Solo Traveler', 'Group Travel', 'Slow Travel', 'Fast-Paced Explorer'
];

export default function NewUserPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: string; longitude: string }>({
    latitude: '',
    longitude: ''
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: '',
      age: 0,
      gender: '',
      about: '',
      location: '',
      phone: '',
      instagram: ''
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const detectLocation = async () => {
    setIsLocating(true);
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = (position as GeolocationPosition).coords;
      setCoordinates({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
      });

      fetchLocationData(latitude, longitude);
    } catch {
      setLocationError('Failed to detect location. Please enter manually.');
    } finally {
      setIsLocating(false);
    }
  };


  interface LocationData {
    results: Array<{
      formatted: string;
      geometry: {
        lat: number;
        lng: number;
      };
    }>;
  }

  const fetchLocationData = async (latitude: number, longitude: number): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=dacf037a4ac84e9ebfe82798e50cb633`
      );
      const data: LocationData = await response.json();

      if (data.results && data.results.length > 0) {
        const areaName = data.results[0].formatted;
        setLocation(areaName);
        setValue('location', areaName);
      } else {
        setLocationError('Could not retrieve location details.');
      }
    } catch {
      setLocationError('Failed to fetch location details. Please try again.');
    }
  };
  
  interface GeocodeResult {
    geometry: {
      lat: number;
      lng: number;
    };
  }

  interface GeocodeResponse {
    results: GeocodeResult[];
  }

  const fetchLocationDataByPlace = async (place: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=dacf037a4ac84e9ebfe82798e50cb633`
      );
      const data: GeocodeResponse = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setCoordinates({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
      } else {
        setLocationError('Could not find location details.');
      }
    } catch {
      setLocationError('Failed to fetch location details. Please try again.');
    }
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    fetchLocationDataByPlace(e.target.value);
  };


  const handleLocationBlur = async () => {
    const coordinatesPattern = /^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),\s*([-+]?(180(\.0+)?|(1[0-7]\d)|(\d{1,2}))(\.\d+)?)$/;
    if (coordinatesPattern.test(location)) {
      const [latitude, longitude] = location.split(',').map((coord) => parseFloat(coord.trim()));
      setCoordinates({ latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) });
      fetchLocationData(latitude, longitude);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted) return;
    
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  interface FormData {
    name: string;
    age: number;
    gender: string;
    about: string;
    location: string;
    phone: string;
    instagram: string;
  }

  const onSubmit = async (data: FormData) => {
    let imageUrl = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'travel');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/travelee/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const result = await response.json();
        imageUrl = result.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const formDataWithExtras = {
      ...data,
      languages: selectedLanguages,
      interests: selectedInterests,
      travelStyles: selectedStyles,
      image: imageUrl,
      coordinates
    };
    console.log(formDataWithExtras)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataWithExtras),
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        throw new Error('Failed to submit profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to submit profile. Please try again.');
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 -mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Travel Profile</h1>
          <p className="text-gray-400 text-lg">Let&apos;s help you connect with the perfect travel companions</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-700 border-4 border-blue-500/30">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-600
                      cursor-pointer"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-400">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  {...register('age', {
                    required: 'Age is required',
                    min: { value: 18, message: 'Must be at least 18 years old' }
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number (WhatsApp)
                </label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram Handle
                </label>
                <input
                  {...register('instagram')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@yourusername"
                />
              </div>

              <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
      <div className="flex gap-2">
        <input
          {...register('location')}
          value={location}
          onChange={handleLocationChange}
          onBlur={handleLocationBlur}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter coordinates or click to detect"
        />
        <button
          type="button"
          onClick={detectLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          disabled={isLocating}
        >
          {isLocating ? '📍...' : '📍'}
        </button>
      </div>
      {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}
      {coordinates.latitude && coordinates.longitude && (
        <div className="mt-2 text-sm text-gray-400">
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
        </div>
      )}
    </div>
            </div>
          </div>

          {/* About Section */}
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">About You</h2>
      <textarea
        {...register('about', {
          required: 'Please write something about yourself'
        })}
        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
        placeholder="Tell us about yourself, your travel experiences, and what you're looking for in a travel companion..."
      />
      {errors.about && (
        <p className="mt-1 text-sm text-red-500">{errors.about.message}</p>
      )}
    </div>

          {/* Languages Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Languages You Speak</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLanguages((prev) =>
                      prev.includes(lang)
                        ? prev.filter((l) => l !== lang)
                        : [...prev, lang]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedLanguages.includes(lang)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Travel Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    setSelectedInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedInterests.includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Travel Style</h2>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => {
                    setSelectedStyles((prev) =>
                      prev.includes(style)
                        ? prev.filter((s) => s !== style)
                        : [...prev, style]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStyles.includes(style)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Create Travel Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}