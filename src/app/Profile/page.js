"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tempProfile, setTempProfile] = useState({
    _id: "",
    profileImage: "",
    name: "",
    username: "",
    email: "",
    role: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setTempProfile(parsed);
      fetchProfileImage(parsed._id);
    }
  }, []);

  const fetchProfileImage = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/profile/image/${userId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blobURL = URL.createObjectURL(response.data);
      setTempProfile((prev) => ({ ...prev, profileImage: blobURL }));
    } catch (err) {
      console.warn("Profile image not found.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Upload new profile image (if any)
      if (fileUpload) {
        const formData = new FormData();
        formData.append("profileImage", fileUpload);

        await axios.post("/api/profile/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Update profile data via the correct route
      const response = await axios.put(
        `/api/profile/users/${tempProfile._id}`,
        tempProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setProfile(response.data.user);
        setTempProfile(response.data.user);
        setPreviewImage(null);
        setIsEditing(false);
        toast.success("✅ Profile updated successfully.");
      }
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response.data?.field === "username"
      ) {
        toast.error("❌ Username already taken. Try another one.");
      } else {
        toast.error(
          `❌ ${err.response?.data?.message || "Something went wrong."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };


  if (!profile) return <div className="p-6 text-red-500">No profile loaded</div>;

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white text-black shadow-2xl rounded-2xl border"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Your Profile</h2>

      {isEditing ? (
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <label className="block text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {(previewImage || tempProfile.profileImage) && (
              <img
                src={previewImage || tempProfile.profileImage}
                alt="Preview"
                className="w-28 h-28 rounded-full mt-3 object-cover"
              />
            )}
          </div>

          {["name", "username", "email", "role"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={tempProfile[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}

          <div className="flex gap-2 items-center">
            <button
              onClick={updateProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src={tempProfile.profileImage || "/default-avatar.png"}
            alt="Profile"
            onError={(e) => (e.target.src = "/default-avatar.png")}
            className="w-32 h-32 rounded-full mx-auto object-cover border border-blue-400"
          />
          <div className="text-md space-y-1">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center mx-auto gap-2 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.585 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM18 14v5h-5l-1.28-1.28"
              />
            </svg>
            Edit Profile
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
