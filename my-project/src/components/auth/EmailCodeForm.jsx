import { useEffect, useRef, useState } from 'react';

export default function EmailCodeForm({ email, onVerify, onResend, onBack, submitLabel = 'Verify email' }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Check your inbox and spam folder. The code expires in 10 minutes.');
  const [busy, setBusy] = useState(false);
  const [deadline, setDeadline] = useState(() => Date.now() + 60000);
  const [seconds, setSeconds] = useState(60);
  const working = useRef(false);
  useEffect(() => {
    const update = () => setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  const run = async (resend) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    try {
      if (resend) {
        await onResend();
        setCode('');
        setDeadline(Date.now() + 60000);
        setMessage('A new code has been requested. Use the most recent email.');
      } else {
        await onVerify(code);
      }
    } catch (error) {
      setMessage(error.message || 'Please try again.');
      if (error.retryAfter) setDeadline(Date.now() + error.retryAfter * 1000);
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  return <form className="space-y-5" onSubmit={event => { event.preventDefault(); void run(false); }}>
    <p className="text-sm text-[#6B7280]">Enter the six-digit code sent to <strong>{email}</strong>.{submitLabel === 'Verify and create account' && ' Your account is created only after verification.'}</p>
    <label className="block text-sm font-medium text-[#374151]">Email verification code
      <input required type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/[^0-9]/g, ''))} className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]" />
    </label>
    <p role="status" className="text-sm">{message}</p>
    <button disabled={busy || code.length !== 6} className="w-full bg-[#F97316] hover:bg-[#df5f18] text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50">{busy ? 'Please wait...' : submitLabel}</button>
    <button type="button" disabled={busy || seconds > 0} onClick={() => void run(true)} className="text-[#48782E] text-sm disabled:opacity-50">{seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}</button>
    <button type="button" disabled={busy} onClick={onBack} className="block text-[#48782E] text-sm">Change details</button>
  </form>;
}
