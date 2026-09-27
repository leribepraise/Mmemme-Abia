import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { Mail, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

const SignUpVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // location.state only exists right after navigate() from Sign Up; it's lost
  // on a page refresh. sessionStorage lets a refresh survive, while someone
  // typing this URL fresh (no signup ever happened) still has nothing to read.
  const email =
    location.state?.email || sessionStorage.getItem("pendingSignupEmail");

  // No pending signup for this browser tab/session — don't allow this screen
  // to be reached directly. Send them back to Sign Up instead.
  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const focusBox = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < CODE_LENGTH - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusBox(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    focusBox(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;

  // TODO: replace with a real POST /auth/verify-otp/ call once wired to the backend.
  const handleVerify = async () => {
    if (!isComplete) {
      toast.error("Enter all 6 digits first");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    sessionStorage.removeItem("pendingSignupEmail");
    toast.success("Account verified");
    navigate("/Signup/onboarding");
  };

  // TODO: replace with a real POST /auth/resend-otp/ call once wired to the backend.
  const handleResend = () => {
    if (secondsLeft > 0) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    focusBox(0);
    toast.success("A new code has been sent to your email");
  };

  const timerLabel = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f6f1] px-4 py-8">
      {/* Logo — swap this for the shared <Logo /> component if one already exists */}
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F97316] to-[#265F27] text-sm font-extrabold text-white">
          M
        </span>
        <span className="text-lg font-extrabold leading-none text-[#1F2937]">
          Mmemme
          <span className="block text-[10px] font-bold tracking-widest text-[#F97316]">
            ABIA
          </span>
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#265F27]/10">
              <Mail className="h-7 w-7 text-[#265F27]" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#265F27] text-white ring-2 ring-[#f3f6f1]">
                <ShieldCheck className="h-3 w-3" />
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#1F2937] md:text-2xl">
              Check Your Inbox
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {email ? (
                <>
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-medium text-[#374151]">{email}</span>
                </>
              ) : (
                "We've sent a 6-digit verification code to your email"
              )}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-base font-bold text-[#1F2937]">
              OTP Verification
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Enter the 6-digit code below to verify your account.
            </p>

            <div
              className="mt-5 flex justify-between gap-2"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-12 rounded-lg border border-gray-200 text-center text-lg font-semibold text-[#1F2937] focus:outline-none focus:border-[#265F27] md:h-14 md:w-14"
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-[#6B7280]">
              Didn't receive the code?{" "}
              {secondsLeft > 0 ? (
                <span className="font-semibold text-[#265F27]">
                  Resend Code ({timerLabel})
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-[#265F27] hover:underline"
                >
                  Resend Code
                </button>
              )}
            </p>

            <button
              type="button"
              onClick={handleVerify}
              disabled={submitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#265F27] py-3 text-sm font-semibold text-white transition hover:bg-[#1f4d20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verifying..." : "Verify"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="mt-5 flex items-center gap-3 text-gray-400 text-xs">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span>or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("pendingSignupEmail");
                navigate("/login");
              }}
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-[#374151] hover:text-[#1F2937]"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpVerifyOtp;
