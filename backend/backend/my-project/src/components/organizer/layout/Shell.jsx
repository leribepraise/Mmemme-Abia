import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation().pathname;
  return (
    <div className="organizer-app app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-shell">
        <Header onMenu={() => setOpen(true)} />
        {children}
        {location !== "/organizer/dashboard" && <Footer />}
      </div>
    </div>
  );
}
