import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout, FileText, Calendar, Image as ImageIcon, Shield, BookOpen } from "lucide-react";
import axios from "../../api/axiosConfig";
import EventsManager from "./EventsManager";
import ActivitiesManager from "./ActivitiesManager";

const ActivityPageManager = () => {
    const [activeTab, setActiveTab] = useState("content"); // content | events | gallery

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Layout className="text-green-600" /> Activity Page Manager
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage everything on the Activity Page from one place.
                    </p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                <TabButton
                    id="content"
                    label="Page Content"
                    icon={<FileText size={18} />}
                    active={activeTab}
                    onClick={setActiveTab}
                />
                <TabButton
                    id="events"
                    label="Events"
                    icon={<Calendar size={18} />}
                    active={activeTab}
                    onClick={setActiveTab}
                />
                <TabButton
                    id="gallery"
                    label="Blogs"
                    icon={<BookOpen size={18} />}
                    active={activeTab}
                    onClick={setActiveTab}
                />
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
                {activeTab === "content" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <PageContentSettings />
                    </motion.div>
                )}
                {activeTab === "events" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <EventsManager />
                    </motion.div>
                )}
                {activeTab === "gallery" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <ActivitiesManager />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors border-b-2 ${active === id
            ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10"
            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
    >
        {icon}
        {label}
    </button>
);

// Extracted Page Content Settings Component
const PageContentSettings = () => {
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get("/page-content/activity");
                if (res.data) {
                    setForm({ title: res.data.title || "", description: res.data.description || "" });
                }
            } catch (err) {
                console.error("Error fetching page content:", err);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg("");
        try {
            await axios.put("/page-content/activity", form);
            setMsg("✅ Activity Page content updated!");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setMsg("❌ Failed to update content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow p-6 max-w-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <Shield size={20} className="text-blue-500" /> Page Header Content
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Update the main title and description displayed at the top of the Activity Page.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Our Activities & Events"
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Short description for the page header..."
                        rows="4"
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                {msg && (
                    <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${msg.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {msg}
                    </div>
                )}

                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-sm">
                    {loading ? "Saving..." : "Save Content"}
                </button>
            </form>
        </div>
    );
};

export default ActivityPageManager;
