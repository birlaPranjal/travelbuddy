"use client";

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBookings } from '@/app/model/Booking';
import { getAllItineraries } from '@/app/model/Itinerary';
import { DBBooking } from '@/app/model/Booking';
import { DBItinerary } from '@/app/model/Itinerary';
import { Spinner } from '@/app/components/Spinner';
import { PageTransition } from '@/app/components/PageTransition';

// Static admin credentials
const ADMIN_EMAIL = "admin@travelbuddy.com";
const ADMIN_PASSWORD = "admin123";

type Tab = 'bookings' | 'itineraries';

const AdminPage: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [itineraries, setItineraries] = useState<DBItinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already authenticated (for refreshes)
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchData();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setEmail('');
    setPassword('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsResult = await getAllBookings();
      if (bookingsResult.success && bookingsResult.bookings) {
        setBookings(bookingsResult.bookings);
      }
      
      // Fetch itineraries
      const itinerariesResult = await getAllItineraries();
      if (itinerariesResult.success && itinerariesResult.itineraries) {
        setItineraries(itinerariesResult.itineraries);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Refresh bookings data
      fetchData();
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status');
    }
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        const response = await fetch(`/api/itineraries/${itineraryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete itinerary');
        }

        // Refresh itineraries data
        fetchData();
      } catch (err) {
        console.error('Error deleting itinerary:', err);
        setError('Failed to delete itinerary');
      }
    }
  };

  const handleCreateItinerary = () => {
    router.push('/admin/create-itinerary');
  };

  const handleEditItinerary = (id: string) => {
    router.push(`/admin/edit-itinerary/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-900/20 border-green-800 text-green-300';
      case 'pending': return 'bg-yellow-900/20 border-yellow-800 text-yellow-300';
      case 'cancelled': return 'bg-red-900/20 border-red-800 text-red-300';
      case 'completed': return 'bg-blue-900/20 border-blue-800 text-blue-300';
      default: return 'bg-gray-900/20 border-gray-800 text-gray-300';
    }
  };

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
            
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Admin dashboard UI
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
              <p className="text-gray-300">
                Manage your travel itineraries and bookings
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Log Out
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'bookings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'itineraries' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('itineraries')}
            >
              Itineraries
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="white" />
              <span className="ml-3 text-white">Loading data...</span>
            </div>
          ) : (
            <>
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      {bookings.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-gray-400">No bookings found</p>
                        </div>
                      ) : (
                        <table className="w-full min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Itinerary</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Start Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">People</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {bookings.map((booking) => (
                              <tr key={booking._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking._id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{booking.userName}</div>
                                  <div className="text-sm text-gray-400">{booking.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.itineraryId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.numberOfPeople}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${booking.totalPrice}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <select
                                      onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
                                      value={booking.status}
                                      className="bg-gray-700 text-white text-sm rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirm</option>
                                      <option value="cancelled">Cancel</option>
                                      <option value="completed">Complete</option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Itineraries Tab */}
              {activeTab === 'itineraries' && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={handleCreateItinerary}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      Create New Itinerary
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      {itineraries.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-gray-400">No itineraries found</p>
                        </div>
                      ) : (
                        <table className="w-full min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {itineraries.map((itinerary) => (
                              <tr key={itinerary._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{itinerary.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{itinerary.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${itinerary.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${itinerary.isPublished ? 'bg-green-900/20 border border-green-800 text-green-300' : 'bg-yellow-900/20 border border-yellow-800 text-yellow-300'}`}>
                                    {itinerary.isPublished ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditItinerary(itinerary._id)}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItinerary(itinerary._id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPage; 