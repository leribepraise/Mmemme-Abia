import { useEffect, useRef, useState } from 'react';

export default function EmailCodeForm({ email, onVerify, onResend, onBack, submitLabel = 'Verify email', backLabel = 'Change details' }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Check your inbox and spam folder. The code expires in 10 minutes.');
  const [busy, setBusy] = useState(false);
  const [deadline, setDeadline] = useState(() => Date.now() + 60000);
  const [seconds, setSeconds] = useState(60);
  const working = useRef(false);
  const inputs = useRef([]);
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
  return <form className="min-w-0 w-full space-y-5" onSubmit={event => { event.preventDefault(); void run(false); }}>
    <p className="text-sm text-[#6B7280]">Enter the six-digit code sent to <strong className="[overflow-wrap:anywhere]">{email}</strong>.{submitLabel === 'Verify and create account' && ' Your account is created only after verification.'}</p>
    <fieldset className="min-w-0 w-full"><legend className="sr-only">Email verification code</legend><div className="grid w-full grid-cols-6 gap-1.5 sm:gap-2">{Array.from({length:6},(_,index)=><input key={index} ref={node=>{inputs.current[index]=node;}} aria-label={`Code digit ${index+1}`} required type="text" inputMode="numeric" autoComplete={index===0?'one-time-code':'off'} pattern="[0-9]" maxLength={6} value={code[index]||''} disabled={busy} onChange={event=>{
      const digits=event.target.value.replace(/[^0-9]/g,'');
      if(digits.length>1){setCode(digits.slice(0,6));inputs.current[Math.min(digits.length,5)]?.focus();return;}
      const next=Array.from({length:6},(_,i)=>code[i]||' ');next[index]=digits||' ';setCode(next.join('').trimEnd());if(digits)inputs.current[Math.min(index+1,5)]?.focus();
    }} onPaste={event=>{const digits=event.clipboardData.getData('text').replace(/[^0-9]/g,'').slice(0,6);if(digits){event.preventDefault();setCode(digits);inputs.current[Math.min(digits.length,5)]?.focus();}}} onFocus={event=>event.target.select()} onKeyDown={event=>{if(event.key==='Backspace'&&!code[index])inputs.current[Math.max(0,index-1)]?.focus();if(event.key==='ArrowLeft')inputs.current[Math.max(0,index-1)]?.focus();if(event.key==='ArrowRight')inputs.current[Math.min(5,index+1)]?.focus();}} className="h-12 min-w-0 w-full rounded-xl sm:h-14 border border-gray-200 bg-white text-center text-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"/>)}</div></fieldset>
    <p role="status" className="text-sm [overflow-wrap:anywhere]">{message}</p>
    <button disabled={busy || !/^[0-9]{6}$/.test(code)} className="w-full bg-[#1d5027] hover:bg-[#174a20] text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50">{busy ? 'Please wait...' : submitLabel+' →'}</button>
    <button type="button" disabled={busy || seconds > 0} onClick={() => void run(true)} className="text-[#48782E] text-sm disabled:opacity-50">{seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}</button>
    <button type="button" disabled={busy} onClick={onBack} className="block text-[#48782E] text-sm">{backLabel}</button>
  </form>;
}
