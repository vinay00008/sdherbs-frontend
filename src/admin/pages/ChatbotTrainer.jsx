import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, Trash2, History, Lightbulb, CheckCircle, AlertCircle, X } from "lucide-react";

const ChatbotTrainer = () => {
    const [logs, setLogs] = useState([]);
    const [knowledge, setKnowledge] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    // UX State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const fetchData = async () => {
        try {
            const [logsRes, knowledgeRes] = await Promise.all([
                axios.get("/chat-trainer/logs"),
                axios.get("/chat-trainer/knowledge"),
            ]);
            setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
            setKnowledge(Array.isArray(knowledgeRes.data) ? knowledgeRes.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLogs([]);
            setKnowledge([]);
        }
    };

    const handleAddKnowledge = async (e) => {
        e.preventDefault();
        if (!newQuestion || !newAnswer) return;

        setLoading(true);
        try {
            await axios.post("/chat-trainer/knowledge", {
                question: newQuestion,
                answer: newAnswer,
            });
            setNewQuestion("");
            setNewAnswer("");
            fetchData(); // Refresh list
            showToast("Knowledge Added! 🧠", "success");
        } catch (error) {
            console.error("Error adding knowledge:", error);
            showToast("Failed to add knowledge.", "error");
        }
        setLoading(false);
    };

    const handleDeleteKnowledge = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await axios.delete(`/chat-trainer/knowledge/${deleteModal.id}`);
            fetchData();
            showToast("Knowledge deleted successfully!", "success");
            setDeleteModal({ show: false, id: null });
        } catch (error) {
            console.error("Error deleting knowledge:", error);
            showToast("Failed to delete knowledge.", "error");
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
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
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Knowledge?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this item? This action cannot be undone.
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

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <Bot className="text-green-600" /> Chatbot Trainer
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Teach the chatbot new facts, answers, and information about SD Herbs.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Knowledge Base */}
                <div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                            <Plus className="text-blue-500" /> Add New Knowledge
                        </h2>
                        <form onSubmit={handleAddKnowledge} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic or Question</label>
                                <input
                                    type="text"
                                    className="w-full border dark:border-gray-600 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g., Return Policy, or 'What is Ashwagandha?'"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Information / Answer</label>
                                <textarea
                                    className="w-full border dark:border-gray-600 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    placeholder="e.g., We offer a 30-day return policy for all unused items..."
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                            >
                                {loading ? "Training..." : "Train Chatbot 🧠"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            <Lightbulb className="text-yellow-500" /> Learned Knowledge ({knowledge.length})
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {knowledge.map((item) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border dark:border-gray-700 p-4 rounded-lg relative group hover:shadow-md transition bg-gray-50 dark:bg-gray-700/50"
                                >
                                    <button
                                        onClick={() => handleDeleteKnowledge(item._id)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">Q: {item.question}</p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm whitespace-pre-wrap">A: {item.answer}</p>
                                </motion.div>
                            ))}
                            {knowledge.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic">No custom knowledge added yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Logs */}
                <div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-full border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                            <History className="text-purple-500" /> Recent Chat Logs
                        </h2>
                        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.map((log) => (
                                <div key={log._id} className="border-b dark:border-gray-700 pb-3 last:border-0">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                                        {log.isUnanswered && <span className="text-red-500 font-bold">Unanswered?</span>}
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">User: {log.userMessage}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Bot: {log.botReply}</p>
                                    {/* Quick Add Button */}
                                    <button
                                        onClick={() => {
                                            setNewQuestion(log.userMessage);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                                    >
                                        Train on this question
                                    </button>
                                </div>
                            ))}
                            {logs.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic">No chat logs yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotTrainer;
