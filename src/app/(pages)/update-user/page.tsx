"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Cloudinary } from "cloudinary-core";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cloudinary = new Cloudinary({ cloud_name: "travelee", secure: true });

const languages = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese",
  "Korean", "Arabic", "Russian", "Portuguese", "Italian", "Hindi"
];

const interests = [
  "Reading", "Writing", "Music", "Movies", "Sports", "Cooking",
  "Travel", "Photography", "Art", "Technology", "Gaming", "Fitness"
];

export default function UpdateUserPage() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{latitude: string, longitude: string} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const [locationError, setLocationError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      about: "",
      location: "",
      phone:"",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/user/profile`);
      if (response.ok) {
        const userData = await response.json();
        const data = userData.user;
        setValue("name", data.name || "");
        setValue("age", data.age || "");
        setValue("gender", data.gender || "");
        setValue("about", data.about || "");
        setValue("phone", data.phone || "")
        setLocation(data.location || "");
        setValue("location", data.location || "");
        setSelectedLanguages(data.languages || []);
        setSelectedInterests(data.interests || []);
        setPreviewImage(data.image || "");
        if (data.coordinates) {
          setCoordinates({
            latitude: data.coordinates.latitude || "",
            longitude: data.coordinates.longitude || ""
          });
        }
      } else {
        console.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [setValue, router]);

  const handleManualLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const manualLocation = e.target.value;
    setLocation(manualLocation);
    setValue("location", manualLocation);
    
    if (manualLocation.length > 3) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(manualLocation)}&key=dacf037a4ac84e9ebfe82798e50cb633`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          setCoordinates({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
          });
        }
      } catch (error) {
        console.error('Error geocoding manual location:', error);
      }
    }
  };

  const detectLocation = async () => {
    setIsLocating(true);
    setLocationError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = (position as GeolocationPosition).coords;
      setCoordinates({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6)
      });
      
      // Call OpenCage reverse geocoding API
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=dacf037a4ac84e9ebfe82798e50cb633`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const areaName = data.results[0].formatted;
        setLocation(areaName);
        setValue("location", areaName);
      }
    } catch {
      setLocationError("Failed to detect location. Please enter manually.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    age: string;
    gender: string;
    about: string;
    location: string;
    phone: string;
  }

  const onSubmit = async (data: FormData) => {
    let imageUrl = previewImage;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "travel");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      imageUrl = result.secure_url;
    }

    const formDataWithCoordinates = {
      ...data,
      languages: selectedLanguages,
      interests: selectedInterests,
      image: imageUrl,
      coordinates: coordinates || { 
        latitude: '',
        longitude: ''
      }
    };

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataWithCoordinates),
    });

    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Update Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </div>
              <input
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
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium">
                Age
              </label>
              <input
                id="age"
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 13, message: "Must be at least 13 years old" },
                })}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.age && <p className="text-red-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <div className="flex space-x-2">
                <input
                  id="location"
                  {...register("location")}
                  value={location}
                  onChange={handleManualLocationChange}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  className="p-2 bg-blue-500 text-white rounded-md"
                  disabled={isLocating}
                >
                  {isLocating ? "Locating..." : "Detect"}
                </button>
              </div>
              {locationError && <p className="text-red-500">{locationError}</p>}
              {coordinates && (
                <p className="text-sm text-gray-500">
                  Coordinates: {coordinates.latitude}, {coordinates.longitude}
                </p>
              )}
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="space-y-2">
            <label htmlFor="about" className="block text-sm font-medium">
              Phone Number(Whatsapp)
            </label>
            <input 
              id="phone"
              {...register("phone")}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <label htmlFor="about" className="block text-sm font-medium">
              About You
            </label>
            <textarea
              id="about"
              rows={4}
              {...register("about")}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Languages and Interests */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Languages</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {languages.map((language) => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={language}
                      checked={selectedLanguages.includes(language)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLanguages([...selectedLanguages, language]);
                        } else {
                          setSelectedLanguages(
                            selectedLanguages.filter((lang) => lang !== language)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-500"
                    />
                    <span>{language}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={interest}
                      checked={selectedInterests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInterests([...selectedInterests, interest]);
                        } else {
                          setSelectedInterests(
                            selectedInterests.filter((int) => int !== interest)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-500"
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}