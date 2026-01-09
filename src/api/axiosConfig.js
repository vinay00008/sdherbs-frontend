import axios from "axios";
import { API_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: API_URL?.replace(/\/$/, ''), // Use central config
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
