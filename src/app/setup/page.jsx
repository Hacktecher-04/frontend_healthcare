'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function Setup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5050/api/setup',
        { username, role },
        { withCredentials: true } // includes cookies like session ID
      );

      if (res.status === 200) {
        router.push(`/dashboard/${role.toLowerCase()}`);
      }
    } catch (err) {
      console.error('Error during setup:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md space-y-6 transition-all duration-500 hover:scale-[1.01] animate-fade-in"
      >
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-4">Complete Your Profile</h1>

        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose your role</option>
            <option value="doctor">Doctor</option>
            <option value="student">Student</option>
            <option value="user">User</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
