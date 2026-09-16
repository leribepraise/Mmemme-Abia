import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const ShareEvent = () => {
  return (
    <div className="bg-white rounded-2xl p-0 space-y-3 mb-10">
      <h3 className="text-[20px] font-semibold text-[#000000] uppercase tracking-wider">
        Share this event
      </h3>

      <div className="flex items-center space-x-8">
        <button
          aria-label="Share on Facebook"
          className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:scale-110 transition cursor-pointer"
        >
          <FaFacebookF className="w-4 h-4" />
        </button>

        <button
          aria-label="Share on Twitter"
          className="p-2.5 rounded-full bg-slate-100 text-slate-900 hover:scale-110 transition cursor-pointer"
        >
          <FaTwitter className="w-4 h-4" />
        </button>

        <button
          aria-label="Share on WhatsApp"
          className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 hover:scale-110 transition cursor-pointer"
        >
          <FaWhatsapp className="w-4 h-4" />
        </button>

        <button
          aria-label="Share on Instagram"
          className="p-2.5 rounded-full bg-pink-50 text-pink-600 hover:scale-110 transition cursor-pointer"
        >
          <FaInstagram className="w-4 h-4" />
        </button>

        <button
          aria-label="Copy Link"
          className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:scale-110 transition cursor-pointer"
        >
          <FiLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShareEvent;
