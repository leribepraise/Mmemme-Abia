import { Link } from 'react-router-dom';
import EmailCodeForm from './EmailCodeForm';

export default function VerificationScreen(props) {
  return <div className="min-h-dvh min-w-0 bg-[#f5f7f3] px-4 py-6 sm:px-6 sm:py-9"><header className="mx-auto max-w-6xl"><Link to="/"><img src="/logo.png" alt="Mmemme Abia" className="h-11 w-auto"/></Link></header><main className="mx-auto mt-8 min-w-0 w-full max-w-[440px] pb-12 sm:mt-12"><div className="mb-8 text-center sm:mb-12"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f3e7]"><img src="/design/email-verified.svg" alt="" className="h-9 w-9"/></div><h1 className="text-2xl font-bold text-slate-900">Check Your Inbox</h1><p className="mt-2 text-sm text-slate-500">We’ve sent a 6-digit verification code to your email</p></div><h2 className="text-lg font-bold">OTP Verification</h2><EmailCodeForm {...props}/><div className="my-7 flex items-center gap-4 text-xs text-slate-400"><hr className="flex-1"/>or<hr className="flex-1"/></div><Link to="/login" className="block text-center text-sm font-medium">← Back to Login</Link></main></div>;
}
