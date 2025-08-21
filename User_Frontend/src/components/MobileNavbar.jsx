import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="md:hidden w-full" style={{ background: "#eaf1f4" }}>
      <nav
        className="w-full bg-white px-4 py-3 flex items-center justify-between"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.07), 0 2px 0 0 #ece9e3"
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/assets/Images/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg" />
          <span className="text-xl font-bold text-dark-brown">CafeChain</span>
        </div>
        {isAuthenticated && (
          <>
            <div className="flex-1 flex items-center mx-3">
              <div className="flex items-center bg-[#f7f6f3] rounded-xl px-3 py-2 w-full">
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
                  className="bg-transparent outline-none text-base w-full"
                />
              </div>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center bg-[#d6ad7b] rounded-full text-white font-bold ml-3 overflow-hidden"
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
            >
              {user?.profilePic ? (
                <img src={user.profilePic} alt="avatar" className="w-10 h-10 object-cover" />
              ) : (
                (user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U')
              )}
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavbar;