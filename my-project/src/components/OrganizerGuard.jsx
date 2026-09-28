import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
export default function OrganizerGuard({ children }) {
  const location=useLocation();
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Loading your account...</p>;
  if (!user) return <Navigate to="/organizer/login" state={{from:location.pathname+location.search}} replace />;
  if (!user.is_staff && !(user.role === 'ORGANIZER' && user.is_verified)) return <Navigate to="/organizer/apply" replace />;
  return children;
}
