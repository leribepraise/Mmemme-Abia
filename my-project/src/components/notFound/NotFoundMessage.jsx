import React from "react";

const NotFoundMessage = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1F1F1F]">
        Oops! Page Not Found
      </h2>

      <p className="mt-3 text-sm md:text-base text-gray-500 leading-6 max-w-md mx-auto">
        The page you're looking for doesn't exist
        <br className="hidden md:block" />
        or has been moved.
      </p>
    </div>
  );
};

export default NotFoundMessage;
