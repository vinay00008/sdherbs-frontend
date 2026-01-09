// client/src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Newspaper, Image, FileText } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";

const Dashboard = () => {
  const [stats, setStats] = useState({ events: 0, news: 0, gallery: 0, products: 0, enquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats");
        if (res.data) setStats(res.data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Products", value: loading ? "..." : stats.products, icon: <FileText size={28} />, color: "bg-white/80" },
    { title: "Enquiries", value: loading ? "..." : stats.enquiries, icon: <FileText size={28} />, color: "bg-white/80" },
    { title: "Total Events", value: loading ? "..." : stats.events, icon: <Calendar size={28} />, color: "bg-white/80" },
    { title: "Gallery Items", value: loading ? "..." : stats.gallery, icon: <Image size={28} />, color: "bg-white/80" },
    { title: "News Posts", value: loading ? "..." : stats.news, icon: <Newspaper size={28} />, color: "bg-white/80" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin 🌿</h1>
        <p className="text-sm text-gray-400 mb-6">Quick overview of site content</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className={`p-5 rounded-xl shadow-md ${card.color} flex items-center justify-between`}>
              <div>
                <h2 className="text-2xl font-semibold">{card.value}</h2>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
              <div className="opacity-70">{card.icon}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

