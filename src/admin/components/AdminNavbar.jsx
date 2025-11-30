// client/src/admin/components/AdminNavbar.jsx
import React from "react";
import { User, Bell } from "lucide-react";

const AdminNavbar = () => {
  return (
    <div className="flex items-center gap-4">
      <button className="hidden md:inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white/5 px-3 py-1 rounded-full">
        <Bell size={16} /> <span className="text-xs">Notifications</span>
      </button>

      <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
        <User size={16} className="text-green-300" />
        <div className="text-xs">
          <div className="font-medium">Admin</div>
          <div className="text-[11px] text-gray-400">sdherbs@admin</div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
