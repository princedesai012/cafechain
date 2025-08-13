import React, { useState } from 'react';
import { MapPin, Phone, Clock, Heart, Star, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const cafes = [
  {
    id: 1,
    name: "The Grind House",
    location: "123 Coffee St, Brewville",
    features: ["Free WiFi", "Good for work", "Artisanal"],
  },
  {
    id: 2,
    name: "Cafe Soul",
    location: "456 Bean Ave, Latte City",
    features: ["Live music", "Cozy atmosphere"],
  },
  {
    id: 3,
    name: "Brew & Bean",
    location: "789 Espresso Rd, Roast Town",
    features: ["Outdoor seating", "Pet-friendly"],
  },
];

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  const cafe = cafes.find(c => c.id === parseInt(id)) || cafes[0];

  const handleBack = () => {
    navigate('/cafes');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleImgError = (e) => {
    if (e.target.src.includes('logo.jpg')) {
      console.error(`Fallback image also failed for cafe: ${cafe.name}`);
      return;
    }
    e.target.src = '/assets/Images/logo.jpg';
  };

  return (
    <div className="pb-20 md:pb-0 font-['Inter'] md:bg-gray-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .text-dark-brown {
          color: #4A3A2F;
        }
        .bg-light-gray {
          background-color: #F8F8F8;
        }
      `}</style>

      {/* MOBILE LAYOUT */}
      <div className="block md:hidden">
        <div className="bg-white shadow-soft px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-light-gray transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-dark-brown" />
            </button>
            <span className="text-sm text-gray-600">cafe/{cafe.name.toLowerCase().replace(/\s+/g, '')}</span>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-light-gray rounded-2xl h-48 flex items-center justify-center overflow-hidden">
            <img
              src={`/assets/Images/Photo${cafe.id}.jpg`}
              alt={cafe.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={handleImgError}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleLike}
              className={`p-3 rounded-xl transition-colors ${
                isLiked ? 'bg-red-50 text-red-500' : 'bg-light-gray text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
           
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">Rating</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
            <h1 className="text-2xl font-bold text-dark-brown">{cafe.name}</h1>
           
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.location}</span>
              </div>
             
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">9316294843</span>
              </div>
             
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Open 12:00 PM to 12:00 AM</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-brown mb-2">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.features?.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                  >
                    {feature}
                  </span>
                )) || (
                  <span className="text-gray-500 text-sm">No tags available</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-brown mb-2">User Feedback</h3>
              <div className="bg-light-gray rounded-xl p-4">
                <p className="text-gray-700 text-sm">
                  "very good awwww cute cafe !!!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block">
        <div className="md:max-w-7xl md:mx-auto md:p-8 space-y-8">
          <div className="bg-white shadow-soft px-4 py-3 rounded-2xl">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-light-gray transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-dark-brown" />
              </button>
              <span className="text-sm text-gray-600">cafe/{cafe.name.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 items-start bg-white p-8 rounded-2xl shadow-soft">
            <div className="bg-light-gray rounded-2xl h-96 flex items-center justify-center overflow-hidden">
              <img
                src={`/assets/Images/Photo${cafe.id}.jpg`}
                alt={cafe.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={handleImgError}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-brown">{cafe.name}</h1>
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-lg text-gray-600">Rating</span>
                  <button
                    onClick={toggleLike}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked ? 'bg-red-50 text-red-500' : 'bg-light-gray text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
             
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.location}</span>
                </div>
               
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">9316294843</span>
                </div>
               
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">Open 12:00 PM to 12:00 AM</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2 text-xl">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {cafe.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-sm">No tags available</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2 text-xl">User Feedback</h3>
                <div className="bg-light-gray rounded-xl p-4">
                  <p className="text-gray-700 text-base">
                    "very good awwww cute cafe !!!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailPage;