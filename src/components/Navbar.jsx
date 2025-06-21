"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react'; // Add lucide-react for icons

const Navbar = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('user');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileImage(parsedProfile.profileImage || null);
        } catch (error) {
          console.error('Error parsing user profile from localStorage:', error);
        }
      }
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">Healthcare App</h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
          <li><Link href="/" onClick={closeMenu}>Home</Link></li>
          <li><Link href="/about" onClick={closeMenu}>About</Link></li>
          <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
          <li className="flex items-center gap-2">
            <Link href="/Profile" onClick={closeMenu}>
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full h-8 w-8 object-cover inline-block"
                />
              )}
              <span className="ml-1">Profile</span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Down Menu */}
      <div
        className={`md:hidden bg-white px-4 pt-2 pb-4 transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="space-y-3 text-sm font-medium">
          <li><Link href="/" onClick={closeMenu}>Home</Link></li>
          <li><Link href="/about" onClick={closeMenu}>About</Link></li>
          <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
          <li className="flex items-center gap-2">
            <Link href="/Profile" onClick={closeMenu}>
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full h-8 w-8 object-cover inline-block"
                />
              )}
              <span className="ml-1">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
