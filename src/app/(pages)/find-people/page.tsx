'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation

export default function FindPeoplePage() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <div className="bg-primary h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-8">Find People</h1>

      {/* Two Option Links */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Link href="/find-people/destination" className="bg-tertiary hover:bg-tertiary-dark text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 text-center">
          Find People for a Destination
        </Link>
        <Link href="/find-people/nearby" className="bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 text-center">
          Find People Nearby
        </Link>

      </div>
    </div>
  );
}
