import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SocialButtons from "./SocialButtons";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [inputType, setInputType] = useState("password");
  const toggleVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin();
  };
  return (
    <div className="p-8 md:p-12 flex items-center">
      <div className="w-full">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} action="">
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={inputType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#48782E]"
                />

                {inputType === "password" ? (
                  <Eye
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={toggleVisibility}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={toggleVisibility}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#666666] cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>

              <button className="text-[#EF6C00] font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>

            <button className="w-full bg-[#1B5E20] hover:bg-[#3d6626] text-white font-semibold py-3 rounded-[8px] transition cursor-pointer text-[14px]">
              Log In
            </button>
          </form>

          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <SocialButtons />

          <p className="text-center text-sm text-[#666666]">
            Don't have an account?{" "}
            <button className="text-[#F36B25] font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
