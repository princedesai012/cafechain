// pages/LeaderboardPage.jsx (Updated)

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { getLeaderboard } from '../api/api'; // Import the new API function

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        // The API should return an array of users sorted by XP.
        // We can add a rank property to each user object here.
        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          avatar: user.name ? user.name.split(' ').map(n => n[0]).join('') : '',
        }));
        setLeaderboardData(rankedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // The empty dependency array ensures this runs only once on mount.

  // Gets the appropriate rank icon for the top 3 users.
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">{rank}</span>;
    }
  };

  // Applies a gradient background for the top 3 users.
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700";
      default:
        return "bg-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }
  
  // If no data is returned.
  if (leaderboardData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">No leaderboard data available.</p>
      </div>
    );
  }

  // Splits the data for the two-column desktop layout.
  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  return (
    // Main responsive container with a centered layout.
    <div className="pb-20 md:pb-0 md:bg-gray-50 md:p-8 font-['Inter']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .text-dark-brown {
          color: #4A3A2F;
        }
        .bg-accent {
          background-color: #6D4C41;
        }
      `}</style>
      
      <div className="px-4 py-6 space-y-6 md:max-w-7xl md:mx-auto md:space-y-8 md:px-8">
        
        {/* Centered header for all screen sizes. */}
        <div className="bg-gradient-to-br from-accent to-dark-brown rounded-2xl p-6 text-white text-center md:p-10 md:max-w-4xl md:mx-auto md:w-full shadow-lg">
          <h1 className="text-2xl font-bold mb-2 md:text-4xl">Leaderboard</h1>
          <p className="text-sm opacity-90 md:text-lg">Top 15 Coffee Enthusiasts</p>
        </div>

        {/* Desktop-only layout: a two-column flex container. */}
        <div className="hidden md:flex md:space-x-8">
          
          {/* Left column for the top 3 users. */}
          <div className="w-1/3 space-y-6">
            {topThree.map((user) => (
              <div
                key={user.rank} // Using rank as key is better as it's unique and stable
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border-4 shadow-xl transform transition-transform duration-300 hover:scale-105 ${getRankColor(user.rank)} text-white`}
              >
                <div className="mb-4">
                  {getRankIcon(user.rank)}
                </div>
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center font-bold text-3xl mb-4">
                  {user.avatar}
                </div>
                <div className="text-2xl font-semibold mb-1">{user.name}</div>
                <div className="text-4xl font-extrabold mb-1">{user.xp.toLocaleString()}</div>
                <div className="text-sm opacity-80">XP Points</div>
              </div>
            ))}
          </div>

          {/* Right column for remaining users (ranks 4-15). */}
          <div className="w-2/3 bg-white rounded-2xl shadow-soft p-6">
            <div className="space-y-4">
              {remainingUsers.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 text-dark-brown transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-md md:px-6 md:py-5`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
                      <span className="text-lg font-bold text-gray-400">{user.rank}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm md:w-12 md:h-12 md:text-base">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold md:text-lg">{user.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold md:text-2xl">{user.xp.toLocaleString()}</div>
                    <div className={`text-xs text-gray-600 md:text-sm`}>
                      XP Points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile-only layout: a single list. */}
        <div className="block md:hidden">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-transform duration-200 ease-in-out hover:scale-[1.01] ${getRankColor(user.rank)} ${user.rank <= 3 ? 'text-white' : 'text-dark-brown'}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{user.xp.toLocaleString()}</div>
                    <div className={`text-xs ${user.rank <= 3 ? 'opacity-80' : 'text-gray-600'}`}>
                      XP Points
                    </div>
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

export default LeaderboardPage;