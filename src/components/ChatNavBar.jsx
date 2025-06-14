"use client";
import React from 'react';
import { useParams, useState } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

const ChatNavBar = () => {
    const router = useRouter();
    const { roomId } = useParams();
    const [roomName, setRoomName] = React.useState("");

    const handleRoomDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/chats/room/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.back(); // Navigate to a safe route after deletion
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    const handleRoomUpdate = async (updateData) => {
        try {
            const token = localStorage.getItem("token");
            // updateData can be { name } or { name, icon }

            const response = await axios.put(`/api/chats/room/${roomId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                alert("Room updated successfully!");
                router.back();
            }
        } catch (error) {
            console.error("Error updating room:", error);
            alert("Failed to update room.");
        }
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Room Actions</h2>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={handleRoomDelete}
            >
                Delete Room
            </button>
            <div>
                <input
                    type="text"
                    className="p-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300 mb-2 w-full"
                    placeholder="Update room name..."
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRoomUpdate({ name: roomName })}
                />
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRoomUpdate({ name: roomName })}
                >
                    Update Room Name
                </button>
            </div>
        </div>
    );
};

export default ChatNavBar;