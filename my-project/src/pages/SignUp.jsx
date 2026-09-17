import SignUpLogo from "../components/auth/register/SignUpLogo";
import SignUpHero from "../components/auth/register/SignUpHero";
import SignUpForm from "../components/auth/register/SignUpForm";
export default function SignUp() {
  return <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12"><SignUpLogo/><div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm"><div className="grid md:grid-cols-2"><SignUpHero/><SignUpForm/></div></div></div>;
}
