import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MailCheck, ArrowRight, ArrowLeft } from "lucide-react";

// Adjust this path to wherever your logo lives
import logo from "/logo.png";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

const AdminVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // The forgot-password screen passes the email along via router state
  const email = location.state?.email ?? "your email address";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  // Countdown for the resend button
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  // Focus the first box on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusBox = (index) => {
    const box = inputRefs.current[index];
    if (box) {
      box.focus();
      box.select();
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (index < OTP_LENGTH - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[index]) {
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = "";
        setDigits(next);
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleResend = () => {
    if (seconds > 0) return;
    // TODO: call the real "resend code" endpoint once the Django backend is connected.
    setDigits(Array(OTP_LENGTH).fill(""));
    setSeconds(RESEND_SECONDS);
    focusBox(0);
    toast.success("A new code has been sent");
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      toast.error(`Enter all ${OTP_LENGTH} digits of the code`);
      return;
    }

    setIsVerifying(true);
    // TODO: replace with the real OTP verification call once the Django backend is connected.
    // This placeholder does NOT check the code, so it is UI-only.
    await new Promise((r) => setTimeout(r, 600));
    setIsVerifying(false);
    toast.success("Code verified");
    navigate("/admin"); // TODO: point this at the next step (e.g. set new password)
  };

  const timeLabel = `00:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f6f1]">
      <header className="px-6 py-5 lg:px-10">
        <Link to="/" aria-label="Mmemme Abia home">
          <img src={logo} alt="Mmemme Abia" className="h-10 w-auto" />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pb-10 pt-4 sm:pt-8">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f3ea] shadow-sm ring-4 ring-white sm:h-16 sm:w-16">
          <MailCheck
            className="h-6 w-6 text-[#14481f] sm:h-7 sm:w-7"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-[#0f172a] sm:text-[26px]">
          Check Your Inbox
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          We've sent a 6-digit verification code to your email
        </p>
        <p className="mt-1 break-all text-center text-sm font-semibold text-[#14481f]">
          {email}
        </p>

        <div className="mt-8 w-full max-w-[340px]">
          <h2 className="text-lg font-bold text-[#0f172a]">OTP Verification</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter the 6-digit code below to verify your account.
          </p>

          {/* OTP boxes */}
          <div
            className="mt-5 grid grid-cols-6 gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white text-center text-lg font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#14481f] focus:ring-2 focus:ring-[#14481f]/30 sm:h-[46px]"
              />
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0}
              className="font-semibold text-[#14481f] hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-70"
            >
              {seconds > 0 ? `Resend Code (${timeLabel})` : "Resend Code"}
            </button>
          </p>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="mt-5 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#14481f] text-sm font-semibold text-white shadow-md transition hover:bg-[#0f3a19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14481f] disabled:opacity-70"
          >
            {isVerifying ? "Verifying..." : "Verify"}
            {!isVerifying && (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <div className="relative my-6 text-center">
            <div
              className="absolute inset-x-0 top-1/2 h-px bg-slate-200"
              aria-hidden="true"
            />
            <span className="relative bg-[#f3f6f1] px-3 text-[11px] text-slate-400">
              or
            </span>
          </div>

          <Link
            to="/admin/login"
            className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-[#14481f]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminVerifyOtp;
