import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import PageSkeleton from '@/components/PageSkeleton';
import { useApi } from '@/hooks/useApi';
import { authPagePath, clearAuthReturn, rememberAuthReturn, sharedEventPath } from '@/lib/authNavigation';

export default function SharedEventEntry() {
  const { id } = useParams();
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const valid = sharedEventPath(id) !== '/events';
  const request = useApi(valid ? `/events/shared/${encodeURIComponent(id)}/` : null);
  useEffect(() => {
    if (loading || !request.data) return;
    const destination = `/events/${encodeURIComponent(request.data.id)}`;
    if (isLoggedIn) {
      clearAuthReturn();
      navigate(destination, { replace: true });
    } else {
      rememberAuthReturn(destination);
      navigate(authPagePath('/signup', destination), { replace: true, state: { from: destination } });
    }
  }, [request.data, isLoggedIn, loading, navigate]);
  if (!valid || request.error) return <main className="mx-auto max-w-lg space-y-4 p-6"><h1 className="text-xl font-bold">Event unavailable</h1><p>This event may have ended or been removed.</p><Link to="/events" className="text-green-700 underline">Explore other events</Link></main>;
  return <PageSkeleton />;
}
