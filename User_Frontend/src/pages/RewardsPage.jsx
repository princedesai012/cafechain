// RewardsPage.jsx (Final version with share functionality)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getRewardsHistory } from '../api/api';
import { ArrowRight, Share2 } from 'lucide-react';

const RewardsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [rewardsData, setRewardsData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllHistory, setShowAllHistory] = useState(false);

    useEffect(() => {
        const fetchRewardsData = async () => {
            if (authLoading) return;

            if (!user || !user.phone) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const [profileRes, historyRes] = await Promise.all([
                    getProfile(user.phone),
                    getRewardsHistory(user.phone)
                ]);

                const pointsEarned = profileRes.points.reduce((total, p) => total + p.totalPoints, 0);

                setRewardsData({
                    pointsEarned: pointsEarned,
                    xpPoints: profileRes.xp,
                    referredCount: profileRes.referralChildren.length,
                    referralCode: profileRes.referralCode
                });
                
                setHistoryData(historyRes);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch rewards data:", err);
                setError("Failed to load rewards data. Please try again.");
                setLoading(false);
            }
        };

        fetchRewardsData();
    }, [user, authLoading]);

    const handleShareReferral = async () => {
        if (!rewardsData || !rewardsData.referralCode) {
            return;
        }

        const referralCode = rewardsData.referralCode;
        const shareText = `Hey! Join me on our CafeChain and earn bonus points. Use my referral code: ${referralCode}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Our CafeChain Club!',
                    text: shareText,
                    url: window.location.origin
                });
                console.log('Referral code shared successfully.');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('Referral code copied to clipboard! Share it with your friends.');
            } catch (error) {
                console.error('Failed to copy referral code:', error);
                alert('Failed to copy referral code. Please try again.');
            }
        }
    };

    const handleViewAllHistory = () => {
        setShowAllHistory(!showAllHistory);
    };

    const handleClaimReward = () => {
        navigate('/claim-reward');
    };

    const displayedHistory = showAllHistory ? historyData : historyData.slice(0, 2);

    if (loading) {
        return <div className="text-center mt-10">Loading rewards...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600">{error}</div>;
    }

    if (!rewardsData) {
        return <div className="text-center mt-10">No rewards data available.</div>;
    }

    return (
        <div className="pb-20 font-['Inter'] md:bg-gray-100 md:pb-0">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              .shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
              .bg-accent { background-color: #6D4C41; }
              .text-accent { color: #6D4C41; }
              .bg-dark-brown { background-color: #4A3A2F; }
              .text-dark-brown { color: #4A3A2F; }
              .bg-light-gray { background-color: #F8F8F8; }
            `}</style>
            
            <div className="block md:hidden">
              <div className="px-4 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                      <div className="text-sm text-gray-600 mb-1">Points you earn</div>
                      <div className="text-3xl font-bold text-accent mb-1">
                        {rewardsData.pointsEarned}
                      </div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                      <div className="text-sm text-gray-600 mb-1">XP points</div>
                      <div className="text-3xl font-bold text-accent mb-1">
                        {rewardsData.xpPoints}
                      </div>
                      <div className="text-sm text-gray-600">XP</div>
                    </div>
                  </div>
                  <div
                    onClick={handleClaimReward}
                    className="bg-white rounded-2xl shadow-soft p-6 text-center flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
                  >
                    <div className="text-dark-brown">
                      <div className="text-sm text-gray-600 mb-1">Referred</div>
                      <div className="text-3xl font-bold text-accent mb-1">
                        {rewardsData.referredCount}
                      </div>
                      <button className="text-sm font-semibold text-accent mt-2 hover:underline">
                        Claim Reward
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h2 className="text-lg font-semibold text-dark-brown mb-4">
                    Your Referral Code
                  </h2>
                  <div className="flex items-center justify-between p-4 bg-light-gray rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-accent">
                        {rewardsData.referralCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        Share with friends to earn bonus points
                      </div>
                    </div>
                    <button
                      onClick={handleShareReferral}
                      className="p-3 bg-accent text-white rounded-xl hover:bg-dark-brown transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-dark-brown">
                      History
                    </h2>
                    <button
                      onClick={handleViewAllHistory}
                      className="text-sm text-accent hover:text-dark-brown transition-colors flex items-center"
                    >
                      {showAllHistory ? 'view less' : 'view all'}
                      <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displayedHistory.map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-light-gray rounded-xl">
                        <div>
                          <div className="font-medium text-dark-brown">{item.description}</div>
                          <div className="text-sm text-gray-600">{item.cafeId?.name || 'N/A'}</div>
                        </div>
                        <div className={`font-semibold ${
                          item.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.points > 0 ? '+' : ''}{item.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block md:max-w-7xl md:mx-auto md:p-8">
              <div className="space-y-8">
                <div className="bg-dark-brown rounded-2xl p-8 text-white text-center shadow-lg">
                  <h1 className="text-4xl font-bold mb-2">Your Rewards</h1>
                  <p className="text-lg opacity-90">Track your points history and see how you’ve earned and redeemed.</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center">
                    <div className="text-base text-gray-600 mb-2">Total Points Balance</div>
                    <div className="text-5xl font-bold text-accent">
                      {rewardsData.pointsEarned}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center">
                    <div className="text-base text-gray-600 mb-2">Total XP</div>
                    <div className="text-5xl font-bold text-accent">
                      {rewardsData.xpPoints}
                    </div>
                  </div>
                  <div
                    onClick={handleClaimReward}
                    className="bg-white rounded-2xl shadow-soft p-8 text-center flex flex-col justify-center cursor-pointer transition-transform transform hover:scale-105"
                  >
                    <div className="text-base text-gray-600 mb-2">Total Referrals</div>
                    <div className="text-5xl font-bold text-accent">
                      {rewardsData.referredCount}
                    </div>
                    <button className="text-base font-semibold text-accent mt-4 hover:underline">
                      Claim Reward
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-dark-brown mb-2">
                      Your Unique Referral Code
                    </h2>
                    <div className="flex items-center space-x-4 p-4 bg-light-gray rounded-xl">
                      <div className="text-3xl font-bold text-accent">
                        {rewardsData.referralCode}
                      </div>
                      <p className="text-sm text-gray-600">
                        Share this code with your friends to earn bonuses.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleShareReferral}
                    className="p-4 bg-accent text-white rounded-xl hover:bg-dark-brown transition-colors ml-6"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-dark-brown">
                      Redemption History
                    </h2>
                    <button
                      onClick={handleViewAllHistory}
                      className="text-base text-accent hover:text-dark-brown transition-colors flex items-center"
                    >
                      {showAllHistory ? 'View Less' : 'View All'}
                      <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {displayedHistory.map((item) => (
                      <div key={item._id} className="grid grid-cols-4 items-center p-4 bg-light-gray rounded-xl text-dark-brown">
                        <div className="col-span-2">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-gray-600">{item.cafeId?.name || 'N/A'}</div>
                        </div>
                        <div className={`text-center font-semibold ${
                          item.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.points > 0 ? '+' : ''}{item.points}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
};

export default RewardsPage;