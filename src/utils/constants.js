export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === "localhost" ? "http://localhost:7777" : "/api");