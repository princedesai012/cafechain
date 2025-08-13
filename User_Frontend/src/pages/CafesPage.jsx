import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CafeCard from '../components/CafeCard';

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

const CafesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filteredCafes, setFilteredCafes] = useState(cafes);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'near') {
      setFilteredCafes(cafes.slice(0, 3));
    } else {
      setFilteredCafes(cafes);
    }
  };

  const handleCafeClick = (cafe) => {
    navigate(`/cafes/${cafe.id}`);
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-2xl px-0 py-6 md:max-w-full md:px-0">
        {/* MOBILE VIEW */}
        <div className="block md:hidden">
          <div className="px-4 py-6">
            <div className="flex bg-light-gray rounded-xl p-1 mb-6">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-dark-brown shadow-soft'
                    : 'text-gray-600 hover:text-dark-brown'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTabChange('near')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'near'
                    ? 'bg-white text-dark-brown shadow-soft'
                    : 'text-gray-600 hover:text-dark-brown'
                }`}
              >
                Near me
              </button>
            </div>

            <div className="space-y-4">
              {filteredCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  onClick={() => handleCafeClick(cafe)}
                />
              ))}
            </div>

            {filteredCafes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-light-gray rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-dark-brown mb-2">
                  No cafes found
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'near'
                    ? 'No cafes nearby. Try searching for all cafes.'
                    : 'No cafes available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex justify-center w-full mt-8">
              <div className="flex bg-light-gray rounded-xl p-1 w-full max-w-lg">
                <button
                  onClick={() => handleTabChange('all')}
                  className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-white text-dark-brown shadow-soft'
                      : 'text-gray-600 hover:text-dark-brown'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleTabChange('near')}
                  className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                    activeTab === 'near'
                      ? 'bg-white text-dark-brown shadow-soft'
                      : 'text-gray-600 hover:text-dark-brown'
                  }`}
                >
                  Near me
                </button>
              </div>
            </div>

            <div className="text-center mt-8 mb-8 px-4">
              <h2 className="text-2xl font-bold text-dark-brown mb-2">Explore Our Cafes</h2>
              <p className="text-gray-600 text-base max-w-2xl mx-auto">
                Discover a curated selection of unique cafes. Your next favorite spot is just a click away.
              </p>
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-4 gap-8 max-w-6xl w-full">
                {filteredCafes.map((cafe) => (
                  <div
                    key={cafe.id}
                    className="flex justify-center"
                  >
                    <div className="w-[260px] h-[320px]">
                      <CafeCard cafe={cafe} onClick={() => handleCafeClick(cafe)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredCafes.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-light-gray rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Coffee className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-brown mb-2">
                  No cafes found
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'near'
                    ? 'No cafes nearby. Try searching for all cafes.'
                    : 'No cafes available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafesPage;