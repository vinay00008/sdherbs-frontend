import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Image,
  FileText,
  Settings,
  LogOut,
  UserPlus,
  Bot,
  Home,
  Layout
} from "lucide-react";
import axios from "../../api/axiosConfig";

const AdminSidebar = ({ onNavigate = () => { } }) => {
  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products", path: "/admin/products", icon: <LayoutDashboard size={18} /> },
    { name: "Enquiries", path: "/admin/enquiries", icon: <FileText size={18} /> },
    { name: "Home Page", path: "/admin/home-page", icon: <Home size={18} /> },
    { name: "About Page", path: "/admin/about", icon: <Newspaper size={18} /> },
    { name: "Activity Page", path: "/admin/activities", icon: <Layout size={18} /> },
    { name: "Gallery Manager", path: "/admin/gallery", icon: <Image size={18} /> },
    { name: "Chatbot Trainer", path: "/admin/chatbot-trainer", icon: <Bot size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await axios.post("/admin/logout");
    } catch (err) {
      // ignore
    } finally {
      // no token saved in localStorage (cookie auth). just redirect to login
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="w-full h-full p-5 flex flex-col justify-between text-gray-100">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-300">🌿 SD Herbs</h2>
          <p className="text-xs text-gray-300 mt-1">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={onNavigate}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-white/6 text-green-300"
                  : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <NavLink to="/admin/settings" onClick={onNavigate} className="flex items-center gap-2 px-3 py-2 text-sm text-blue-200 hover:underline">
          <UserPlus size={16} /> Add Admin
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-6 w-full text-left flex items-center gap-2 px-3 py-2 text-red-300 hover:bg-white/5 rounded-md"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
