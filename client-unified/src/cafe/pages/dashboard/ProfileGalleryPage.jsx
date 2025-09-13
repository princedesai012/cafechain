import React, { useState } from "react";
import { useAppContext } from "../../store/AppContext";
import Loader from '../../components/Loader';

import {
  BuildingStorefrontIcon,
  PhotoIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"; // Black outline icons
import { useNavigate } from "react-router-dom";

function ProfileGalleryPage() {
  const { state } = useAppContext();
  const { cafeInfo, gallery: initialGallery } = state;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  const [cafeForm, setCafeForm] = useState({
    name: cafeInfo.name || "",
    address: cafeInfo.address || "",
    phone: cafeInfo.phone || "",
    email: cafeInfo.email || "",
    description: cafeInfo.description || "",
    openingHours: cafeInfo.openingHours || "",
    tags: cafeInfo.tags || [],
  });

  const [gallery, setGallery] = useState(initialGallery || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [redemptionPolicy, setRedemptionPolicy] = useState({
    pointsPerDollar: cafeInfo.redemptionPolicy?.pointsPerDollar || 1,
    minimumPoints: cafeInfo.redemptionPolicy?.minimumPoints || 100,
    maximumDiscount: cafeInfo.redemptionPolicy?.maximumDiscount || 50,
  });

  const handleCafeFormChange = (e) => {
    const { name, value } = e.target;
    setCafeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setCafeForm((prev) => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter((t) => t !== tag) };
      } else if (currentTags.length < 3) {
        return { ...prev, tags: [...currentTags, tag] };
      }
      return prev;
    });
  };

  const handleImageSelect = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (!selectedImage) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGallery((prev) => [
              ...prev,
              { url: imagePreview, caption: selectedImage.name },
            ]);
            setSelectedImage(null);
            setImagePreview(null);
            setUploadProgress(0);
            alert("Image uploaded successfully!");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePolicyChange = (e) => {
    const { name, value } = e.target;
    setRedemptionPolicy((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const availableTags = [
    "Coffee",
    "Tea",
    "Pastries",
    "Breakfast",
    "Lunch",
    "Vegan",
    "Organic",
    "Specialty Coffee",
    "Wifi",
    "Study Friendly",
    "Pet Friendly",
    "Outdoor Seating",
    "Live Music",
  ];

  const tabConfig = [
    { id: "profile", label: "Cafe Profile", icon: BuildingStorefrontIcon },
    { id: "gallery", label: "Photo Gallery", icon: PhotoIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-sans antialiased">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button (desktop only) */}
        <div className="hidden md:flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#4a3a2f] hover:text-[#3a2d24] transition font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
        </div>

        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold font-serif text-[#4a3a2f] mb-3 tracking-tight">
            Manage Your Cafe
          </h1>
          <p className="text-lg font-sans text-[#4a3a2f]/70 max-w-2xl mx-auto leading-relaxed">
            Keep your cafe details up-to-date and showcase your unique
            atmosphere with photos.
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center mb-10">
          <div className="flex bg-white border border-[#4a3a2f]/20 rounded-xl shadow-md overflow-hidden">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#4a3a2f] text-white"
                      : "text-[#4a3a2f] hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 stroke-[2]" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <section
            className="bg-white shadow-xl rounded-2xl border border-[#4a3a2f]/20 overflow-hidden"
            aria-labelledby="cafe-profile"
          >
            <div className="px-8 py-6 border-b border-[#4a3a2f]/10 flex justify-between items-center">
              <div>
                <h2
                  id="cafe-profile"
                  className="text-2xl font-bold font-serif text-[#4a3a2f]"
                >
                  Cafe Information
                </h2>
                <p className="text-sm font-sans text-[#4a3a2f]/70 mt-1">
                  Update your cafe details to help customers find you.
                </p>
              </div>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 border border-[#4a3a2f] text-[#4a3a2f] rounded-lg hover:bg-[#4a3a2f] hover:text-white transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {editMode ? (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Inputs */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Cafe Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cafeForm.name}
                      onChange={handleCafeFormChange}
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={cafeForm.phone}
                      onChange={handleCafeFormChange}
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={cafeForm.address}
                      onChange={handleCafeFormChange}
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={cafeForm.email}
                      onChange={handleCafeFormChange}
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      name="openingHours"
                      value={cafeForm.openingHours}
                      onChange={handleCafeFormChange}
                      placeholder="e.g. Mon-Fri: 8am-6pm"
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="lg:col-span-2 space-y-4">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Cafe Tags (Select up to 3)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-4 py-2 rounded-full text-sm border transition ${
                            cafeForm.tags.includes(tag)
                              ? "bg-[#4a3a2f] text-white border-[#4a3a2f]"
                              : "bg-white text-[#4a3a2f] border-[#4a3a2f]/30 hover:border-[#4a3a2f]"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex justify-end gap-4 pt-6 border-t border-[#4a3a2f]/10">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-[#4a3a2f]/30 text-[#4a3a2f] rounded-lg hover:bg-[#4a3a2f] hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#4a3a2f] text-white rounded-lg hover:bg-[#3a2d24] transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="p-6 bg-gray-50 rounded-xl border border-[#4a3a2f]/10">
                    <h3 className="flex items-center gap-2 font-semibold font-serif text-[#4a3a2f] mb-3">
                      <PhoneIcon className="h-5 w-5" /> Contact Information
                    </h3>
                    <p className="text-sm font-sans text-[#4a3a2f]/70">
                      Phone: {cafeInfo.phone || "Not provided"}
                    </p>
                    <p className="text-sm font-sans text-[#4a3a2f]/70">
                      Email: {cafeInfo.email || "Not provided"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-6 bg-gray-50 rounded-xl border border-[#4a3a2f]/10">
                    <h3 className="flex items-center gap-2 font-semibold font-serif text-[#4a3a2f] mb-3">
                      <MapPinIcon className="h-5 w-5" /> Location & Hours
                    </h3>
                    <p className="text-sm font-sans text-[#4a3a2f]/70">
                      Address: {cafeInfo.address || "Not provided"}
                    </p>
                    <p className="text-sm font-sans text-[#4a3a2f]/70">
                      Hours: {cafeInfo.openingHours || "Not specified"}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 p-6 bg-gray-50 rounded-xl border border-[#4a3a2f]/10">
                    <h3 className="flex items-center gap-2 font-semibold font-serif text-[#4a3a2f] mb-3">
                      <InformationCircleIcon className="h-5 w-5" /> About Our Cafe
                    </h3>
                    <p className="text-sm font-sans text-[#4a3a2f]/80 leading-relaxed">
                      {cafeInfo.description ||
                        "No description provided yet. Add one in Edit Mode."}
                    </p>
                  </div>

                  {/* Tags */}
                  {cafeInfo.tags && cafeInfo.tags.length > 0 && (
                    <div className="md:col-span-2 p-6 bg-gray-50 rounded-xl border border-[#4a3a2f]/10">
                      <h3 className="flex items-center gap-2 font-semibold font-serif text-[#4a3a2f] mb-3">
                        Cafe Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cafeInfo.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-sm bg-[#4a3a2f] text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <section
            className="bg-white shadow-xl rounded-2xl border border-[#4a3a2f]/20 overflow-hidden"
            aria-labelledby="photo-gallery"
          >
            <div className="px-8 py-6 border-b border-[#4a3a2f]/10">
              <h2
                id="photo-gallery"
                className="text-2xl font-bold font-serif text-[#4a3a2f]"
              >
                Photo Gallery
              </h2>
              <p className="text-sm font-sans text-[#4a3a2f]/70">
                Upload and manage photos of your cafe.
              </p>
            </div>
            <div className="p-8">
              {/* Upload Section */}
              <div className="mb-10 p-8 border-2 border-dashed border-[#4a3a2f]/30 rounded-xl bg-gray-50">
                <div className="text-center">
                  <PhotoIcon className="h-12 w-12 mx-auto stroke-1 text-[#4a3a2f]" />
                  <p className="mt-3 text-sm font-sans text-[#4a3a2f]/70">
                    Select and upload new cafe photos
                  </p>
                  <label className="inline-block mt-4 cursor-pointer">
                    <span className="px-6 py-2 bg-[#4a3a2f] text-white rounded-lg hover:bg-[#3a2d24] transition">
                      Choose Image
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleImageSelect}
                      accept="image/*"
                    />
                  </label>
                </div>

                {/* Preview & Upload Controls */}
                {imagePreview && (
                  <div className="mt-6">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-40 object-contain rounded-lg border border-[#4a3a2f]/20"
                    />
                    <div className="mt-4 flex justify-center gap-4">
                      <button
                        onClick={handleImageUpload}
                        type="button"
                        className="px-6 py-2 bg-[#4a3a2f] text-white rounded-lg hover:bg-[#3a2d24] transition"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setUploadProgress(0);
                        }}
                        type="button"
                        className="px-6 py-2 border border-[#4a3a2f]/30 text-[#4a3a2f] rounded-lg hover:bg-[#4a3a2f] hover:text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                    {uploadProgress > 0 && (
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#4a3a2f] h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.length > 0 ? (
                  gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-sm font-sans text-[#4a3a2f]/70">
                    No photos uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfileGalleryPage;

