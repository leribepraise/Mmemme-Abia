import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  PlusSquare,
  Ticket,
  Users,
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { seedMessages } from "@/data/organizerData";
import { useAuth } from "@/components/context/AuthContext";

const unreadCount = seedMessages.filter((m) => m.unread).length;

const NAV_ITEMS = [
  { href: "/organizer/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/organizer/events", icon: Calendar, label: "My Events" },
  { href: "/organizer/events/new", icon: PlusSquare, label: "Create Event" },
  { href: "/organizer/ticket-sales", icon: Ticket, label: "Ticket & Sales" },
  { href: "/organizer/attendees", icon: Users, label: "Attendees" },
  { href: "/organizer/messages", icon: MessageSquare, label: "Messages", badge: unreadCount || null },
  { href: "/organizer/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/organizer/payouts", icon: CreditCard, label: "Payouts" },
  { href: "/organizer/settings", icon: Settings, label: "Settings" },
];

function isActive(href, pathname) {
  if (href === "/organizer/events") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const NavItem = ({ href, icon: Icon, label, badge, active }) => (
  <Link
    to={href}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
      active ? "bg-[#1E5B2A] text-white shadow-sm" : "text-white/85 hover:bg-white/10"
    }`}
    data-testid={`link-nav-${label.toLowerCase().replaceAll(" ", "-")}`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-[18px] h-[18px]" />
      <span>{label}</span>
    </div>
    {!!badge && (
      <span className="bg-[#F36B25] text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
        {badge}
      </span>
    )}
  </Link>
);

export default function OrganizerSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/organizer/login");
  };
  return (
    <aside
      className="w-64 bg-[#3F7D3D] hidden lg:flex flex-col h-screen sticky top-0 shrink-0"
      data-testid="sidebar-organizer"
    >
      <div className="p-5">
        <Link to="/" className="flex items-center gap-2.5 mb-8" data-testid="link-sidebar-logo">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
            <span className="text-[#F36B25] font-black text-xl leading-none">M</span>
          </div>
          <div className="leading-tight">
            <p className="text-white font-extrabold text-sm tracking-tight">Mmemme</p>
            <p className="text-[#F9A857] font-extrabold text-[10px] tracking-widest -mt-0.5">ABIA</p>
          </div>
        </Link>
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={isActive(item.href, pathname)} />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-5 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-[#F9A857] hover:text-white font-bold text-sm transition-colors px-4 py-2"
          data-testid="button-organizer-logout"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
