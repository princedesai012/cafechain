// src/pages/UserCafePointsPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

// ✅ Dummy data: cafes with users and points
const dummyCafePoints = [
  {
    _id: "cafe1",
    name: "Brew Haven",
    users: [
      { name: "Raj", points: 120 },
      { name: "Aman", points: 95 },
      { name: "Kashyap", points: 75 },
    ],
  },
  {
    _id: "cafe2",
    name: "Coffee Corner",
    users: [
      { name: "Raj", points: 60 },
      { name: "Aman", points: 150 },
      { name: "Kashyap", points: 110 },
    ],
  },
  {
    _id: "cafe3",
    name: "Cafe Mocha",
    users: [
      { name: "Raj", points: 200 },
      { name: "Aman", points: 90 },
    ],
  },
];

const UserCafePointsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState([]);
  const userName = "Raj"; // This would come from logged-in user context

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      const points = dummyCafePoints
        .map((cafe) => {
          const user = cafe.users.find((u) => u.name === userName);
          return user ? { cafeName: cafe.name, points: user.points } : null;
        })
        .filter(Boolean); // remove nulls
      setUserPoints(points);
      setLoading(false);
    }, 1000); // 1 sec loader
  }, [userName]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Back Button */}
      <motion.button
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-[#4a3a2f] hover:opacity-80"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </motion.button>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-extrabold mb-8 text-[#4a3a2f] text-center md:text-left flex items-center gap-2"
      >
        <Coffee className="w-6 h-6" /> Your Cafe Points
      </motion.h1>

      {userPoints.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          You have no points in any cafe yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPoints.map((cafe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="p-5 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all"
            >
              <div className="font-bold text-lg text-[#4a3a2f]">{cafe.cafeName}</div>
              <div className="mt-2 text-gray-600">
                Points: <span className="font-semibold">{cafe.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCafePointsPage;
