import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileMobileHeader from "../components/profile/ProfileMobileHeader";

import Dashboard from "../components/profile/Dashboard";
import MyTickets from "../components/profile/MyTickets";
import MyBookings from "../components/profile/MyBookings";
import SavedItems from "../components/profile/SavedItems";
import PaymentHistory from "../components/profile/PaymentHistory";
import Notifications from "../components/profile/Notifications";
import SettingsPage from "../components/profile/SettingsPage";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get logged-in user
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  // Handle sidebar navigation
  const handleMenuClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  // All profile sections
  const sections = {
    Dashboard: (
      <Dashboard
        user={user}
        onEditProfile={() => setActiveSection("Settings")}
      />
    ),

    "My Tickets": <MyTickets user={user} />,

    "My Bookings": <MyBookings />,

    "Saved Items": <SavedItems />,

    "Payment History": <PaymentHistory />,

    Notifications: <Notifications />,

    Settings: <SettingsPage user={user} />,
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* MOBILE HEADER */}
      <ProfileMobileHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex min-h-[calc(100vh-65px)] lg:min-h-screen">
        {/* SIDEBAR */}
        <ProfileSidebar
          user={user}
          activeSection={activeSection}
          mobileMenuOpen={mobileMenuOpen}
          onMenuClick={handleMenuClick}
          onLogout={handleLogout}
        />

        {/* MOBILE OVERLAY */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[65px] z-30 bg-black/20 lg:hidden"
          />
        )}

        {/* MAIN CONTENT */}
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          {sections[activeSection]}
        </main>
      </div>
    </div>
  );
};

export default Profile;
