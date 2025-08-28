import mongoose from 'mongoose';

export interface BookingData {
  itineraryId: string;
  userId: string;
  userEmail: string;
  userName: string;
  startDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  contactNumber?: string;
  paymentId?: string;
  orderId?: string;
  paymentSignature?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

const BookingSchema = new mongoose.Schema({
  itineraryId: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  startDate: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending' 
  },
  specialRequests: { type: String },
  contactNumber: { type: String },
  paymentId: { type: String },
  orderId: { type: String },
  paymentSignature: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending' 
  },
}, {
  timestamps: true
});

export interface DBBooking extends BookingData, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Check if model exists before creating it
let Booking: mongoose.Model<DBBooking>;
try {
  Booking = mongoose.model<DBBooking>('Booking');
} catch {
  Booking = mongoose.model<DBBooking>('Booking', BookingSchema);
}

export default Booking;

export const createBooking = async (bookingData: BookingData): Promise<{ success: boolean; booking?: DBBooking; error?: string }> => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
};

export const getBookingsByUser = async (userId: string): Promise<{ success: boolean; bookings?: DBBooking[]; error?: string }> => {
  try {
    const response = await fetch(`/api/bookings?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch bookings',
    };
  }
};

export const getAllBookings = async (): Promise<{ success: boolean; bookings?: DBBooking[]; error?: string }> => {
  try {
    const response = await fetch('/api/bookings/all');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch all bookings',
    };
  }
};

export const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<{ success: boolean; booking?: DBBooking; error?: string }> => {
  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update booking status',
    };
  }
}; 