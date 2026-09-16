import React, { useEffect, useState } from "react";

import {
  Ticket,
  CalendarDays,
  Heart,
  Users,
  MapPin,
  CalendarCheck,
  Edit,
  Globe,
  Banknote,
  Bell,
  Moon,
} from "lucide-react";

import StatCard from "./common/StatCard";
import BookingCard from "./common/BookingCard";
import Info from "./common/Info";
import Preference from "./common/Preference";

const Dashboard = ({ user, onEditProfile }) => {
  const [bookings, setBookings] = useState([]);

  // Get bookings from sessionStorage
  useEffect(() => {
    const savedBookings = sessionStorage.getItem("bookings");

    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings);

        if (Array.isArray(parsedBookings)) {
          setBookings(parsedBookings);
        }
      } catch (error) {
        console.error("Error reading bookings:", error);
        setBookings([]);
      }
    }
  }, []);

  // Get the user's selected plan
  const formattedPlan = user?.plan
    ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
    : "Not selected";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1100px] overflow-hidden">
      {/* HEADER CARD */}
      <div className="flex flex-col gap-5 rounded-xl bg-[#174A20] p-5 text-white sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {/* PROFILE IMAGE */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#EAF4EB]">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#3F783D]">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>

          {/* USER INFO */}
          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              {user?.fullName || "User"}
            </h1>

            <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-gray-200">
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                Abia, Nigeria
              </span>

              <span className="flex items-center gap-1">
                <CalendarDays size={11} />
                Joined 2026
              </span>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <button
          onClick={onEditProfile}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-xs transition hover:bg-white/10"
        >
          <Edit size={13} />
          Edit Profile
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<CalendarCheck size={17} />}
          number={bookings.length}
          label="Bookings"
        />

        <StatCard
          icon={<Ticket size={17} />}
          number="0"
          label="Events Attended"
        />

        <StatCard icon={<Heart size={17} />} number="0" label="Saved Places" />

        <StatCard
          icon={<Users size={17} />}
          number="0"
          label="Community Posts"
        />
      </div>

      {/* RECENT BOOKINGS */}
      <section className="mt-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-[#172033]">Recent Bookings</h2>

          <button className="text-xs font-medium text-[#3F783D] hover:underline">
            View All
          </button>
        </div>

        {bookings.length === 0 ? (
          /* EMPTY BOOKING STATE */
          <div className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-5 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4EB]">
              <CalendarCheck size={18} className="text-[#3F783D]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#172033]">
              No recent booking
            </h3>

            <p className="mt-1 max-w-[300px] text-[10px] leading-4 text-gray-400">
              You haven't made any bookings yet. Explore events and make your
              first booking.
            </p>
          </div>
        ) : (
          /* BOOKING CARDS */
          <div className="w-full min-w-0 overflow-hidden">
            <div className="flex w-full gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {bookings.map((booking, index) => (
                <div
                  key={booking.id || index}
                  className="w-[280px] min-w-[280px] shrink-0 md:w-[300px] md:min-w-[300px]"
                >
                  <BookingCard
                    image={booking.image}
                    title={booking.title}
                    location={booking.location}
                    status={booking.status}
                    price={booking.price}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BOTTOM INFORMATION */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* ACCOUNT INFORMATION */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-[#172033]">Account Information</h2>

          <Info label="Full Name" value={user?.fullName || "Not provided"} />

          <Info label="Email" value={user?.email || "Not provided"} />

          <Info label="Phone Number" value={user?.phone || "Not provided"} />

          <Info label="Membership" value={`${formattedPlan} Plan`} green />

          <button className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-xs transition hover:bg-gray-50">
            Edit Information
          </button>
        </div>

        {/* PAYMENT */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-[#172033]">Payment Methods</h2>

          <div className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-10 items-center justify-center rounded bg-blue-700 text-[8px] font-bold text-white">
                  VISA
                </div>

                <div>
                  <p className="text-xs font-medium">Visa ending in 4242</p>

                  <span className="text-[9px] text-green-600">Default</span>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-3 w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs transition hover:bg-gray-50">
            + Add New Card
          </button>
        </div>

        {/* PREFERENCES */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-[#172033]">Preferences</h2>

          <Preference
            icon={<Globe size={14} />}
            label="Language"
            value="English"
          />

          <Preference
            icon={<Banknote size={14} />}
            label="Currency"
            value="NGN (₦)"
          />

          <Preference
            icon={<Bell size={14} />}
            label="Notifications"
            value="Enabled"
          />

          <Preference
            icon={<Moon size={14} />}
            label="Dark Mode"
            value="Disabled"
          />

          <button className="mt-5 w-full rounded-lg border border-gray-200 py-2 text-xs transition hover:bg-gray-50">
            Edit Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
