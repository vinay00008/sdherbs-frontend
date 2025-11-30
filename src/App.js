import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import LoadingFallback from "./components/LoadingFallback";
import { useTheme } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";

// 🌿 Lazy Load Public Pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

// 🧠 Lazy Load Admin Panel
const AdminApp = lazy(() => import("./admin/AdminApp"));
const GalleryManager = lazy(() => import("./admin/pages/GalleryManager"));
const ChatbotTrainer = lazy(() => import("./admin/pages/ChatbotTrainer"));

// 🏗️ Layout Component to handle conditional rendering
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </main>
      {isHomePage && <StatsBar />}
      <Footer />
      <ChatbotWidget />
    </>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <HelmetProvider>
      <SettingsProvider>
        <ToastProvider>
          <div
            className={`min-h-screen transition-all duration-500 ${theme === "dark"
              ? "bg-secondary-dark text-neutral-dark"
              : "bg-secondary-light text-neutral-light"
              }`}
          >
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* 🌿 Public Website Routes */}
                  <Route path="/*" element={<Layout />} />

                  {/* 🔐 Admin Panel Routes */}
                  <Route path="/admin/*" element={<AdminApp />}>
                    <Route path="gallery" element={<GalleryManager />} />
                    <Route path="chatbot-trainer" element={<ChatbotTrainer />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </div>
        </ToastProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
