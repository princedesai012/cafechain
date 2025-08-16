// ClaimRewardPage.jsx (New page)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is used for user state

const ClaimRewardPage = () => {
  const navigate = useNavigate();
  const [cafeName, setCafeName] = useState('');
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate API call
    try {
      // In a real application, you would send this data to a backend
      const formData = new FormData();
      formData.append('cafeName', cafeName);
      formData.append('amount', amount);
      if (invoice) {
        formData.append('invoice', invoice);
      }
      
      // Simulating a network delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // On successful submission
      setSubmitMessage('Your points are on their way! They will be credited to your account within 24 hours. Thanks for your patience!');
      
      // Reset form fields
      setCafeName('');
      setAmount('');
      setInvoice(null);
    } catch (error) {
      console.error("Failed to submit claim:", error);
      setSubmitMessage('Oops! Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoice(file);
    }
  };

  return (
    <div className="min-h-screen font-['Inter'] md:bg-gray-100 md:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .bg-accent { background-color: #6D4C41; }
        .text-accent { color: #6D4C41; }
        .bg-dark-brown { background-color: #4A3A2F; }
        .text-dark-brown { color: #4A3A2F; }
        .bg-light-gray { background-color: #F8F8F8; }
      `}</style>

      {/* Header with back button */}
      <div className="flex items-center p-4 bg-white shadow-soft md:rounded-2xl md:mx-4 md:mt-4">
        <button 
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="p-2 mr-4 text-dark-brown rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-dark-brown">Claim Your Rewards</h1>
      </div>

      <div className="p-4 space-y-6 md:p-8 md:max-w-2xl md:mx-auto">
        
        {/* Intro text */}
        <div className="text-center md:text-left">
          <p className="text-lg text-gray-700">
           Upload your cafe invoice to claim points! Enter the details, and your points will be credited within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cafe Name Input */}
            <div>
              <label htmlFor="cafeName" className="block text-sm font-medium text-gray-700 mb-1">
                Cafe Name
              </label>
              <input
                type="text"
                id="cafeName"
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                placeholder="Enter cafe name"
                required
                className="w-full p-4 border border-gray-300 rounded-xl bg-light-gray focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="w-full p-4 border border-gray-300 rounded-xl bg-light-gray focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Invoice Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload invoice
              </label>
              <label htmlFor="invoice-upload" className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-light-gray cursor-pointer transition-colors hover:bg-gray-200">
                {invoice ? (
                  <div className="text-center text-dark-brown">
                    <span className="font-medium">{invoice.name}</span>
                    <span className="block text-sm text-gray-500">File ready to upload.</span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <Plus className="w-12 h-12" />
                  </div>
                )}
              </label>
              <input
                id="invoice-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-4 bg-accent text-white font-semibold rounded-xl hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          
          {/* Submission message */}
          {submitMessage && (
            <div className={`mt-4 p-4 rounded-xl text-center font-medium ${submitMessage.includes('Oops') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardPage;