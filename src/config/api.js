const API_URL = import.meta.env.VITE_API_URL || "https://hnbconnectbackend.vercel.app";

// Remove any trailing slash
export default API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;