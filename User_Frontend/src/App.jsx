import React, { useState } from 'react';
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

// Protected Route component
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
  const { isAuthenticated } = useAuth(); // ✅ correctly placed
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();

  React.useEffect(() => {
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
    if (page === 'login') {
      navigate('/login');
    } else if (page === 'signup') {
      navigate('/signup');
    }
  };

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/welcome' ||
    location.pathname === '/verify-email';

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
        <>
          <div className="hidden md:block">
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

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cafes"
            element={
              <ProtectedRoute>
                <CafesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cafes/:id"
            element={
              <ProtectedRoute>
                <CafeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim-reward"
            element={
              <ProtectedRoute>
                <ClaimRewardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAuthPage && isAuthenticated && (
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