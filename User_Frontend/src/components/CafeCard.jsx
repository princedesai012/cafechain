import React from 'react';
import { MapPin, Star } from 'lucide-react';

const CafeCard = ({ cafe, onClick }) => {
  const handleImgError = (e) => {
    if (!e.target.src.includes('logo.jpg')) {
      e.target.src = '/assets/Images/logo.jpg';
    }
  };

  return (
    <div
      className="
        bg-white rounded-2xl shadow-soft cursor-pointer hover:shadow-lg transition-shadow
        flex flex-col h-full w-full overflow-hidden
      "
      onClick={() => onClick && onClick(cafe)}
    >
      {/* Image section */}
      <div className="w-full h-36 flex-shrink-0">
        <img
          src={`/assets/Images/Photo${cafe.id}.jpg`}
          alt={cafe.name}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-dark-brown text-lg mb-1 truncate">{cafe.name}</h3>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{cafe.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {cafe.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-light-gray text-gray-700 px-2 py-1 rounded-lg text-xs truncate max-w-[80px]"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Rating at the bottom */}
        <div className="mt-auto flex items-center text-sm">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-gray-600">{cafe.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
