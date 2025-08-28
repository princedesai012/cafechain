import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import Loader from "../components/Loader"; // Loader component imported

//==================================================================
// 1. Integrated AnimatedSubtitle for the Hero Section
//==================================================================
const AnimatedHeaderSubtitle = ({ lines }) => {
  const [lineIndex, setLineIndex] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, 5000); // Change line every 5 seconds
    return () => clearInterval(interval);
  }, [lines.length]);

  const lineVariants = {
    animate: { transition: { staggerChildren: 0.03 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  };

  const charVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 200 } },
    exit: { opacity: 0, y: -20, transition: { ease: 'easeInOut', duration: 0.3 } },
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
          {lines[lineIndex].split('').map((char, index) => (
            <motion.span key={index} variants={charVariants} style={{ display: 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};


//==================================================================
// 2. Main HomePage Component
//==================================================================
const HomePage = () => {
  // Added loading state
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Page will show loader for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Example data
  const points = 1800;
  const activities = [
    { name: "Cafe Soul", desc: "Visit reward", points: "+50", time: "2 hours ago" },
    { name: "Brew & Bean", desc: "Referral bonus", points: "+75", time: "1 day ago" },
    { name: "The Daily Grind", desc: "Check-in bonus", points: "+25", time: "3 days ago" },
  ];
  const cafes = [
    { id: 1, name: "The Cafe de meet", desc: "Downtown, City Center", img: "/assets/Images/cafe1-a.jpg", specialty: "Artisan Coffee" },
    { id: 2, name: "Cafe Soul", desc: "Arts District", img: "/assets/Images/cafe2-a.jpg", specialty: "Local Roasts" },
    { id: 3, name: "Brew & Bean", desc: "University Area", img: "/assets/Images/cafe3-a.jpg", specialty: "Fresh Pastries" },
  ];
  const workflowSteps = [
    { title: "Join & Check-In", desc: "Sign up and check in at partner cafes to start collecting CashPoints for every visit.", icon: "🏪" },
    { title: "Refer & Earn", desc: "Share your unique referral code. You and your friends earn bonus points when they make their first visit.", icon: "👥" },
    { title: "Redeem Rewards", desc: "Use your CashPoints to pay for coffee, food, and more at any participating cafe.", icon: "🎁" },
  ];
  const animatedMessages = ["Discover amazing cafes", "Earn rewards with every sip", "Your loyalty, rewarded."];
  
  // Animation variants for scroll-triggered sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Conditional rendering for the loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */} 
      <section className="relative py-24 bg-gradient-to-br from-[#4A3A2F] via-[#3B2D25] to-[#2A1F18] overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">CafeChain</h1>
          <AnimatedHeaderSubtitle lines={animatedMessages} />
          <div className="inline-block w-full max-w-md mx-auto mb-10">
            <div className="bg-white rounded-3xl shadow-2xl p-6 text-[#4a3a2f] relative overflow-hidden border border-gray-200/50">
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-gray-100/50 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gray-100/50 rounded-full"></div>
              <div className="relative flex items-center">
                <div className="relative w-24 h-24 bg-gray-100 flex items-center justify-center rounded-2xl mr-6 border border-gray-200"><span className="text-4xl">☕</span></div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-500">CashPoints Balance</p>
                  <h2 className="text-5xl font-extrabold mt-1 text-[#4a3a2f]">{points.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link to="/cafes" className="w-full bg-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg transform hover:scale-105" style={{ color: "#4A3A2F" }}>🔍 Find Cafes</Link>
            <Link to="/claim-reward" className="w-full bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-700 transition-all shadow-lg transform hover:scale-105">💰 Redeem Rewards</Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Actions */}
      <motion.section
        className="py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#4A3A2F" }}>What would you like to do today?</h2>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={cardContainerVariants}>
            <motion.div variants={cardVariants}>
              <Link to="/cafes" className="block bg-amber-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-amber-100 h-full"><div className="text-5xl mb-4">🔍</div><h3 className="font-bold text-lg mb-2" style={{ color: "#4A3A2F" }}>Find Cafes</h3><p className="text-gray-600 text-sm">Discover nearby partner locations</p></Link>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Link to="/cafes" className="block bg-green-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-green-100 h-full"><div className="text-5xl mb-4">❤️</div><h3 className="font-bold text-lg mb-2" style={{ color: "#4A3A2F" }}>Wishlist</h3><p className="text-gray-600 text-sm">Your Favourite cafe`s</p></Link>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Link to="/rewards" className="block bg-blue-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-blue-100 h-full"><div className="text-5xl mb-4">👥</div><h3 className="font-bold text-lg mb-2" style={{ color: "#4A3A2F" }}>Invite Friends</h3><p className="text-gray-600 text-sm">Share and earn bonus points</p></Link>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Link to="/claim-reward" className="block bg-purple-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-purple-100 h-full"><div className="text-5xl mb-4">🎁</div><h3 className="font-bold text-lg mb-2" style={{ color: "#4A3A2F" }}>Redeem</h3><p className="text-gray-600 text-sm">Use points for rewards</p></Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. How It Works */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#4A3A2F" }}>How CashPoints Works</h2><p className="text-xl text-gray-600 max-w-3xl mx-auto">Start earning rewards in three simple steps and transform your coffee routine into a rewarding experience</p></div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16" variants={cardContainerVariants}>
            {workflowSteps.map((step, idx) => (
              <motion.div key={idx} className="text-center relative" variants={cardVariants}>
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl shadow-xl relative" style={{ backgroundColor: "#4A3A2F" }}><div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">{idx + 1}</div><span className="text-white">{step.icon}</span></div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: "#4A3A2F" }}>{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 4. Featured Cafes */}
      <motion.section
        className="py-20 bg-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold mb-6" style={{ color: "#4A3A2F" }}>Featured Partner Cafes</h2><p className="text-xl text-gray-600">Discover amazing coffee experiences near you</p></div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" variants={cardContainerVariants}>
            {cafes.map((cafe) => (
              <motion.div key={cafe.id} className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" variants={cardVariants}>
                <div className="relative"><img src={cafe.img} alt={`${cafe.name} specialty: ${cafe.specialty}`} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" /></div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2" style={{ color: "#4A3A2F" }}>{cafe.name}</h3>
                  <p className="text-gray-600 mb-4">{cafe.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 px-3 py-1 rounded-full text-sm font-medium" style={{ color: "#4A3A2F" }}>{cafe.specialty}</span>
                    <Link to={`/cafes/${cafe.id}`} className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md" style={{ backgroundColor: "#4A3A2F" }}>Visit Now</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 5. Recent Activity */}
      <motion.section
        className="py-16 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-bold" style={{ color: "#4A3A2F" }}>Recent Activity</h2><Link to="/rewards" className="text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg" style={{ backgroundColor: "#4A3A2F" }}>View All Activity</Link></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border hover:shadow-lg transition-all hover:bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md" style={{ backgroundColor: "#4A3A2F" }}><span className="text-white">☕</span></div>
                    <div>
                      <p className="font-semibold text-lg" style={{ color: "#4A3A2F" }}>{activity.name}</p>
                      <p className="text-gray-600">{activity.desc}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right"><div className="font-bold text-green-600 text-xl bg-green-100 px-3 py-1 rounded-full">{activity.points}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Final Call to Action */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: "#4A3A2F" }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-amber-200 mb-12">Join CashPoints today and transform every coffee purchase into valuable rewards</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/cafes" className="bg-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-xl" style={{ color: "#4A3A2F" }}>🚀 Explore Cafes</Link>
            <Link to="/rewards" className="bg-amber-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-amber-700 transition-all shadow-xl">📱 Redeem Points</Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;