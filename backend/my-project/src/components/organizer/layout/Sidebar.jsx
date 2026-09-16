import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Brand } from "./Brand";
import { navItems } from "./navItems";

export function Sidebar({ open, onClose }) {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} data-testid="sidebar">
      <Brand />
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/organizer/dashboard"
              ? location === href
              : location === href || (href === "/organizer/events" && location.startsWith("/organizer/events/") && location !== "/organizer/events/new");
          return (
            <Link
              key={href}
              to={href}
              className={`nav-link ${active ? "active" : ""}`}
              onClick={onClose}
              data-testid={`link-nav-${label.toLowerCase().replaceAll(" ", "-")}`}
            >
              <Icon />
              <span>{label}</span>
              {label === "Messages" && <span className="status status-draft" style={{ marginLeft: "auto" }}>2</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-link logout" onClick={() => navigate("/organizer/login")} data-testid="button-logout">
          <LogOut /><span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
