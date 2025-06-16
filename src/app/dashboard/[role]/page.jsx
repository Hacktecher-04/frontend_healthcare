"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import UserList from "@/components/UserList";
import UserListRoom from "@/components/UserListRoom";

const UserSearch = () => {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`/api/chats/user/${JSON.parse(localStorage.getItem("user"))._id}/rooms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRooms(response.data.rooms);
        console.log("Rooms fetched:", response.data.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`/auth/me`, {
  //         withCredentials: true, // Send cookies
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // if (!user) {
  //   return (
  //     <div className="text-center p-10">
  //       <h2 className="text-xl">Not logged in</h2>
  //       <a href="/login" className="text-blue-500 underline">Go to Login</a>
  //     </div>
  //   );
  // }

  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">

      <UserList />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rooms</h2>
        {rooms.length > 0 ? (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition duration-300">
                <a href={`/chat/${room._id}`} className="block text-blue-600 hover:text-blue-800">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <svg
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 18h.01M8 21h8a2.252 2.252 0 002.25-2.25V5.25A2.252 2.252 0 0016 3h-4.095a2.252 2.252 0 00-2.25 2.25v1.012c0 1.032-.538 2.036-1.45 2.924L4.772 9.772a.75.75 0 01-1.06 1.06l4.758 4.758a1.5 1.5 0 012.12 0l.007-.007A6.799 6.799 0 0012 18z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{room.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{new Date(room.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No rooms available.</p>
        )}
      </div>

      <UserListRoom />
    </div>
  );
};

export default UserSearch;