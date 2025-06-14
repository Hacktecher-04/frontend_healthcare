"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { io } from "socket.io-client";
import ChatNavBar from '@/components/ChatNavBar';
import Addmem from '@/components/AddMem';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"; // Adjust if needed

const ChatRoom = () => {
    const { roomId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifyError, setVerifyError] = useState('');
    const [user, setUser] = useState(null);
    const [roomName, setRoomName] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        // Get current user from localStorage
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
    }, []);

    // Setup socket connection
    useEffect(() => {
        if (!user || !roomId) return;

        // Connect socket
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        // Join the room
        socketRef.current.emit("joinRoom", { roomId, userId: user._id });

        // Listen for incoming messages
        socketRef.current.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user, roomId]);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`/api/chats/room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.room) {
                    const room = response.data.room;
                    if (!room.isGroupChat && room.users && user) {
                        const otherUser = room.users.find(u => u._id !== user._id);
                        if (otherUser) {
                            setRoomName(otherUser.name);
                        }
                    } else {
                        setRoomName(room.name);
                    }
                }
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        if (roomId) {
            fetchRoomDetails();
        }
    }, [roomId, user]);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");
                await axios.get(`/api/chats/room/${roomId}/verify`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVerifyError('');
            } catch (error) {
                setVerifyError(router.back);
            }
        };
        if (roomId) verifyUser();
    }, [roomId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chats/messages/${roomId}`);
                setMessages(response.data.messages || []);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (roomId) fetchMessages();
    }, [roomId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        try {
            const token = localStorage.getItem("token");
            // Send via socket for real-time
            socketRef.current.emit("sendMessage", {
                roomId,
                content: newMessage,
                sender: { _id: user._id, name: user.name }
            });

            await axios.post('/api/chats/send', {
                roomId,
                content: newMessage,
                sender: user._id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewMessage('');
        } catch (error) {
            alert('Error sending message');
        }
    };

    const navibar = () => {
        var bar = document.querySelector('.navibar').classList.toggle('hidden');
        return bar;
        return (
            <div className="bg-white shadow rounded p-4">
                <ChatNavBar />
                <Addmem roomId={roomId} />
            </div>
        );
    }

    if (verifyError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 text-red-700 p-6 rounded shadow">{verifyError}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-whatsapp-background">
            {/* Header */}
            <header className="bg-whatsapp-header p-4 text-white flex items-center justify-between">
                <h1 className="text-xl font-semibold">{roomName || `Chat Room: ${roomId}`}</h1>
                <div onClick={navibar} className="flex flex-col gap-1 items-center cursor-pointer">
                    <span className='h-1 w-[30px] bg-white'></span>
                    <span className='h-1 w-[30px] bg-white'></span>
                    <span className='h-1 w-[30px] bg-white'></span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 text-white scrollbar-thin scrollbar-thumb-whatsapp-scrollbar" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                {loading ? (
                    <div>Loading messages...</div>
                ) : (
                    messages.length === 0 ? (
                        <div className="text-gray-500 text-center">No messages yet.</div>
                    ) : (
                        [...messages].reverse().map((message, idx) => {
                            const isCurrentUser = message.sender && typeof message.sender === "object" ? message.sender._id === user?._id : message.sender === user?._id;
                            return (
                                <div key={message._id || idx} className={`mb-2 rounded-lg py-2 px-3 max-w-fit ${isCurrentUser ? 'bg-blue-500 text-white ml-auto' : 'bg-green-700 mr-auto'}`}>
                                    <div>
                                        <span className="font-bold">
                                            {message.sender && typeof message.sender === "object"
                                                ? message.sender.name || message.sender.username
                                                : message.sender === (user && user._id)
                                                    ? "You"
                                                    : message.sender}
                                        </span>
                                        :
                                    </div>
                                    <div>{message.content || message.text}</div>
                                </div>
                            );
                        })
                    )
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-whatsapp-input">
                <div className="flex items-center">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded text-white focus:outline-none focus:ring focus:border-whatsapp-border"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-whatsapp-send text-white rounded hover:bg-whatsapp-send-hover focus:outline-none focus:ring focus:bg-whatsapp-send-hover"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;