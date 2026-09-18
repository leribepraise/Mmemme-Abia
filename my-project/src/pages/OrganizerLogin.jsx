import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, CalendarCheck2, Eye, EyeOff, Lock, Mail, ShieldCheck, Users2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialButtons from "@/components/auth/login/SocialButtons";
import { useAuth } from "@/components/context/AuthContext";
import { save } from "@/lib/utils";

const BENEFITS = [
  { icon: CalendarCheck2, text: "Create & manage events easily", tint: "bg-[#EAF5EA] text-[#3F7D3D]" },
  { icon: BarChart3, text: "Track sales and audience insights", tint: "bg-[#EAF5EA] text-[#3F7D3D]" },
  { icon: ShieldCheck, text: "Get paid securely", tint: "bg-[#EAF5EA] text-[#3F7D3D]" },
  { icon: Users2, text: "Reach thousands across Abia and beyond", tint: "bg-[#FDEEE3] text-[#F36B25]" },
];

export default function OrganizerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (e) => {
    e.preventDefault();
    if (email && password) {
      const session = {
        email,
        remember,
        role: "organizer",
        loggedInAt: new Date().toISOString(),
      };
      save("mmemme-auth", session);
      login({ email, role: "organizer" });
      const destination = location.state?.from || "/organizer/dashboard";
      navigate(destination);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] flex flex-col">
      <Header />

      <div className="relative flex-1 overflow-hidden min-h-[640px] md:min-h-[720px] flex items-center">
        {/* Background Decorative Circles */}
        <div className="absolute -top-10 -right-6 w-32 h-32 md:w-44 md:h-44 bg-[#3F7D3D] rounded-full opacity-90 pointer-events-none z-0" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 md:w-72 md:h-72 bg-[#F36B25] rounded-full pointer-events-none z-0" />

        {/* Left Side Cover Image */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[45%] overflow-hidden">
          <img src="/Thumbnail.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-10 left-10 bg-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3 z-10">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-gray-500 font-bold">Tickets Sold</p>
                <span className="text-[11px] font-bold text-green-600 bg-green-100 rounded-full px-2 py-0.5">+12%</span>
              </div>
              <p className="text-xl font-black text-black leading-none mt-1 mb-2">842</p>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 32 L14 26 L28 30 L42 18 L56 22 L70 12 L84 16 L98 6 L112 10 L120 2"
                  stroke="#3F7D3D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M0 32 L14 26 L28 30 L42 18 L56 22 L70 12 L84 16 L98 6 L112 10 L120 2 L120 40 L0 40 Z"
                  fill="#3F7D3D"
                  fillOpacity="0.12"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12 w-full z-10">
          <div className="flex justify-end">
            {/* Unified White Box wrapper combining form and benefits list */}
            <div className="bg-white rounded-[28px] shadow-2xl p-8 md:p-12 w-full md:max-w-[700px] flex flex-col md:flex-row items-center gap-8 md:gap-10 border border-gray-100">
              
              {/* Login Form Column */}
              <div className="flex-1 w-full">
                <div className="text-center mb-6">
                  <h2 className="text-[26px] leading-tight font-extrabold text-black mb-1.5 tracking-tight">Organizer Login</h2>
                  <p className="text-xs text-gray-500 leading-snug">Access your dashboard and manage your events.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-black mb-1.5" htmlFor="org-email">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="org-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3D]/20 focus:border-[#3F7D3D] transition-colors"
                        data-testid="input-login-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-black mb-1.5" htmlFor="org-password">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="org-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3D]/20 focus:border-[#3F7D3D] transition-colors"
                        data-testid="input-login-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded accent-black" checked={remember} onChange={e => setRemember(e.target.checked)} data-testid="checkbox-remember" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => window.alert("Password reset instructions requested.")} className="text-[#3F7D3D] font-semibold hover:underline" data-testid="button-forgot-password">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#006029] hover:bg-[#004d21] active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2"
                    data-testid="button-login"
                  >
                    Log In
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-3 text-gray-400 text-xs my-5">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span>Or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <SocialButtons />

                <p className="text-center text-xs text-gray-600 mt-5">
                  Don't have an account?{" "}
                  <button onClick={() => window.alert("Registration is coming soon.")} className="text-[#F36B25] font-semibold hover:underline inline-flex items-center gap-1" data-testid="button-register">
                    Register now
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </p>
              </div>

              {/* Benefits Column Inside Same Card */}
              <div className="hidden md:flex flex-col gap-6 pl-6 border-l border-gray-100 max-w-[200px]">
                {BENEFITS.map(({ icon: Icon, text, tint }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{text}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}