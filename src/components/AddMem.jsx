"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios"; // Adjust the import path as necessary
import UserCard from "@/components/UserCard";
import { motion } from "framer-motion";

const ManageRoomMembers = ({ roomId }) => {
    const [room, setRoom] = useState(null);
    const [status, setStatus] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/chats/room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoom(res.data.room);
            } catch {
                setStatus("Failed to fetch room.");
            }
        };

        const fetchUsers = async () => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            const user = storedUser ? JSON.parse(storedUser) : null;
            const token = storedToken || null;
            let userRoleFromStorage = user ? user.role : "user";

            let searchRoles = [];
            if (userRoleFromStorage === "doctor") searchRoles = ["student", "user"];
            else if (userRoleFromStorage === "student") searchRoles = ["user"];

            try {
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
            } catch {
                setStatus("Failed to fetch users.");
            }
        };

        if (roomId) fetchRoom();
        fetchUsers();
    }, [roomId]);

    const handleAddMember = async () => {
        if (!selectedUser) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `/api/chats/room/${roomId}/members`,
                { userId: selectedUser._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoom(res.data.room);
            setStatus("Member added!");
            setSelectedUser(null);
        } catch {
            setStatus("Failed to add member.");
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(
                `/api/chats/room/${roomId}/members`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { userId },
                }
            );
            setRoom(res.data.room);
            setStatus("Member removed!");
        } catch {
            setStatus("Failed to remove member.");
        }
    };

    if (!room) return <div className="p-6 text-center">Loading room...</div>;

    const availableUsers = users.filter(
        (u) => !room.members.some((m) => m._id === u._id)
    );

    const filteredUsers = availableUsers.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Manage Room Members</h2>
            {status && <div className="mb-4 text-blue-600">{status}</div>}

            <div className="mb-6">
                <label className="block mb-2 font-semibold">Search & Select User</label>
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border px-3 py-2 rounded w-full mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                isSelected={selectedUser?._id === user._id}
                                onClick={setSelectedUser}
                            />
                        ))
                    ) : (
                        <p key="no-users" className="col-span-3 text-center text-gray-500">No users found</p>
                    )}
                </div>
                {selectedUser && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleAddMember}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition"
                        >
                            Add {selectedUser.name} to Room
                        </button>
                    </div>
                )}
            </div>

            <hr className="my-6" />

            <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Current Members</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.members.map((member) => (
                        <UserCard
                            key={member._id}
                            user={member}
                            isSelected={false}
                            showRemove
                            onRemove={() => handleRemoveMember(member._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageRoomMembers;
