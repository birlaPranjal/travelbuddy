"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProfileUpdate = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    location: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!session) {
      console.log("User not signed in or Session Not Found");
      router.push("/sign-in");
    } else {
      const { user } = session;
      setUserData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        location: "", // fetch from backend if available
      });
    }
  }, [session, router]);

  if (!session) {
    return <div className="p-32 text-center text-8xl">Sign-In First</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "travel");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/travel/image/upload",
        formData
      );
      setUserData((prev) => ({ ...prev, image: response.data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Send updated profile data to the server
      await axios.put("/api/update-profile", {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        location: userData.location,
      });
      alert("Profile updated successfully!");
      // Refresh the session if needed
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-dark text-white mt-16 min-h-screen flex items-start justify-center container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            {userData.image && (
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={userData.image}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                />
              </div>
            )}
            <input type="file" onChange={handleImageChange} />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded"
              placeholder="Enter your location"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="bg-blue-600 px-6 py-2 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
