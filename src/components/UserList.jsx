"use client";

import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserCard from "./UserCard";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        return;
      }

      const user = JSON.parse(storedUser);
      const token = storedToken;

      setUserRole(user?.role || "user");
      setAuthorized(true);

      fetchUsers(user?.role, token);
    } catch {
      // Silently ignore
    }
  }, []);

  const fetchUsers = async (role, token) => {
    try {
      setLoading(true);

      const rolesToSearch =
        role === "doctor" ? ["student", "user"] : role === "student" ? ["user"] : [];

      const res = await axios.post(
        "/api/users/search",
        { roles: rolesToSearch },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data || []);
    } catch {
      // Silently ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessageStatus("");
  };

  const handleSendMessage = async () => {
    try {
      const sender = JSON.parse(localStorage.getItem("user"));
      const senderId = sender?._id;

      if (!senderId || !selectedUser?._id) return;

      const res = await axios.post("/api/chats/room", {
        name: `${sender.name} & ${selectedUser.name}`,
        isGroup: false,
        members: [senderId, selectedUser._id],
      });

      router.push(`/chat/${res.data.room._id}`);
    } catch {
      // Silently ignore
    }
  };

  if (!authorized) return null;

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
        <p className="text-center text-gray-500 animate-pulse">Loading users...</p>
      )}

      {!loading && users.length > 0 && (
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

      {!loading && users.length === 0 && (
        <p className="text-center mt-10 text-gray-600">
          No users found for your role view.
        </p>
      )}
    </div>
  );
};

export default UserList;
