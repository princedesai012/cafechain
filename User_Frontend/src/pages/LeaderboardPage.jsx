import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import { getLeaderboard } from "../api/api";
import Loader from "../components/Loader";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = { name: 'You', xp: 8750, rank: 5, profilePic: 'https://i.pravatar.cc/150?u=currentuser' };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [data] = await Promise.all([
          getLeaderboard(),
          new Promise(resolve => setTimeout(resolve, 500))
        ]);

        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          avatar: user.name
            ? user.name.split(" ").map((n) => n[0]).join("")
            : "",
        }));
        setLeaderboardData(rankedData);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  // --- Helper Functions ---
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-glow animate-pulse" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-500 drop-shadow-glow animate-pulse" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600 drop-shadow-glow animate-pulse" />;
      default:
        return <span className="text-lg font-bold text-gray-500">{rank}</span>;
    }
  };

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-b from-yellow-300 to-yellow-500 text-gray-900";
      case 2:
        return "bg-gradient-to-b from-gray-200 to-gray-400 text-gray-900";
      case 3:
        return "bg-gradient-to-b from-amber-300 to-amber-500 text-gray-900";
      default:
        return "bg-white shadow-sm text-gray-800";
    }
  };

  const renderAvatar = (user, size = "w-full h-full") => {
    if (user.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={user.name}
          className={`${size} object-cover rounded-full border-2 border-gray-300 shadow-md`}
        />
      );
    }
    return (
      <div className={`${size} flex items-center justify-center font-bold text-gray-700 bg-gray-200 rounded-full`}>
        {user.avatar}
      </div>
    );
  };

  // --- RENDER STATES ---
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ffffff]">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // --- DATA SPLIT ---
  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push(topThree[1]);
  if (topThree[0]) podiumOrder.push(topThree[0]);
  if (topThree[2]) podiumOrder.push(topThree[2]);

  return (
    // =================================================================
    // FIX: Added pb-24 to create space for the bottom navigation bar
    // =================================================================
    <div className="min-h-screen bg-[#ffffff] text-gray-900 font-['Inter'] p-6 md:p-10 pb-24 overflow-hidden">
      <style>{`.drop-shadow-glow { filter: drop-shadow(0 0 8px rgba(0,0,0,0.1)); }`}</style>

      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-glow">Leaderboard</h1>
        <p className="text-gray-600 text-lg">Top 15 Coffee Enthusiasts</p>
      </motion.div>

      {/* Desktop Podium */}
      {podiumOrder.length > 0 && (
        <motion.div
          className="hidden md:flex justify-center items-end space-x-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {podiumOrder.map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center justify-center rounded-2xl shadow-xl p-6 md:p-8 ${getPodiumColor(user.rank)} relative overflow-hidden w-48 md:w-60`}
              style={{ transform: user.rank === 1 ? "translateY(-30px)" : "translateY(-15px)" }}
            >
              <div className="absolute top-2 right-2">{getRankIcon(user.rank)}</div>
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner">{renderAvatar(user)}</div>
              <h2 className="font-bold text-xl mb-1 truncate max-w-[150px] text-center">{user.name}</h2>
              <p className="text-2xl font-extrabold drop-shadow-glow">{user.xp.toLocaleString()}</p>
              <p className="text-sm opacity-80">XP</p>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Mobile Podium */}
      {topThree.length > 0 && (
        <motion.div
          className="flex md:hidden justify-between items-end mb-8 relative w-full max-w-sm mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {topThree.map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.15, rotate: 2 }}
              className="flex flex-col items-center w-1/3 relative"
            >
              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(0,0,0,0.1)", "0 0 20px rgba(0,0,0,0.2)", "0 0 0px rgba(0,0,0,0.1)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 border-2 border-gray-300 ${getPodiumColor(user.rank)}`}
              >
                {renderAvatar(user, "w-full h-full")}
              </motion.div>
              <div className="text-sm font-semibold truncate max-w-[90px] text-center text-gray-800">{user.name}</div>
              <div className="text-xs text-gray-500">{user.xp.toLocaleString()} XP</div>
              <div className="mt-1">{getRankIcon(user.rank)}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Your Rank Card */}
      <motion.div
        className="bg-gray-100 p-4 md:p-5 rounded-2xl border border-gray-200 shadow-lg mb-8 text-gray-800"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
              <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold">{currentUser.name}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{currentUser.xp.toLocaleString()}</div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
        </div>
      </motion.div>

      {/* Remaining Users */}
      <motion.div
        className="bg-gray-100 rounded-2xl shadow-lg p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="space-y-4">
          {remainingUsers.map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-500 w-8">{user.rank}</div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                    {renderAvatar(user, "w-10 h-10")}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{user.xp.toLocaleString()}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;