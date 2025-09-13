import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import LeaderboardWidget from '../components/LeaderboardWidget';
import { motion } from 'framer-motion';
import Loader from '../components/Loader'; // ✅ import Loader

const BACKGROUND = '#f9f7f4';
const CARD_BG = '#ede7e1';
const TEXT_DARK = '#2f2a26';
const ACCENT = '#6b4f3f';
const SUBTLE_TEXT = '#7d746d';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StyledCard = ({ children, className = '' }) => (
  <motion.div
    variants={itemFadeIn}
    className={`rounded-2xl shadow-xl transition-all duration-300 ${className}`}
    style={{
      background: `linear-gradient(145deg, ${CARD_BG}, ${BACKGROUND})`,
      border: `1px solid ${SUBTLE_TEXT}30`,
      boxShadow:
        '0 5px 20px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.5)',
    }}
  >
    {children}
  </motion.div>
);

function Home() {
  const { state } = useAppContext();
  const { isAuthenticated, setupCompleted, cafeInfo, announcements, partnerCafes } = state;

  const [isLoading, setIsLoading] = useState(true); // ✅ loader state

  // ✅ simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200); // 1.2s loader
    return () => clearTimeout(timer);
  }, []);

  // ✅ Show loader if still loading
  if (isLoading) return <Loader />;

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative p-8"
        style={{ background: BACKGROUND, fontFamily: '"Poppins", sans-serif', color: TEXT_DARK }}
      >
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto z-10"
        >
          <h1 className="text-8xl font-extralight leading-tight tracking-widest uppercase">
            Cafe<span className="font-bold text-9xl" style={{ color: ACCENT }}>Chain</span>
          </h1>
          <p
            className="mt-8 text-xl font-light max-w-xl mx-auto leading-relaxed"
            style={{ color: SUBTLE_TEXT }}
          >
            Elevating cafe loyalty and community. Connect your cafe to a network of premium hospitality.
          </p>
          <div className="mt-16 flex justify-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cafe/auth/register"
                className="px-10 py-4 text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl"
                style={{ background: ACCENT, color: 'white' }}
              >
                Join the network
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cafe/auth/login"
                className="px-10 py-4 text-lg font-medium rounded-full transition-all duration-300 border hover:text-white"
                style={{ borderColor: TEXT_DARK, color: TEXT_DARK }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = TEXT_DARK;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = TEXT_DARK;
                }}
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && !setupCompleted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative p-8"
        style={{ background: BACKGROUND, fontFamily: '"Poppins", sans-serif', color: TEXT_DARK }}
      >
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center max-w-xl mx-auto z-10"
        >
          <StyledCard className="p-16">
            <h1 className="text-4xl font-semibold mb-6">Complete Your Profile</h1>
            <p className="text-lg mb-10" style={{ color: SUBTLE_TEXT }}>
              Your journey starts here. Finish setting up your cafe profile to begin.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cafe/setup"
                className="inline-block px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-2xl"
                style={{ background: TEXT_DARK, color: 'white' }}
              >
                Go to Setup
              </Link>
            </motion.div>
          </StyledCard>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen p-8 lg:p-16"
      style={{ background: BACKGROUND, fontFamily: '"Poppins", sans-serif', color: TEXT_DARK }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeIn} className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-extralight tracking-wide drop-shadow-lg">
            Welcome back, <span className="font-bold">{cafeInfo?.name}</span>
          </h2>
          <p className="mt-3 text-lg font-light" style={{ color: SUBTLE_TEXT }}>
            Your hub for connection and growth within the CafeChain network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <StyledCard className="lg:col-span-2 p-10">
            <h3
              className="text-2xl font-semibold mb-6 pb-3 border-b"
              style={{ borderColor: SUBTLE_TEXT }}
            >
              Announcements
            </h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <motion.article
                    key={announcement.id}
                    variants={itemFadeIn}
                    className="p-5 rounded-lg transition-all duration-300"
                    style={{
                      background: BACKGROUND,
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold">{announcement.title}</h4>
                      <time className="text-sm font-light" style={{ color: SUBTLE_TEXT }}>
                        {new Date(announcement.date).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="mt-2 font-light" style={{ color: SUBTLE_TEXT }}>
                      {announcement.content}
                    </p>
                    {announcement.priority === 'high' && (
                      <span
                        className="inline-block mt-3 px-3 py-1 rounded-full text-white font-bold text-xs shadow-md tracking-wide"
                        style={{ background: '#9b2c2c' }}
                      >
                        Important
                      </span>
                    )}
                  </motion.article>
                ))
              ) : (
                <p className="italic" style={{ color: SUBTLE_TEXT }}>
                  No announcements at this time.
                </p>
              )}
            </div>
          </StyledCard>

          <StyledCard className="p-8 flex flex-col items-center justify-center">
            <LeaderboardWidget />
          </StyledCard>

          <StyledCard className="lg:col-span-3 p-10">
            <h3
              className="text-2xl font-semibold mb-6 pb-3 border-b"
              style={{ borderColor: SUBTLE_TEXT }}
            >
              Partner Cafes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerCafes.map((cafe) => (
                <motion.article
                  key={cafe.id}
                  variants={itemFadeIn}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    y: -5,
                  }}
                  className="rounded-xl p-6 flex items-center transition-transform duration-300 cursor-pointer"
                  style={{
                    background: BACKGROUND,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: `1px solid ${BACKGROUND}`,
                  }}
                >
                  <img
                    src={cafe.logo}
                    alt={`${cafe.name} logo`}
                    className="h-14 w-14 rounded-full object-cover shadow-lg"
                    style={{ border: `2px solid ${ACCENT}` }}
                  />
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold">{cafe.name}</h4>
                    <p className="text-sm mt-1" style={{ color: SUBTLE_TEXT }}>
                      {cafe.address}
                    </p>
                    <div
                      className="flex items-center mt-3 text-sm font-medium"
                      style={{ color: SUBTLE_TEXT }}
                    >
                      <span>
                        Rating: <strong style={{ color: ACCENT }}>{cafe.rating}</strong>/5
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span>
                        Joined: {new Date(cafe.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </StyledCard>
        </div>
      </div>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${ACCENT};
            border-radius: 8px;
            border: 2px solid ${BACKGROUND};
          }
        `}
      </style>
    </motion.div>
  );
}

export default Home;
