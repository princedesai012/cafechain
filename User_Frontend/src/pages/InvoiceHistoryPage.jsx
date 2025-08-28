// src/pages/InvoiceHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

const dummyInvoices = [
  { cafe: "Cafe Aroma", date: "25 Aug 2024", status: "Approved" },
  { cafe: "Brew & Bite", date: "10 Aug 2024", status: "Pending" },
  { cafe: "Espresso Hub", date: "5 Aug 2024", status: "Rejected" },
  { cafe: "Mocha Magic", date: "20 Jul 2024", status: "Approved" },
  { cafe: "Latte Lane", date: "1 Jul 2024", status: "Pending" },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const InvoiceHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fake loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
        className="text-3xl md:text-4xl font-extrabold mb-8 text-[#4a3a2f] text-center md:text-left"
      >
        Invoice History
      </motion.h1>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyInvoices.map((invoice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            className="p-5 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all cursor-pointer"
          >
            {/* Row with cafe + date + status (always inline) */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg text-[#4a3a2f]">
                  {invoice.cafe}
                </div>
                <div className="text-sm text-gray-500">
                  Visited on {invoice.date}
                </div>
              </div>
              <motion.div
                className={`ml-3 px-3 py-1 text-sm font-semibold rounded-full ${statusColors[invoice.status]}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
              >
                {invoice.status}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceHistoryPage;
