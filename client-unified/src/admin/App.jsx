import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import CafeApprovalQueuePage from "./pages/CafeApprovalQueuePage";
import CafeListPage from "./pages/CafeListPage";
import CafeDetailPage from "./pages/CafeDetailPage";
import UserLookupPage from "./pages/UserLookupPage";
import UserProfilePage from "./pages/UserProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PromotionsPage from "./pages/PromotionsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminInvoicesPage from "./pages/invoice"; 
import EventManagementPage from './pages/EventManagementPage';
// import AdminSignupPage from "./pages/AdminSignupPage";

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        {/* <Route path="/signup" element={<AdminSignupPage />} /> */}

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="dashboard"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="events"
          element={
            <AdminLayout>
              <EventManagementPage />
            </AdminLayout>
          }
        />

        {/* Cafes */}
        <Route
          path="cafes/approval-queue"
          element={
            <AdminLayout>
              <CafeApprovalQueuePage />
            </AdminLayout>
          }
        />
        <Route
          path="cafes"
          element={
            <AdminLayout>
              <CafeListPage />
            </AdminLayout>
          }
        />
        <Route
          path="cafes/:id"
          element={
            <AdminLayout>
              <CafeDetailPage />
            </AdminLayout>
          }
        />

        {/* Users */}
        <Route
          path="users"
          element={
            <AdminLayout>
              <UserLookupPage />
            </AdminLayout>
          }
        />
        <Route
          path="users/:id"
          element={
            <AdminLayout>
              <UserProfilePage />
            </AdminLayout>
          }
        />
        <Route
          path="profile/:id"
          element={
            <AdminLayout>
              <UserProfilePage />
            </AdminLayout>
          }
        />

        {/* Analytics */}
        <Route
          path="analytics"
          element={
            <AdminLayout>
              <AnalyticsPage />
            </AdminLayout>
          }
        />

        {/* Promotions */}
        <Route
          path="promotions"
          element={
            <AdminLayout>
              <PromotionsPage />
            </AdminLayout>
          }
        />

        {/* ✅ Invoices */}
        <Route
          path="invoices"
          element={
            <AdminLayout>
              <AdminInvoicesPage />
            </AdminLayout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AdminAuthProvider>
  );
}
