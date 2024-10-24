'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function DestinationSearch() {
  const { data: session, status } = useSession();
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [matchedPeople, setMatchedPeople] = useState([]);

  // If session is loading, return loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, return a message
  if (!session) {
    return <div>Please sign in to search for people.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = session?.user?.email; // Fetch email from session

    if (!email) {
      console.error('User is not authenticated.');
      return;
    }

    // Send destination search request to API
    const response = await fetch('/api/people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, destination, travelDate }),  // Include travel date
    });

    const data = await response.json();
    if (response.ok) {
      setMatchedPeople(data.people);
    } else {
      console.error('Error finding people:', data.error);
    }
  };

  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Find People for a Destination</h1>

      {/* Destination search form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="p-2 border rounded-lg"
          required
        />

        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="p-2 border rounded-lg"
          required
        />

        <button type="submit" className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-lg">
          Search
        </button>
      </form>

      {/* Display matched people */}
      <div className="mt-8">
        {matchedPeople.length > 0 ? (
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold">People who live at or want to go to {destination}</h2>
            {matchedPeople.map((person) => (
              <div key={person.email} className="bg-white p-4 rounded-lg shadow-lg">
                <p>Name: {person.name}</p>
                <p>Location: {person.location || 'N/A'}</p>
                <p>Interests: {person.interests?.join(', ') || 'None'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No matches found for {destination}.</p>
        )}
      </div>
    </div>
  );
}
