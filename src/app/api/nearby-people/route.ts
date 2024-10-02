import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function POST(req) {
  try {
    // Parse the incoming request
    const { latitude, longitude, userId } = await req.json();
    
    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ error: "Latitude and Longitude are required" }), { status: 400 });
    }
    
    await dbConnect(); // Ensure DB is connected
    
    // Fetch all users excluding the current user (use `userId` from the request body if no auth middleware)
    const users = await UserModel.find({
      _id: { $ne: userId }, // Exclude current user
      latitude: { $exists: true }, // Only consider users with lat/lng set
      longitude: { $exists: true }
    });

    // Calculate distance for each user and sort by proximity
    const nearbyUsers = users
      .map(user => ({
        ...user._doc, // Spread user document
        distance: calculateDistance(
          latitude, 
          longitude, 
          user.latitude || 0, 
          user.longitude || 0
        )
      }))
      .sort((a, b) => a.distance - b.distance);
    
    // Sanitize user data for the response (avoid returning sensitive data)
    const sanitizedUsers = nearbyUsers.map(user => ({
      _id: user._id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      location: user.location,
      about: user.about,
      interests: user.interests,
      image: user.image,
      distance: Math.round(user.distance) // Round the distance to nearest km
    }));

    return new Response(JSON.stringify(sanitizedUsers), { status: 200 });

  } catch (error) {
    console.error('Error fetching nearby people:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch nearby people' }), { status: 500 });
  }
}
