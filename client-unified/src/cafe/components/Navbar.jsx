import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";

function Navbar() {
  const { state } = useAppContext();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for blur and shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Path checks
  const isAuthOrSetup =
    location.pathname.startsWith("/auth/login") ||
    location.pathname.startsWith("/auth/register") ||
    location.pathname.startsWith("/setup");

  const isHome = location.pathname === "/" || location.pathname === "/cafe/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  // Reusable button styles
  const buttonClasses = (from, to) =>
    `px-5 py-2 rounded-full text-base font-semibold text-gray-700
     bg-gradient-to-r from-${from} to-${to} shadow-md
     hover:from-${from === "yellow-200" ? "yellow-300" : "amber-300"}
     hover:to-${to === "yellow-400" ? "yellow-500" : "amber-500"}
     hover:scale-105 hover:shadow-lg transition-all duration-300`;

  return (
    <nav
      className={`sticky top-0 z-10 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-white/80 shadow-lg" : "bg-white shadow-md"
      }`}
      style={{
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo and Name */}
          <Link to="/cafe" className="flex items-center group">
            <img
              src={logo}
              alt="CafeChain Logo"
              className="h-9 w-9 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="ml-3 text-2xl font-extrabold text-gray-900 tracking-wide group-hover:text-primary transition-colors duration-300">
              CafeChain
            </span>
          </Link>

          {/* Desktop Menu (only for home/dashboard) */}
          {!isAuthOrSetup && (
            <div className="hidden md:flex items-center">
              {isHome && (
                <Link to="/cafe/dashboard" className={buttonClasses("yellow-200", "yellow-400")}>
                  Dashboard
                </Link>
              )}
              {isDashboard && (
                <Link to="/cafe" className={`flex items-center ml-4 ${buttonClasses("amber-200", "amber-400")}`}>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m6-11v11a1 1 0 001 1h5m-7-1h-4" />
                  </svg>
                  Home
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthOrSetup && (
            <div className="md:hidden flex items-center">
              <button
                type="button"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-300"
              >
                <span className="sr-only">Toggle menu</span>
                {/* Hamburger Icon */}
                <svg
                  className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close Icon */}
                <svg
                  className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isAuthOrSetup && (
        <div
          id="mobile-menu"
          className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-white/90 backdrop-blur-md transition-all duration-300`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
            {isHome && (
              <Link
                to="/cafe/dashboard"
                className={buttonClasses("yellow-200", "yellow-400")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isDashboard && (
              <Link
                to="/cafe"
                className={`flex items-center ${buttonClasses("amber-200", "amber-400")}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m6-11v11a1 1 0 001 1h5m-7-1h-4" />
                </svg>
                Home
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
