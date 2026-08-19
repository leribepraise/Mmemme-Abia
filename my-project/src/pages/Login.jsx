import React from "react";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginLogo from "../components/auth/login/LoginLogo";
import LoginHero from "../components/auth/login/LoginHero";
import LoginForm from "../components/auth/login/LoginForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12">
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
