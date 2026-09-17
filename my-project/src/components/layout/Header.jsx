import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const links = [
  ["/", "Home"],
  ["/events", "Events"],
  ["/hotels", "Hotels"],
  ["/restaurants", "Food"],
  ["/transport-routes", "Transport"],
  ["/tourism", "Explore Abia"],
];
export default function Header() {
  const { user, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="mx-5 pt-3">
      <nav
        aria-label="Main navigation"
        className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-white p-5 shadow-sm"
      >
        <Link to="/" aria-label="Mmemme Abia home">
          <img src="/logo.png" alt="Mmemme Abia" className="h-10 w-auto" />
        </Link>
        <button
          className="rounded border px-3 py-2 lg:hidden"
          aria-expanded={open}
          aria-controls="main-links"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <div
          id="main-links"
          className={
            (open ? "flex" : "hidden") +
            " w-full flex-col gap-5 lg:flex lg:w-auto lg:flex-row lg:items-center"
          }
        >
          {links.map(([path, title]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-[#3F7D3D] underline"
                  : "text-gray-700"
              }
            >
              {title}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-[#3F7D3D] px-4 py-2 text-[#3F7D3D]"
            >
              {user?.first_name || "My account"}
            </Link>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[#3F7D3D] px-4 py-2 text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
