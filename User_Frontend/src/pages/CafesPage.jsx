import React, { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CafeCard from '../components/CafeCard';
import Loader from '../components/Loader'; // 1. Loader component imported

//==================================================================
// 1. Integrated AnimatedSubtitle Component
//==================================================================
const AnimatedSubtitle = ({ lines }) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, 5000); 
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
    <div className="h-14 md:h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto"
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
// 2. Main CafesPage Component
//==================================================================
const cafes = [
  { id: 1, name: "The Grind House", location: "123 Coffee St, Brewville", features: ["Free WiFi", "Good for work", "Artisanal"] },
  { id: 2, name: "Cafe Soul", location: "456 Bean Ave, Latte City", features: ["Live music", "Cozy atmosphere"] },
  { id: 3, name: "Brew & Bean", location: "789 Espresso Rd, Roast Town", features: ["Outdoor seating", "Pet-friendly"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const CafesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filteredCafes, setFilteredCafes] = useState(cafes);
  const [loading, setLoading] = useState(true); // 2. Added loading state
  const navigate = useNavigate();

  // 3. Added useEffect to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500); // Load for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const subtitleLines = [
    "Explore our curated collection of unique cafes.",
    "Your next favorite spot is just a scroll away."
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'near') {
      setFilteredCafes(cafes.slice(0, 2));
    } else {
      setFilteredCafes(cafes);
    }
  };

  const handleCafeClick = (cafe) => {
    navigate(`/cafes/${cafe.id}`);
  };

  // 4. Conditional rendering for the loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pb-24 text-[#4a3a2f]">
      <div className="w-full max-w-7xl px-4 py-6">
        {/* Unified Header */}
        <motion.div
          className="text-center my-8 md:my-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Find Your Perfect Coffee Moment
          </h1>
          <AnimatedSubtitle lines={subtitleLines} />
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center w-full mb-8 md:mb-12">
          <div className="relative flex bg-gray-100 rounded-full p-1 w-full max-w-xs">
            <button onClick={() => handleTabChange('all')} className="relative flex-1 py-3 px-4 rounded-full text-sm md:text-base font-medium z-10 transition-colors">
              All Cafes
            </button>
            <button onClick={() => handleTabChange('near')} className="relative flex-1 py-3 px-4 rounded-full text-sm md:text-base font-medium z-10 transition-colors">
              Favourite
            </button>
            <motion.div
              className="absolute top-1 bottom-1 h-auto bg-white rounded-full shadow-md"
              initial={false}
              animate={{
                left: activeTab === 'all' ? '4px' : '50%',
                right: activeTab === 'near' ? '4px' : '50%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Cafe Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredCafes.length > 0 ? (
            <motion.div
              key={activeTab}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCafes.map((cafe) => (
                <motion.div key={cafe.id} variants={itemVariants}>
                  <CafeCard
                    cafe={cafe}
                    onClick={() => handleCafeClick(cafe)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-cafes"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Coffee className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-[#4a3a2f] mb-2">
                No Cafes Found
              </h3>
              <p className="text-gray-500">
                {activeTab === 'near'
                  ? 'We couldn\'t find any cafes nearby. Try expanding your search!'
                  : 'Check back later for new and exciting cafes.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CafesPage;