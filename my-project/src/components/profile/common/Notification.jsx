import React from "react";

const Notification = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4EB] text-[#3F783D]">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {text}
        </p>

      </div>

    </div>
  );
};

export default Notification;