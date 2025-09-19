import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Hook to read URL parameters
import axios from "axios";
import toast from "react-hot-toast";
import UserProfileTabs from "../components/UserProfileTabs";
import Loader from "../components/Loader";

export default function UserProfilePage() {
    const { userId } = useParams(); // Get the user's ID from the URL
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`https://api.cafechain.in/api/admin/users/${userId}`);
                setUser(response.data);
            } catch (err) {
                toast.error("Could not load user data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]); // Re-run this effect if the userId in the URL changes

    if (isLoading) return <Loader />;
    if (!user) return <div className="text-center p-8">User not found.</div>;

    return (
        <div>
             <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">
                &larr; Back to User List
            </button>
            {/* ✅ Pass the fetched user data down to the tabs component */}
            <UserProfileTabs user={user} />
        </div>
    );
}