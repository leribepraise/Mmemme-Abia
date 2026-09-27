import toast from "react-hot-toast";
import React from "react";

const SignUpSocialButtons = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button aria-label="Continue with Google" type="button" onClick={() => toast.error("Social sign-in is not configured yet. Please use email and password.")} className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="" className="w-5 h-5"
        />
      </button>

      <button aria-label="Continue with Facebook" type="button" onClick={() => toast.error("Social sign-in is not configured yet. Please use email and password.")} className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          alt="" className="w-5 h-5"
        />
      </button>

      <button aria-label="Continue with Apple" type="button" onClick={() => toast.error("Social sign-in is not configured yet. Please use email and password.")} className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img alt="" src="/applelogo.png" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SignUpSocialButtons;
