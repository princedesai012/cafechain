import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ArrowRight } from 'lucide-react';
import { getProfile, updateProfile, changePassword } from '../api/api';

// This component displays the user's profile information, stats, and quick links.
// It features a single-column layout for mobile and a two-column layout for desktop.
const ProfilePage = () => {
  const { user: authUser, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const phone = authUser?.phone || localStorage.getItem('userPhone');
        if (!phone) return;
        const data = await getProfile(phone);
        setProfile(data);
      } catch (e) {
        setError(e?.toString() || 'Failed to load profile');
      }
    };
    load();
  }, [authUser]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const phone = authUser?.phone || localStorage.getItem('userPhone');
      if (!phone) throw new Error('Missing user phone');
      
      const updateData = { name: profile?.name };
      
      // Handle profile picture upload
      console.log('🔍 Selected file from state:', !!selectedFile);
      console.log('📁 Selected image from state:', !!selectedImage);
      
      if (selectedFile) {
        console.log('📄 Processing file:', selectedFile.name, selectedFile.size, selectedFile.type);
        
        // Check if file is actually an image
        if (!selectedFile.type.startsWith('image/')) {
          setError('Please select a valid image file');
          setSaving(false);
          return;
        }
        
        // Convert file to base64
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            updateData.profilePic = reader.result; // This will be base64
            console.log('🔄 Sending profile update with image...');
            console.log('📸 Image data length:', updateData.profilePic.length);
            const updated = await updateProfile(phone, updateData);
            console.log('✅ Profile updated successfully:', updated);
            console.log('📸 New profilePic URL:', updated.user.profilePic);
                         setProfile(prev => ({ ...prev, ...updated.user }));
             // Update AuthContext so navbar shows the new profile picture
             updateUserData(updated.user);
             setSuccess('Profile updated successfully!');
             setSelectedImage(null); // Clear the preview
             setSelectedFile(null); // Clear the stored file
             setShowEdit(false); // Hide the edit form
          } catch (e) {
            console.error('❌ Profile update failed:', e);
            setError(e?.toString() || 'Failed to update profile');
          } finally {
            setSaving(false);
          }
        };
        
        reader.readAsDataURL(selectedFile);
        return; // Exit early, the async operation will continue
      }
      
             // If no file, just update the name
       console.log('🔄 Sending profile update without image...');
       const updated = await updateProfile(phone, updateData);
       console.log('✅ Profile updated successfully:', updated);
       setProfile(prev => ({ ...prev, ...updated.user }));
       // Update AuthContext so navbar shows the updated name
       updateUserData(updated.user);
       setSuccess('Profile updated successfully!');
       setSelectedImage(null); // Clear the preview
       setShowEdit(false); // Hide the edit form
    } catch (e) {
      console.error('❌ Profile update failed:', e);
      setError(e?.toString() || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setChangingPwd(true);
      setError('');
      setSuccess('');
      const phone = authUser?.phone || localStorage.getItem('userPhone');
      if (!phone) throw new Error('Missing user phone');
      const currentPassword = (document.getElementById('currentPassword') || {}).value;
      const newPassword = (document.getElementById('newPassword') || {}).value;
      const confirmNewPassword = (document.getElementById('confirmNewPassword') || {}).value;
      if (!currentPassword || !newPassword || !confirmNewPassword) throw new Error('Enter all password fields');
      if (newPassword !== confirmNewPassword) throw new Error('New passwords do not match');
      await changePassword(phone, { currentPassword, newPassword });
      setSuccess('Password changed');
      if (document.getElementById('currentPassword')) document.getElementById('currentPassword').value = '';
      if (document.getElementById('newPassword')) document.getElementById('newPassword').value = '';
      if (document.getElementById('confirmNewPassword')) document.getElementById('confirmNewPassword').value = '';
    } catch (e) {
      setError(e?.toString() || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📁 File selected:', file.name, file.size, file.type);
      setSelectedFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-20 font-['Inter'] md:bg-gray-100 md:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .text-primary {
          color: #4A3A2F;
        }
        .text-accent {
          color: #6D4C41;
        }
        .bg-light-gray {
          background-color: #F8F8F8;
        }
      `}</style>
      
      {/* MOBILE LAYOUT */}
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-light-gray rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {profile?.profilePic ? (
                  <img src={profile.profilePic} alt="avatar" className="w-20 h-20 object-cover" />
                ) : (
                  <div className="text-2xl font-bold text-white">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h1 className="text-xl font-semibold text-primary mb-1">
                {profile?.name || 'Your Name'}
              </h1>
              <p className="text-gray-600 mb-6">
                {profile?.email || 'your@email.com'}
              </p>
                              {showEdit && (
                <form onSubmit={handleEditProfile} className="space-y-3">
                  <div className="space-y-2">
                    <input 
                      id="avatarInput" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="w-full" 
                    />
                    {selectedImage && (
                      <div className="w-20 h-20 mx-auto">
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-full border-2 border-accent" 
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    defaultValue={profile?.name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button disabled={saving} className="w-full bg-accent text-white py-2 rounded-xl">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
                )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Your Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-light-gray rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">
                  {profile?.xp ?? 0}
                </div>
                <div className="text-sm text-gray-600">XP</div>
              </div>
              
              <div className="text-center p-4 bg-light-gray rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">
                  {profile?.referralChildren?.length ?? 0}
                </div>
                <div className="text-sm text-gray-600">Referrals</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Quick Links
            </h2>
            <div className="space-y-3">
              <a href="/history/visits" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Visit History</div>
                <div className="text-sm text-gray-600">View your cafe visits</div>
              </a>
              
              <a href="/history/points" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Points History</div>
                <div className="text-sm text-gray-600">Track your points activity</div>
              </a>
              
              <a href="/refer" className="block p-3 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors">
                <div className="font-medium text-primary">Refer Friends</div>
                <div className="text-sm text-gray-600">Earn bonus points</div>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="space-y-4">
              <button
                onClick={() => { 
                  setShowEdit((v) => !v); 
                  setShowChangePwd(false); 
                  if (!showEdit) {
                    setSelectedImage(null);
                    setSelectedFile(null);
                  }
                }}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Edit Profile</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </button>


              <button
                onClick={() => { setShowChangePwd((v) => !v); setShowEdit(false); }}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Change Password</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-primary">Logout</span>
                <LogOut className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block md:max-w-7xl md:mx-auto md:p-8">
        <div className="space-y-8">
          {/* Main Profile Header for Desktop */}
          <div className="bg-[#4A3A2F] text-white rounded-2xl shadow-lg p-12 text-center">
            <h1 className="text-4xl font-bold">Welcome back, {profile?.name || ''}!</h1>
            <p className="text-lg opacity-80 mt-2">Manage your account details and preferences.</p>
          </div>
          
          {/* Main Content Area for Desktop - a centered container for the profile card and actions */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-light-gray rounded-full mb-6 flex items-center justify-center overflow-hidden">
                  {profile?.profilePic ? (
                    <img src={profile.profilePic} alt="avatar" className="w-32 h-32 object-cover" />
                  ) : (
                    <div className="text-4xl font-bold text-white">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-semibold text-primary mb-1">
                  {profile?.name || 'Your Name'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {profile?.email || 'your@email.com'}
                </p>
                {showEdit && (
                <form onSubmit={handleEditProfile} className="w-full space-y-4">
                  <div className="space-y-2">
                    <input 
                      id="avatarInput" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="w-full" 
                    />
                    {selectedImage && (
                      <div className="w-32 h-32 mx-auto">
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-full border-2 border-accent" 
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    defaultValue={profile?.name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button disabled={saving} className="w-full bg-accent text-white py-2 rounded-xl">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
                )}
                <div className="w-full space-y-4">
                  <button
                    onClick={() => { 
                      setShowEdit((v) => !v);
                      if (!showEdit) {
                        setSelectedImage(null);
                        setSelectedFile(null);
                      }
                    }}
                    className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between mt-3"
                  >
                    <span className="font-medium text-primary">Edit Profile</span>
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-light-gray rounded-xl p-4 text-left hover:bg-gray-200 transition-colors flex items-center justify-between text-red-600"
                  >
                    <span className="font-medium">Logout</span>
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Stats and Quick Links */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Your Stats
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-light-gray rounded-xl">
                    <div className="text-4xl font-bold text-accent mb-2">
                      {profile?.xp ?? 0}
                    </div>
                    <div className="text-base text-gray-600">XP</div>
                  </div>
                  <div className="text-center p-6 bg-light-gray rounded-xl">
                    <div className="text-4xl font-bold text-accent mb-2">
                      {profile?.referralChildren?.length ?? 0}
                    </div>
                    <div className="text-base text-gray-600">Referrals</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Quick Links
                </h2>
                <div className="space-y-4">
                  <a href="/history/visits" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Visit History</div>
                      <div className="text-sm text-gray-600">View your cafe visits</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                  
                  <a href="/history/points" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Points History</div>
                      <div className="text-sm text-gray-600">Track your points activity</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                  
                  <a href="/refer" className="block p-4 bg-light-gray rounded-xl hover:bg-gray-200 transition-colors flex justify-between items-center">
                    <div>
                      <div className="font-medium text-primary">Refer Friends</div>
                      <div className="text-sm text-gray-600">Earn bonus points</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
