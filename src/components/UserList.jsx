import React, { useState, useEffect } from "react";
import axios from "@/utils/axios"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserCard from "./UserCard";

const UserList = ({ userRole, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = storedToken || null;

    let userRoleFromStorage;

    if (user) {
      userRoleFromStorage = user.role;
    } else {
      userRoleFromStorage = "user";
    }

    fetchUsers(userRoleFromStorage, token);
  }, []);

  const fetchUsers = async (userRole, token) => {
    let searchRoles = [];

    if (userRole === "doctor") {
      searchRoles = ["student", "user"];
    } else if (userRole === "student") {
      searchRoles = ["user"];
    } else {
      searchRoles = [];
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/users/search`,
        { roles: searchRoles },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessageStatus("");
  };

  const handleSendMessage = async () => {
    const senderData = JSON.parse(localStorage.getItem("user"));
    const senderId = senderData?._id;

    if (!senderId || !selectedUser?._id) {
      setMessageStatus("Missing sender or recipient data.");
      return;
    }

    try {
      const response = await axios.post(`/api/chats/room`, {
        name: `${senderData.name} & ${selectedUser.name}`,
        isGroup: false,
        members: [senderId, selectedUser._id],
      });
      console.log("Chat room created:", response.data);
      router.push(`/chat/${response.data.room._id}`);
    } catch (error) {
      console.error("Send error:", error);
      setMessageStatus("Failed to send message.");
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <motion.h1
        className="text-4xl font-bold text-center mb-6 text-gray-800"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {userRole === "doctor"
          ? "Student & User Accounts"
          : userRole === "student"
          ? "User Accounts"
          : "User Data"}
      </motion.h1>

      {loading && (
        <p className="text-center text-gray-500 animate-pulse">
          Loading users...
        </p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <UserCard
                key={user._id || index}
                user={user}
                selected={selectedUser?._id === user._id}
                onSelect={handleUserSelect}
                index={index}
              />
            ))}
          </div>

          {selectedUser && (
            <div className="flex justify-center mt-8">
              <motion.button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                onClick={handleSendMessage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                Send Message to {selectedUser.name}
              </motion.button>
            </div>
          )}

          {messageStatus && (
            <p className="text-center mt-4 font-medium text-blue-700">
              {messageStatus}
            </p>
          )}
        </>
      )}

      {!loading && !users.length && !error && (
        <p className="text-center mt-10 text-gray-600">
          No users found for your role view.
        </p>
      )}
    </div>
  );
};

export default UserList;