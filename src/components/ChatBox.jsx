'use client';
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import axios from '@/utils/axios';

export default function ChatBox({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', roomId);

    axios.get(`/api/chats/room/${roomId}`)
      .then(res => setMessages(res.data.messages));

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage');
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!text.trim() || !roomId) return;
    const sender = userId;

    // Send message via socket for real-time
    socket.emit('sendMessage', { roomId, content: text, sender });

    // Also save message via REST API
    await fetch('/api/chats/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, content: text, sender }),
    });
    setText('');
  };

  if (!roomId) {
    return (
      <div className="p-4 border rounded w-full max-w-xl mx-auto text-red-500">
        Room ID is missing!
      </div>
    );
  }

  return (
    <div className="p-4 border rounded w-full max-w-xl mx-auto">
      <div className="mb-4 h-[300px] overflow-y-auto border p-2">
        {messages.map((msg, i) => {
          // If sender is an object with username, use it
          // If sender is just an ID, show "You" if it's the current user, else "Unknown"
          let senderName = "Unknown";
          if (msg.sender && typeof msg.sender === "object" && msg.sender.username) {
            senderName = msg.sender.username;
          } else if (msg.sender === userId) {
            senderName = "You";
          }
          return (
            <div key={i}>
              <strong>{senderName}</strong>: {msg.content}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4">Send</button>
      </div>
    </div>
  );
}