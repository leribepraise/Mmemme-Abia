import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, MessageSquare } from "lucide-react";

export function Header({ onMenu }) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={onMenu} aria-label="Open menu" data-testid="button-open-menu">
        <Menu />
      </button>
      <div className="topbar-welcome">
        <strong>Welcome back, Shalom Events <span aria-hidden="true">👋</span></strong>
        <span>Here’s what’s happening with your events</span>
      </div>
      <div className="user-menu">
        <Link to="/organizer/events/new" className="btn btn-accent header-create" data-testid="button-header-create-event">Create Event</Link>
        <button className="header-icon" aria-label="Open messages" onClick={() => navigate("/organizer/messages")} data-testid="button-header-messages">
          <MessageSquare /><i>5</i>
        </button>
        <button className="header-icon" aria-label="Open notifications" data-testid="button-notifications">
          <Bell /><i>3</i>
        </button>
        <button className="avatar" onClick={() => navigate("/organizer/settings")} aria-label="Open account settings" data-testid="button-profile-avatar">
          <img src="/user.png" alt="" />
        </button>
        <button className="icon-btn" aria-label="Account menu" onClick={() => navigate("/organizer/settings")} data-testid="button-account-menu">
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}
