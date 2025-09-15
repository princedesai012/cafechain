import React, { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);