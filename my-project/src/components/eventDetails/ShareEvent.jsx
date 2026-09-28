import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const ShareEvent = () => {
  const url=window.location.origin+window.location.pathname;
  const copy=async()=>{try{await navigator.clipboard.writeText(url);toast.success("Event link copied.");}catch{toast.error("Unable to copy. Copy the address from your browser.");}};
  const share=async()=>{if(!navigator.share){await copy();return;}try{await navigator.share({title:"Mmemme Abia event",url});}catch(error){if(error.name!=="AbortError")await copy();}};
  return (
    <div className="bg-white rounded-2xl p-0 space-y-3 mb-10">
      <h3 className="text-[20px] font-semibold text-[#000000] uppercase tracking-wider">
        Share this event
      </h3>

      <div className="flex items-center space-x-8">
        <button
          onClick={()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,"_blank","noopener,noreferrer")} aria-label="Share on Facebook"
          className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:scale-110 transition cursor-pointer"
        >
          <FaFacebookF className="w-4 h-4" />
        </button>

        <button
          onClick={()=>window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,"_blank","noopener,noreferrer")} aria-label="Share on Twitter"
          className="p-2.5 rounded-full bg-slate-100 text-slate-900 hover:scale-110 transition cursor-pointer"
        >
          <FaTwitter className="w-4 h-4" />
        </button>

        <button
          onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(url)}`,"_blank","noopener,noreferrer")} aria-label="Share on WhatsApp"
          className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 hover:scale-110 transition cursor-pointer"
        >
          <FaWhatsapp className="w-4 h-4" />
        </button>

        <button
          onClick={share} aria-label="Share event"
          className="p-2.5 rounded-full bg-pink-50 text-pink-600 hover:scale-110 transition cursor-pointer"
        >
          <FaInstagram className="w-4 h-4" />
        </button>

        <button
          onClick={copy} aria-label="Copy Link"
          className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:scale-110 transition cursor-pointer"
        >
          <FiLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShareEvent;
