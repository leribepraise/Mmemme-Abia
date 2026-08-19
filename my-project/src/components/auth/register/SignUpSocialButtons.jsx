import React from "react";

const SignUpSocialButtons = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
      </button>

      <button className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          className="w-5 h-5"
        />
      </button>

      <button className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50 flex justify-center">
        <img src="/applelogo.png" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SignUpSocialButtons;
