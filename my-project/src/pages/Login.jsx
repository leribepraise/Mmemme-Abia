import Seo from "../components/seo/Seo";
import React, { useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { authReturnFrom, clearAuthReturn, postAuthPath, rememberAuthReturn } from '@/lib/authNavigation';
import LoginLogo from "../components/auth/login/LoginLogo";
import LoginHero from "../components/auth/login/LoginHero";
import LoginForm from "../components/auth/login/LoginForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = authReturnFrom(location);
  useEffect(() => { rememberAuthReturn(returnTo); }, [returnTo]);

  const handleLogin = async (credentials) => {
    const user = await login(credentials);
    const destination = postAuthPath(user, returnTo);
    clearAuthReturn();
    navigate(destination, { replace: true });
  };
  return (
    <div className="min-h-dvh min-w-0 bg-[#F5F7F3] px-3 py-5 sm:px-5 sm:py-8 md:px-12">
      <Seo title="Log In" noIndex path="/login" />
      <LoginLogo />

      <div className="max-w-6xl mx-auto min-w-0 bg-white rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-2">
          <LoginHero />
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
