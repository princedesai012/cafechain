import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, ArrowRight } from 'lucide-react';

// This component displays the user's profile information, stats, and quick links.
// It features a single-column layout for mobile and a two-column layout for desktop.
const ProfilePage = () => {
  // A mock user object is used for demonstration since the AuthContext is not available.
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    points: 1250,
    referredCount: 5,
  };
  // const { user, logout } = useAuth();

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page
    console.log('Navigate to edit profile');
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password page
    console.log('Navigate to change password');
  };

  const handleLogout = async () => {
    try {
      // const result = await logout();
      // if (result.success) {
      //   // TODO: Navigate to login page
      //   console.log('Logged out successfully');
      // }
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="pb-20 font-['Inter'] md:bg-gray-100 md:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .text-primary {
          color: #4A3A2F;
        }
        .text-accent {
          color: #6D4C41;
        }
        .bg-light-gray {
          background-color: #F8F8F8;
        }
      `}</style>
      
      {/* MOBILE LAYOUT */}
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-light-gray rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <h1 className="text-xl font-semibold text-primary mb-1">
                {user?.name}
              </h1>
              <p className="text-gray-600 mb-6">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Your Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-light-gray rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">
                  {user?.points}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              
              <div className="text-center p-4 bg-light-gray rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">
                  {user?.referredCount}
                </div>
                <div className="text-sm text-gray-600">Referrals</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Quick Links
            </h2>
            <div className="space-y-3">
              <a href="/history/visits" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Visit History</div>
                <div className="text-sm text-gray-600">View your cafe visits</div>
              </a>
              
              <a href="/history/points" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Points History</div>
                <div className="text-sm text-gray-600">Track your points activity</div>
              </a>
              
              <a href="/refer" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Refer Friends</div>
                <div className="text-sm text-gray-600">Earn bonus points</div>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="space-y-4">
              <button
                onClick={handleEditProfile}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Edit Profile</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={handleChangePassword}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Change pass</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Logout</span>
                <LogOut className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block md:max-w-7xl md:mx-auto md:p-8">
        <div className="space-y-8">
          {/* Main Profile Header for Desktop */}
          <div className="bg-[#4A3A2F] text-white rounded-2xl shadow-lg p-12 text-center">
            <h1 className="text-4xl font-bold">Your Profile</h1>
            <p className="text-lg opacity-80 mt-2">Manage your account details and preferences.</p>
          </div>
          
          {/* Main Content Area for Desktop - a centered container for the profile card and actions */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-light-gray rounded-full mb-6 flex items-center justify-center">
                  <div className="text-4xl font-bold text-gray-400">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-primary mb-1">
                  {user?.name}
                </h1>
                <p className="text-gray-600 mb-6">
                  {user?.email}
                </p>
                <div className="w-full space-y-4">
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-primary">Edit Profile</span>
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-primary">Change Password</span>
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between text-red-600"
                  >
                    <span className="font-medium">Logout</span>
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Stats and Quick Links */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Your Stats
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-light-gray rounded-xl">
                    <div className="text-4xl font-bold text-accent mb-2">
                      {user?.points}
                    </div>
                    <div className="text-base text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center p-6 bg-light-gray rounded-xl">
                    <div className="text-4xl font-bold text-accent mb-2">
                      {user?.referredCount}
                    </div>
                    <div className="text-base text-gray-600">Referrals</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Quick Links
                </h2>
                <div className="space-y-4">
                  <a href="/history/visits" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Visit History</div>
                      <div className="text-sm text-gray-600">View your cafe visits</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                  
                  <a href="/history/points" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Points History</div>
                      <div className="text-sm text-gray-600">Track your points activity</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                  
                  <a href="/refer" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Refer Friends</div>
                      <div className="text-sm text-gray-600">Earn bonus points</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
