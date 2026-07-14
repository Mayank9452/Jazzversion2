// import { BACKEND_URL } from "@/config/config";
import { BACKEND_URL } from "@/config/config";
import { io } from "socket.io-client";

const socket = io(BACKEND_URL); // or your production server
export default socket;