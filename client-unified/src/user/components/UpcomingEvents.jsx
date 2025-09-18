// // src/components/UpcomingEvents.jsx

// import React, { useState, useEffect } from 'react';
// import EventCard from './EventCard';
// import { getActiveEvents } from '../api/api';
// import { motion } from 'framer-motion';
// import { Calendar } from 'lucide-react';

// const UpcomingEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const activeEvents = await getActiveEvents();
//         if (activeEvents.length > 0) {
//           // Duplicate the array for a seamless scrolling loop
//           setEvents([...activeEvents, ...activeEvents]);
//         }
//       } catch (error) {
//         console.error("Could not fetch upcoming events.", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading || events.length === 0) {
//     return null; // Don't render anything if loading or no events
//   }

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   return (
//     <motion.section
//       className="py-16 bg-gray-50"
//       variants={sectionVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//     >
//       <div className="max-w-7xl mx-auto">
//         <h2 className="flex items-center justify-center gap-3 text-4xl font-bold text-center mb-12 text-[#4A3A2F]">
//           <Calendar className="w-8 h-8 text-amber-600" /> Upcoming Events
//         </h2>
//         <div className="relative w-full overflow-hidden mask-image">
//           <div className="flex animate-marquee whitespace-nowrap py-4">
//             {events.map((event, index) => (
//               <div key={`${event._id}-${index}`} className="flex-shrink-0 w-80 mx-4">
//                 <EventCard event={event} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <style jsx global>{`
//         .mask-image {
//           -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
//           mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
//         }
//         @keyframes marquee {
//           0% { transform: translateX(0%); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           animation: marquee 70s linear infinite;
//         }
//         .animate-marquee:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </motion.section>
//   );
// };

// export default UpcomingEvents;


// src/components/UpcomingEvents.jsx

import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { getActiveEvents } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ 1. Import AnimatePresence
import { Calendar } from 'lucide-react';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ 2. State to track the current card

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const activeEvents = await getActiveEvents();
        // ✅ 3. We no longer need to duplicate the array
        setEvents(activeEvents);
      } catch (error) {
        console.error("Could not fetch upcoming events.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ 4. A separate useEffect to handle the auto-sliding timer
  useEffect(() => {
    if (events.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000); // Change card every 5 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [currentIndex, events.length]);


  if (loading || events.length === 0) {
    return null;
  }

  // ✅ 5. Define animation variants for sliding right-to-left
  const slideVariants = {
    enter: {
      x: "100%",
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: "-100%",
      opacity: 0,
    },
  };

  return (
    <motion.section
      className="py-16 bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="flex items-center justify-center gap-3 text-4xl font-bold text-center mb-8 text-[#4A3A2F]">
          <Calendar className="w-8 h-8 text-amber-600" /> Upcoming Events
        </h2>

        {/* ✅ 6. Main container for the slider */}
        <div className="relative flex items-center justify-center h-[28rem] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              // The key is crucial for AnimatePresence to detect changes
              key={currentIndex}
              className="absolute w-80"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
            >
              {/* Render only the current event card */}
              <EventCard event={events[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default UpcomingEvents;