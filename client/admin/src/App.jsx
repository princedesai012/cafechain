// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import LoginPage from "./pages/LoginPage";
import ClaimApprovalPage from "./pages/ClaimApprovalPage";

const ProtectedRoute = ({ children }) => {
  const { adminToken } = useAdminAuth();
  if (!adminToken) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/claims" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/claim-approvals"
          element={
            // <ProtectedRoute>
              <ClaimApprovalPage />
            // </ProtectedRoute>
          }
        />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}