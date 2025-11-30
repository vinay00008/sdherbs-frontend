import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Search } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false);
    }
  };

  // 🌿 Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Activity", path: "/activity" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b transition-all duration-300
        ${theme === "dark"
          ? isScrolled
            ? "bg-gray-900/95 border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            : "bg-gray-900/80 border-gray-800"
          : isScrolled
            ? "bg-white/90 border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            : "bg-white/70 border-gray-100"
        }`}
    >
      {/* 🌿 Scroll Progress Bar with Glow Shadow + Pulse Animation */}
      <div
        className={`absolute top-0 left-0 h-[3px] bg-green-500 transition-all duration-200 
          ${theme === "dark"
            ? "shadow-[0_2px_8px_rgba(34,197,94,0.6)] animate-pulse-slow"
            : "shadow-[0_2px_6px_rgba(0,0,0,0.25)] animate-pulse-slow"
          }`}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* 🌿 Navbar Inner */}
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-6 transition-all duration-300 ${isScrolled ? "py-2" : "py-3"
          }`}
      >
        {/* 🌿 Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={settings.logo}
            alt="SD Herbs Logo"
            className={`object-contain transition-all duration-500 ease-in-out hover:scale-105 
              ${isScrolled ? "w-[58px]" : "w-[68px]"
              } drop-shadow-[0_0_12px_rgba(16,185,129,0.35)] 
              group-hover:drop-shadow-[0_0_18px_rgba(16,185,129,0.55)]`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </Link>

        {/* 🌱 Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium tracking-wide relative transition-all duration-300
                ${isActive
                  ? "text-primary after:w-full after:bg-primary"
                  : "text-gray-700 dark:text-gray-200 hover:text-primary"
                }
                after:absolute after:bottom-[-6px] after:left-0 after:h-[2px]
                after:transition-all after:duration-300 after:w-0 hover:after:w-full`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* 🔍 Desktop Search */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-1.5 rounded-full border transition-all duration-300 outline-none
                ${theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:bg-gray-700"
                  : "bg-gray-100 border-gray-200 text-gray-800 focus:border-green-500 focus:bg-white"}
                w-32 focus:w-64 group-hover:w-64`}
            />
            <Search
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
                ${theme === "dark" ? "text-gray-400 group-focus-within:text-green-500" : "text-gray-500 group-focus-within:text-green-600"}`}
            />
          </form>

          {/* 🌞 Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-full border dark:border-gray-700 border-gray-200 
                       hover:bg-green-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* 🍔 Mobile Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-green-100 dark:hover:bg-gray-800 transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 📱 Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`md:hidden border-t ${theme === "dark"
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-white"
              }`}
          >
            <div className="flex flex-col px-5 py-3 space-y-3">
              {/* 🔍 Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none
                    ${theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:border-green-500"
                      : "bg-gray-50 border-gray-200 text-gray-800 focus:border-green-500"}`}
                />
                <Search
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 
                    ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                />
              </form>

              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block font-medium py-2 rounded-md ${isActive
                      ? "text-primary bg-green-50 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-200 hover:text-primary"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* 🌞 Theme Toggle (Mobile) */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 border rounded-md 
                           dark:border-gray-700 border-gray-200 
                           hover:bg-green-100 dark:hover:bg-gray-800 transition"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} className="text-yellow-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="text-gray-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
