import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfile, getRewardsHistory } from "../api/api";
import Loader from "../components/Loader";
import CafeCard from "../components/CafeCard";
import axios from "axios";

// ============================================================
// Animated Subtitle for Hero
// ============================================================
const AnimatedHeaderSubtitle = ({ lines }) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setLineIndex((prev) => (prev + 1) % lines.length),
      5000
    );
    return () => clearInterval(interval);
  }, [lines.length]);

  const lineVariants = {
    animate: { transition: { staggerChildren: 0.03 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  };

  const charVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <div className="text-2xl md:text-3xl font-medium text-amber-200 mb-12 min-h-[3rem]">
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          variants={lineVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {lines[lineIndex].split("").map((char, idx) => (
            <motion.span
              key={idx}
              variants={charVariants}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// HomePage Component
// ============================================================
const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [points, setPoints] = useState(0);
  const [activities, setActivities] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Profile (XP / points)
        const profileRes = await getProfile(user.phone);
        if (profileRes?.xp !== undefined) {
          setPoints(profileRes.xp);
        }

        // ✅ Rewards history (Recent Activity)
        const rewardsRes = await getRewardsHistory(user.phone);
        if (Array.isArray(rewardsRes)) {
          const formatted = rewardsRes.slice(0, 4).map((activity) => ({
            name: activity.cafeName || "Unknown Cafe",
            desc: activity.rewardType || "Reward",
            points: `+${activity.xp || 0}`,
            time: new Date(activity.date).toLocaleDateString(),
          }));
          setActivities(formatted);
        }

        // ✅ Fetch 3 random cafes
        const cafeRes = await axios.get("http://localhost:5000/api/cafes");
        if (Array.isArray(cafeRes.data)) {
          const random = cafeRes.data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setCafes(random);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const workflowSteps = [
    { title: "Join & Check-In", desc: "Sign up and check in at partner cafes to start collecting CashPoints.", icon: "🏪" },
    { title: "Refer & Earn", desc: "Share your referral code. You and your friends earn bonus points.", icon: "👥" },
    { title: "Redeem Rewards", desc: "Use your CashPoints to pay for coffee, food, and more.", icon: "🎁" },
  ];

  const animatedMessages = [
    "Discover amazing cafes",
    "Earn rewards with every sip",
    "Your loyalty, rewarded.",
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      {/* === Hero Section === */}
      <section className="relative py-24 bg-gradient-to-br from-[#4A3A2F] via-[#3B2D25] to-[#2A1F18]">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">CafeChain</h1>
          <AnimatedHeaderSubtitle lines={animatedMessages} />

          <div className="inline-block max-w-md mx-auto mb-10">
            <div className="bg-white rounded-3xl shadow-2xl p-6 text-[#4a3a2f]">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-2xl mr-6">
                  <span className="text-4xl">☕</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your XP</p>
                  <h2 className="text-5xl font-extrabold">{points.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link to="/cafes" className="bg-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 shadow-lg">🔍 Find Cafes</Link>
            <Link to="/claim-reward" className="bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-700 shadow-lg">💰 Redeem Rewards</Link>
          </div>
        </div>
      </section>

      {/* === Quick Actions === */}
      <motion.section className="py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What would you like to do today?</h2>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={cardContainerVariants}>
            {[
              { icon: "🔍", title: "Find Cafes", link: "/cafes" },
              { icon: "❤️", title: "Wishlist", link: "/cafes" },
              { icon: "👥", title: "Invite Friends", link: "/rewards#referral-section" },
              { icon: "🎁", title: "Redeem", link: "/claim-reward" },
            ].map((action, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <Link to={action.link} className="block bg-amber-50 rounded-2xl p-8 text-center shadow-lg hover:scale-105">
                  <div className="text-5xl mb-2">{action.icon}</div>
                  <h3 className="font-bold">{action.title}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* === How It Works === */}
      <motion.section className="py-20 bg-gray-50" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How CashPoints Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Start earning rewards in three simple steps</p>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12" variants={cardContainerVariants}>
            {workflowSteps.map((step, idx) => (
              <motion.div key={idx} className="text-center" variants={cardVariants}>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl shadow-xl" style={{ backgroundColor: "#4A3A2F" }}>
                  <span className="text-white">{step.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* === Featured Cafes (fetched from backend) === */}
      <motion.section className="py-20 bg-white" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Featured Partner Cafes</h2>
            <p className="text-xl text-gray-600">Discover amazing coffee experiences near you</p>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={cardContainerVariants}>
            {cafes.length > 0 ? (
              cafes.map((cafe) => (
                <motion.div key={cafe._id} variants={cardVariants}>
                  <CafeCard cafe={cafe} onClick={() => (window.location.href = `/cafes/${cafe._id}`)} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-3">No cafes available</p>
            )}
          </motion.div>
          <div className="text-center mt-10">
            <Link to="/cafes" className="px-8 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 shadow-lg">See All Cafes</Link>
          </div>
        </div>
      </motion.section>

      {/* === Recent Activity === */}
      <motion.section className="py-16 bg-gray-50" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recent Activity</h2>
              <Link to="/rewards#recent-activity" className="px-6 py-3 bg-[#4A3A2F] text-white rounded-full font-semibold shadow-lg">View All Activity</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border hover:shadow-lg transition-all hover:bg-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md" style={{ backgroundColor: "#4A3A2F" }}>
                        <span className="text-white">☕</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{activity.name}</p>
                        <p className="text-gray-600">{activity.desc}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-xl bg-green-100 px-3 py-1 rounded-full">{activity.points}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-2">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* === Final Call to Action === */}
      <motion.section className="py-20" style={{ backgroundColor: "#4A3A2F" }} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-amber-200 mb-12">Join CashPoints today and transform every coffee purchase into valuable rewards</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/cafes" className="bg-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 shadow-xl text-[#4A3A2F]">🚀 Explore Cafes</Link>
            <Link to="/rewards" className="bg-amber-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-amber-700 shadow-xl">📱 Redeem Points</Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
