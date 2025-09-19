// Cafe App.jsx - Works with nested routing

import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext, AppProvider } from './store/AppContext'

// Layout Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/VerifyOTP'
import PendingApproval from './pages/PendingApproval'

// import FirstTimeSetup from './pages/setup/FirstTimeSetup'
import Dashboard from './pages/dashboard/Dashboard'
import MetricsPage from './pages/dashboard/MetricsPage'
import RedemptionPage from './pages/dashboard/RedemptionPage'
import AdsEventsPage from './pages/dashboard/AdsEventsPage'
import ActivityLogPage from './pages/dashboard/ActivityLogPage'
import ProfileGalleryPage from './pages/dashboard/ProfileGalleryPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

const CafeLayout = () => {
  const { state, dispatch } = useAppContext()
  const { isLoading } = state

  useEffect(() => {
    // Initialize app by loading data from localStorage
    dispatch({ type: 'INIT_APP' })
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/auth/ForgotPasswordPage" element={<ForgotPasswordPage />}></Route>
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute requireActiveCafe={true}><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireActiveCafe={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/metrics" element={<ProtectedRoute requireActiveCafe={true}><MetricsPage /></ProtectedRoute>} />
          <Route path="/dashboard/redemption" element={<ProtectedRoute requireActiveCafe={true}><RedemptionPage /></ProtectedRoute>} />
          <Route path="/dashboard/ads-events" element={<ProtectedRoute requireActiveCafe={true}><AdsEventsPage /></ProtectedRoute>} />
          <Route path="/dashboard/activity" element={<ProtectedRoute requireActiveCafe={true}><ActivityLogPage /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute requireActiveCafe={true}><ProfileGalleryPage /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <CafeLayout />
    </AppProvider>
  )
}

export default App;