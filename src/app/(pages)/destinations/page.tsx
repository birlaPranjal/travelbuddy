"use client";
import React, { useState, useEffect } from 'react';

export default function TouristPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });

  // Fetch user's coordinates from the API
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
      } catch (err) {
        setError('Error fetching user coordinates');
        setLoading(false);
      }
    };

    fetchUserCoordinates();
  }, []);

  // Fetch tourist places based on user's current location
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

        const processedPlaces = data.elements
          .filter(element => element.tags && element.tags.name)
          .map(element => {
            let type = '';
            if (element.tags.historic) type = 'Historical Place';
            if (element.tags.historic === 'castle') type = 'Castle';
            if (element.tags.historic === 'palace') type = 'Palace';
            if (element.tags.tourism === 'museum') type = 'Museum';
            if (element.tags.waterway === 'waterfall') type = 'Waterfall';
            if (element.tags.natural === 'water' && element.tags.water === 'lake') type = 'Lake';

            return {
              id: element.id,
              name: element.tags.name,
              type: type,
              lat: element.lat || (element.center && element.center.lat),
              lon: element.lon || (element.center && element.center.lon),
              description: element.tags.description || '',
              address: element.tags['addr:street'] || '',
              image: null
            };
          });

        setPlaces(processedPlaces);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userLocation.latitude && userLocation.longitude) {
      fetchTouristPlaces();
    }
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Historical Places, Museums, and Natural Attractions Nearby</h1>
      {places.length === 0 ? (
        <p className="text-gray-600">No attractions found in this area.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <div key={place.id} className="border rounded-lg overflow-hidden shadow-lg">
              {place.image ? (
                <div className="relative h-48">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
                <p className="text-gray-600 mb-2">Type: {place.type}</p>
                {place.description && (
                  <p className="text-gray-600 mb-2 line-clamp-3">{place.description}</p>
                )}
                {place.lat && place.lon && (
                  <p className="text-gray-600 mb-2">
                    Distance: {calculateDistance(userLocation.latitude, userLocation.longitude, place.lat, place.lon)} km
                  </p>
                )}
                {place.address && (
                  <p className="text-gray-600">Address: {place.address}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
