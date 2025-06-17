"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            var storedProfile = localStorage.getItem('user');
            if (storedProfile) {
                try {
                    storedProfile = JSON.parse(storedProfile);
                    setProfileImage(storedProfile.profileImage || null);
                } catch (error) {
                    console.error('Error parsing user profile from localStorage:', error);
                }
            }
        }
    }, []);


    return (
        <nav className="bg-white flex justify-between items-center text-black relative shadow-md p-4">
            <h1 className="text-xl font-bold">Healthcare App</h1>
            <ul className="flex space-x-4 items-center">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/Profile">
                    {profileImage && (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="rounded-full h-8 w-8"
                        />
                        <button>
                            Profile
                        <button/>
                    )}</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
