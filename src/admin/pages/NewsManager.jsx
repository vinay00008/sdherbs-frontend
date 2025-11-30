import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, Newspaper, X } from "lucide-react";

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", date: "" });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get("/news");
      setNews(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/news", formData);
      fetchNews();
      closeModal();
    } catch (err) {
      console.error("Error creating news:", err);
      alert("Failed to create news");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      await axios.delete(`/news/${id}`);
      setNews(news.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", content: "", date: "" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
          <Newspaper size={24} /> News Manager
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={18} /> Add News
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading news...</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden sm:block bg-white dark:bg-[#1e293b] rounded-xl shadow overflow-hidden w-full border border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-[#0f172a]">
                <tr>
                  <th className="p-4 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">Title</th>
                  <th className="p-4 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-right text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{item.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {news.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No news found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="sm:hidden space-y-4">
            {news.map((item) => (
              <div key={item._id} className="bg-white dark:bg-[#1e293b] shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  📅 {new Date(item.date || item.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-end gap-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <p className="text-center text-gray-500 py-4">No news found.</p>
            )}
          </div>
        </>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold dark:text-white">Add News</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-2"
                >
                  Publish News
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsManager;
