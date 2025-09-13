import React, { useState } from "react";
import UserProfileTabs from "../components/UserProfileTabs";

export default function UserProfilePage() {
  const [tab, setTab] = useState("profile");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <UserProfileTabs tab={tab} setTab={setTab} />
    </div>
  );
}