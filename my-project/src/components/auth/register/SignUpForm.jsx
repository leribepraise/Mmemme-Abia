import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SignUpSocialButtons from "./SignUpSocialButtons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./validation/schemas/signupSchema";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("password");
  const [comfireInputType, setComfireInputType] = useState("password");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });
  const onSubmit = (data) => {
    console.log(data);

    // Save the registered user
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }),
    );

    // signup successful
    navigate("/login");
  };
  const toggleVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  const comfireToggleVisibility = () => {
    setComfireInputType((prevType) =>
      prevType === "password" ? "text" : "password",
    );
  };

  return (
    <div className="p-8 md:p-10 flex items-center">
      <div className="w-full">
        <h1 className="text-[24px] font-bold text-[#1F2937] mb-2">
          Create Your Account
        </h1>
        <p className="text-[14px] text-[#6B7280] mb-8">Let's get you started</p>
        <div className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="Enter your full name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={inputType}
                  {...register("password")}
                  placeholder="Create a password"
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={comfireInputType}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#48782E]"
                />
                {comfireInputType === "password" ? (
                  <Eye
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={comfireToggleVisibility}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={comfireToggleVisibility}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Terms */}
            <label className="block text-[14px] font-medium text-[#374151] mb-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1 rounded"
              />
              <span>
                I agree to the
                <span className="text-[#48782E] font-semibold">
                  Terms & Conditions
                </span>
                and
                <span className="text-[#48782E] font-semibold">
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#df5f18] text-white text-[14px] font-medium py-3 rounded-lg transition cursor-pointer"
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <SignUpSocialButtons />
          <p className="text-center text-sm text-[#666666]">
            Already have an account?
            <button
              onClick={onLogin}
              className="text-[#48782E] font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpForm;
