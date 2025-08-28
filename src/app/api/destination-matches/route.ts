import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TravelPlan from '@/app/model/TravelPlan';
import dbConnect from '@/app/lib/dbConnect';

interface GeocodingResponse {
  results: Array<{
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
}

async function getCoordinates(destination: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
} | null> {
  try {
    const encodedDestination = encodeURIComponent(destination);
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodedDestination}&key=dacf037a4ac84e9ebfe82798e50cb633&limit=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const data: GeocodingResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        formattedAddress: result.formatted
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = await req.json();
    
    const { destination, fromDate, toDate, budget } = searchParams;

    if (!destination || !fromDate || !toDate || !budget) {
      return NextResponse.json({ error: 'Missing required search parameters' }, { status: 400 });
    }

    const locationData = await getCoordinates(destination);

    if (!locationData) {
      return NextResponse.json({ error: 'Could not geocode destination' }, { status: 400 });
    }

    // Create the coordinates object in the correct format
    const coordinates: { type: "Point"; coordinates: [number, number] } = {
      type: "Point",
      coordinates: [locationData.longitude, locationData.latitude]
    };

    // Create the travel plan with explicit coordinates structure
    const travelPlanData = {
      userId: session.user._id,
      destination,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      budget: Number(budget),
      coordinates,
      formattedAddress: locationData.formattedAddress
    };


    const travelPlan = await TravelPlan.create(travelPlanData);
    console.log('Created travel plan:', travelPlan);

    // Find matching plans
    const matchingPlans = await TravelPlan.aggregate([
      {
        $geoNear: {
          near: coordinates,
          distanceField: "distance",
          maxDistance: 100000, // 100km in meters
          spherical: true
        }
      },
      {
        $match: {
          userId: { $ne: session.user._id },
          fromDate: { $lte: new Date(toDate) },
          toDate: { $gte: new Date(fromDate) },
          budget: {
            $gte: budget * 0.7,
            $lte: budget * 1.3
          }
        }
      }
    ]);

    return NextResponse.json({
      message: 'Successfully found matching travelers',
      travelPlan,
      matches: matchingPlans
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        errors: (error as { errors?: unknown }).errors
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to process search request',
          details: error.message,
          validationErrors: (error as { errors?: unknown }).errors
        },
        { status: 500 }
      );
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process search request',
          details: 'An unexpected error occurred'
        },
        { status: 500 }
      );
    }
  }
}



export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's active travel plan
    const userPlan = await TravelPlan.findOne({
      userId: session.user._id,
    }).sort({ createdAt: -1 }); // Get the most recent plan

    if (!userPlan) {
      return NextResponse.json({ 
        error: 'No travel plan found for the user' 
      }, { status: 404 });
    }

    // Find matching plans using aggregation pipeline
    const matchingPlans = await TravelPlan.aggregate([
      {
        $geoNear: {
          near: userPlan.coordinates,
          distanceField: "distanceInMeters",
          maxDistance: 100000, // 100km in meters
          spherical: true
        }
      },
      {
        $match: {
          userId: { $ne: session.user._id }, // Exclude the current user
          fromDate: { $lte: userPlan.toDate }, // Overlapping dates
          toDate: { $gte: userPlan.fromDate },
          budget: {
            $gte: userPlan.budget * 0.5, // Within 50% budget range
            $lte: userPlan.budget * 1.5
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          destination: 1,
          fromDate: 1,
          toDate: 1,
          budget: 1,
          formattedAddress: 1,
          coordinates: 1,
          distanceInKm: { $divide: ['$distanceInMeters', 1000] },
          user: {
            _id: '$userDetails._id',
            name: '$userDetails.name',
            email: '$userDetails.email',
            image: '$userDetails.image',
            age: '$userDetails.age',
            gender: '$userDetails.gender',
            location: '$userDetails.location',
            latitude: '$userDetails.latitude',
            longitude: '$userDetails.longitude',
            phone: '$userDetails.phone',
            about: '$userDetails.about',
            languages: '$userDetails.languages',
            interests: '$userDetails.interests',
            username: '$userDetails.username',
            instagram: '$userDetails.instagram',
            travelStyles: '$userDetails.travelStyles',
            isAcceptingMessages: '$userDetails.isAcceptingMessages'
          },
          travelPlans: {
            destination: '$destination',
            fromDate: '$fromDate',
            toDate: '$toDate',
            budget: '$budget',
            formattedAddress: '$formattedAddress',
            coordinates: '$coordinates'
          }
        }
      },
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
          travelPlans: { 
            $push: {
              destination: '$travelPlans.destination',
              fromDate: '$travelPlans.fromDate',
              toDate: '$travelPlans.toDate',
              budget: '$travelPlans.budget',
              formattedAddress: '$travelPlans.formattedAddress',
              coordinates: '$travelPlans.coordinates',
              distanceInKm: '$distanceInKm'
            }
          }
        }
      },
      {
        $sort: {
          'travelPlans.distanceInKm': 1,
          'travelPlans.fromDate': 1
        }
      }
    ]);

    return NextResponse.json({
      userPlan,
      matches: matchingPlans,
      totalMatches: matchingPlans.length
    });

  } catch (error) {
    console.error('Error finding matching travel plans:', error);
    return NextResponse.json(
      { 
        error: 'Failed to find matching travel plans',
        details: (error as Error).message
      }, 
      { status: 500 }
    );
  }
}