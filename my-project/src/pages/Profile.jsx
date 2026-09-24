import toast from "react-hot-toast";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { useUser } from "../components/context/UserContext";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileMobileHeader from "../components/profile/ProfileMobileHeader";

import Dashboard from "../components/profile/Dashboard";
import MyTickets from "../components/profile/MyTickets";
import MyBookings from "../components/profile/MyBookings";
import SavedItems from "../components/profile/SavedItems";
import PaymentHistory from "../components/profile/PaymentHistory";
import Notifications from "../components/profile/Notifications";
import SettingsSection from "../components/profile/SettingsSection";

const Profile = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { logout } = useAuth();
  const { user } = useUser();

  const [activeSection, setActiveSection] = useState(["Dashboard", "My Tickets", "My Bookings", "Saved Items", "Payment History", "Notifications", "Settings"].includes(params.get("section")) ? params.get("section") : "Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle sidebar navigation
  const handleMenuClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try { await logout(); navigate("/"); } catch (error) { toast.error(error.message); }
  };

  // All profile sections
  const sections = {
    Dashboard: (
      <Dashboard
        user={user}
        onEditProfile={() => setActiveSection("Settings")}
        onViewBookings={() => setActiveSection("My Bookings")}
      />
    ),

    "My Tickets": <MyTickets user={user} />,

    "My Bookings": <MyBookings />,

    "Saved Items": <SavedItems />,

    "Payment History": <PaymentHistory />,

    Notifications: <Notifications />,

    Settings: <SettingsSection user={user} />,
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <Seo title="My Profile" noIndex path="/profile" />
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
        <main className="w-full min-w-0 flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
          {sections[activeSection]}
        </main>
      </div>
    </div>
  );
};

export default Profile;
