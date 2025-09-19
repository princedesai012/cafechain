import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { format } from 'date-fns';

export default function CafeDetailPage() {
    const { cafeId } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [cafe, setCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ✅ DEBUG: Add console logs to trace the process
        console.log("CafeDetailPage has mounted.");
        console.log("Cafe ID from URL params:", cafeId);

        if (!cafeId) {
            console.error("No cafeId found in the URL. Cannot fetch data.");
            setIsLoading(false); // Stop loading if there's no ID
            return;
        }

        const fetchCafeDetails = async () => {
            try {
                console.log(`Attempting to send API request to: /api/admin/cafes/${cafeId}`);
                const response = await axios.get(`https://api.cafechain.in/api/admin/cafes/${cafeId}`);
                console.log("API Success! Response data:", response.data);
                setCafe(response.data);
            } catch (error) {
                toast.error("Failed to fetch cafe details.");
                // This will show the specific error (like 404 Not Found) in the console
                console.error("API Request Failed:", error);
            } finally {
                // This line is crucial. It ensures the loader is hidden
                // even if the API call fails.
                console.log("Fetch process finished. Hiding loader.");
                setIsLoading(false);
            }
        };

        fetchCafeDetails();
    }, [cafeId]); // This effect re-runs whenever the cafeId in the URL changes

    // Handler for updating the cafe's status
    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await axios.put(`https://api.cafechain.in/api/admin/cafes/${cafeId}/status`, { status: newStatus });
            toast.success(response.data.message);
            // Update the local state to instantly reflect the change in the UI
            setCafe(prevCafe => ({ ...prevCafe, status: newStatus }));
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Update Status Error:", error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!cafe) {
        return <div className="text-center p-8 text-xl font-semibold text-red-500">Cafe Not Found. It may have been deleted or the ID is incorrect.</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">
                &larr; Back to Cafe List
            </button>
            <h1 className="text-3xl font-bold mb-2">{cafe.name}</h1>
            <p className="text-gray-500 mb-6">{cafe.address}</p>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-600">Cafe Details</h3>
                        <DetailItem label="Business Phone" value={cafe.cafePhone} />
                        <DetailItem label="Status" value={cafe.status} isStatus={true} />
                        <DetailItem label="Account Created" value={format(new Date(cafe.createdAt), 'PPpp')} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Owner Details</h3>
                        <DetailItem label="Owner Name" value={cafe.ownerName} />
                        <DetailItem label="Owner Email" value={cafe.email} />
                        <DetailItem label="Owner Phone" value={cafe.ownerPhone} />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-600 mb-2">Admin Actions</h3>
                    <div className="flex flex-wrap gap-2">
                        {cafe.status !== 'active' && 
                            <button onClick={() => handleUpdateStatus('active')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Set Active</button>}
                        {cafe.status !== 'rejected' && 
                            <button onClick={() => handleUpdateStatus('rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Reject / Suspend</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for displaying details
const DetailItem = ({ label, value, isStatus = false }) => (
    <div className="mt-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isStatus ? (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                value === 'active' ? 'bg-green-100 text-green-800' : 
                value === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {value.replace('_', ' ')}
            </span>
        ) : (
            <p className="text-lg text-gray-800">{value || 'N/A'}</p>
        )}
    </div>
);

