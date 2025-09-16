import React, { useState } from "react";
import { useAppContext } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  BuildingStorefrontIcon,
  PhotoIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Updated to allow multiple images at once
  const handleImageSelect = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Check total limit
    if (gallery.length + selectedImages.length + files.length > 5) {
      toast.error("You can upload maximum 5 images in total.");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageUpload = () => {
    if (selectedImages.length === 0) return;

    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const newImages = selectedImages.map((file, idx) => ({
          url: imagePreviews[idx],
          caption: file.name,
        }));

        setGallery((prev) => [...prev, ...newImages].slice(0, 5)); // enforce max 5

        setSelectedImages([]);
        setImagePreviews([]);
        setUploadProgress(0);

        toast.success("Images uploaded successfully!");
      }
    }, 200);
  };

  const handleRemoveImage = (idx) => {
    setGallery((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Image removed!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const tabConfig = [
    { id: "profile", label: "Cafe Profile", icon: BuildingStorefrontIcon },
    { id: "gallery", label: "Photo Gallery", icon: PhotoIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-sans antialiased">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
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

            <div className="p-8">
              {editMode ? (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Cafe Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Cafe Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cafeForm.name}
                      className="w-full px-4 py-3 border border-[#4a3a2f]/30 rounded-lg focus:border-[#4a3a2f] focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
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

                  {/* Address */}
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

                  {/* Email */}
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

                  {/* Opening Hours */}
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

                  {/* Description */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold font-sans text-[#4a3a2f]">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={cafeForm.description}
                      onChange={handleCafeFormChange}
                      rows={4}
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

                  {/* Buttons */}
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
                      Choose Images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Preview & Upload Controls */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-40 object-contain rounded-lg border border-[#4a3a2f]/20"
                        />
                        <button
                          onClick={() => {
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setImagePreviews((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={handleImageUpload}
                      className="px-6 py-2 bg-[#4a3a2f] text-white rounded-lg hover:bg-[#3a2d24] transition"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImages([]);
                        setImagePreviews([]);
                        setUploadProgress(0);
                      }}
                      className="px-6 py-2 border border-[#4a3a2f]/30 text-[#4a3a2f] rounded-lg hover:bg-[#4a3a2f] hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#4a3a2f] h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.length > 0 ? (
                  gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group"
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
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
