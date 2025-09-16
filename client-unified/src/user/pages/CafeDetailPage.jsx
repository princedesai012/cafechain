import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCafeById } from "../api/api";
import Loader from "../components/Loader";

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafe = async () => {
      setLoading(true);
      const startTime = Date.now(); // track start time
      try {
        const data = await getCafeById(id);
        setCafe(data);
        const favs = JSON.parse(localStorage.getItem("favourites")) || [];
        setIsLiked(favs.includes(data._id));
      } catch (error) {
        console.error("Error fetching cafe:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = 1000 - elapsed; // 1 second minimum
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };
    fetchCafe();
  }, [id]);

  const handleBack = () => navigate("/user/cafes");

  const toggleLike = () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    if (!isLiked) {
      favourites.push(cafe._id);
    } else {
      favourites = favourites.filter((cid) => cid !== cafe._id);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    setIsLiked(!isLiked);
  };

  const handleImgError = (e) => {
    if (!e.target.src.includes("logo.jpg")) {
      e.target.src = "/assets/Images/logo.jpg";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pb-20 md:pb-0 font-['Inter'] md:bg-gray-100">
      <div className="px-4 pt-4 md:max-w-7xl md:mx-auto md:px-8">
        <button
          onClick={handleBack}
          className="text-base font-semibold text-gray-600 hover:text-dark-brown transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-6 relative">
          <div className="bg-light-gray rounded-2xl h-48 overflow-hidden relative">
            <img
              src={cafe.image || "/assets/Images/logo.jpg"}
              alt={cafe.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={handleImgError}
            />
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-semibold text-gray-700">Open</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={toggleLike}
              className={`p-3 rounded-xl transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-light-gray text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
            <h1 className="text-2xl font-bold text-dark-brown">{cafe.name}</h1>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.cafePhone || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Open 12:00 PM - 12:00 AM</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-brown mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.features?.length > 0 ? (
                  cafe.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="md:max-w-7xl md:mx-auto md:px-8 md:py-8">
          <div className="grid grid-cols-2 gap-8 items-start bg-white p-8 rounded-2xl shadow-soft relative">
            <div className="bg-light-gray rounded-2xl h-96 overflow-hidden relative">
              <img
                src={cafe.image || "/assets/Images/logo.jpg"}
                alt={cafe.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={handleImgError}
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-gray-700">Open</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-brown">
                  {cafe.name}
                </h1>
                <button
                  onClick={toggleLike}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked
                      ? "bg-red-50 text-red-500"
                      : "bg-light-gray text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.cafePhone || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">Open 12:00 PM - 12:00 AM</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2 text-xl">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cafe.features?.length > 0 ? (
                    cafe.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No tags available</span>
                  )}
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
