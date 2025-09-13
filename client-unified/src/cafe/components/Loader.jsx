import React from 'react';
import LOGO_URL from '../assets/logo.jpg'

// You can replace the placeholder URL with your actual logo path.
// const LOGO_URL = "https://placehold.co/100x100/4a3a2f/ffffff?text=LOGO";
const ANIMATED_RING_URL = "https://placehold.co/150x150/ffffff/4a3a2f?text=";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/70 backdrop-blur-sm">
      <style>
        {`
          /* Keyframe animation for the spinning effect */
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          /* Keyframe animation for the reverse spinning effect */
          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          /* Apply animation to the rings */
          .ring-1 {
            animation: spin 2s linear infinite;
          }
          .ring-2 {
            animation: spin-reverse 3s linear infinite;
          }
        `}
      </style>
      
      {/* Loader Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Central Logo */}
        <div className="relative z-10 w-24 h-24 p-2 bg-white rounded-full shadow-lg">
          <img 
            src={LOGO_URL} 
            alt="App Logo" 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
        
        {/* Animated Rings */}
        <div className="absolute w-32 h-32 border-4 border-transparent rounded-full border-t-[#4a3a2f] ring-1"></div>
        <div className="absolute w-40 h-40 border-4 border-transparent rounded-full border-b-[#4a3a2f] ring-2"></div>
      </div>
    </div>
  );
};

export default Loader;