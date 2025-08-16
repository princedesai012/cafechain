import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import WelcomePage from './pages/WelcomePage';
import ClaimRewardPage from './pages/ClaimRewardPage'; // <-- Add this import

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
  const [activePage, setActivePage] = useState('home');
  const [currentAuthPage, setCurrentAuthPage] = useState('login');
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActivePage('home');
    else if (path.startsWith('/cafes')) setActivePage('cafes');
    else if (path === '/rewards') setActivePage('rewards');
    else if (path === '/leaderboard') setActivePage('leaderboard');
    else if (path === '/profile') setActivePage('profile');
  }, [location]);

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const handleAuthNavigation = (page) => {
    setCurrentAuthPage(page);
    if (page === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (page === 'signup') {
      window.history.pushState({}, '', '/signup');
    }
  };

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/welcome';

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
        <div className="hidden md:block">
          <Navbar onSearch={handleSearch} />
        </div>
      )}
      {!isAuthPage && (
        <div className="md:hidden">
          <MobileNavbar />
        </div>
      )}
      <main className={!isAuthPage ? 'pt-0' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cafes" element={<CafesPage />} />
          <Route path="/cafes/:id" element={<CafeDetailPage />} />
          <Route path="/claim-reward" element={<ClaimRewardPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage onNavigate={handleAuthNavigation} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleAuthNavigation} />} />
        </Routes>
      </main>
      {!isAuthPage && (
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