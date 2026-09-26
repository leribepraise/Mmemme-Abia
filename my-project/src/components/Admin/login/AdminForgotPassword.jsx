import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

// Adjust this path to wherever your logo lives
import logo from "/logo.png";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
});

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    // TODO: replace with the real "send reset link" call once the Django backend is connected.
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Code sent to ${email}`);
    navigate("/admin/verify-otp", { state: { email } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f6f1]">
      <header className="px-6 py-5 lg:px-10">
        <Link to="/" aria-label="Mmemme Abia home">
          <img src={logo} alt="Mmemme Abia" className="h-10 w-auto" />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pb-10 pt-4 sm:pt-8">
        {/* Lock icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f3ea] shadow-sm ring-4 ring-white sm:h-16 sm:w-16">
          <Lock
            className="h-5 w-5 text-[#14481f] sm:h-6 sm:w-6"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-[#0f172a] sm:text-[26px]">
          Reset Your Password
        </h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-slate-500">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 w-full max-w-sm space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Email Address
            </label>
            <div
              className={`flex h-[50px] items-center gap-3 rounded-xl border bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#14481f]/30 ${
                errors.email ? "border-red-400" : "border-slate-200"
              }`}
            >
              <Mail
                className="h-4 w-4 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@mmemmeabia.com"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#14481f] text-sm font-semibold text-white shadow-md transition hover:bg-[#0f3a19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14481f] disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
            {!isSubmitting && (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="relative my-6 w-full max-w-sm text-center">
          <div
            className="absolute inset-x-0 top-1/2 h-px bg-slate-200"
            aria-hidden="true"
          />
          <span className="relative bg-[#f3f6f1] px-3 text-[11px] text-slate-400">
            OR
          </span>
        </div>

        <Link
          to="/admin/login"
          className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-[#14481f]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Login
        </Link>

        {/* Decorative illustration */}
        <svg
          viewBox="0 0 440 140"
          className="mt-8 w-full max-w-[440px]"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Hills */}
          <path
            d="M0 92 C60 62 110 72 150 82 S260 100 330 72 S420 62 440 76 V125 H0 Z"
            fill="#dfeedd"
          />
          <path
            d="M0 106 C80 86 160 101 230 101 S380 96 440 106 V130 H0 Z"
            fill="#cfe3cf"
          />
          <path
            d="M20 125 C110 108 220 112 300 122 S400 125 430 128 V133 H20 Z"
            fill="#b9d5b9"
          />

          {/* Monument */}
          <g stroke="#4f9a5a" strokeWidth="1.5" fill="#e6f2e6">
            <line x1="220" y1="0" x2="220" y2="14" />
            <rect x="210" y="16" width="20" height="16" />
            <rect x="204" y="34" width="32" height="18" />
            <rect x="192" y="54" width="56" height="44" />
            <rect x="180" y="76" width="12" height="22" rx="6" />
            <rect x="248" y="76" width="12" height="22" rx="6" />
            <path d="M210 98 V80 a10 10 0 0 1 20 0 V98" fill="#f3f8f3" />
          </g>

          {/* Palm trees */}
          <g stroke="#7db486" strokeWidth="1.5" strokeLinecap="round">
            <path d="M72 106 C72 92 70 82 72 68" />
            <path d="M72 68 C60 58 48 62 40 70" />
            <path d="M72 68 C84 57 96 59 104 67" />
            <path d="M72 68 C66 58 60 52 54 49" />

            <path d="M340 110 C340 92 338 76 342 58" />
            <path d="M342 58 C328 46 314 50 304 60" />
            <path d="M342 58 C356 45 370 48 380 58" />
            <path d="M342 58 C336 46 330 38 322 34" />
            <path d="M342 58 C350 46 356 38 364 34" />

            <path d="M388 112 C388 100 386 90 389 78" />
            <path d="M389 78 C378 70 368 73 360 80" />
            <path d="M389 78 C400 69 410 72 418 79" />
          </g>

          {/* Swoosh lines */}
          <path
            d="M0 132 C60 126 140 126 200 134"
            stroke="#f28c28"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0 138 C90 131 200 131 300 139"
            stroke="#1a6a2a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </main>
    </div>
  );
};

export default AdminForgotPassword;
