import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useState } from 'react';

function Navbar() {
  const { state } = useAppContext();
  const { isAuthenticated, setupCompleted, cafeInfo } = state;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo and Name (always links to home) */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-8" 
                src="/logo.svg" 
                alt="CafeChain Logo" 
              />
              <span className="ml-2 text-xl font-bold text-gray-900">CafeChain</span>
            </Link>
          </div>
          
          {/* Center: (empty, no page title) */}
          <div className="flex-1"></div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" 
              aria-controls="mobile-menu" 
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg 
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg 
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Right: Home icon (if on dashboard), Dashboard button (if on home), Auth Links or Cafe Name (desktop) */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                {/* Show Home icon if on dashboard */}
                {setupCompleted && location.pathname.startsWith('/dashboard') && (
                  <Link 
                    to="/" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary flex items-center"
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m6-11v11a1 1 0 001 1h5m-7-1h-4" />
                    </svg>
                    Home
                  </Link>
                )}
                {/* Show Dashboard button if on home */}
                {setupCompleted && location.pathname === '/' && (
                  <Link 
                    to="/dashboard" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                )}
                {cafeInfo && (
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {cafeInfo.name}
                  </span>
                )}
              </>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/auth/login" 
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="bg-primary text-white hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          {/* Home icon for dashboard page */}
          {isAuthenticated && setupCompleted && location.pathname.startsWith('/dashboard') && (
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m6-11v11a1 1 0 001 1h5m-7-1h-4" />
              </svg>
              Home
            </Link>
          )}
          {/* Dashboard button for home page */}
          {isAuthenticated && setupCompleted && location.pathname === '/' && (
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <>
              {cafeInfo && (
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  {cafeInfo.name}
                </div>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/auth/register" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;