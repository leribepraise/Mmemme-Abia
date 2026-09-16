import { Link, useLocation } from 'wouter';
import { LogOut } from 'lucide-react';
import { Brand } from './Brand';
import { navItems } from './navItems';

export function Sidebar({ open, onClose }) {
  const [location, setLocation] = useLocation();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} data-testid="sidebar">
      <Brand />
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? location === href
              : location === href || (href === '/events' && location.startsWith('/events/') && location !== '/events/new');
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={onClose}
              data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
            >
              <Icon />
              <span>{label}</span>
              {label === 'Messages' && <span className="status status-draft" style={{ marginLeft: 'auto' }}>2</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-link logout" onClick={() => setLocation('/login')} data-testid="button-logout">
          <LogOut /><span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
