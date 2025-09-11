// App.jsx (Corrected and Final)

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import MobileNavbar from './components/MobileNavbar';
import HomePage from './pages/HomePage';
import CafesPage from './pages/CafesPage';
import CafeDetailPage from './pages/CafeDetailPage';
import RewardsPage from './pages/RewardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WelcomePage from './pages/WelcomePage';
import ClaimRewardPage from './pages/ClaimRewardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import axios from 'axios';
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // ✅ Import the new page
import TermsAndConditionsPage from './pages/TermsAndConditions'; // ✅ Import the new page

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // ✅ Fixed with backticks
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/home') setActivePage('home');
    else if (path.startsWith('/cafes')) setActivePage('cafes');
    else if (path === '/rewards') setActivePage('rewards');
    else if (path === '/leaderboard') setActivePage('leaderboard');
    else if (path === '/profile') setActivePage('profile');
  }, [location]);

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const handleAuthNavigation = (page) => {
    if (page === 'login') navigate('/login');
    else if (page === 'signup') navigate('/signup');
  };

  const isAuthPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/welcome' ||
    location.pathname === '/verify-email';

  // ✅ Include new policy page in known routes
  const isKnownRoute = () => {
    const p = location.pathname;
    const known = new Set([
      '/', '/welcome', '/login', '/signup', '/verify-email',
      '/forgot-password', '/verify-otp', '/reset-password',
      '/home', '/cafes', '/rewards', '/claim-reward', '/leaderboard', '/profile',
      '/privacy-policy'
    ]);
    if (known.has(p)) return true;
    if (p.startsWith('/cafes/')) return true;
    return false;
  };

  const isUnknownRoute = !isKnownRoute();
  const hideNavbars = isAuthPage || (isUnknownRoute && !isAuthenticated);

  return (
    <div className="min-h-screen bg-background">
      {!hideNavbars && (
        <>
          <div className="hidden md:block sticky top-0 z-50">
            <Navbar onSearch={handleSearch} />
          </div>
          <div className="md:hidden">
            <MobileNavbar />
          </div>
        </>
      )}

      <main className="pt-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage onNavigate={handleAuthNavigation} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleAuthNavigation} />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* ✅ Policy page */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage/>} />

          {/* Forgot Password Flow */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cafes" element={<ProtectedRoute><CafesPage /></ProtectedRoute>} />
          <Route path="/cafes/:id" element={<ProtectedRoute><CafeDetailPage /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
          <Route path="/claim-reward" element={<ProtectedRoute><ClaimRewardPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!hideNavbars && isAuthenticated && (
        <div className="md:hidden">
          <BottomNav activePage={activePage} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
