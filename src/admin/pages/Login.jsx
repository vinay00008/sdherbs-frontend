// client/src/admin/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axiosInstance.post("/admin/login", form);
      if (res.data) {
        // Store token for header-based auth
        localStorage.setItem("token", res.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-[#07122a] dark:to-[#061020]">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white dark:bg-[#071229] rounded-2xl shadow-xl p-8 w-full max-w-md border border-black/5">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SD Herbs" className="w-20 mb-3" />
          <h2 className="text-2xl font-bold text-green-600">Admin Panel</h2>
          <p className="text-sm text-gray-500">Sign in to manage content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-green-600" size={16} />
              <input type="email" name="email" required onChange={handleChange} value={form.email} placeholder="admin@sdherbs.com" className="w-full pl-10 pr-3 py-2 rounded border bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-green-600" size={16} />
              <input type="password" name="password" required onChange={handleChange} value={form.password} placeholder="••••••••" className="w-full pl-10 pr-3 py-2 rounded border bg-gray-50" />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

          <button type="submit" disabled={loading} className={`w-full py-2 rounded bg-green-600 text-white`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

