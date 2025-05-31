"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserList({ currentUser }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch users when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setUsers([]);
      setError("");
      return;
    }
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/search?q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data.filter((u) => u._id !== currentUser._id));
          setError("");
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [query, currentUser]);

  const startChat = async (user) => {
    try {
      const isGroup = false;
      const members = [currentUser._id, user._id];
      const name = `${currentUser.name} & ${user.name}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/room`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, isGroup, members }),
        }
      );
      const data = await res.json();
      if (data.success && data.room) {
        router.push(`/chat/${data.room._id}`);
      } else {
        setError(data.message || "Failed to create/find room");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">Find Users</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul className="divide-y">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center py-2"
          >
            <div>
              <span className="font-semibold">{user.name}</span>
              <span className="ml-2 text-gray-500">({user.role})</span>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => startChat(user)}
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
      {users.length === 0 && query && !loading && !error && (
        <div className="text-gray-500 text-center mt-4">No users found.</div>
      )}
    </div>
  );
}
