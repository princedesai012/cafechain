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
import EmailVerificationPage from './pages/EmailVerificationPage'; // <-- NEW

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
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
    else if (path === '/cafes') setActivePage('cafes');
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
    location.pathname === '/welcome' ||
    location.pathname === '/email-verification'; // <-- NEW

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
          {/* Redirect / to /home if authenticated, otherwise to /welcome */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/welcome" replace />
          } />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cafes" element={<ProtectedRoute><CafesPage /></ProtectedRoute>} />
          <Route path="/cafes/:id" element={<ProtectedRoute><CafeDetailPage /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Public Routes */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage onNavigate={handleAuthNavigation} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleAuthNavigation} />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} /> {/* <-- NEW */}
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
