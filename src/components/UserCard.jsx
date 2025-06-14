"use client";

import React from "react";
import { motion } from "framer-motion";

const UserCard = ({ user, isSelected, onSelect }) => {
    return (
        <motion.div
            className={`cursor-pointer rounded-xl shadow-md p-5 border transition-all duration-300
                ${isSelected ? "bg-green-100 border-green-600 scale-105" : "bg-white border-gray-200 hover:shadow-lg"}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelect(user)}
        >
            {user.profileImage && (
                <img
                    src={user.profileImage}
                    alt="avatar"
                    className="w-16 h-16 mx-auto rounded-full mb-3 object-cover border-2 border-gray-500"
                />
            )}
            <h2 className="text-xl font-semibold text-center text-blue-800">{user.username || user.name}</h2>
            <span
                className={`block text-center mt-2 text-sm font-medium rounded-full px-3 py-1
                    ${user.role === "doctor"
                        ? "bg-green-100 text-green-800"
                        : user.role === "student"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
            >
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Role Not Assigned'}
            </span>
        </motion.div>
    );
};

export default UserCard;
