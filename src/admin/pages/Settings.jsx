// client/src/admin/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, Mail, Lock, Trash2, Loader2, Users, Power, ArrowLeft, Image, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { useSettings } from "../../context/SettingsContext";

const Settings = () => {
  const navigate = useNavigate();
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fetching, setFetching] = useState(true);

  const handleChange = (e) => setAdminForm({ ...adminForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccessMsg(""); setErrorMsg("");
    try {
      const res = await axios.post("/admin/register", adminForm);
      if (res.data?.email || res.data?.name) {
        setSuccessMsg(`Admin "${res.data.name || res.data.email}" added successfully!`);
        setAdminForm({ name: "", email: "", password: "" });
        fetchAdmins();
      } else {
        setErrorMsg("Something went wrong while adding admin.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Unable to add new admin. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("/admin/list");
      setAdmins(res.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(`/admin/${id}/toggle`);
      setAdmins((prev) => prev.map((a) => (a._id === id ? { ...a, isActive: res.data.isActive } : a)));
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update admin status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`/admin/${id}`);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete admin.");
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/admin/dashboard")} className="flex items-center text-green-600 hover:text-green-700 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
        <h1 className="text-3xl font-bold text-green-300 flex items-center gap-2"><Shield size={24} /> Admin Settings</h1>
        <p className="text-sm text-gray-400">Manage admin members and system preferences.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white dark:bg-[#071029] rounded-xl shadow p-6 max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-300"><UserPlus size={18} /> Add New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={adminForm.name} onChange={handleChange} placeholder="Full name" className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a]" />
          <input name="email" type="email" value={adminForm.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a]" />
          <input name="password" type="password" value={adminForm.password} onChange={handleChange} placeholder="Password" className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a]" />
          {successMsg && <div className="text-green-600 bg-green-50 p-2 rounded">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
          <button type="submit" disabled={loading} className={`w-full py-2 rounded bg-green-500 hover:bg-green-600 text-white`}>
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white dark:bg-[#071029] rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-300"><Users size={18} /> Existing Admins</h2>
          <div className="text-sm text-gray-400">Total: <span className="font-medium text-green-300">{admins.length}</span></div>
        </div>

        {fetching ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin" /></div>
        ) : admins.length === 0 ? (
          <div className="text-gray-400">No admins found.</div>
        ) : (
          <ul className="space-y-2">
            {admins.map((a) => (
              <li key={a._id} className="bg-gray-50 dark:bg-[#07162a] p-3 rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-gray-400">{a.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggle(a._id)} className={`px-3 py-1 rounded-full text-sm ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {a.isActive ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => handleDelete(a._id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* LOGO SETTINGS */}
      <LogoSettings />

      {/* CONTACT PAGE SETTINGS */}
      <ContactSettings />
    </div>
  );
};

const ContactSettings = () => {
  const [form, setForm] = useState({
    address: "Mandsaur, Madhya Pradesh, India",
    phone: "+91 98931 56792",
    email: "info@sdherbs.com",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    whatsapp: "919893156792",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("/page-content/contact");
        if (res.data && res.data.content) {
          setForm((prev) => ({ ...prev, ...res.data.content }));
        }
      } catch (err) {
        console.error("Error fetching contact content:", err);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axios.put("/page-content/contact", {
        content: form,
      });
      setMsg("Contact details updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Error saving contact content:", err);
      setMsg("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-[#071029] rounded-xl shadow p-6 max-w-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-300">
        <Mail size={18} /> Contact Page Details
      </h2>
      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email Address</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Business Hours</label>
          <input
            name="hours"
            value={form.hours}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">WhatsApp Number (No +)</label>
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-[#07142a] text-sm"
          />
        </div>

        {msg && (
          <div
            className={`text-sm p-2 rounded ${msg.includes("Failed")
              ? "text-red-600 bg-red-50"
              : "text-green-600 bg-green-50"
              }`}
          >
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

const LogoSettings = () => {
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(null);
  const { fetchSettings: refreshGlobalSettings } = useSettings();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/settings");
        if (res.data && res.data.logo) {
          setLogo(res.data.logo);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Upload Image
      const uploadRes = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const logoUrl = uploadRes.data.filePath;

      // 2. Update Settings
      await axios.put("/settings", { logo: logoUrl });

      setLogo(logoUrl);
      setMsg("Logo updated successfully!");

      // Refresh global context
      refreshGlobalSettings();
    } catch (err) {
      console.error("Error uploading logo:", err);
      setMsg("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-[#071029] rounded-xl shadow p-6 max-w-lg mb-6"
    >
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-300">
        <Image size={18} /> Website Logo
      </h2>

      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
          {preview || logo ? (
            <img src={preview || logo} alt="Logo Preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-xs">No Logo</span>
          )}
        </div>

        <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md">
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          <span>{uploading ? "Uploading..." : "Change Logo"}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>

        {msg && (
          <div className={`text-sm p-2 rounded ${msg.includes("Failed") ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}>
            {msg}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Settings;
