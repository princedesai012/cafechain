import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from './store/AppContext'

// Layout Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import FirstTimeSetup from './pages/setup/FirstTimeSetup'
import Dashboard from './pages/dashboard/Dashboard'
import MetricsPage from './pages/dashboard/MetricsPage'
import RedemptionPage from './pages/dashboard/RedemptionPage'
import AdsEventsPage from './pages/dashboard/AdsEventsPage'
import ActivityLogPage from './pages/dashboard/ActivityLogPage'
import ProfileGalleryPage from './pages/dashboard/ProfileGalleryPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'

function App() {
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
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/setup" element={
            <ProtectedRoute requireSetup={true}>
              <FirstTimeSetup />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute requireSetup={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/metrics" element={
            <ProtectedRoute requireSetup={true}>
              <MetricsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/redemption" element={
            <ProtectedRoute requireSetup={true}>
              <RedemptionPage />
            </ProtectedRoute>
          } />
          
         
          
          <Route path="/dashboard/ads-events" element={
            <ProtectedRoute requireSetup={true}>
              <AdsEventsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/activity" element={
            <ProtectedRoute requireSetup={true}>
              <ActivityLogPage />
            </ProtectedRoute>
          } />
          
          
          
          <Route path="/dashboard/profile" element={
            <ProtectedRoute requireSetup={true}>
              <ProfileGalleryPage />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App