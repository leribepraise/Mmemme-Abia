import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/SignUp" replace />;
};

export default GuestGuard;
