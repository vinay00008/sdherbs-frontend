import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductManager from "./pages/ProductManager";
import EnquiryManager from "./pages/EnquiryManager";
import ActivityPageManager from "./pages/ActivityPageManager";
import EditActivity from "./pages/EditActivity";
import AboutManager from "./pages/AboutManager";
import Settings from "./pages/Settings";
import ChatbotTrainer from "./pages/ChatbotTrainer";
import GalleryManager from "./pages/GalleryManager";
import HomePageManager from "./pages/HomePageManager";

import ProtectedRoute from "./ProtectedRoute";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

import { Menu, X } from "lucide-react";

/**
 * Layout: takes children content (pages).
 * - Sidebar fixed on md+, slide-in overlay on mobile.
 * - Navbar fixed at top. Content gets top padding.
 */
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0b1220] text-gray-800 dark:text-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-72 md:w-64 bg-[#0f1724] text-gray-100 shadow-lg border-r border-black/10 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-hidden={!sidebarOpen}
      >
        {/* mobile header inside sidebar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-black/10">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-400">🌿 SD Herbs</span>
          </div>
          <button onClick={closeSidebar} className="p-1 rounded-md hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        {/* sidebar content */}
        <div className="h-full overflow-auto">
          <AdminSidebar onNavigate={closeSidebar} />
        </div>
      </aside>

      {/* overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* NAVBAR */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#071024]/90 backdrop-blur-sm border-b border-black/5 dark:border-black/20 flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-black/5 text-gray-700 dark:text-gray-200"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-lg font-semibold">SD Herbs Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AdminNavbar />
          </div>
        </header>

        {/* CONTENT: top padding so content does not hide under navbar */}
        <main className="flex-1 overflow-y-auto pt-6 pb-8">
          <div className="max-w-[1200px] mx-auto px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

const AdminApp = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="products"
      element={
        <ProtectedRoute>
          <Layout>
            <ProductManager />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="enquiries"
      element={
        <ProtectedRoute>
          <Layout>
            <EnquiryManager />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="activities"
      element={
        <ProtectedRoute>
          <Layout>
            <ActivityPageManager />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="activities/edit/:id"
      element={
        <ProtectedRoute>
          <Layout>
            <EditActivity />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="about"
      element={
        <ProtectedRoute>
          <Layout>
            <AboutManager />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="settings"
      element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="chatbot-trainer"
      element={
        <ProtectedRoute>
          <Layout>
            <ChatbotTrainer />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="gallery"
      element={
        <ProtectedRoute>
          <Layout>
            <GalleryManager />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="home-page"
      element={
        <ProtectedRoute>
          <Layout>
            <HomePageManager />
          </Layout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AdminApp;
