"use client";


import React, { useState } from "react";
import axios from "@/utils/axios"; // Adjust the import path as necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState("user"); // default
  const [error, setError] = useState("");


    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
      const token = localStorage.getItem('token');
      const dashboardRoute = localStorage.getItem('dashboardRoute');

      if (token && dashboardRoute) {
        const verifyToken = async () => {
          try {
            await axios.get('/api/auth/validate-token', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            window.location.href = dashboardRoute;
          } catch (error) {
            localStorage.clear();
            setError("Session expired. Please login again.");
            setLoading(false);
          }
        };

        verifyToken();
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) {
      return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
        </div>
      );
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `/api/auth/login`,
        { email, password }
      );
      const data = res.data;
      if (data.token) {
        localStorage.clear();
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]);
        });
        window.location.href = data.dashboardRoute;
      } else {
        setError("Invalid token received from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-8 bg-white border border-black rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-black mb-4">Login</h2>
      {error && (
        <div className="text-red-600 bg-black bg-opacity-5 px-2 py-1 rounded">
          {error}
        </div>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
      />
      <select
        value={dashboard}
        onChange={e => setDashboard(e.target.value)}
        className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="doctor">Doctor Dashboard</option>
        <option value="student">Student Dashboard</option>
        <option value="user">User Dashboard</option>
      </select>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition"
      >
        Login
      </button>
      <p className="text-sm text-gray-600 mt-4">
        Dont have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </p>
    </form>
  );
};

export default Login;