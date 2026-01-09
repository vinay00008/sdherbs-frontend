import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, Upload, Loader2, Image as ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react";

const AboutManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false); // New state for upload modal
    const [activeTab, setActiveTab] = useState("hero");
    const [toast, setToast] = useState({ show: false, message: "", type: "success" }); // New state for toast

    // Initial State Structure
    const [content, setContent] = useState({
        hero: { title: "", subtitle: "", image: "" },
        story: { title: "", content: "", image: "" },
        mission: { title: "", content: "" },
        vision: { title: "", content: "" },
        values: [], // { title, desc, icon }
        team: [],   // { name, role, bio, image }
        stats: []   // { label, value }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    // Toast Helper
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const fetchContent = async () => {
        try {
            const res = await axiosInstance.get("/page-content/about");
            if (res.data && res.data.content) {
                setContent((prev) => ({ ...prev, ...res.data.content }));
            }
        } catch (err) {
            console.error("Error fetching about content:", err);
            showToast("Failed to load content", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put("/page-content/about", {
                title: "About Us",
                content: content
            });
            showToast("Content saved successfully!", "success");
        } catch (err) {
            console.error("Error saving content:", err);
            showToast("Failed to save content.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e, section, index = null, field = "image") => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showToast("File size exceeds 10MB limit.", "error");
            return;
        }

        setUploading(true); // Show modal
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axiosInstance.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = res.data.filePath;

            setContent((prev) => {
                const newContent = { ...prev };
                if (index !== null) {
                    newContent[section][index][field] = imageUrl;
                } else {
                    newContent[section][field] = imageUrl;
                }
                return newContent;
            });
            showToast("Image uploaded successfully!", "success");
        } catch (err) {
            console.error("Error uploading image:", err);
            showToast("Image upload failed.", "error");
        } finally {
            setUploading(false); // Hide modal
        }
    };

    const handleChange = (section, field, value) => {
        setContent((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setContent((prev) => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addItem = (section, template) => {
        setContent((prev) => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeItem = (section, index) => {
        setContent((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:10000'}${path}`;
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    const tabs = [
        { id: "hero", label: "Hero Section" },
        { id: "story", label: "Our Story" },
        { id: "mission", label: "Mission & Vision" },
        { id: "values", label: "Core Values" },
        { id: "team", label: "Team" },
        { id: "stats", label: "Stats" },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto relative">
            {/* TOAST NOTIFICATION */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${toast.type === "success"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Uploading Image...</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your file.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">About Page Manager</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? "bg-green-600 text-white font-medium"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">

                {/* HERO SECTION */}
                {activeTab === "hero" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Hero Section</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={content.hero?.title || ""}
                                onChange={(e) => handleChange("hero", "title", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subtitle</label>
                            <textarea
                                value={content.hero?.subtitle || ""}
                                onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-24"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Background Image</label>
                            <div className="flex items-center gap-4">
                                {content.hero?.image && (
                                    <img src={getImageUrl(content.hero.image)} alt="Hero" className="w-32 h-20 object-cover rounded" />
                                )}
                                <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded border border-dashed border-gray-400 hover:bg-gray-200 transition">
                                    <span className="flex items-center gap-2 text-sm"><Upload size={16} /> Upload Image</span>
                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "hero")} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* STORY SECTION */}
                {activeTab === "story" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Our Story</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={content.story?.title || ""}
                                onChange={(e) => handleChange("story", "title", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                                value={content.story?.content || ""}
                                onChange={(e) => handleChange("story", "content", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-40"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Story Image</label>
                            <div className="flex items-center gap-4">
                                {content.story?.image && (
                                    <img src={getImageUrl(content.story.image)} alt="Story" className="w-32 h-32 object-cover rounded" />
                                )}
                                <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded border border-dashed border-gray-400 hover:bg-gray-200 transition">
                                    <span className="flex items-center gap-2 text-sm"><Upload size={16} /> Upload Image</span>
                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "story")} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* MISSION & VISION */}
                {activeTab === "mission" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Mission</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={content.mission?.title || ""}
                                onChange={(e) => handleChange("mission", "title", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <textarea
                                placeholder="Content"
                                value={content.mission?.content || ""}
                                onChange={(e) => handleChange("mission", "content", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-32"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Vision</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={content.vision?.title || ""}
                                onChange={(e) => handleChange("vision", "title", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <textarea
                                placeholder="Content"
                                value={content.vision?.content || ""}
                                onChange={(e) => handleChange("vision", "content", e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-32"
                            />
                        </div>
                    </div>
                )}

                {/* VALUES */}
                {activeTab === "values" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Core Values</h2>
                            <button
                                onClick={() => addItem("values", { title: "", desc: "", icon: "Leaf" })}
                                className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                            >
                                <Plus size={16} /> Add Value
                            </button>
                        </div>
                        <div className="space-y-4">
                            {content.values?.map((val, i) => (
                                <div key={i} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={val.title}
                                            onChange={(e) => handleArrayChange("values", i, "title", e.target.value)}
                                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={val.desc}
                                            onChange={(e) => handleArrayChange("values", i, "desc", e.target.value)}
                                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <select
                                            value={val.icon}
                                            onChange={(e) => handleArrayChange("values", i, "icon", e.target.value)}
                                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        >
                                            <option value="Leaf">Leaf</option>
                                            <option value="Award">Award</option>
                                            <option value="Heart">Heart</option>
                                            <option value="Users">Users</option>
                                            <option value="Globe">Globe</option>
                                            <option value="ShieldCheck">Shield</option>
                                        </select>
                                    </div>
                                    <button onClick={() => removeItem("values", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TEAM */}
                {activeTab === "team" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Team Members</h2>
                            <button
                                onClick={() => addItem("team", { name: "", role: "", bio: "", image: "" })}
                                className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                            >
                                <Plus size={16} /> Add Member
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.team?.map((member, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative">
                                    <button onClick={() => removeItem("team", i)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                            {member.image ? (
                                                <img src={getImageUrl(member.image)} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-full h-full p-4 text-gray-400" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer text-xs bg-white dark:bg-gray-700 border px-2 py-1 rounded hover:bg-gray-100">
                                            Change Photo
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "team", i)} />
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={member.name}
                                            onChange={(e) => handleArrayChange("team", i, "name", e.target.value)}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Role"
                                            value={member.role}
                                            onChange={(e) => handleArrayChange("team", i, "role", e.target.value)}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <textarea
                                            placeholder="Bio"
                                            value={member.bio}
                                            onChange={(e) => handleArrayChange("team", i, "bio", e.target.value)}
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-20"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STATS */}
                {activeTab === "stats" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Company Stats</h2>
                            <button
                                onClick={() => addItem("stats", { label: "", value: "" })}
                                className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                            >
                                <Plus size={16} /> Add Stat
                            </button>
                        </div>
                        <div className="space-y-4">
                            {content.stats?.map((stat, i) => (
                                <div key={i} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g., Happy Clients)"
                                        value={stat.label}
                                        onChange={(e) => handleArrayChange("stats", i, "label", e.target.value)}
                                        className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g., 500+)"
                                        value={stat.value}
                                        onChange={(e) => handleArrayChange("stats", i, "value", e.target.value)}
                                        className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <button onClick={() => removeItem("stats", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AboutManager;

