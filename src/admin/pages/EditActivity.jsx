import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle, AlertCircle, Upload, Loader2 } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/ConfirmModal";

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // New state for upload modal
  const [toast, setToast] = useState({ show: false, message: "", type: "success" }); // New state for toast

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    fitMode: "contain",
    photos: [],
  });

  const [newFiles, setNewFiles] = useState([]);

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ---------------------------------------
  // LOAD ACTIVITY
  // ---------------------------------------
  const fetchActivity = async () => {
    try {
      const res = await axiosInstance.get(`/activities/${id}`);
      setActivity(res.data);
    } catch (err) {
      showToast("Unable to load activity.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // ---------------------------------------
  // OPEN CONFIRM MODAL
  // ---------------------------------------
  const askDelete = (publicId) => {
    setPhotoToDelete(publicId);
    setShowConfirm(true);
  };

  // ---------------------------------------
  // DELETE PHOTO CONFIRMED
  // ---------------------------------------
  const deletePhotoConfirmed = async () => {
    try {
      await axiosInstance.delete(`/activities/${id}/photo`, {
        data: { publicId: photoToDelete }
      });

      // Remove from UI
      setActivity((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.publicId !== photoToDelete),
      }));

      showToast("Photo deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete photo.", "error");
    } finally {
      setShowConfirm(false);
    }
  };

  // ---------------------------------------
  // SAVE CHANGES
  // ---------------------------------------
  const handleSave = async () => {
    setSaving(true);
    if (newFiles.length > 0) setUploading(true);

    try {
      const fd = new FormData();
      fd.append("title", activity.title);
      fd.append("description", activity.description);
      fd.append("fitMode", activity.fitMode);

      newFiles.forEach((f) => fd.append("images", f));

      await axiosInstance.put(`/activities/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Activity updated successfully!", "success");
      // Delay navigation slightly to show toast
      setTimeout(() => navigate("/admin/activities"), 1000);
    } catch (err) {
      showToast("Failed to update activity.", "error");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
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

      <h1 className="text-2xl font-bold">Edit Activity</h1>

      <div className="bg-white dark:bg-[#09141f] p-6 rounded-xl shadow space-y-6">

        {/* --------------------------------------- */}
        {/* TITLE */}
        {/* --------------------------------------- */}
        <div>
          <label className="font-medium">Title</label>
          <input
            type="text"
            value={activity.title}
            onChange={(e) =>
              setActivity({ ...activity, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-50"
          />
        </div>

        {/* --------------------------------------- */}
        {/* DESCRIPTION */}
        {/* --------------------------------------- */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            value={activity.description}
            onChange={(e) =>
              setActivity({ ...activity, description: e.target.value })
            }
            rows={3}
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-50"
          ></textarea>
        </div>

        {/* --------------------------------------- */}
        {/* FIT MODE */}
        {/* --------------------------------------- */}
        <div>
          <label className="font-medium">Image Fit Mode</label>
          <select
            value={activity.fitMode}
            onChange={(e) =>
              setActivity({ ...activity, fitMode: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-50"
          >
            <option value="contain">Fit (No Crop)</option>
            <option value="cover">Fill (Crop)</option>
          </select>
        </div>

        {/* --------------------------------------- */}
        {/* EXISTING PHOTOS */}
        {/* --------------------------------------- */}
        <div>
          <label className="font-medium">Existing Photos</label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-3">
            {activity.photos.map((p) => (
              <div key={p.publicId} className="relative group">
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-28 rounded object-cover shadow"
                />

                {/* DELETE BUTTON */}
                <button
                  onClick={() => askDelete(p.publicId)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 
                             group-hover:opacity-100 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------------------- */}
        {/* ADD NEW PHOTOS */}
        {/* --------------------------------------- */}
        <div>
          <label className="font-medium">Add More Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="mt-2"
          />
        </div>

        {/* --------------------------------------- */}
        {/* SAVE BUTTON */}
        {/* --------------------------------------- */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-5 py-2 rounded text-white flex items-center gap-2 ${saving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Saving...
            </>
          ) : "Save Changes"}
        </button>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        show={showConfirm}
        title="Delete Photo?"
        message="Are you sure you want to delete this photo?"
        onConfirm={deletePhotoConfirmed}
        onCancel={() => setShowConfirm(false)}
      />

    </motion.div>
  );
};

export default EditActivity;

