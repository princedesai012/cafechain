import { Navigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';

/**
 * ProtectedRoute component to handle authentication and setup requirements
 * @param {Object} props
 * @param {boolean} props.requireSetup - If true, requires setup to be completed
 * @param {React.ReactNode} props.children - Child components to render if conditions are met
 */
function ProtectedRoute({ children, requireSetup = true }) {
  const { state } = useAppContext();
  const { isAuthenticated, setupCompleted } = state;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If setup is required but not completed, redirect to setup
  if (requireSetup && !setupCompleted) {
    return <Navigate to="/setup" replace />;
  }

  // If setup is completed but we're on the setup page, redirect to home
  if (!requireSetup && setupCompleted) {
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the children
  return children;
}

export default ProtectedRoute;