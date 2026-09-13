import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const ContactInfo = () => {
  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      lines: ["support@mmemmeabia.com"],
    },
    {
      icon: Phone,
      label: "Phone",
      lines: ["+234 812 345 6789"],
    },
    {
      icon: MapPin,
      label: "Address",
      lines: ["1 Library Avenue, Umuahia,", "Abia State, Nigeria"],
    },
    {
      icon: Clock,
      label: "Working Hours",
      lines: ["Mon - Fri: 8:00 AM - 5:00 PM"],
    },
  ];

  return (
    <div className="w-full lg:max-w-md">
      <h1 className="text-3xl md:text-4xl font-bold text-[#172033] leading-tight">
        We'd Love to Hear From You!
      </h1>

      <p className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed">
        Have a question, suggestion or need help?
        <br className="hidden sm:block" />
        Reach out to us and our team will get back to you shortly.
      </p>

      <div className="mt-8 space-y-6">
        {infoItems.map(({ icon: Icon, label, lines }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-[#EAF4EB] flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#3F783D]" />
            </div>

            <div>
              <p className="font-semibold text-sm text-[#172033]">{label}</p>
              {lines.map((line, i) => (
                <p key={i} className="text-sm text-gray-500">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="font-semibold text-sm text-[#172033] mb-3">Follow us</p>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-[#172033] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaFacebookF className="w-4 h-4" />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full bg-[#172033] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaInstagram className="w-4 h-4" />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full bg-[#172033] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaYoutube className="w-4 h-4" />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full bg-[#172033] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaTiktok className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
