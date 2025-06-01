const isDevelopment = import.meta.env.MODE === 'development';

// Use the deployed URL in production, localhost in development
const API_URL = isDevelopment 
  ? "http://localhost:8000" 
  : "https://hnbconnectbackend.vercel.app";

// Export both the API URL and a flag for socket.io
export default API_URL;
export const SOCKET_URL = API_URL; // Add this export for socket.io