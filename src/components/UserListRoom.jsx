"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserCard from "@/components/UserCard"; // ✅ reusable card

const CreateGroup = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [messageStatus, setMessageStatus] = useState("");
    const router = useRouter();

    const user = typeof window !== "undefined" && localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    const token = typeof window !== "undefined" && localStorage.getItem("token");

    useEffect(() => {
        if (!user || !token) return;
        fetchUsers(user.role);
    }, []);

    const fetchUsers = async (role) => {
        try {
            const response = await axios.post(
                "/api/users/search",
                { roles: ["user", "student", "doctor"] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(response.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const toggleUser = (selected) => {
        const isAlready = selectedUsers.find((u) => u._id === selected._id);
        if (isAlready) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== selected._id));
        } else {
            setSelectedUsers([...selectedUsers, selected]);
        }
    };

    const handleCreateRoom = async () => {
        if (!user || !selectedUsers.length) {
            setMessageStatus("Please select at least one user to create a room.");
            return;
        }

        try {
            const memberIds = [user._id, ...selectedUsers.map((u) => u._id)];

            const response = await axios.post(
                "/api/chats/room",
                {
                    name: `${user.name}'s Group`,
                    isGroup: true,
                    members: memberIds,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessageStatus("Room created successfully!");
            router.push(`/chat/${response.data.room._id}`);
        } catch (error) {
            console.error("Create room error:", error);
            setMessageStatus("Failed to create room.");
        }
    };

    return (
        <div className="p-6">
            <motion.h1
                className="text-3xl text-center font-bold mb-6 text-blue-900"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                Create a Group Chat Room
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {users.map((u, idx) => (
                    <UserCard
                        key={u._id}
                        user={u}
                        isSelected={!!selectedUsers.find(s => s._id === u._id)}
                        onSelect={toggleUser}
                    />
                ))}
            </div>

            {selectedUsers.length > 0 && (
                <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <button
                        onClick={handleCreateRoom}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
                    >
                        Create Group Room ({selectedUsers.length} Members)
                    </button>
                </motion.div>
            )}

            {messageStatus && (
                <p className="text-center mt-4 text-md font-medium text-blue-700">
                    {messageStatus}
                </p>
            )}
        </div>
    );
};

export default CreateGroup;
