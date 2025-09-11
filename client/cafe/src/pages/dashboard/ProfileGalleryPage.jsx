import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';

function ProfileGalleryPage() {
  const { state } = useAppContext();
  const { cafeInfo, gallery } = state;
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'gallery', 'settings'
  const [editMode, setEditMode] = useState(false);
  
  // Form state for cafe profile
  const [cafeForm, setCafeForm] = useState({
    name: cafeInfo.name || '',
    address: cafeInfo.address || '',
    phone: cafeInfo.phone || '',
    email: cafeInfo.email || '',
    description: cafeInfo.description || '',
    openingHours: cafeInfo.openingHours || '',
    tags: cafeInfo.tags || []
  });
  
  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // State for redemption policy
  const [redemptionPolicy, setRedemptionPolicy] = useState({
    pointsPerDollar: cafeInfo.redemptionPolicy?.pointsPerDollar || 1,
    minimumPoints: cafeInfo.redemptionPolicy?.minimumPoints || 100,
    maximumDiscount: cafeInfo.redemptionPolicy?.maximumDiscount || 50
  });
  
  // Handle cafe form changes
  const handleCafeFormChange = (e) => {
    const { name, value } = e.target;
    setCafeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle tag selection
  const handleTagToggle = (tag) => {
    setCafeForm(prev => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag)
        };
      } else {
        if (currentTags.length < 3) {
          return {
            ...prev,
            tags: [...currentTags, tag]
          };
        }
        return prev;
      }
    });
  };
  
  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image upload (simulated)
  const handleImageUpload = () => {
    if (!selectedImage) return;
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add to gallery after "upload" completes
          setTimeout(() => {
            // Reset states
            setSelectedImage(null);
            setImagePreview(null);
            setUploadProgress(0);
            
            // Show success message (would use toast in a real app)
            alert('Image uploaded successfully!');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Handle redemption policy changes
  const handlePolicyChange = (e) => {
    const { name, value } = e.target;
    setRedemptionPolicy(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, would dispatch an action to update the state
    // For now, just toggle edit mode off
    setEditMode(false);
    
    // Show success message (would use toast in a real app)
    alert('Profile updated successfully!');
  };
  
  // Available cafe tags
  const availableTags = [
    'Coffee', 'Tea', 'Pastries', 'Breakfast', 'Lunch', 
    'Vegan', 'Organic', 'Specialty Coffee', 'Wifi', 'Study Friendly',
    'Pet Friendly', 'Outdoor Seating', 'Live Music'
  ];
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile & Gallery</h1>
        
        {/* Tab Navigation */}
        <div className="mt-4 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${activeTab === 'profile' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              Cafe Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'gallery' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-300`}
            >
              Photo Gallery
            </button>
            {/* <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${activeTab === 'settings' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              Redemption Settings
            </button> */}
          </div>
        </div>
      </div>
      
      {/* Cafe Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Cafe Information</h2>
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          <div className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Cafe Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={cafeForm.name}
                        onChange={handleCafeFormChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={cafeForm.phone}
                        onChange={handleCafeFormChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={cafeForm.address}
                        onChange={handleCafeFormChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={cafeForm.email}
                        onChange={handleCafeFormChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={cafeForm.description}
                        onChange={handleCafeFormChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Brief description of your cafe for customers.</p>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                      Opening Hours
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="openingHours"
                        id="openingHours"
                        value={cafeForm.openingHours}
                        onChange={handleCafeFormChange}
                        placeholder="e.g. Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-700">Cafe Tags (Select up to 3)</legend>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => (
                            <span 
                              key={tag}
                              onClick={() => handleTagToggle(tag)}
                              className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium cursor-pointer
                                ${cafeForm.tags.includes(tag) 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {cafeInfo.logo ? (
                      <img src={cafeInfo.logo} alt={cafeInfo.name} className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{cafeInfo.name}</h3>
                    <p className="text-sm text-gray-500">{cafeInfo.tags?.join(', ')}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{cafeInfo.phone}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{cafeInfo.email}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{cafeInfo.address}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Opening Hours</dt>
                      <dd className="mt-1 text-sm text-gray-900">{cafeInfo.openingHours || 'Not specified'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{cafeInfo.description || 'No description provided.'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Photo Gallery</h2>
            <p className="mt-1 text-sm text-gray-500">Upload and manage photos of your cafe</p>
          </div>
          
          <div className="p-6">
            {/* Upload Section */}
            <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-md">
              <div className="space-y-4">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">Upload a new photo to your gallery</p>
                </div>
                
                <div>
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Select Image
                    </span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageSelect} accept="image/*" />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="object-cover" />
                    </div>
                    
                    {uploadProgress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">{uploadProgress}% uploaded</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="mr-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gallery Grid */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Photos</h3>
              
              {gallery && gallery.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                        <img src={image.url} alt={image.caption || `Gallery image ${index + 1}`} className="object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                          <button className="p-1.5 bg-white rounded-full">
                            <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button className="p-1.5 bg-white rounded-full">
                            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      {image.caption && (
                        <p className="mt-2 text-sm text-gray-500">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by uploading your first photo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Redemption Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Redemption Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Configure how customers earn and redeem points</p>
          </div>
          
          <div className="p-6">
            <form>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Points Earning</h3>
                  <p className="mt-1 text-sm text-gray-500">Define how customers earn points at your cafe</p>
                  
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="pointsPerDollar" className="block text-sm font-medium text-gray-700">
                        Points per Dollar Spent
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="pointsPerDollar"
                          id="pointsPerDollar"
                          min="1"
                          value={redemptionPolicy.pointsPerDollar}
                          onChange={handlePolicyChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Number of points earned for each dollar spent</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">Redemption Rules</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Points Redemption</h3>
                  <p className="mt-1 text-sm text-gray-500">Define how customers can redeem their points</p>
                  
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="minimumPoints" className="block text-sm font-medium text-gray-700">
                        Minimum Points for Redemption
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="minimumPoints"
                          id="minimumPoints"
                          min="1"
                          value={redemptionPolicy.minimumPoints}
                          onChange={handlePolicyChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Minimum points required for any redemption</p>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="maximumDiscount" className="block text-sm font-medium text-gray-700">
                        Maximum Discount Percentage
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="maximumDiscount"
                          id="maximumDiscount"
                          min="1"
                          max="100"
                          value={redemptionPolicy.maximumDiscount}
                          onChange={handlePolicyChange}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Maximum percentage of bill that can be paid with points</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Redemption Example</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>With current settings, a customer spending $100 would earn {100 * redemptionPolicy.pointsPerDollar} points.</p>
                          <p className="mt-1">A customer with {redemptionPolicy.minimumPoints} points could redeem them for up to {redemptionPolicy.maximumDiscount}% off their bill.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileGalleryPage;