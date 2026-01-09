import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Save, Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import axios from "../../api/axiosConfig";

const HomePageManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false); // New uploading state
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const [form, setForm] = useState({
        title: "Unlock Nature's Healing Power",
        subtitle: "Experience the purest form of Ayurveda. Scientifically tested, ethically sourced, and delivered with care.",
        heroImage: "https://www.tasteofhome.com/wp-content/uploads/2023/10/GettyImages-1154618104-spices-and-herbs-FT-JVedit.jpg"
    });

    // Toast Helper
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/page-content/home");
                if (res.data) {
                    setForm({
                        title: res.data.title || "Unlock Nature's Healing Power",
                        subtitle: res.data.description || "Experience the purest form of Ayurveda. Scientifically tested, ethically sourced, and delivered with care.",
                        heroImage: res.data.content?.heroImage || "https://www.tasteofhome.com/wp-content/uploads/2023/10/GettyImages-1154618104-spices-and-herbs-FT-JVedit.jpg"
                    });
                }
            } catch (err) {
                console.error("Error fetching home content:", err);
                showToast("Failed to load content.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showToast("File size too large (Max 10MB)", "error");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true); // Start uploading animation
            const res = await axios.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Simulate a small delay for the animation to be visible and feel premium
            await new Promise(resolve => setTimeout(resolve, 800));

            const newImageUrl = res.data.filePath;
            setForm(prev => ({ ...prev, heroImage: newImageUrl }));

            // AUTO SAVE after upload
            await axios.put("/page-content/home", {
                title: form.title,
                description: form.subtitle,
                content: { heroImage: newImageUrl }
            });

            showToast("Image uploaded & SAVED successfully! ✅", "success");
        } catch (err) {
            console.error("Upload error:", err);
            showToast("Failed to upload image.", "error");
        } finally {
            setUploading(false); // Stop uploading animation
        }
    };

    // Save Changes
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put("/page-content/home", {
                title: form.title,
                description: form.subtitle,
                content: { heroImage: form.heroImage }
            });
            showToast("Home Page updated successfully!", "success");
        } catch (err) {
            console.error("Save error:", err);
            showToast("Failed to save changes.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 size={48} className="animate-spin text-green-600" />
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 relative">
            {/* UPLOAD OVERLAY MODAL */}
            <AnimatePresence>
                {uploading && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-green-100 dark:border-green-900 border-t-green-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Upload size={24} className="text-green-600 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Uploading & Saving...</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Optimizing and saving your visual asset.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                            <Home size={28} />
                        </div>
                        Home Page Manager
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                        Customize the Hero section and main content.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${toast.type === "success" ? "bg-white text-green-700 border-green-200" : "bg-white text-red-700 border-red-200"}`}
                    >
                        {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section Form */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <ImageIcon size={20} className="text-gray-400" /> Hero Section Content
                    </h2>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Text Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Main Title
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={3}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg font-medium resize-none shadow-sm"
                                    placeholder="Unlock Nature's Healing Power"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">&lt;br/&gt;</span>
                                breaks line. Text after break is <span className="text-green-600 font-bold">green</span>.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Subtitle / Description
                            </label>
                            <textarea
                                rows={5}
                                value={form.subtitle}
                                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-base resize-none shadow-sm"
                                placeholder="Experience the purest form of Ayurveda..."
                            />
                        </div>
                    </div>

                    {/* Right: Image Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Hero Image Preview
                        </label>

                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg group">
                            {form.heroImage ? (
                                <img
                                    src={form.heroImage}
                                    alt="Hero"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={64} className="mb-4 opacity-50" />
                                    <span className="font-medium">No Image Selected</span>
                                </div>
                            )}

                            {/* Overlay Upload Button */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <label className="cursor-pointer bg-white text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 hover:text-green-700 transition-all transform hover:scale-105 shadow-xl">
                                    <Upload size={20} /> Change Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                        <p className="text-xs text-center text-gray-400">
                            Recommended: 1200x800px (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageManager;
