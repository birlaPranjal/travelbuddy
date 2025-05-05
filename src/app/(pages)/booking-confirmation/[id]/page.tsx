"use client";

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageTransition } from '@/app/components/PageTransition';
import { Spinner } from '@/app/components/Spinner';
import { getItineraryById } from '@/app/model/Itinerary';

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
}

const BookingConfirmationPage: FC<BookingConfirmationPageProps> = ({ params }) => {
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [itineraryData, setItineraryData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a simple function to get booking by ID
        const getBookingById = async (id: string) => {
          try {
            const response = await fetch(`/api/bookings/${id}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          } catch (error) {
            console.error('Error fetching booking:', error);
            throw error;
          }
        };

        // Fetch booking data
        const bookingResult = await getBookingById(id);
        
        if (!bookingResult.success || !bookingResult.booking) {
          throw new Error(bookingResult.error || 'Failed to fetch booking');
        }
        
        setBookingData(bookingResult.booking);
        
        // Fetch itinerary data
        const itineraryResult = await getItineraryById(bookingResult.booking.itineraryId);
        
        if (!itineraryResult.success || !itineraryResult.itinerary) {
          throw new Error(itineraryResult.error || 'Failed to fetch itinerary details');
        }
        
        setItineraryData(itineraryResult.itinerary);
      } catch (err) {
        console.error('Error loading confirmation page:', err);
        setError('Failed to load booking confirmation. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" color="white" />
        <span className="ml-3 text-white">Loading your booking confirmation...</span>
      </div>
    );
  }

  if (error || !bookingData || !itineraryData) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 text-red-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{error || 'Booking not found'}</p>
            <button
              onClick={() => router.push('/itineraries')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Browse Itineraries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-900/20 border border-green-800 text-green-300 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Booking Confirmed! 🎉</h2>
            <p>
              Thank you for booking with Travel Buddy. Your booking has been confirmed and details have been sent to your email.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Booking Confirmation</h1>
              
              <div className="border-b border-gray-700 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-white mb-4">Trip Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Itinerary</p>
                    <p className="text-white font-medium">{itineraryData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Destination</p>
                    <p className="text-white font-medium">{itineraryData.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Start Date</p>
                    <p className="text-white font-medium">
                      {new Date(bookingData.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-medium">{itineraryData.duration} {itineraryData.duration === 1 ? 'day' : 'days'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-700 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-white mb-4">Traveler Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-medium">{bookingData.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{bookingData.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Contact Number</p>
                    <p className="text-white font-medium">{bookingData.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Number of People</p>
                    <p className="text-white font-medium">{bookingData.numberOfPeople}</p>
                  </div>
                </div>

                {bookingData.specialRequests && (
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">Special Requests</p>
                    <p className="text-white mt-1">{bookingData.specialRequests}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Price per person</span>
                  <span className="text-white">${itineraryData.price}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Number of people</span>
                  <span className="text-white">{bookingData.numberOfPeople}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-700 mt-2 pt-2">
                  <span className="text-gray-300 font-bold">Total paid</span>
                  <span className="text-green-400 font-bold">${bookingData.totalPrice}</span>
                </div>
                
                {bookingData.paymentId && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400 text-sm">Payment Status</span>
                      <span className="text-green-400 font-medium">
                        {bookingData.paymentStatus === 'completed' ? 'Completed' : bookingData.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400 text-sm">Payment ID</span>
                      <span className="text-white text-sm font-mono">{bookingData.paymentId}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400 text-sm">Order ID</span>
                      <span className="text-white text-sm font-mono">{bookingData.orderId}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 pt-6 flex justify-between">
                <Link
                  href="/itineraries"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Browse More Itineraries
                </Link>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookingConfirmationPage; 