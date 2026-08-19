import React from "react";

const SidebarEvent = () => {
  const places = [
    [
      "/tourism1.jpg",
      "Arochukwu Cultural Festival",
      "Arochukwu",
      "May 27 - 29, 2025",
    ],
    ["/tourism2.jpg", "New Yam Festival", "98 Hotels"],
    ["/tourism3.jpg", "Abia Heritage Day", "Umuahia", "Oct 1, 2025"],
  ];

  return (
    <div className="bg-white rounded-2xl">
      <div className="space-y-4">
        {places.map(([image, name, hotels, time]) => (
          <div key={name}>
            <div className="flex gap-2">
              <img src={image} alt="" className="w-20 h-20 rounded-md" />
              <div className="flex flex-col gap-y-2">
                <h4 className="font-semibold text-[14px] text-[#111827]">
                  {name}
                </h4>
                <p className="text-[12px] font-normal text-[#6B7280]">
                  {hotels}
                </p>
                <p className="text-[11px] font-normal text-[#9CA3AF]">{time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarEvent;
