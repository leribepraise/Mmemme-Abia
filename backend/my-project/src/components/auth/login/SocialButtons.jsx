import React from "react";

const SocialButtons = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button className="border border-gray-200 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
        Google
      </button>

      <button className="border border-gray-200 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
        <img
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          className="w-5 h-5"
        />
        Facebook
      </button>

      <button className="border border-gray-200 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
        <img src="/applelogo.png" className="w-5 h-5" />
        Apple
      </button>
    </div>
  );
};

export default SocialButtons;
