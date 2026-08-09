import React from "react";

const Events = () => {
  const events = [
    {
      image: "/Frame1.png",
      text: "Hotel Oris Live Concert",
      icon: "",
      text2: "Umuahia, Abia",
      text3: "N2,500",
    },
    {
      image: "/Frame2.png",
      text: "Abia Business Summit 2026",
      icon: "",
      text2: "Aba, Abia",
      text3: "N3,000",
    },
    {
      image: "/Frame3.png",
      text: "Abia Cultural Festival",
      icon: "",
      text2: "Ohafia, Abia",
      text3: "Free",
    },
    {
      image: "/Frame4.png",
      text: "Abia Food & Drinks Carnival",
      icon: "",
      text2: "Arochukwu, Abia",
      text3: "N2,000",
    },
    {
      image: "/Frame1.png",
      text: "Hotel Oris Live Concert",
      icon: "",
      text2: "Umuahia, Abia",
      text3: "N2,500",
    },
    {
      image: "/Frame2.png",
      text: "Abia Business Summit 2026",
      icon: "",
      text2: "Aba, Abia",
      text3: "N3,000",
    },
    {
      image: "/Frame3.png",
      text: "Abia Cultural Festival",
      icon: "",
      text2: "Ohafia, Abia",
      text3: "Free",
    },
    {
      image: "/Frame4.png",
      text: "Abia Food & Drinks Carnival",
      icon: "",
      text2: "Arochukwu, Abia",
      text3: "N2,000",
    },
  ];
  return (
    <>
      <section className="mt-10 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-left mb-5">
            Trending Events 🔥
          </h1>
          <div>
            <p className="font-semibold text-[12px] text-[#F46F1A]">See More</p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-between items-center w-max animate-marquees">
            <div className="flex w-max gap-5">
              {events.map((event, index) => (
                <div
                  key={`first-${index}`}
                  className="w-[313px] h-[240px] rounded-3xl bg-[#FEFEFE] transition duration-300 hover:bg-[#F1FCEE] hover:text-black hover:-translate-y-1 hover:shadow-md cursor-pointer shrink-0"
                >
                  {<img src={event.image} className="w-full" />}
                  <div className="p-3 space-y-3">
                    <p className="font-semibold text-[16px]">{event.text}</p>{" "}
                    <div className="flex justify-between">
                      <p className="font-medium text-[12px]">{event.text2}</p>{" "}
                      <p className="font-semibold text-[16px] text-[#3C6E16]">
                        {event.text3}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dublicate set */}
            <div className="flex gap-5">
              {events.map((event) => (
                <div className="w-[313px] h-[240px] rounded-3xl bg-[#FEFEFE] transition duration-300 hover:bg-[#F1FCEE] hover:text-black hover:-translate-y-1 hover:shadow-md cursor-pointer">
                  {<img src={event.image} className="w-full" />}
                  <div className="p-3 space-y-3">
                    <p className="font-semibold text-[16px]">{event.text}</p>{" "}
                    <div className="flex justify-between">
                      <p className="font-medium text-[12px]">{event.text2}</p>{" "}
                      <p className="font-semibold text-[16px] text-[#3C6E16]">
                        {event.text3}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
