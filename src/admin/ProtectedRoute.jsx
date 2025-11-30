// client/src/admin/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        await axios.get("/admin/me");
        if (mounted) setStatus({ loading: false, ok: true });
      } catch (err) {
        if (mounted) setStatus({ loading: false, ok: false });
      }
    };
    checkAuth();
    return () => (mounted = false);
  }, []);

  if (status.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-sm">Checking session…</div>
      </div>
    );
  }

  if (!status.ok) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
