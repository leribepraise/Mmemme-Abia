import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';
import LoginLogo from '@/components/auth/login/LoginLogo';
export default function AccountAction() {
  const [params] = useSearchParams();
  const verify = useLocation().pathname === '/verify-email';
  const { user, reloadUser } = useAuth();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const token = params.get('token');
  const submit = async event => {
    event.preventDefault(); setBusy(true);
    const fields = new FormData(event.currentTarget);
    try {
      const path = verify ? token ? '/auth/verify-email/' : '/auth/resend-verification/' : token ? '/auth/password-reset/confirm/' : '/auth/password-reset/';
      const body = verify ? { token } : token ? { token, user: params.get('user'), password: fields.get('password') } : { email: fields.get('email') };
      const result = await api(path, { method: 'POST', body });
      setMessage(result.detail);
      if (verify && token && user) await reloadUser();
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12"><LoginLogo /><form onSubmit={submit} className="max-w-lg mx-auto bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-5">
    <h1 className="text-[24px] font-bold text-[#1F2937]">{verify ? 'Verify your email' : 'Reset your password'}</h1>
    {!verify && <input required name={token ? 'password' : 'email'} type={token ? 'password' : 'email'} autoComplete={token ? 'new-password' : 'email'} placeholder={token ? 'New password' : 'Your email address'} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]" />}
    {verify && !token && !user ? <p>Log in to request a new verification email.</p> : <button disabled={busy} className="w-full bg-[#1B5E20] text-white font-semibold py-3 rounded-[8px]">{busy ? 'Please wait...' : verify ? token ? 'Verify email' : 'Resend verification email' : token ? 'Save new password' : 'Send reset link'}</button>}
    <p role="status">{message}</p><Link to="/login" className="text-[#48782E]">Back to login</Link>
  </form></div>;
}
