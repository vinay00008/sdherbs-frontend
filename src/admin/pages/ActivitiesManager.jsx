// client/src/admin/pages/ActivitiesManager.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  Pencil,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

const ActivitiesManager = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UX State
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    fitMode: "contain", // contain | cover
    files: [],
  });

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ---------- API HELPERS ----------
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/activities");
      setActivities(res.data || []);
    } catch (err) {
      console.error("Fetch activities error:", err);
      showToast("Unable to load activities.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      files: Array.from(e.target.files || []),
    }));
  };

  // ---------- CREATE NEW ACTIVITY ----------
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Title is required.", "error");
      return;
    }
    if (!form.files.length) {
      showToast("At least one photo is required.", "error");
      return;
    }

    try {
      setSaving(true);
      setUploading(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description || "");
      fd.append("fitMode", form.fitMode);

      form.files.forEach((f) => fd.append("images", f));

      await axiosInstance.post("/activities", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Activity created successfully!", "success");
      setForm({
        title: "",
        description: "",
        fitMode: "contain",
        files: [],
      });

      // refresh list
      fetchActivities();
    } catch (err) {
      console.error("Create activity error:", err);
      showToast(err.response?.data?.message || "Failed to create activity.", "error");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ---------- DELETE ACTIVITY ----------
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosInstance.delete(`/activities/${deleteId}`);
      setActivities((prev) => prev.filter((a) => a._id !== deleteId));
      setDeleteId(null);
      showToast("Activity deleted successfully!", "success");
    } catch (err) {
      console.error("Delete activity error:", err);
      showToast("Failed to delete activity.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 relative"
    >
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${toast.type === "success"
              ? "bg-white text-green-700 border-green-200"
              : "bg-white text-red-700 border-red-200"
              }`}
          >
            {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {uploading && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload size={20} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Uploading...</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your request.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden p-6 text-center"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Delete Blog?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CREATE BLOG CARD */}
      <div className="bg-white dark:bg-[#09141f] rounded-xl shadow p-5 space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UploadCloud size={18} /> Add New Blog
        </h2>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 bg-gray-50"
              placeholder="e.g., New Product Launch"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description / Content
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 bg-gray-50"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Fit mode */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Image Display Mode
            </label>
            <select
              value={form.fitMode}
              onChange={(e) =>
                setForm((p) => ({ ...p, fitMode: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
            >
              <option value="contain">Fit (No Crop)</option>
              <option value="cover">Fill (Crop)</option>
            </select>
          </div>

          {/* Photos input */}
          <div>
            <label className="block text-sm font-medium mb-1">Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm"
            />
            {form.files.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {form.files.length} file(s)
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white ${saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Plus size={16} /> Save Blog
              </>
            )}
          </button>
        </form>
      </div>

      {/* EXISTING BLOGS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-blue-300">Existing Blogs</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#09141f] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">No blogs created yet.</p>
            <p className="text-sm text-gray-400">Add your first blog above to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activities.map((act) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={act._id}
                className="bg-white dark:bg-[#09141f] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col sm:flex-row gap-6 border border-gray-100 dark:border-gray-800"
              >
                {/* LEFT: TEXT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate pr-4">{act.title}</h3>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${act.fitMode === 'cover' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {act.fitMode === 'cover' ? 'Fill' : 'Fit'}
                    </span>
                  </div>

                  {act.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {act.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <ImageIcon size={14} /> {act.photos?.length || 0} Photos
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span>Created: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* CENTER: THUMBNAILS */}
                {act.photos?.length > 0 && (
                  <div className="flex gap-2 sm:w-1/3 overflow-hidden mask-linear-fade">
                    {act.photos.slice(0, 3).map((p, i) => (
                      <div key={p.publicId || i} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img
                          src={p.url}
                          className="w-full h-full object-cover"
                          alt=""
                          loading="lazy"
                        />
                        {i === 2 && act.photos.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            +{act.photos.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* RIGHT: ACTIONS */}
                <div className="flex sm:flex-col justify-end items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0">
                  <Link
                    to={`/admin/activities/edit/${act._id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(act._id);
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActivitiesManager;

