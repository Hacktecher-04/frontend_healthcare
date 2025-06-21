'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';  

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-blue-700"
        >
          Healthcare Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl"
        >
          A platform that connects doctors, students, and users. Chat, assist, and grow together.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/login')}
          className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </motion.button>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-100 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-blue-800 mb-3">For Doctors</h3>
            <p className="text-gray-600">
              Provide guidance, manage health records, and connect with patients instantly.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-100 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-green-800 mb-3">For Students</h3>
            <p className="text-gray-600">
              Learn from real-world cases, chat with professionals, and assist users.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-100 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-purple-800 mb-3">For Users</h3>
            <p className="text-gray-600">
              Ask questions, get medical help, and stay informed with reliable support.
            </p>
          </motion.div>
        </div>

        
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 Healthcare Management System. All rights reserved.
      </footer>
    </main>
  );
}