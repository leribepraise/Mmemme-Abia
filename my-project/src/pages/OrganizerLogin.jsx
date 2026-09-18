import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck2, Eye, EyeOff, LineChart, ShieldCheck, TrendingUp, Users2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialButtons from "@/components/auth/login/SocialButtons";
import { useAuth } from "@/components/context/AuthContext";
import { save } from "@/lib/utils";

const BENEFITS = [
  { icon: CalendarCheck2, text: "Create & manage events easily", tint: "bg-[#EAF5EA] text-[#3F7D3D]" },
  { icon: LineChart, text: "Track sales and audience insights", tint: "bg-[#E7F1FB] text-[#2F80ED]" },
  { icon: ShieldCheck, text: "Get paid securely", tint: "bg-[#EAF5EA] text-[#3F7D3D]" },
  { icon: Users2, text: "Reach thousands across Abia and beyond", tint: "bg-[#FDEEE3] text-[#F36B25]" },
];

export default function OrganizerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (e) => {
    e.preventDefault();
    if (email && password) {
      save("mmemme-auth", { email, remember });
      login();
      navigate("/organizer/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] flex flex-col">
      <Header />

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute -top-10 -right-6 w-32 h-32 md:w-44 md:h-44 bg-[#3F7D3D] rounded-full opacity-90 pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-[44%] w-20 h-20 rounded-full border-[7px] border-[#2F80ED] translate-y-1/2 overflow-hidden pointer-events-none">
          <div className="absolute inset-2 bg-[#F36B25] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-14">
          <div className="relative md:min-h-[540px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[48%] rounded-[28px] overflow-hidden shadow-xl">
              <img src="/Event%20Thumbnail.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF5EA] text-[#3F7D3D] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-bold">Tickets Sold</p>
                  <p className="text-lg font-black text-black leading-none mt-0.5">842 <span className="text-green-500 text-xs font-bold">+12%</span></p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-10 md:pl-[34%]">
              <div className="bg-white rounded-[28px] shadow-2xl w-full md:max-w-[380px] p-8 md:p-10 z-10">
                <h2 className="text-2xl font-extrabold text-black mb-1">Organizer Login</h2>
                <p className="text-sm text-gray-500 mb-6">Access your dashboard and manage your events.</p>
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2" htmlFor="org-email">Email Address</label>
                    <input
                      id="org-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3D]/20 focus:border-[#3F7D3D] transition-colors"
                      data-testid="input-login-email"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2" htmlFor="org-password">Password</label>
                    <div className="relative">
                      <input
                        id="org-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F7D3D]/20 focus:border-[#3F7D3D] transition-colors"
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
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-[#666666] cursor-pointer">
                      <input type="checkbox" className="rounded accent-[#3F7D3D]" checked={remember} onChange={e => setRemember(e.target.checked)} data-testid="checkbox-remember" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => window.alert("Password reset instructions requested.")} className="text-[#EF6C00] font-semibold hover:underline" data-testid="button-forgot-password">
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#3F7D3D] hover:bg-[#336633] active:scale-[0.98] text-white font-semibold py-3 rounded-[8px] transition-all text-[14px] shadow-sm"
                    data-testid="button-login"
                  >
                    Log In
                  </button>
                </form>
                <div className="flex items-center gap-3 text-gray-400 text-xs my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span>or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <SocialButtons />
                <p className="text-center text-sm text-[#666666] mt-6">
                  Don't have an organizer account?{" "}
                  <button onClick={() => window.alert("Registration is coming soon.")} className="text-[#F36B25] font-semibold hover:underline" data-testid="button-register">
                    Register now
                  </button>
                </p>
              </div>

              <div className="hidden md:flex flex-col gap-6">
                {BENEFITS.map(({ icon: Icon, text, tint }) => (
                  <div key={text} className="flex items-center gap-3 max-w-[150px]">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[13px] font-bold text-black leading-tight">{text}</p>
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
