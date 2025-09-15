import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';

function ProtectedRoute({ children, requireSetup = false, requireActiveCafe = false }) {
  const { state } = useAppContext();
  const { isAuthenticated, setupCompleted, cafeStatus } = state;
  const location = useLocation();

  // 1. If not logged in → always go to login
  if (!isAuthenticated) {
    return <Navigate to="/cafe/auth/login" state={{ from: location }} replace />;
  }

  // NEW: Check cafeStatus for access routing
  if (requireActiveCafe) {
    if (cafeStatus === "pending") return <Navigate to="/cafe/setup" replace />;
    if (cafeStatus === "pendingApproval") return <Navigate to="/cafe/pending-approval" replace />;
    if (cafeStatus !== "active") return <Navigate to="/cafe" replace />;
  }
  // If setup not done, redirect
  if (requireSetup && typeof setupCompleted !== "undefined") {
    if (!setupCompleted) {
      return <Navigate to="/cafe/setup" replace />;
    }
  }
  if (!requireSetup && setupCompleted) {
    if (location.pathname === "/cafe/setup") {
      return <Navigate to="/cafe" replace />;
    }
  }
  // 2. All good
  return children;
}

export default ProtectedRoute;