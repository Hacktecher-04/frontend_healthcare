"use client";
import React, { useEffect, useState } from "react";
import axios from "@/utils/axios"; // Make sure this points to your custom axios instance

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    _id: "",
    profileImage: "",
    name: "",
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setTempProfile(parsed);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { _id } = tempProfile;
      const response = await axios.put(`/api/auth/users/${_id}`, tempProfile, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setProfile(response.data.user);
        setIsEditing(false);
        alert("✅ Profile updated successfully.");
      }
    } catch (err) {
      alert(`❌ Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (!profile) return <div className="p-6 text-red-500">No profile loaded</div>;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfile((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 flex flex-col items-center justify-center text-black bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Profile Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {tempProfile.profileImage && (
              <img
                src={tempProfile.profileImage}
                alt="Preview"
                className="w-2 h-24 rounded-full mt-2"
              />
            )}
          </div>
          {["name", "username"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}:</label>
              <input
                type="text"
                name={field}
                value={tempProfile[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={updateProfile} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex flex-col items-center">
          <img src={profile.profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
          <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded mt-4 flex items-center gap-1">
            Edit Profile
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.585 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v5h-5l-1.28-1.28" />
            </svg>

          </button>
        </div>
      )}
    </div>
  );
};

export default Profile