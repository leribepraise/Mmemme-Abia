import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import PageSkeleton from '@/components/PageSkeleton';
import { authPagePath, clearAuthReturn, rememberAuthReturn, sharedEventPath } from '@/lib/authNavigation';

export default function SharedEventEntry() {
  const { id } = useParams();
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    const destination = sharedEventPath(id) === '/events' ? '/events' : `/events/${encodeURIComponent(id)}`;
    if (isLoggedIn) {
      clearAuthReturn();
      navigate(destination, { replace: true });
    } else {
      rememberAuthReturn(destination);
      navigate(authPagePath('/signup', destination), { replace: true, state: { from: destination } });
    }
  }, [id, isLoggedIn, loading, navigate]);
  return <PageSkeleton />;
}
