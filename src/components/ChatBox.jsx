'use client';
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import axios from 'axios';

export default function ChatBox({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', roomId);

    axios.get(`http://localhost:5050/api/chats/messages/${roomId}`)
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
    await fetch('http://localhost:5050/api/chats/send', {
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
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender && msg.sender.username ? msg.sender.username : msg.sender}</strong>: {msg.content}
          </div>
        ))}
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