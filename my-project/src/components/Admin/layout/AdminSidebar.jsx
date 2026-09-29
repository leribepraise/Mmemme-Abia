import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  CalendarDays,
  Compass,
  Hotel,
  ChevronDown,
  UtensilsCrossed,
  Bus,
  MessagesSquare,
  Mail,
  ClipboardList,
  Wallet,
  BadgeCheck,
  FileText,
  BarChart3,
  ShieldAlert,
  Bell,
  Headset,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Organizers", to: "/admin/organizers", icon: UsersRound },
  { label: "Organizer inbox", to: "/admin/organizer-inbox", icon: Mail },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Tourism", to: "/admin/tourism", icon: Compass },
  // "Hotels & Stays" is rendered separately below as an expandable item
  { label: "Food", to: "/admin/food", icon: UtensilsCrossed },
  { label: "Transport", to: "/admin/transport", icon: Bus },
  { label: "Community", to: "/admin/community", icon: MessagesSquare },
  { label: "Bookings", to: "/admin/bookings", icon: ClipboardList },
  { label: "Payments", to: "/admin/payments", icon: Wallet },
  { label: "Subscriptions", to: "/admin/subscriptions", icon: BadgeCheck },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Reports & Moderation", to: "/admin/reports", icon: ShieldAlert },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Support", to: "/admin/support", icon: Headset },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

// Hotel management uses the same live records as customer bookings.
const hotelsSubItems = [
  { label: "Properties", to: "/admin/hotels/properties" },
  { label: "Rooms", to: "/admin/hotels/rooms" },
  { label: "Bookings", to: "/admin/hotels/bookings" },
  { label: "Hosts", to: "/admin/hotels/hosts" },
  { label: "Reviews", to: "/admin/hotels/reviews" },
];

const NAV_LINK_CLASS =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors";
const NAV_LINK_ACTIVE = "bg-[#1f6b33] text-white";
const NAV_LINK_INACTIVE = "text-green-50/80 hover:bg-white/10 hover:text-white";

const HotelsDropdown = () => {
  const location = useLocation();
  const isOnHotelsSection = location.pathname.startsWith("/admin/hotels");
  const [open, setOpen] = useState(isOnHotelsSection);

  // Keep the dropdown open automatically while on any of its sub-pages
  // (e.g. navigating there via a direct link or a "View details" redirect).
  useEffect(() => {
    if (isOnHotelsSection) setOpen(true);
  }, [isOnHotelsSection]);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
          isOnHotelsSection
            ? "text-white"
            : "text-green-50/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Hotel className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">Hotels & Stays</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className="mt-0.5 space-y-0.5 pl-7">
          {hotelsSubItems.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#1f6b33] text-white"
                      : "text-green-50/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const AdminSidebar = ({ open, onClose }) => {
  const location = useLocation();
  useEffect(() => { onClose?.(); }, [location.pathname]);
  return (
    <>
      {/* Dark overlay behind the drawer on mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-52 overflow-y-auto bg-[#0f3d1b] px-2 py-3 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav aria-label="Admin navigation">
          <ul className="space-y-0.5">
            {navItems.slice(0, 5).map(({ label, to, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${NAV_LINK_CLASS} ${
                      isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </NavLink>
              </li>
            ))}

            <HotelsDropdown />

            {navItems.slice(5).map(({label,to,icon:Icon})=><li key={label}><NavLink to={to} className={({isActive})=>`${NAV_LINK_CLASS} ${isActive?NAV_LINK_ACTIVE:NAV_LINK_INACTIVE}`}><Icon className="h-4 w-4 shrink-0"/><span>{label}</span></NavLink></li>)}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
