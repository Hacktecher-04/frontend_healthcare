'use client';
import React from 'react';
import ChatBox from '@/components/ChatBox';

export default function ChatRoom({ params }) {
  const { roomId } = React.use(params);
  const userId = '665a4b8009c123abc111a111'; // Assume logged in as Alice

  return (
    <main className="flex flex-col justify-center items-center p-8">
      <h2 className="text-xl font-semibold mb-4">Chat Room: {roomId}</h2>
      <ChatBox roomId={roomId} userId={userId} />
    </main>
  );
}
