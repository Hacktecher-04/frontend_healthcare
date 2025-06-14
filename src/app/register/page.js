"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "@/utils/axios"; 

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [username, setUsername] = useState(""); // NEW
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // Check token in localStorage and redirect if valid

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Optionally, validate token with backend
            axios.post(`/api/auth/validate-token`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    const data = res.data;
                    if (data.valid) {
                        // Token is valid, redirect to login or dashboard
                        router.push("/login");
                    } else {
                        // Token invalid, remove it
                        localStorage.removeItem("token");
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                });
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await axios.post(`/api/auth/register`, {
                name,
                username,
                email,
                password,
                role,
            });

            if (res.status !== 200) {
            setError(res.data.message || "Registration failed");
            } else {
            setSuccess("Registration successful! Redirecting...");
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            // Redirect based on role
            if (role === "doctor") {
                router.push("/dashboard/doctor");
            } else if (role === "student") {
                router.push("/dashboard/student");
            } else {
                router.push("/dashboard/user");
            }
            }
        } catch (error) {
            setError(error.response?.data?.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 text-black rounded shadow-md w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-black text-center">Register</h2>
                {error && (
                    <div className="bg-red-100 text-black px-4 py-2 rounded">{error}</div>
                )}
                {success && (
                    <div className="bg-green-100  text-green-700 px-4 py-2 rounded">{success}</div>
                )}
                <div>
                    <label className="block text-black mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full text-black border rounded px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-black mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        className="w-full text-black border rounded px-3 py-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-black mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full text-black border rounded px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-black mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full text-black border rounded px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-black mb-1 font-medium">Role</label>
                    <select
                        className="w-full text-black border rounded px-3 py-2"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="doctor">Doctor</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <p className="text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}