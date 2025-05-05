import mongoose from 'mongoose';

export interface ItineraryData {
  title: string;
  description: string;
  duration: number; // in days
  price: number;
  location: string;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  createdBy: string;
  isPublished: boolean;
}

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: { type: [String], required: true },
  highlights: { type: [String], default: [] },
  inclusions: { type: [String], default: [] },
  exclusions: { type: [String], default: [] },
  createdBy: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
}, {
  timestamps: true
});

export interface DBItinerary extends ItineraryData, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Check if model exists before creating it
let Itinerary: mongoose.Model<DBItinerary>;
try {
  Itinerary = mongoose.model<DBItinerary>('Itinerary');
} catch {
  Itinerary = mongoose.model<DBItinerary>('Itinerary', ItinerarySchema);
}

export default Itinerary;

export const getAllItineraries = async (): Promise<{ success: boolean; itineraries?: DBItinerary[]; error?: string }> => {
  try {
    const response = await fetch('/api/itineraries');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch itineraries',
    };
  }
};

export const getItineraryById = async (id: string): Promise<{ success: boolean; itinerary?: DBItinerary; error?: string }> => {
  try {
    const response = await fetch(`/api/itineraries/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch itinerary',
    };
  }
};

export const createItinerary = async (itineraryData: ItineraryData): Promise<{ success: boolean; itinerary?: DBItinerary; error?: string }> => {
  try {
    const response = await fetch('/api/itineraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itineraryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create itinerary',
    };
  }
};

export const updateItinerary = async (id: string, itineraryData: Partial<ItineraryData>): Promise<{ success: boolean; itinerary?: DBItinerary; error?: string }> => {
  try {
    const response = await fetch(`/api/itineraries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itineraryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update itinerary',
    };
  }
};

export const deleteItinerary = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`/api/itineraries/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete itinerary',
    };
  }
};

// Fallback formatCurrency function in case it doesn't exist
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}; 