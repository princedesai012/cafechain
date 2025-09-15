import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileWarning } from "lucide-react";
import Loader from "../components/Loader";
import ClaimCard from "../components/ClaimCard";
import { getPendingClaims, approveClaim, rejectClaim } from "../api/adminApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const ClaimApprovalPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const data = await getPendingClaims();
      setClaims(data);
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveClaim(id);
      setClaims((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error approving claim:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectClaim(id);
      setClaims((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error rejecting claim:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pb-24 text-[#4a3a2f]">
      <div className="w-full max-w-6xl px-4 py-6">
        <motion.div
          className="text-center my-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Pending Reward Claims
          </h1>
          <p className="text-gray-500">
            Review and approve or reject claims submitted by users.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {claims.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {claims.map((claim) => (
                <motion.div key={claim._id} variants={itemVariants}>
                  <ClaimCard
                    claim={claim}
                    onApprove={() => handleApprove(claim._id)}
                    onReject={() => handleReject(claim._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-claims"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FileWarning className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-[#4a3a2f] mb-2">
                No Pending Claims
              </h3>
              <p className="text-gray-500">All reward claims have been reviewed.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClaimApprovalPage;
