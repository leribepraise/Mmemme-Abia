import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, CalendarCheck2, Eye, EyeOff, Lock, Mail, ShieldCheck, Users2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialButtons from "@/components/auth/login/SocialButtons";
import { useAuth } from "@/components/context/AuthContext";
import { save } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
      toast({
        title: "Welcome back",
        description: `Signed in as ${email}.`,
      });
      const destination = location.state?.from || "/organizer/dashboard";
      navigate(destination);
    } else {
      toast({
        title: "Missing details",
        description: "Enter both your email and password to log in.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">

      {/* Background Photo starting from top-0 and stretching down to touch the footer */}
      <div className="hidden lg:block absolute top-0 left-0 w-1/2 bottom-[320px] z-0">
        <img
          src="/organizer-login-photo.png"
          alt="Organizer background"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Tickets Sold Widget Card */}
        {/* <div className="absolute bottom-8 left-8 bg-white rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 z-10 border border-gray-100/20">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-gray-500 font-bold">Tickets Sold</p>
              <span className="text-[10px] font-bold text-green-600 bg-green-100 rounded-full px-2 py-0.5">+12%</span>
            </div>
            <p className="text-2xl font-black text-black leading-none mt-1.5 mb-2.5">842</p>
            <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 28 L14 22 L28 26 L42 14 L56 18 L70 8 L84 12 L98 4 L112 8 L120 1"
                stroke="#3F7D3D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M0 28 L14 22 L28 26 L42 14 L56 18 L70 8 L84 12 L98 4 L112 8 L120 1 L120 36 L0 36 Z"
                fill="#3F7D3D"
                fillOpacity="0.12"
              />
            </svg>
          </div>
        </div> */}
      </div>

      {/* Header sits at the very top */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12 lg:py-16 relative z-10">

        {/* Background Decorative Circles */}
        <div className="absolute top-4 right-12 w-64 h-64 bg-[#3F7D3D] rounded-full opacity-90 pointer-events-none z-0" />
        <div className="absolute bottom-4 right-1/3 w-80 h-80 bg-[#F36B25] rounded-full pointer-events-none z-0" />

        {/* Inner Flex Row */}
        <div className="relative flex flex-col lg:flex-row items-center w-full">

          {/* Left spacer matching photo width */}
          <div className="hidden lg:block w-1/2 shrink-0 h-[480px]" />

          {/* Right Half: Login Card Container (Overlapping photo edge) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start z-20 lg:-ml-32">
            <div className="bg-white rounded-[32px] shadow-[0_16px_48px_rgba(0,0,0,0.1)] p-9 md:p-11 w-full max-w-[820px] flex flex-col md:flex-row items-center gap-8 border border-gray-100/80">

              {/* Login Form Column */}
              <div className="flex-1 w-full">
                <div className="text-center mb-6">
                  <h2 className="text-[28px] leading-tight font-extrabold text-black mb-1 tracking-tight">Organizer Login</h2>
                  <p className="text-xs text-gray-500 leading-snug">Access your dashboard and manage your events</p>
                </div>

                <form onSubmit={submit} className="space-y-3.5">
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

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                      <input type="checkbox" className="w-4 h-4 rounded accent-[#006029]" checked={remember} onChange={e => setRemember(e.target.checked)} data-testid="checkbox-remember" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Check your email",
                          description: email
                            ? `If an account exists for ${email}, reset instructions are on the way.`
                            : "Enter your email above first, then click this again to get reset instructions.",
                        })
                      }
                      className="text-[#3F7D3D] font-semibold hover:underline"
                      data-testid="button-forgot-password"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#006029] hover:bg-[#004d21] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm flex items-center justify-center gap-2 mt-1"
                    data-testid="button-login"
                  >
                    Log In
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-3 text-gray-400 text-xs my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span>Or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <SocialButtons />

                <p className="text-center text-xs text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Coming soon",
                        description: "Organizer registration isn't open yet — check back shortly.",
                      })
                    }
                    className="text-[#F36B25] font-semibold hover:underline inline-flex items-center gap-1"
                    data-testid="button-register"
                  >
                    Register now
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </p>
              </div>

              {/* Right Side Benefits Column Inside Card */}
              <div className="hidden md:flex flex-col gap-5 pl-6 border-l border-gray-100 max-w-[210px] shrink-0">
                {BENEFITS.map(({ icon: Icon, text, tint }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight">{text}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer safely positioned underneath */}
      <div className="relative z-30">
        <Footer />
      </div>
    </div>
  );
}