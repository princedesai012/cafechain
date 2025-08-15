// RewardsPage.jsx (Modified)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Share2, Plus } from 'lucide-react'; // Import Plus icon

// Mock data to replace the external assets
const rewards = {
  pointsEarned: 1250,
  xpPoints: 2850,
  referredCount: 5,
  referralCode: "ALEX27E3"
};

const extendedHistory = [
  {
    id: 1,
    cafeName: "cafeshop",
    points: 50,
    type: "earned",
    date: "2024-01-15",
    description: "Visit reward"
  },
  {
    id: 2,
    cafeName: "cafesoul",
    points: -100,
    type: "redeemed",
    date: "2024-01-14",
    description: "Coffee reward"
  },
  {
    id: 3,
    cafeName: "Brew & Bean",
    points: 75,
    type: "earned",
    date: "2024-01-13",
    description: "Referral bonus"
  },
  {
    id: 4,
    cafeName: "Urban Coffee",
    points: -50,
    type: "redeemed",
    date: "2024-01-12",
    description: "Pastry reward"
  },
  {
    id: 5,
    cafeName: "Cozy Corner",
    points: 120,
    type: "earned",
    date: "2024-01-11",
    description: "Visit reward"
  },
  {
    id: 6,
    cafeName: "The Cafe de meet",
    points: -25,
    type: "redeemed",
    date: "2024-01-10",
    description: "Discount reward"
  },
  {
    id: 7,
    cafeName: "Cafe Soul",
    points: 90,
    type: "earned",
    date: "2024-01-09",
    description: "Referral bonus"
  },
  {
    id: 8,
    cafeName: "Brew & Bean",
    points: -75,
    type: "redeemed",
    date: "2024-01-08",
    description: "Free coffee"
  }
];


const RewardsPage = () => {
  // const { user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [showAllHistory, setShowAllHistory] = useState(false);

  const handleShareReferral = () => {
    console.log('Share referral code:', rewards.referralCode);
  };

  const handleViewAllHistory = () => {
    setShowAllHistory(!showAllHistory);
  };

  // New handler for navigating to the Claim Rewards page
  const handleClaimReward = () => {
    navigate('/claim-reward');
  };

  const displayedHistory = showAllHistory ? extendedHistory : extendedHistory.slice(0, 2);

  return (
    <div className="pb-20 font-['Inter'] md:bg-gray-100 md:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .bg-accent { background-color: #6D4C41; }
        .text-accent { color: #6D4C41; }
        .bg-dark-brown { background-color: #4A3A2F; }
        .text-dark-brown { color: #4A3A2F; }
        .bg-light-gray { background-color: #F8F8F8; }
      `}</style>

      {/* MOBILE LAYOUT (Default) */}
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-6">
          {/* Points and Referrals Cards for Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">Points you earn</div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {rewards.pointsEarned}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">XP points</div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {rewards.xpPoints}
                </div>
                <div className="text-sm text-gray-600">XP</div>
              </div>
            </div>
            {/* The 'Referred' card is now the 'Claim Reward' button */}
            <div
              onClick={handleClaimReward}
              className="bg-white rounded-2xl shadow-soft p-6 text-center flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <div className="text-dark-brown">
                <div className="text-sm text-gray-600 mb-1">Referred</div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {rewards.referredCount}
                </div>
                <button className="text-sm font-semibold text-accent mt-2 hover:underline">
                  Claim Reward
                </button>
              </div>
            </div>
          </div>

          {/* Referral Code Section for Mobile */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-dark-brown mb-4">
              Your Referral Code
            </h2>
            <div className="flex items-center justify-between p-4 bg-light-gray rounded-xl">
              <div>
                <div className="text-2xl font-bold text-accent">
                  {rewards.referralCode}
                </div>
                <div className="text-sm text-gray-600">
                  Share with friends to earn bonus points
                </div>
              </div>
              <button
                onClick={handleShareReferral}
                className="p-3 bg-accent text-white rounded-xl hover:bg-dark-brown transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* History Section for Mobile */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-brown">
                History
              </h2>
              <button
                onClick={handleViewAllHistory}
                className="text-sm text-accent hover:text-dark-brown transition-colors flex items-center"
              >
                {showAllHistory ? 'view less' : 'view all'}
                <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className="space-y-3">
              {displayedHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-light-gray rounded-xl">
                  <div>
                    <div className="font-medium text-dark-brown">{item.cafeName}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className={`font-semibold ${
                    item.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block md:max-w-7xl md:mx-auto md:p-8">
        <div className="space-y-8">
          {/* Header Section for Desktop */}
          <div className="bg-dark-brown rounded-2xl p-8 text-white text-center shadow-lg">
            <h1 className="text-4xl font-bold mb-2">Your Rewards</h1>
            <p className="text-lg opacity-90">Track your points history and see how you’ve earned and redeemed.</p>
          </div>

          {/* Points and Referrals Cards for Desktop */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center">
              <div className="text-base text-gray-600 mb-2">Total Points Balance</div>
              <div className="text-5xl font-bold text-accent">
                {rewards.pointsEarned}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center">
              <div className="text-base text-gray-600 mb-2">Total XP</div>
              <div className="text-5xl font-bold text-accent">
                {rewards.xpPoints}
              </div>
            </div>
            {/* The 'Referred' card is now the 'Claim Reward' button */}
            <div
              onClick={handleClaimReward}
              className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <div className="text-base text-gray-600 mb-2">Total Referrals</div>
              <div className="text-5xl font-bold text-accent">
                {rewards.referredCount}
              </div>
              <button className="text-base font-semibold text-accent mt-4 hover:underline">
                Claim Reward
              </button>
            </div>
          </div>

          {/* Referral Code Section for Desktop */}
          <div className="bg-white rounded-2xl shadow-soft p-6 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-dark-brown mb-2">
                Your Unique Referral Code
              </h2>
              <div className="flex items-center space-x-4 p-4 bg-light-gray rounded-xl">
                <div className="text-3xl font-bold text-accent">
                  {rewards.referralCode}
                </div>
                <p className="text-sm text-gray-600">
                  Share this code with your friends to earn bonuses.
                </p>
              </div>
            </div>
            <button
              onClick={handleShareReferral}
              className="p-4 bg-accent text-white rounded-xl hover:bg-dark-brown transition-colors ml-6"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* History Section for Desktop */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-dark-brown">
                Redemption History
              </h2>
              <button
                onClick={handleViewAllHistory}
                className="text-base text-accent hover:text-dark-brown transition-colors flex items-center"
              >
                {showAllHistory ? 'View Less' : 'View All'}
                <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {/* History Table for Desktop */}
            <div className="space-y-4">
              {displayedHistory.map((item) => (
                <div key={item.id} className="grid grid-cols-4 items-center p-4 bg-light-gray rounded-xl text-dark-brown">
                  <div className="col-span-2">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-gray-600">{item.cafeName}</div>
                  </div>
                  <div className={`text-center font-semibold ${
                    item.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;