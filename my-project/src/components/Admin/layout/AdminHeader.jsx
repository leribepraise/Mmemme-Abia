import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useCollection } from "@/hooks/useApi";
import { useNotifications } from '@/components/context/NotificationsContext';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";

// Adjust this path to wherever your logo lives
import logo from "/logo.png";

const AdminHeader = ({ onMenuClick }) => {
  const {user,logout}=useAuth();
  const navigate=useNavigate();
  const [search,setSearch]=useState('');
  const {unreadCount:notificationCount}=useNotifications();
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-3 rounded-b-2xl bg-white px-4 shadow-md sm:px-6">
      {/* Left: menu button (mobile/tablet) + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/admin" aria-label="Mmemme Abia admin home">
          <img src={logo} alt="Mmemme Abia" className="h-9 w-auto sm:h-10" />
        </Link>
      </div>

      {/* Center: search (hidden on small screens) */}
      <form onSubmit={event=>{event.preventDefault();navigate(`/admin/users?search=${encodeURIComponent(search)}`);}} className="hidden w-full max-w-md md:block">
        <label htmlFor="admin-search" className="sr-only">
          Search users
        </label>
        <div className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 focus-within:ring-2 focus-within:ring-[#14481f]/30">
          <Search
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="admin-search"
            type="search" value={search} onChange={event=>setSearch(event.target.value)}
            placeholder="Search users..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </form>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={()=>navigate("/notifications")}
          aria-label={`Notifications, ${notificationCount} unread`}
          className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Swap this for the admin's real photo once auth is connected */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14481f] text-sm font-semibold text-white"
          aria-label="Admin profile"
        >
          {(user?.first_name || user?.email || "A")[0].toUpperCase()}
        </div>
      <button onClick={async()=>{try{await logout();navigate("/admin/login");}catch(error){toast.error(error.message);}}} className="text-sm text-green-800">Log out</button>
      </div>
    </header>
  );
};

export default AdminHeader;
