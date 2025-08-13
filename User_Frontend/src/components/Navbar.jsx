import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Defines the navigation links and their corresponding paths.
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Cafes", path: "/cafes" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Rewards", path: "/rewards" },
];

const Navbar = () => {
  // `useLocation` hook from React Router to get the current URL path.
  const location = useLocation();
  // `useNavigate` hook for programmatic navigation.
  const navigate = useNavigate();

  return (
    // The main navigation bar container. It is only visible on medium screens and up (`md:flex`).
    // It uses Tailwind classes for layout, padding, and shadows.
    <nav
      className="hidden md:flex items-center justify-between bg-white px-8 py-4 shadow-lg"
      style={{
        // Custom shadow for a more refined, "floating" look.
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07), 0 2px 0 0 #ece9e3",
      }}
    >
      {/* Logo and name container */}
      <div className="flex items-center gap-3">
        {/* Placeholder for the logo image. In a real app, this would be a local asset. */}
        <img src="/assets/Images/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg" />
        {/* The brand name, styled with a bold, dark brown font. */}
        <span className="text-2xl font-bold text-dark-brown">CafeChain</span>
      </div>

      {/* Centered navigation links container. */}
      <div className="flex gap-8 mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            // This is the updated part. When the link is active, it gets a bold
            // `text-dark-brown` color. Inactive links get a lighter color and
            // a subtle hover effect to indicate they are clickable.
            className={`text-lg font-medium transition ${
              location.pathname === link.path 
                ? "text-dark-brown font-bold" // Active link is bold and dark
                : "text-gray-500 hover:text-dark-brown" // Inactive link is gray with a darker hover
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Search and profile container */}
      <div className="flex items-center gap-4">
        {/* Search bar input field */}
        <div className="flex items-center bg-[#f7f6f3] rounded-xl px-3 py-2">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search for cafes"
            className="bg-transparent outline-none text-base w-32"
          />
        </div>
        {/* Profile button */}
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#d6ad7b] rounded-full text-white font-bold ml-3"
          onClick={() => navigate("/profile")}
          aria-label="Go to profile"
        >
          D
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
