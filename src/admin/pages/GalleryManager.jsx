import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Plus, Trash2, X, Upload, CheckCircle, AlertCircle, Loader2, Copy, Search } from "lucide-react";

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "", // used as caption
    category: "General"
  });

  // UX State
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  useEffect(() => {
    fetchGallery();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchGallery = async () => {
    try {
      const res = await axios.get("/gallery");
      setGallery(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      showToast("Failed to load gallery", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10MB limit.", "error");
      e.target.value = ""; // Clear input
      return;
    }
    setUploadFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return showToast("Please select a file", "error");

    setUploading(true);

    const data = new FormData();
    data.append("image", uploadFile);
    data.append("caption", formData.title);
    data.append("category", formData.category);

    try {
      await axios.post("/gallery", data);
      fetchGallery();
      closeModal();
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      console.error("Error uploading image:", err);
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await axios.delete(`/gallery/${deleteModal.id}`);
      setGallery(gallery.filter((img) => img._id !== deleteModal.id));
      showToast("Image deleted successfully!", "success");
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      console.error("Error deleting image:", err);
      showToast("Failed to delete image", "error");
    }
  };

  const copyToClipboard = (url) => {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
    navigator.clipboard.writeText(fullUrl);
    showToast("Link copied to clipboard!", "success");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadFile(null);
    setFormData({ title: "", category: "General" });
  };

  const filteredGallery = gallery.filter(img =>
    (img.caption && img.caption.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (img.category && img.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="p-6 relative max-w-7xl mx-auto">
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Image size={32} className="text-green-600" /> Media Gallery
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your website images and assets.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md whitespace-nowrap"
          >
            <Plus size={20} /> Upload Image
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.length > 0 ? (
            filteredGallery.map((img) => (
              <motion.div
                key={img._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 group relative flex flex-col"
              >
                <div className="h-48 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                  <img
                    src={img.image && img.image.startsWith('http') ? img.image : `http://localhost:5000${img.image}`}
                    alt={img.caption || "Gallery Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(img.image)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-75"
                      title="Copy Link"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-100"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate" title={img.caption}>
                      {img.caption || "Untitled"}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full mt-2 inline-block">
                      {img.category || "General"}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <Image size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No images found</p>
              <p className="text-sm">Upload some images to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Image?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold dark:text-white">Upload Image</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption / Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Event 2024"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Events">Events</option>
                    <option value="Products">Products</option>
                    <option value="Team">Team</option>
                    <option value="Awards">Awards</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 pointer-events-none">
                      <Upload size={24} />
                      <span className="text-sm font-medium">
                        {uploadFile ? uploadFile.name : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-xs text-gray-400">Max size: 10MB</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-2"
                >
                  Upload Image
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryManager;
