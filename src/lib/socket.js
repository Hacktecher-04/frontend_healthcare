// src/lib/socket.js
import { io } from 'socket.io-client';
import dotenv from "dotenv";
 dotenv.config();

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL); // backend port

export default socket;
