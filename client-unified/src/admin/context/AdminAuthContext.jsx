import React, { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState({ name: "Super Admin", role: "superadmin" });

  const logout = () => {
    // Implement logout logic
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  return (
    <AdminAuthContext.Provider value={{ admin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}