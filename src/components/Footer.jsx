import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

import { useSettings } from "../context/SettingsContext";
import { Facebook, Instagram, Mail, MapPin, Phone, Linkedin } from "lucide-react";

const Footer = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();

  return (
    <footer
      className={`relative mt-16 border-t transition-all duration-500 ${theme === "dark"
        ? "bg-gray-900 border-gray-800 text-gray-300"
        : "bg-white border-gray-200 text-gray-700"
        }`}
    >
      {/* 🌿 Herbal Gradient Glow Line */}
      <div
        className={`absolute top-0 left-0 w-full h-[3px] ${theme === "dark"
          ? "bg-green-500/70 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
          : "bg-green-500/40 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          }`}
      ></div>

      {/* 🌿 Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 🌿 Logo & Brand Section */}
        <div className="flex flex-col gap-3">
          <motion.img
            src={settings.logo}
            alt="SD Herbs Logo"
            className="w-20 h-auto object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Nature’s healing touch, packed with purity and care 🌿
          </p>

          <div className="flex gap-4 mt-2">
            {[
              { icon: Facebook, link: "#" },
              { icon: Instagram, link: "#" },
              { icon: Linkedin, link: "#" },
            ].map(({ icon: Icon, link }, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-green-100 dark:bg-gray-800 hover:bg-green-500 hover:text-white transition"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* 🧭 Quick Links */}
        <div>
          <h3 className="font-semibold text-lg text-primary mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {["Home", "Products", "About", "Activity", "Contact"].map(
              (name) => (
                <li key={name}>
                  <Link
                    to={`/${name.toLowerCase() === "home" ? "" : name.toLowerCase()}`}
                    className="hover:text-primary transition duration-200"
                  >
                    {name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* 📍 Contact Info */}
        <div>
          <h3 className="font-semibold text-lg text-primary mb-3">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Mandsaur, Madhya Pradesh, India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 98931 56792
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> info@sdherbs.com
            </li>
          </ul>
        </div>

        {/* 🌱 Newsletter (Optional & Premium Touch) */}
        <div>
          <h3 className="font-semibold text-lg text-primary mb-3">
            Stay Updated
          </h3>
          <p className="text-sm mb-3">
            Get updates about new herbal products & offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-lg px-3 py-2 text-sm outline-none border ${theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-soft transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* 🌍 Bottom Bar */}
      <div
        className={`text-center py-4 text-sm border-t ${theme === "dark"
          ? "border-gray-800 bg-gray-950/40"
          : "border-gray-200 bg-gray-50/50"
          }`}
      >
        <p>
          © {new Date().getFullYear()} <span className="text-green-600 font-semibold">SD Herbs</span> — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
