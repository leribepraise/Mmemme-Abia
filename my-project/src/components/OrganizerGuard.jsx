import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
export default function OrganizerGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Loading your account...</p>;
  if (!user) return <Navigate to="/organizer/login" replace />;
  if (!user.is_staff && !(user.role === 'ORGANIZER' && user.is_verified)) return <Navigate to="/profile" replace />;
  return children;
}
