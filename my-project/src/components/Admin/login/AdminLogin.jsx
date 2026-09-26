import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

// Adjust these two paths to wherever your assets live
import logo from "/logo.png";
import adminHero from "/admin-login-hero.png";

const schema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const onSubmit = async () => {
    // TODO: replace with the real admin auth call once the Django backend is connected.
    // This placeholder does NOT check credentials, so it is UI-only.
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Welcome back, Admin");
    navigate("/admin");
  };

  const fieldBase =
    "flex items-center gap-3 rounded-xl border bg-white px-4 h-[50px] shadow-sm focus-within:ring-2 focus-within:ring-[#14481f]/30";

  return (
    <div className="min-h-screen bg-[#f3f6f1]">
      <header className="px-6 py-5 lg:px-10">
        <Link to="/" aria-label="Mmemme Abia home">
          <img src={logo} alt="Mmemme Abia" className="h-10 w-auto" />
        </Link>
      </header>

      <main className="mx-auto flex max-w-5xl items-center justify-center gap-16 px-6 pb-16 pt-4 lg:pt-8">
        {/* Left: image panel (hidden on small screens) */}
        <aside className="relative hidden h-[590px] w-[305px] shrink-0 overflow-hidden lg:block">
          <img
            src={adminHero}
            alt="Abia State welcome monument surrounded by greenery"
            className="h-full w-full object-cover"
          />

          {/* Orange swoosh + green overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-[46%] bg-[#f28c28]"
            style={{ clipPath: "polygon(0 14%, 100% 0, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[43%] bg-gradient-to-b from-[#1a6a2a] to-[#0d3d1a]"
            style={{ clipPath: "polygon(0 16%, 100% 2%, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <h2 className="text-3xl font-semibold leading-tight">
              Admin Portal
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85">
              Manage the Abia experience. Keep our platform safe, active and
              thriving.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="text-white/70">Secure</span>
              <span aria-hidden="true">•</span>
              <span>Trusted</span>
              <span aria-hidden="true">•</span>
              <span>Mmemme Abia</span>
            </div>
          </div>
        </aside>

        {/* Right: form */}
        <section className="w-full max-w-[365px]">
          <h1 className="text-[32px] font-extrabold leading-tight text-[#0f172a]">
            Welcome Back,
            <br />
            <span className="text-[#1a6a2a]">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your admin account to continue.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="identifier"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Email or Username
              </label>
              <div
                className={`${fieldBase} ${errors.identifier ? "border-red-400" : "border-slate-200"}`}
              >
                <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="admin@mmemmeabia.com"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div
                className={`${fieldBase} ${errors.password ? "border-red-400" : "border-slate-200"}`}
              >
                <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-[#14481f]"
                  {...register("remember")}
                />
                Remember me
              </label>
              <Link
                to="/admin/forgot-password"
                className="font-semibold text-[#14481f] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#14481f] text-sm font-semibold text-white shadow-md transition hover:bg-[#0f3a19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14481f] disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Login"}
              {!isSubmitting && (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div
              className="absolute inset-x-0 top-1/2 h-px bg-slate-200"
              aria-hidden="true"
            />
            <span className="relative bg-[#f3f6f1] px-3 text-[11px] text-slate-400">
              or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={() => toast("Google sign-in isn't connected yet")}
            className="flex h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FcGoogle className="h-5 w-5" aria-hidden="true" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Need help?{" "}
            <Link
              to="/contact"
              className="font-semibold text-[#14481f] hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
