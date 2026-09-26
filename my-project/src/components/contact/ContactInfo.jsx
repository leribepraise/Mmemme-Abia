import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const ContactInfo = () => {
  const infoItems = [
    {
      icon: Mail,
      label: "Email Us",
      lines: ["support@mmemme.com.ng"],
      href: "mailto:support@mmemme.com.ng",
    },
    {
      icon: Phone,
      label: "Call Us",
      lines: ["+234 812 345 6789"],
      href: "tel:+2348123456789",
    },
    {
      icon: MapPin,
      label: "Visit Our Office",
      lines: ["1 Library Avenue, Umuahia,", "Abia State, Nigeria"],
      href: null,
    },
    {
      icon: Clock,
      label: "Working Hours",
      lines: ["Mon - Fri: 8:00 AM - 5:00 PM"],
      href: null,
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, label: "Facebook", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaYoutube, label: "YouTube", href: "#" },
    { icon: FaTiktok, label: "TikTok", href: "#" },
  ];

  return (
    <div className="w-full lg:max-w-md">
      {/* HEADING & SUBTITLE */}
      <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        We'd Love to Hear From You!
      </h1>

      <p className="mt-4 text-base font-medium leading-relaxed text-gray-600 md:text-lg">
        Have a question, suggestion, or need help? Reach out to us and our team
        will get back to you shortly.
      </p>

      {/* CONTACT METRICS LIST */}
      <div className="mt-8 space-y-6 md:mt-10">
        {infoItems.map(({ icon: Icon, label, lines, href }) => (
          <div key={label} className="flex items-start gap-4">
            {/* ICON CONTAINER */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#265F27]/10 text-[#265F27]">
              <Icon className="h-5 w-5" />
            </div>

            {/* LABEL & VALUES */}
            <div>
              <p className="text-sm font-extrabold text-gray-900 md:text-base">
                {label}
              </p>
              {lines.map((line, i) =>
                href ? (
                  <a
                    key={i}
                    href={href}
                    className="block text-sm font-semibold text-gray-600 transition hover:text-[#265F27] hover:underline md:text-base"
                  >
                    {line}
                  </a>
                ) : (
                  <p key={i} className="text-sm font-semibold text-gray-600 md:text-base">
                    {line}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SOCIAL MEDIA SECTION */}
      <div className="mt-10 border-t border-gray-100 pt-8">
        <p className="mb-4 text-sm font-extrabold tracking-wider uppercase text-gray-500">
          Follow our community
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: SocialIcon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-[#265F27] hover:text-white"
            >
              <SocialIcon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;