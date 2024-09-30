"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.log("User not signed in or Session Not Found");
      router.push("/sign-in");
    }
  }, [session, router]);

  if (!session) {
    return <div className="p-32 text-center text-8xl">Sign-In First</div>;
  }

  const { user } = session;

  return (
    <div className="bg-dark text-white mt-16 min-h-screen flex items-start justify-center container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex items-center space-x-4">
          {user.image && (
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image src={user.image} alt="Profile Picture" width={80} height={80} />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
