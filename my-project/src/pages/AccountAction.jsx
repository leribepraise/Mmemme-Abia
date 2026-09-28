import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';
import LoginLogo from '@/components/auth/login/LoginLogo';
import EmailCodeForm from '@/components/auth/EmailCodeForm';
import VerificationScreen from '@/components/auth/VerificationScreen';
import { PASSWORD_HELP, passwordError } from '@/lib/passwordPolicy';
export default function AccountAction() {
  const [params] = useSearchParams();
  const location = useLocation();
  const verify = location.pathname === '/verify-email';
  const { user } = useAuth();
  const [email, setEmail] = useState(location.state?.email || user?.email || '');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const token = params.get('token');
  const requestCode = () => api('/auth/resend-verification/', { method: 'POST', body: { email } });
  const submit = async event => {
    event.preventDefault(); setBusy(true);
    const fields = new FormData(event.currentTarget);
    try {
      if (verify) {
        await requestCode();
        setMessage('');
        setCodeSent(true);
      } else {
        const body = token ? { token, user: params.get('user'), password: fields.get('password') } : { email: fields.get('email') };
        if (token && passwordError(body.password)) throw new Error(passwordError(body.password));
        const result = await api(token ? '/auth/password-reset/confirm/' : '/auth/password-reset/', { method: 'POST', body });
        setMessage(result.detail);
      }
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  const verifyCode = async otp_code => {
    const result = await api('/auth/verify-email/', { method: 'POST', body: { email, otp_code } });
    setMessage(result.detail);
    setVerified(true);
  };
  if (verify && codeSent && !verified) return <VerificationScreen email={email} onVerify={verifyCode} onResend={requestCode} onBack={()=>setCodeSent(false)}/>;
  return <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12"><LoginLogo /><div className="max-w-lg mx-auto bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-5">
    <h1 className="text-[24px] font-bold text-[#1F2937]">{verify ? 'Verify your email' : 'Reset your password'}</h1>
    {verify && token && !verified && <p>Email verification now uses a code. Request a new code below.</p>}
    {verify && codeSent && !verified ? <EmailCodeForm email={email} onVerify={verifyCode} onResend={requestCode} onBack={() => setCodeSent(false)} /> : !verified && <form onSubmit={submit} className="space-y-5">
      {verify ? <label className="block text-sm">Email address<input required name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]" /></label> : <input required name={token ? 'password' : 'email'} type={token ? 'password' : 'email'} autoComplete={token ? 'new-password' : 'email'} placeholder={token ? 'New password' : 'Your email address'} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]" />}
      {!verify && token && <p className="text-xs text-gray-500">{PASSWORD_HELP}</p>}
      <button disabled={busy} className="w-full bg-[#1B5E20] text-white font-semibold py-3 rounded-[8px]">{busy ? 'Please wait...' : verify ? 'Send verification code' : token ? 'Save new password' : 'Send reset link'}</button>
    </form>}
    <p role="status">{message}</p><Link to="/login" className="text-[#48782E]">Back to login</Link>
    {verify && !verified && <Link to="/signup" className="block text-[#48782E]">New here? Create an account</Link>}
  </div></div>;
}
