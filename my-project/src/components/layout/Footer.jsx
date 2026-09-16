import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="mt-12 bg-[#3F783D] px-6 py-10 text-white"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
    <div><h2 className="text-xl font-bold">Mmemme Abia</h2><p className="mt-3">Discover, book and experience Abia.</p></div>
    <nav aria-label="Explore" className="flex flex-col gap-2"><Link to="/events">Events</Link><Link to="/hotels">Hotels</Link><Link to="/restaurants">Food</Link><Link to="/transport-routes">Transport</Link><Link to="/tourism">Tourism</Link></nav>
    <nav aria-label="Account" className="flex flex-col gap-2"><Link to="/account">My bookings and tickets</Link><Link to="/account">Become a provider</Link><Link to="/organizer/dashboard">Provider dashboard</Link><Link to="/reset-password">Reset password</Link></nav>
  </div><p className="mx-auto mt-8 max-w-6xl border-t border-white/30 pt-5 text-sm">© {new Date().getFullYear()} Mmemme Abia.</p></footer>;
}
