import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const GuestGuard = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <p role="status">Loading your account...</p>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default GuestGuard;
