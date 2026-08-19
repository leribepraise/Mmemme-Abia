import React from "react";
import { useNavigate } from "react-router-dom";
import SignUpLogo from "../components/auth/register/SignUpLogo";
import SignUpHero from "../components/auth/register/SignUpHero";
import SignUpForm from "../components/auth/register/SignUpForm";
import { useAuth } from "../components/context/AuthContext";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/"); // Go to Home after signing up
  };
  return (
    <div className="min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12">
      <SignUpLogo />

      <div className="max-w-5xl mx-auto bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-2">
          <SignUpHero />
          <SignUpForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
