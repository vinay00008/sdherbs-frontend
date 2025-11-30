import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

/**
 * AdminLayout.jsx
 * Ye layout har admin page ke around use hoga
 * Navbar fix rahega, Sidebar toggle hoga (mobile ke liye),
 * aur content automatically adjust hoga.
 */

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* 🔝 Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* 📋 Sidebar */}
      <div
        className={`fixed top-[56px] md:top-0 left-0 z-40 md:z-30 h-[calc(100vh-56px)] md:h-screen w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* 📄 Main Content */}
      <main
        className="pt-[70px] md:pt-[70px] md:ml-64 transition-all duration-300"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
