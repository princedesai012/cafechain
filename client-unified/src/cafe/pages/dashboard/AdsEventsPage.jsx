import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../store/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getActiveEvents } from '../../api/api';

// Style constants
const PRIMARY = '#4a3a2f';
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

  // Get the 'user' object and the context's loading status
  const { user, isLoading: isContextLoading } = state;

  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getActiveEvents();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // This filtering logic will now work correctly
  useEffect(() => {
    const myCafeId = user?._id; 

    if (filter === 'my_cafe') {
      if (myCafeId) {
        const myEvents = allEvents.filter(event => event.cafe._id === myCafeId);
        setFilteredEvents(myEvents);
      } else {
        setFilteredEvents([]);
      }
    } else {
      setFilteredEvents(allEvents);
    }
  }, [filter, allEvents, user]);

  // Wait for BOTH the context to load AND the events to be fetched
  if (isContextLoading || isLoading) return <Loader />;

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
        <a
          href="https://wa.me/917575825782?text=hiii%20heloo%20cafechain"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: PRIMARY, color: 'white' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-5 h-5"
          />
          Book Your Ads & Events
        </a>
      </header>

      <div className="container mx-auto px-4 md:px-12 py-6">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-4xl md:text-6xl font-extrabold mb-8 tracking-wide"
          style={{ color: PRIMARY, textShadow: `0 6px 24px rgba(74, 58, 47, 0.2)` }}
        >
          Ads & Events
        </motion.h1>

        {/* Filter buttons */}
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  className="bg-white rounded-3xl border-2 shadow-xl overflow-hidden flex flex-col cursor-pointer"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  custom={index}
                  style={{ borderColor: SUBTLE_ACCENT, backgroundColor: 'white' }}
                >
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: PRIMARY }}>
                      {event.name}
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 my-3 flex-grow">{event.description}</p>
                    
                    <div className="mt-auto space-y-2 text-sm text-gray-600 border-t pt-4">
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" style={{ color: SUBTLE_ACCENT }} />
                        <span>{event.cafe.name}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p 
                initial={{opacity: 0}} 
                animate={{opacity: 1}}
                className="text-center text-gray-500 col-span-full text-lg"
              >
                No events found for this filter.
              </motion.p>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdsEventsPage;