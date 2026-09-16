import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
const GuestGuard = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p role="status" className="p-8 text-center">Loading your account…</p>;
  return isLoggedIn ? children : <Navigate to="/login" state={{ from: {pathname:location.pathname,search:location.search} }} replace />;
};
export default GuestGuard;
