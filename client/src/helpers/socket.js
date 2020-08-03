import io from "socket.io-client";

const apiUrl = process.env.API_URL || "localhost:5000";

// initialize connection to api
const socket = io(apiUrl);