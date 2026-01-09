// client/src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:10000/api").replace(/\/$/, ''), // Use ENV var in production
  withCredentials: true, // include cookies
  headers: {
    // "Content-Type": "application/json", // Let browser set this for FormData
  },
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
