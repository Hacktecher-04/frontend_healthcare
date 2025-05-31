"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userRole = parsedUser.role;

      if (!userRole) {
        setError("User role not found.");
        setLoading(false);
        return;
      }

      setRole(userRole);

      let searchRoles = [];

      if (userRole === "doctor") {
        searchRoles = ["student"];
      } else if (userRole === "student") {
        searchRoles = ["user"];
      }
      axios
        .post(
          "http://localhost:5050/api/users/search",
          { roles: searchRoles },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ) 
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Failed to fetch users.");
          setLoading(false);
        });
    } catch (err) {
      console.error("Parse error:", err);
      setError("Invalid user data.");
      setLoading(false);
    }
  }, []);

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
      const response = await axios.post("http://localhost:5050/api/message/send", {
        senderId,
        receiverId: selectedUser._id,
        receiverName: selectedUser.name,
        receiverRole: selectedUser.role,
      });

      setMessageStatus("Message sent successfully!");
    } catch (error) {
      console.error("Send error:", error);
      setMessageStatus("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <motion.h1
        className="text-4xl font-bold text-center mb-6 text-gray-800"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {role === "doctor"
          ? "Student & User Accounts"
          : role === "student"
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
              <motion.div
                key={index}
                className={`cursor-pointer bg-white rounded-xl shadow-md p-5 transition duration-300 hover:shadow-xl ${
                  selectedUser?._id === user._id
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleUserSelect(user)}
              >
                <h2 className="text-xl font-semibold text-blue-800">
                  {user.name}
                </h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                    user.role === "doctor"
                      ? "bg-green-100 text-green-800"
                      : user.role === "student"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </motion.div>
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

export default UserSearch;
