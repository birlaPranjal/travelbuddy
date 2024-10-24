'use client';
import { useEffect, useState } from 'react';
import FindPeople from './FindPeople';

export default function FindPeoplePage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch current user data
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const userData = await response.json();
        setCurrentUser(userData.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" bg-primary ">
      <h1 className="text-3xl font-bold text-center ">Find People Near You</h1>
      <FindPeople currentUser={currentUser} />
    </div>
  );
}