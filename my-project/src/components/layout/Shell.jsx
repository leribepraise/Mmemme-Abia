import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-shell">
        <Header onMenu={() => setOpen(true)} />
        {children}
        {location !== '/dashboard' && <Footer />}
      </div>
    </div>
  );
}
