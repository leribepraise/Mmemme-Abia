import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import { refreshSession } from '@/lib/api';

export default function SocialAuthComplete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading, reloadUser } = useAuth();
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState('');
  const organizer = params.get('flow') === 'organizer';
  const providerError = params.get('error');
  useEffect(() => {
    if (loading || providerError || !user) return;
    const destination = organizer
      ? user.role === 'ORGANIZER' && user.is_verified ? '/organizer/dashboard' : '/organizer/apply'
      : user.onboarding_completed_at ? '/dashboard' : '/Signup/onboarding';
    navigate(destination, { replace: true });
  }, [loading, user, organizer, providerError, navigate]);
  const retry = async () => {
    setRetrying(true);
    setError('');
    try {
      if (!await refreshSession()) throw new Error('Your sign-in session expired. Please try again.');
      await reloadUser();
    } catch (failure) { setError(failure.message); }
    finally { setRetrying(false); }
  };
  if (loading || (user && !providerError)) return <main className="mx-auto max-w-md p-8" role="status">Finishing sign-in…</main>;
  return <main className="mx-auto mt-12 max-w-md rounded-xl border bg-white p-8 text-center">
    <h1 className="text-xl font-bold">Sign-in needs another try</h1>
    <p className="mt-3 text-sm text-gray-600">{error || (providerError === 'cancelled' ? 'Sign-in was cancelled.' : providerError === 'unavailable' ? 'This sign-in option is not configured yet.' : 'We could not complete sign-in. Please try again.')}</p>
    {!providerError && <button type="button" disabled={retrying} onClick={retry} className="mt-5 rounded-lg bg-green-800 px-5 py-2 text-white disabled:opacity-50">{retrying ? 'Trying…' : 'Try again'}</button>}
    <Link to={organizer ? '/organizer/login' : '/login'} className="mt-5 block text-sm font-semibold text-green-800 underline">Return to login</Link>
  </main>;
}
