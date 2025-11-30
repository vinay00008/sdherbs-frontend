// client/src/admin/pages/BlogManager.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";

const BlogManager = () => {
  const [blogs] = useState([
    { id: 1, title: "Benefits of Ashwagandha", date: "2025-10-25", author: "Vinay Patidar" },
    { id: 2, title: "How to Store Herbal Powders", date: "2025-09-14", author: "SD Herbs Team" },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText size={20}/> Blog Manager</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Plus size={16}/> Add Blog
        </button>
      </div>

      <div className="bg-white dark:bg-[#071029] rounded-xl shadow overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-[#071629]">
              <tr>
                <th className="p-3 text-sm text-left">Title</th>
                <th className="p-3 text-sm text-left">Author</th>
                <th className="p-3 text-sm text-left">Date</th>
                <th className="p-3 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id} className="border-t border-gray-200 dark:border-black/20 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="p-3">{b.title}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3 text-right flex items-center justify-end gap-3">
                    <button className="text-blue-600 hover:text-blue-700"><Pencil size={16} /></button>
                    <button className="text-red-600 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogManager;
