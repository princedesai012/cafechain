import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../store/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, Coffee, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader'; // ✅ Import Loader

const PRIMARY = '#4a3a2f';
const GOLD = '#d4af37';
const LIGHT_BG = '#fcf8f3';
const SUBTLE_ACCENT = '#7a6a5e';

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.8 } },
  hover: { scale: 1.05, boxShadow: `0 20px 60px rgba(74, 58, 47, 0.25)` },
};

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function AdsEventsPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); // ✅ Loader state

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // 1s simulated loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />; // ✅ Show loader while loading

  const events = state?.events && state?.events.length > 0 ? state.events : [
    {
      id: 1,
      type: 'cafe',
      title: 'Coffee Tasting Night',
      description: 'Sample different coffee blends from around the world in an engaging evening.',
      date: new Date().toISOString(),
      time: '6:00 PM',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      location: 'Main Branch'
    },
    {
      id: 2,
      type: 'live',
      title: 'Live Acoustic Music',
      description: 'Enjoy soulful acoustic music performances by local artists while sipping coffee.',
      date: new Date().toISOString(),
      time: '8:00 PM',
      image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      location: 'Downtown Cafe'
    },
    {
      id: 3,
      type: 'promo',
      title: 'Seasonal Promotion',
      description: 'A special offer on our new pumpkin spice latte and seasonal treats.',
      date: new Date().toISOString(),
      time: 'All Day',
      image: 'https://images.unsplash.com/photo-1542361109-d2b4f6e5f32a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      location: 'All Locations'
    },
    {
      id: 4,
      type: 'workshop',
      title: 'Barista Skills Workshop',
      description: 'Learn the art of latte art and espresso making from our expert baristas.',
      date: new Date().toISOString(),
      time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1579978759959-b1d5d36e2f49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      location: 'Headquarters Cafe'
    }
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: LIGHT_BG }}>
      <header className="p-6 md:p-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-lg font-semibold transition-transform duration-300 hover:scale-105"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
      </header>

      <div className="container mx-auto px-4 md:px-12 py-6">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-4xl md:text-6xl font-extrabold mb-14 tracking-wide"
          style={{ color: PRIMARY, textShadow: `0 6px 24px rgba(74, 58, 47, 0.2)` }}
        >
          Ads & Events
        </motion.h1>

        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-3xl border-2 shadow-xl overflow-hidden flex flex-col cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                custom={index}
                style={{ borderColor: SUBTLE_ACCENT, backgroundColor: 'white' }}
              >
                {event.image && (
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="h-56 w-full object-cover rounded-t-3xl"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: PRIMARY }}>
                      {event.title}
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: GOLD, color: 'white' }}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 mb-4">{event.description}</p>
                  
                  <div className="mt-auto space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2"
          style={{ borderColor: SUBTLE_ACCENT, backgroundColor: '#f5f0eb' }}
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: PRIMARY }}>
            Event Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700">
            <div>
              <h3 className="font-semibold text-xl mb-3 flex items-center" style={{ color: PRIMARY }}>
                <Coffee size={24} className="mr-2" /> Effective Event Types
              </h3>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>Coffee tasting sessions</li>
                <li>Barista workshops</li>
                <li>Live music nights</li>
                <li>Book clubs & discussion groups</li>
                <li>Seasonal promotions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-3 flex items-center" style={{ color: PRIMARY }}>
                <Volume2 size={24} className="mr-2" /> Promotion Tips
              </h3>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>Share events 2-3 weeks in advance</li>
                <li>Use WhatsApp and social media</li>
                <li>Offer early-bird incentives</li>
                <li>Partner with local businesses</li>
                <li>Follow up with attendees after events</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdsEventsPage;
