'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TravelPlan {
  destination: string;
  fromDate: string;
  toDate: string;
  budget: number;
}

export default function DestinationSearchPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<TravelPlan>({
    destination: '',
    fromDate: '',
    toDate: '',
    budget: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/destination-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });
      const data = await response.json();
      console.log('Search results:', data);
      router.push(`/find-people/destination/results`);
    } catch (error) {
      console.error('Error creating travel plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 -mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 mt-20">Find Travel Companions by Destination</h1>
            <p className="text-gray-400 text-lg">Connect with travelers heading to your dream destination</p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Where do you want to go?"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Budget (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={searchParams.budget || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, budget: Number(e.target.value) })}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your budget"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={searchParams.fromDate}
                    onChange={(e) => setSearchParams({ ...searchParams, fromDate: e.target.value })}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={searchParams.toDate}
                    onChange={(e) => setSearchParams({ ...searchParams, toDate: e.target.value })}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  Find Travel Companions
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}