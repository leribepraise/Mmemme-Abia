import React from "react";
import { MdOutlineSecurity } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";

const WhyChose = () => {
  const reasons = [
    {
      title: "Trusted & Secure",
      text: "Your security is our priority. Safe payments and data protection guaranteed",
      icon: <MdOutlineSecurity />,
      color: "text-[#267835]",
    },
    {
      title: "Easy Ticketing",
      text: "Book tickets in seconds and receive them instantly on your device",
      icon: <IoTicketOutline />,
      color: "text-[#ff720c]",
    },
    {
      title: "Global and Local Reach",
      text: "Discover events in Abia and connect with people worldwide.",
      icon: <IoLocationOutline />,
      color: "text-[#267835]",
    },
    {
      title: "24/7 Support",
      text: "We are here to help anytime you need us.",
      icon: <BiSupport />,
      color: "text-[#ff720c]",
    },
  ];
  return (
    <section className="my-10">
      <h1 className="font-bold text-[30px] text-center mb-5">
        Why Choose <span className="text-[#3C6E16]">Mmemme Abia</span>?
      </h1>
      <div className="flex gap-5">
        {reasons.map((reason) => (
          <div className="h-[190px] w-[313px] bg-[#FFFFFF] rounded-[15px] shadow-xl flex gap-[15px] justify-center items-center p-2">
            <p className={`text-5xl ${reason.color}`}>{reason.icon}</p>
            <div>
              <h2 className="font-bold text-[16px] mb-2">{reason.title}</h2>
              <p className="font-normal text-[16px]">{reason.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChose;
