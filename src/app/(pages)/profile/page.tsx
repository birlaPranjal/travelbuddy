"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  about: string;
  location: string;
  languages: string[];
  interests: string[];
  image: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/api/auth/signin"); // Redirect to login if not authenticated
        return;
      }
      console.log(session);
      
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          console.log( "on frontend /n " , data);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        
        {/* Display Profile Image */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-24 w-24 rounded-full overflow-hidden">
            {profile.image ? (
              <img src={profile.image} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span>No image available</span>
            )}
          </div>
        </div>

        {/* Display Profile Information */}
        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>About:</strong> {profile.about}</p>
          <p><strong>Languages:</strong> {profile.languages?.join(", ")}</p>
          <p><strong>Interests:</strong> {profile.interests?.join(", ")}</p>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => router.push("/update-user")}
          className="mt-6 p-2 bg-blue-500 text-white rounded-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
