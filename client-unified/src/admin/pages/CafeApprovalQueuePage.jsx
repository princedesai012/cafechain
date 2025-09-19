import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CafeTable from "../components/CafeTable";
import CafeDetailModal from "../components/CafeDetailModal";
import Loader from "../components/Loader"; // Assuming you have a loader component

export default function CafeApprovalQueuePage() {
    const [pendingCafes, setPendingCafes] = useState([]);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch pending cafes from the backend
    const fetchPendingCafes = async () => {
        try {
            const response = await axios.get("https://api.cafechain.in/api/admin/cafes/pending");
            setPendingCafes(response.data);
        } catch (error) {
            toast.error("Failed to fetch pending cafes.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchPendingCafes();
    }, []);

    // Handler for approving a cafe
    const handleApprove = async (cafeId) => {
        try {
            const response = await axios.put(`https://api.cafechain.in/api/admin/cafes/${cafeId}/approve`);
            toast.success(response.data.message);
            // Update the UI by removing the approved cafe from the list
            setPendingCafes(currentCafes => currentCafes.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null); // Close the modal
        } catch (error) {
            toast.error("Failed to approve cafe.");
            console.error(error);
        }
    };

    // Handler for rejecting a cafe
    const handleReject = async (cafeId, reason) => {
        // The reason can be used later to send an email, for now we just log it
        console.log(`Rejecting cafe ${cafeId} for reason: ${reason}`);
        try {
            const response = await axios.delete(`https://api.cafechain.in/api/admin/cafes/${cafeId}/reject`);
            toast.success(response.data.message);
            // Update the UI by removing the rejected cafe
            setPendingCafes(currentCafes => currentCafes.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null); // Close the modal
        } catch (error) {
            toast.error("Failed to reject cafe.");
            console.error(error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Cafe Approval Queue</h1>
            {pendingCafes.length > 0 ? (
                <CafeTable
                    cafes={pendingCafes}
                    onRowClick={setSelectedCafe}
                    approvalMode
                />
            ) : (
                <p className="text-gray-500">There are no pending cafe approvals.</p>
            )}

            {selectedCafe && (
                <CafeDetailModal
                    cafe={selectedCafe}
                    onClose={() => setSelectedCafe(null)}
                    onApprove={() => handleApprove(selectedCafe._id)}
                    onReject={(reason) => handleReject(selectedCafe._id, reason)}
                />
            )}
        </div>
    );
}