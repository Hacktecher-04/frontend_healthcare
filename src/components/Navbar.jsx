'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import axios from '@/utils/axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsLoggedIn(true);

        if (parsed.photo) {
          setProfileImage(parsed.photo);
        } else if (parsed._id) {
          fetchProfileImage(parsed._id);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  const fetchProfileImage = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/profile/image/${userId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const imageBlob = URL.createObjectURL(res.data);
      setProfileImage(imageBlob);
    } catch {
      console.warn('Profile image not loaded');
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ✅ Main Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700 tracking-tight">
            Healthcare App
          </h1>

          {/* 🔷 Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-sm text-black font-medium items-center">
            <li><Link href="/" onClick={closeMenu}>Home</Link></li>
            <li><Link href="/about" onClick={closeMenu}>About</Link></li>
            <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>

            {isLoggedIn && (
              <li>
                <Link href="/Profile">
                  <img
                    src={profileImage || '/default-avatar.png'}
                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    alt="Profile"
                    className="rounded-full h-8 w-8 object-cover border border-gray-300"
                  />
                </Link>
              </li>
            )}
          </ul>

          {/* 🔷 Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-black focus:outline-none">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 🔷 Mobile Slide Menu */}
        <div
          className={`md:hidden bg-white px-4 transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[400px] opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'
          }`}
        >
          <ul className="space-y-4 text-sm text-black font-medium flex flex-col items-center">
            <li><Link href="/" onClick={closeMenu}>Home</Link></li>
            <li><Link href="/about" onClick={closeMenu}>About</Link></li>
            <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* ✅ Mobile Floating Profile Icon (Outside Navbar) */}
      {isLoggedIn && (
        <div className="md:hidden fixed top-2 right-12 z-[60]">
          <Link href="/Profile">
            <img
              src={profileImage || '/default-avatar.png'}
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-white shadow-md object-cover bg-gray-100"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
