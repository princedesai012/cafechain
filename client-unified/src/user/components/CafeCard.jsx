import React from "react";
import { MapPin, Phone } from "lucide-react";

const CafeCard = ({ cafe, onClick }) => {
  const handleImgError = (e) => {
    if (!e.target.src.includes("logo.jpg")) {
      e.target.src = "/assets/Images/logo.jpg"; // fallback
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
      {/* ✅ Image section */}
      <div className="w-full h-40 flex-shrink-0">
        <img
          src={cafe.images?.[0]?.url ?? "/assets/Images/logo.jpg"} // from DB or fallback
          alt={cafe.name}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>

      {/* ✅ Details */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-dark-brown text-lg mb-1 truncate">
          {cafe.name}
        </h3>

        {/* Address */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{cafe.address || "Unknown address"}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{cafe.cafePhone || "N/A"}</span>
        </div>

        {/* ✅ Features */}
        {cafe.features?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {cafe.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-light-gray text-gray-700 px-2 py-1 rounded-lg text-xs truncate max-w-[100px]"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Cafe Code (optional) */}
        {/* <div className="mt-auto text-xs text-gray-500">
          Code: {cafe.cafeCode}
        </div> */}
      </div>
    </div>
  );
};

export default CafeCard;
