"use client";

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getItineraryById, DBItinerary } from '@/app/model/Itinerary';
import { createBooking } from '@/app/model/Booking';
import { PageTransition } from '@/app/components/PageTransition';
import { Spinner } from '@/app/components/Spinner';
import { RazorpayPayment } from '@/app/components/RazorpayPayment';

interface ItineraryDetailPageProps {
  params: {
    id: string;
  };
}

const ItineraryDetailPage: FC<ItineraryDetailPageProps> = ({ params }) => {
  const { id } = params;
  const [itinerary, setItinerary] = useState<DBItinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [booking, setBooking] = useState({
    startDate: '',
    numberOfPeople: 1,
    userName: '',
    userEmail: '',
    contactNumber: '',
    specialRequests: '',
    totalPrice: 0,
  });
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const result = await getItineraryById(id);
        
        if (result.success && result.itinerary) {
          setItinerary(result.itinerary);
          setBooking(prev => ({
            ...prev,
            totalPrice: result.itinerary?.price || 0,
          }));
        } else {
          throw new Error(result.error || 'Failed to fetch itinerary');
        }
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError('Failed to load itinerary details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'numberOfPeople') {
      const people = parseInt(value, 10);
      const newTotalPrice = itinerary ? itinerary.price * people : 0;
      
      setBooking({
        ...booking,
        [name]: people,
        totalPrice: newTotalPrice,
      });
    } else {
      setBooking({
        ...booking,
        [name]: value,
      });
    }
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handlePaymentSuccess = async (paymentId: string, orderId: string, signature: string) => {
    try {
      setPaymentProcessing(true);
      
      if (!itinerary) return;
      
      const bookingData = {
        itineraryId: itinerary._id,
        userId: 'guest', // This would be the actual user ID in a real app with authentication
        userEmail: booking.userEmail,
        userName: booking.userName,
        startDate: new Date(booking.startDate),
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        status: 'confirmed' as const,
        specialRequests: booking.specialRequests,
        contactNumber: booking.contactNumber,
        paymentId: paymentId,
        orderId: orderId,
        paymentSignature: signature,
        paymentStatus: 'completed' as const
      };
      
      const result = await createBooking(bookingData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create booking');
      }
      
      setPaymentProcessing(false);
      router.push(`/booking-confirmation/${result.booking?._id}`);
    } catch (err) {
      setPaymentProcessing(false);
      setError('Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" color="white" />
        <span className="ml-3 text-white">Loading itinerary details...</span>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 text-red-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{error || 'Itinerary not found'}</p>
            <button
              onClick={() => router.push('/itineraries')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Back to Itineraries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/itineraries')}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Itineraries
          </button>

          {/* Hero Section */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            {itinerary.images && itinerary.images.length > 0 ? (
              <Image 
                src={itinerary.images[0]}
                alt={itinerary.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{itinerary.title}</h1>
              <div className="flex items-center text-gray-300 mb-2">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{itinerary.location}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
                <p className="text-gray-300 whitespace-pre-line">{itinerary.description}</p>
              </div>

              {/* Image Gallery */}
              {itinerary.images && itinerary.images.length > 1 && (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {itinerary.images.slice(1).map((img, index) => (
                      <div key={`gallery-${index}`} className="relative h-48 rounded overflow-hidden">
                        <Image 
                          src={img}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {itinerary.highlights && itinerary.highlights.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Highlights</h2>
                  <ul className="grid grid-cols-1 gap-3">
                    {itinerary.highlights.map((highlight, index) => (
                      <li key={`highlight-${index}`} className="flex text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Inclusions */}
                {itinerary.inclusions && itinerary.inclusions.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">What&apos;s Included</h2>
                    <ul className="grid grid-cols-1 gap-3">
                      {itinerary.inclusions.map((inclusion, index) => (
                        <li key={`inclusion-${index}`} className="flex text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exclusions */}
                {itinerary.exclusions && itinerary.exclusions.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">What&apos;s Not Included</h2>
                    <ul className="grid grid-cols-1 gap-3">
                      {itinerary.exclusions.map((exclusion, index) => (
                        <li key={`exclusion-${index}`} className="flex text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white text-2xl font-bold">${itinerary.price}</span>
                  <span className="text-gray-400">per person</span>
                </div>

                <div className="mb-6">
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-semibold mb-4">Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Duration:</span>
                      <span>{itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Location:</span>
                      <span>{itinerary.location}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Group Size:</span>
                      <span>1-10 people</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Book your trip</h2>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={booking.userName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={booking.userEmail}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-gray-300 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={booking.contactNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={booking.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numberOfPeople" className="block text-gray-300 mb-1">Number of People</label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    name="numberOfPeople"
                    value={booking.numberOfPeople}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-gray-300 mb-1">Special Requests (optional)</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={booking.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Price per person:</span>
                    <span className="text-white">${itinerary.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Number of people:</span>
                    <span className="text-white">{booking.numberOfPeople}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white">${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <RazorpayPayment
                    amount={booking.totalPrice}
                    name={`Booking for ${itinerary.title}`}
                    description={`${booking.numberOfPeople} people for ${itinerary.duration} days`}
                    buttonText={paymentProcessing ? "Processing..." : "Confirm & Pay"}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      setError('Failed to create booking. Please try again.');
                      console.error('Payment error:', error);
                    }}
                    disabled={!booking.userName || !booking.userEmail || !booking.contactNumber || !booking.startDate}
                  />
                </div>
                
                <p className="text-gray-400 text-xs text-center mt-4">
                  By confirming your booking, you agree to our
                  <span className="text-blue-400 mx-1">Terms of Service</span>
                  and
                  <span className="text-blue-400 ml-1">Privacy Policy</span>
                </p>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Having issues? Feel free to <a href="mailto:support@travelbuddy.com" className="text-blue-400 hover:underline">contact support</a>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default ItineraryDetailPage; 