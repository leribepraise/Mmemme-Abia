import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import VerificationScreen from '@/components/auth/VerificationScreen';
import PasswordStrength from '@/components/auth/PasswordStrength';
import { PASSWORD_HELP, passwordError } from '@/lib/passwordPolicy';
import { api, refreshSession } from '@/lib/api';

function destination(user, organizer) {
  return organizer
    ? user.role === 'ORGANIZER' && user.is_verified ? '/organizer/dashboard' : '/organizer/apply'
    : user.onboarding_completed_at ? '/dashboard' : '/Signup/onboarding';
}

function PasswordSetup({ email, onComplete }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault();
    const invalid = passwordError(password);
    if (invalid || password !== confirmation) {
      setError(invalid || 'Passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try { await onComplete(password, confirmation); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto mt-8 w-full max-w-md px-4 pb-12 sm:mt-14">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Create your password</h1>
      <p className="mt-2 text-sm text-slate-600">Your email <strong className="break-all">{email}</strong> is verified. Set a password to finish creating your account.</p>
      <form onSubmit={submit} className="mt-6 space-y-5">
        <label className="block text-sm font-medium text-slate-800">Password
          <input type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={128}
            value={password} onChange={event => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
        </label>
        <PasswordStrength password={password} />
        <p className="text-xs text-slate-600">{PASSWORD_HELP}</p>
        <label className="block text-sm font-medium text-slate-800">Confirm password
          <input type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={128}
            value={confirmation} onChange={event => setConfirmation(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={visible} onChange={event => setVisible(event.target.checked)} /> Show passwords
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-lg bg-green-800 px-5 py-3 font-semibold text-white disabled:opacity-50">
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  </main>;
}

export default function SocialAuthComplete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading, reloadUser } = useAuth();
  const [pending, setPending] = useState(null);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState('');
  const [accountReady, setAccountReady] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState('');
  const organizer = params.get('flow') === 'organizer';
  const providerError = params.get('error');
  const needsOtp = params.get('verify') === '1';
  useEffect(() => {
    if (!needsOtp || providerError) return;
    let active = true;
    api('/auth/social/pending/').then(result => { if (active) setPending(result); })
      .catch(failure => { if (active) setPendingError(failure.message); })
      .finally(() => { if (active) setPendingLoading(false); });
    return () => { active = false; };
  }, [needsOtp, providerError]);
  useEffect(() => {
    if (needsOtp || loading || providerError || !user) return;
    navigate(destination(user, organizer), { replace: true });
  }, [needsOtp, loading, user, organizer, providerError, navigate]);
  const recoverSession = async () => {
    if (!await refreshSession()) throw new Error('Your sign-in session expired. Please try again.');
    const currentUser = await reloadUser();
    navigate(destination(currentUser, organizer), { replace: true });
  };
  const complete = async action => {
    await action();
    setAccountReady(true);
    try { await recoverSession(); }
    catch (failure) { setError(failure.message); }
  };
  const verifyCode = async otp_code => {
    const result = await api('/auth/social/verify/', { method: 'POST', body: { otp_code } });
    if (result.needs_password) setPending(current => ({ ...current, stage: 'password' }));
    else await complete(async () => {});
  };
  const retry = async () => {
    setRetrying(true);
    setError('');
    try { await recoverSession(); }
    catch (failure) { setError(failure.message); }
    finally { setRetrying(false); }
  };
  if (needsOtp && !accountReady && !providerError) {
    if (pending?.stage === 'otp') return <VerificationScreen email={pending.email} onVerify={verifyCode}
      onResend={() => api('/auth/social/resend/', { method: 'POST' })}
      onBack={() => navigate(organizer ? '/organizer/signup' : '/Signup')}
      backLabel="Return to sign-up" submitLabel="Verify email" />;
    if (pending?.stage === 'password') return <PasswordSetup email={pending.email}
      onComplete={(password, confirm_password) => complete(() => api('/auth/social/password/',
        { method: 'POST', body: { password, confirm_password } }))} />;
    if (pendingLoading) return <main className="mx-auto max-w-md p-8" role="status">Preparing verification…</main>;
    if (pendingError) return <main className="mx-auto mt-12 max-w-md rounded-xl border bg-white p-8 text-center">
      <h1 className="text-xl font-bold">Verification session expired</h1>
      <p className="mt-3 text-sm text-gray-600">{pendingError}</p>
      <Link to={organizer ? '/organizer/signup' : '/Signup'} className="mt-5 block text-sm font-semibold text-green-800 underline">Start sign-up again</Link>
    </main>;
    return <main className="mx-auto max-w-md p-8" role="status">Preparing verification…</main>;
  }
  if (loading || (user && !providerError && !needsOtp)) return <main className="mx-auto max-w-md p-8" role="status">Finishing sign-in…</main>;
  return <main className="mx-auto mt-12 max-w-md rounded-xl border bg-white p-8 text-center">
    <h1 className="text-xl font-bold">Sign-in needs another try</h1>
    <p className="mt-3 text-sm text-gray-600">{error || (providerError === 'cancelled' ? 'Sign-in was cancelled.' : providerError === 'unavailable' ? 'This sign-in option is not configured yet.' : 'We could not complete sign-in. Please try again.')}</p>
    {!providerError && <button type="button" disabled={retrying} onClick={retry} className="mt-5 rounded-lg bg-green-800 px-5 py-2 text-white disabled:opacity-50">{retrying ? 'Trying…' : 'Try again'}</button>}
    <Link to={organizer ? '/organizer/login' : '/login'} className="mt-5 block text-sm font-semibold text-green-800 underline">Return to login</Link>
  </main>;
}
