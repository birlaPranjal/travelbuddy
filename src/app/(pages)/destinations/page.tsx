"use client";
import React, { useState, useEffect } from 'react';

const UNSPLASH_ACCESS_KEY = 'LoXL49MckgJpQJO_51V7B3RocOU1F7rCkAr_qcm6EkM'; // Replace with your Unsplash API key

export default function TouristPlaces() {
  interface Place {
    id: number;
    name: string;
    type: string;
    lat: number | undefined;
    lon: number | undefined;
    description: string;
    address: string;
    image: string | null;
  }

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });

  const fetchImageForPlace = async (placeName: string, type: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName + ' ' + type)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      const data = await response.json();
      return data.results[0]?.urls?.regular || null;
    } catch {
      return null;
    }
  };

  const handleViewDetails = (place: Place) => {
    const searchQuery = encodeURIComponent(`${place.name} ${place.type} ${place.address}`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  useEffect(() => {
    const fetchUserCoordinates = async () => {
      try {
        const response = await fetch('/api/user/coordinates');
        const data = await response.json();

        if (response.ok) {
          setUserLocation({
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          });
        } else {
          setError(data.error || 'Failed to fetch user coordinates');
          setLoading(false);
        }
      } catch {
        setError('Error fetching user coordinates');
        setLoading(false);
      }
    };

    fetchUserCoordinates();
  }, []);

  useEffect(() => {
    const fetchTouristPlaces = async () => {
      try {
        if (!userLocation.latitude || !userLocation.longitude) return;

        const radius = 10000; // 10km radius

        const query = `
          [out:json][timeout:25];
          (
            node["historic"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            way["historic"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            node["historic"="castle"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            way["historic"="castle"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            node["historic"="palace"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            way["historic"="palace"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            
            node["tourism"="museum"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            way["tourism"="museum"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            
            node["waterway"="waterfall"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            
            node["natural"="water"]["water"="lake"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            way["natural"="water"]["water"="lake"](around:${radius},${userLocation.latitude},${userLocation.longitude});
            relation["natural"="water"]["water"="lake"](around:${radius},${userLocation.latitude},${userLocation.longitude});
          );
          out body;
          >;
          out skel qt;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        interface Element {
          id: number;
          tags: {
            name?: string;
            historic?: string;
            tourism?: string;
            waterway?: string;
            natural?: string;
            water?: string;
            description?: string;
            'addr:street'?: string;
          };
          lat?: number;
          lon?: number;
          center?: {
            lat: number;
            lon: number;
          };
        }

        interface OverpassResponse {
          elements: Element[];
        }

        const processedPlaces: Place[] = await Promise.all(
          (data as OverpassResponse).elements
            .filter((element) => element.tags && element.tags.name)
            .map(async (element) => {
              let type = '';
              if (element.tags.historic) type = 'Historical Place';
              if (element.tags.historic === 'castle') type = 'Castle';
              if (element.tags.historic === 'palace') type = 'Palace';
              if (element.tags.tourism === 'museum') type = 'Museum';
              if (element.tags.waterway === 'waterfall') type = 'Waterfall';
              if (element.tags.natural === 'water' && element.tags.water === 'lake') type = 'Lake';

              const image = await fetchImageForPlace(element.tags.name!, type);

              return {
                id: element.id,
                name: element.tags.name!,
                type: type,
                lat: element.lat || (element.center && element.center.lat),
                lon: element.lon || (element.center && element.center.lon),
                description: element.tags.description || '',
                address: element.tags['addr:street'] || '',
                image: image
              };
            })
        );

        setPlaces(processedPlaces);
        setLoading(false);
      } catch {
        setError("Failed to fetch tourist places");
        setLoading(false);
      }
    };

    if (userLocation.latitude && userLocation.longitude) {
      fetchTouristPlaces();
    }
  }, [userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl max-w-2xl mx-auto">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 -mt-16">
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
            Discover Nearby Attractions
          </h1>
          
          {places.length === 0 ? (
            <p className="text-xl text-gray-400 text-center">No attractions found in this area.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {places.map(place => (
                <div key={place.id} className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {place.image ? (
                    <div className="relative h-48">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-blue-400">{place.name}</h2>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-blue-500">Type:</span> {place.type}
                      </p>
                      {place.description && (
                        <p className="text-gray-400 line-clamp-3">{place.description}</p>
                      )}
                      {place.lat && place.lon && (
                        <p className="text-gray-300">
                          <span className="text-blue-500">Distance:</span> {calculateDistance(userLocation.latitude, userLocation.longitude, place.lat, place.lon)} km
                        </p>
                      )}
                      {place.address && (
                        <p className="text-gray-300">
                          <span className="text-blue-500">Address:</span> {place.address}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleViewDetails(place)}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}