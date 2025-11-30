// client/src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // backend base URL
  withCredentials: true, // include cookies
  headers: {
    // "Content-Type": "application/json", // Let browser set this for FormData
  },
});

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
