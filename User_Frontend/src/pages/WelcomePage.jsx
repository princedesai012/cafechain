import React from 'react';
import { Coffee, Star, Trophy, Users } from 'lucide-react';
// import logo from '../assets/Images/logo.jpg'; // Assuming logo is a static asset

const WelcomePage = () => {
  // Mock logo for the project.
  const logo = "./assets/Images/logo.jpg"; // Replace with actual path to logo image

  return (
    // Main page container with a responsive background color.
    <div className="min-h-screen bg-warm-gray font-['Inter']">
      {/* Custom styles for colors and shadows. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .bg-warm-gray { background-color: #F8F6F1; }
        .bg-accent { background-color: #6D4C41; }
        .text-dark-brown { color: #4A3A2F; }
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .border-light-cream { border-color: #ECE9E3; }
      `}</style>

      {/* MOBILE VIEW - Visible only on small screens. */}
      <div className="flex flex-col md:hidden">
        {/* Header with logo. */}
        <div className="flex justify-center items-center pt-16 pb-8">
          <img src={logo} alt="CafeChain" className="w-20 h-20 rounded-2xl shadow-soft" />
        </div>

        {/* Welcome message and features section. */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-brown mb-4">Welcome to CafeChain</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Discover amazing cafes, earn rewards, and climb the leaderboard with every visit!
            </p>
          </div>

          {/* Features list with icons. */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center bg-white rounded-xl p-4 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-brown">Discover Cafes</h3>
                <p className="text-gray-600 text-sm">Find the best cafes near you</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-xl p-4 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-brown">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">Get points with every visit</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-xl p-4 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-brown">Compete</h3>
                <p className="text-gray-600 text-sm">Climb the leaderboard</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-xl p-4 shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-brown">Refer Friends</h3>
                <p className="text-gray-600 text-sm">Get bonus points for referrals</p>
              </div>
            </div>
          </div>

          {/* Action buttons for mobile. */}
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-dark-brown transition-colors shadow-soft"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      
      {/* DESKTOP VIEW - Hidden on smaller screens. */}
      <div className="hidden md:flex flex-col items-center justify-center p-12">
        <div className="md:max-w-4xl md:mx-auto space-y-16 text-center">
          {/* Main welcome message for desktop. */}
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-6">
              <img src={logo} alt="CafeChain" className="w-24 h-24 rounded-2xl shadow-soft" />
              <div className="space-y-2">
                <h1 className="text-5xl font-extrabold text-dark-brown">Welcome to CafeChain</h1>
                <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto">
                  Discover amazing cafes, earn rewards, and climb the leaderboard with every visit!
                </p>
              </div>
            </div>
          </div>

          {/* Features in a horizontal grid for desktop. */}
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-soft transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-dark-brown text-lg">Discover Cafes</h3>
              <p className="text-gray-600 text-sm mt-1">Find the best cafes near you</p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-soft transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-dark-brown text-lg">Earn Rewards</h3>
              <p className="text-gray-600 text-sm mt-1">Get points with every visit</p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-soft transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-dark-brown text-lg">Compete</h3>
              <p className="text-gray-600 text-sm mt-1">Climb the leaderboard</p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-soft transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-dark-brown text-lg">Refer Friends</h3>
              <p className="text-gray-600 text-sm mt-1">Get bonus points for referrals</p>
            </div>
          </div>

          {/* Action buttons for desktop. */}
          <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-6">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-dark-brown transition-colors shadow-soft"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
