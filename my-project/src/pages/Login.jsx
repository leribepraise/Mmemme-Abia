import Seo from "../components/seo/Seo";
import React from "react";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { safeAppPath } from '@/lib/navigation';
import LoginLogo from "../components/auth/login/LoginLogo";
import LoginHero from "../components/auth/login/LoginHero";
import LoginForm from "../components/auth/login/LoginForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    const user = await login(credentials);
    navigate(location.state?.from ? safeAppPath(location.state.from,'/dashboard') : user.onboarding_completed_at ? "/dashboard" : "/Signup/onboarding", {replace:true});
  };
  return (
    <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12">
      <Seo title="Log In" noIndex path="/login" />
      <LoginLogo />

      <div className="max-w-6xl mx-auto bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-2">
          <LoginHero />
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
