import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/cafes/approval-queue", label: "Cafe Approval Queue" },
  { to: "/admin/cafes", label: "Cafe List" },
  { to: "/admin/users", label: "User Management" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/promotions", label: "Promotions" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        CafeChain Admin
      </div>
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded mb-2 ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}