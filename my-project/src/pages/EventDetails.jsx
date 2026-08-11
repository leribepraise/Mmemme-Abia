import React, { useState } from "react";
import {
  FiMapPin,
  FiCalendar,
  //FiTicket,
  FiBookmark,
  FiUsers,
  FiMic,
  FiCoffee,
  FiShield,
  FiMinus,
  FiPlus,
  FiHeart,
  FiLink,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function EventDetails() {
  // Ticket quantities state
  const [tickets, setTickets] = useState({
    regular: 1,
    vip: 1,
    vvip: 1,
  });

  // Main banner image state
  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
  );

  const galleryImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
  ];

  const updateQuantity = (type, action) => {
    setTickets((prev) => ({
      ...prev,
      [type]:
        action === "increase"
          ? prev[type] + 1
          : Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-slate-500 flex items-center space-x-1">
          <span className="hover:underline cursor-pointer">Events</span>
          <span>&gt;</span>
          <span className="font-medium text-slate-700">
            Abia Business Summit 2026
          </span>
        </div>

        {/* TOP MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTENT (BANNER + GALLERY + INFO) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* IMAGE GALLERY */}
              <div className="md:col-span-7 space-y-3">
                {/* Main Banner */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 w-full bg-slate-900">
                  <img
                    src={selectedImage}
                    alt="Abia Business Summit"
                    className="w-full h-full object-cover"
                  />
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/40">
                    <span className="block text-sm font-bold text-orange-600 uppercase">
                      28
                    </span>
                    <span className="block text-xs font-extrabold text-slate-800 tracking-wider">
                      OCT
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition cursor-pointer ${
                        selectedImage === img
                          ? "border-orange-500 scale-95"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* EVENT HIGHLIGHTS */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    Abia Business Summit 2026
                  </h1>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Fri, 25 Oct - Sun, 27 Oct, 2026
                        </p>
                        <p className="text-slate-500">6:00 PM - 11:00 PM (WAT)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Umueze Sports Arena,
                        </p>
                        <p className="text-slate-500">Umuahia, Abia</p>
                        <button className="text-[11px] text-emerald-600 font-semibold underline hover:text-emerald-700 mt-0.5 cursor-pointer">
                          View on map
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                        AAL
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase font-medium">
                          Organized By
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                          All Africa Leaders
                        </p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition cursor-pointer">
                      Follow +
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Get ready for an unforgettable nights of music and energy as
                  Abia Business Summit takes the stage live in umuahia. Three days
                  of non-stop entertainment, top artists, and amazing vibes.{" "}
                  <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                    ... Read more
                  </span>
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT TICKET CARD */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="bg-emerald-50 -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                From
              </span>
              <p className="text-xl font-extrabold text-emerald-700">
                N3,000
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Available Tickets
              </h3>

              {/* TICKET TYPES LIST */}
              <div className="space-y-3.5 divide-y divide-slate-100">
                {/* Regular */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Regular
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose the number of tickets to buy
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-slate-900">
                      N3,000
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity("regular", "decrease")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-bold">
                        {tickets.regular}
                      </span>
                      <button
                        onClick={() => updateQuantity("regular", "increase")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* VIP */}
                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">VIP</h4>
                    <p className="text-xs text-slate-500">
                      Choose the number of tickets to buy
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-slate-900">
                      N10,000
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity("vip", "decrease")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-bold">
                        {tickets.vip}
                      </span>
                      <button
                        onClick={() => updateQuantity("vip", "increase")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* VVIP */}
                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">VVIP</h4>
                    <p className="text-xs text-slate-500">
                      Choose the number of tickets to buy
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-slate-900">
                      N20,000
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity("vvip", "decrease")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-bold">
                        {tickets.vvip}
                      </span>
                      <button
                        onClick={() => updateQuantity("vvip", "increase")}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CALL TO ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <button className="w-full bg-[#FF6200] hover:bg-[#e05600] active:scale-95 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer">
                <span>Buy Tickets</span>
                {/* <FiTicket className="w-4 h-4" /> */}
              </button>

              <button className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer">
                <span>Save Events</span>
                <FiBookmark className="w-4 h-4" />
              </button>
            </div>

            {/* INTERESTED USERS AVATARS */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
                  alt="User 1"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
                  alt="User 2"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                  alt="User 3"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-600">
                15.7k people are interested
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: ABOUT & LOCATION MAP */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ABOUT THE EVENT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-6">
                About the Event
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
                  <FiUsers className="w-6 h-6 text-emerald-600 mb-1.5" />
                  <span className="text-sm font-bold text-slate-900">10k+</span>
                  <span className="text-xs text-slate-500">
                    Expected People
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
                  <FiUsers className="w-6 h-6 text-emerald-600 mb-1.5" />
                  <span className="text-sm font-bold text-slate-900">10k+</span>
                  <span className="text-xs text-slate-500">
                    Expected People
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
                  <FiMic className="w-6 h-6 text-emerald-600 mb-1.5" />
                  <span className="text-sm font-bold text-slate-900">Live</span>
                  <span className="text-xs text-slate-500">
                    Performances
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
                  <FiCoffee className="w-6 h-6 text-emerald-600 mb-1.5" />
                  <span className="text-sm font-bold text-slate-900">
                    Food &amp; Drinks
                  </span>
                  <span className="text-xs text-slate-500">Available</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
                  <FiShield className="w-6 h-6 text-emerald-600 mb-1.5" />
                  <span className="text-sm font-bold text-slate-900">
                    Secured
                  </span>
                  <span className="text-xs text-slate-500">
                    Environment
                  </span>
                </div>
              </div>
            </div>

            {/* LOCATION CARD WITH MAP OVERLAY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Location</h2>

              <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-200 flex items-center justify-center p-6 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="absolute inset-0 bg-emerald-50/40"></div>

                <div className="absolute right-1/3 top-1/3 text-orange-600 drop-shadow-md">
                  <FiMapPin className="w-8 h-8 fill-orange-600 text-white" />
                </div>

                <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white max-w-sm w-full flex items-center space-x-3">
                  <div className="p-2.5 rounded-full bg-slate-100 text-slate-800">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Umueze Sports Arena
                    </h3>
                    <p className="text-sm text-slate-500 mb-1">
                      Umuahia, Abia
                    </p>
                    <button className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: SHARE & SIMILAR EVENTS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SHARE THIS EVENT */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Share this event
              </h3>
              <div className="flex items-center space-x-3">
                <button aria-label="Share on Facebook" className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:scale-110 transition cursor-pointer">
                  <FaFacebookF className="w-4 h-4" />
                </button>
                <button aria-label="Share on Twitter" className="p-2.5 rounded-full bg-slate-100 text-slate-900 hover:scale-110 transition cursor-pointer">
                  <FaTwitter className="w-4 h-4" />
                </button>
                <button aria-label="Share on WhatsApp" className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 hover:scale-110 transition cursor-pointer">
                  <FaWhatsapp className="w-4 h-4" />
                </button>
                <button aria-label="Share on Instagram" className="p-2.5 rounded-full bg-pink-50 text-pink-600 hover:scale-110 transition cursor-pointer">
                  <FaInstagram className="w-4 h-4" />
                </button>
                <button aria-label="Copy Link" className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:scale-110 transition cursor-pointer">
                  <FiLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SIMILAR EVENTS */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Similar Events
              </h3>

              <div className="space-y-3">
                {/* Event 1 */}
                <div className="flex space-x-3 border border-slate-100 rounded-xl p-2 hover:shadow-md transition bg-slate-50/50">
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop"
                      alt="Abia Food & Drinks"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-white/90 text-[9px] font-bold text-slate-900 px-1.5 py-0.5 rounded">
                      02 Nov
                    </span>
                    <button className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full cursor-pointer">
                      <FiHeart className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-between py-0.5 w-full">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        Abia Food &amp; Drinks Carnival
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <FiMapPin className="w-2.5 h-2.5" />
                        <span>Arochukwu, Abia</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-600">
                        Free
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex space-x-3 border border-slate-100 rounded-xl p-2 hover:shadow-md transition bg-slate-50/50">
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop"
                      alt="Abia Cultural Festival"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-white/90 text-[9px] font-bold text-slate-900 px-1.5 py-0.5 rounded">
                      31 Oct
                    </span>
                    <button className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full cursor-pointer">
                      <FiHeart className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-between py-0.5 w-full">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        Abia Cultural Festival
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <FiMapPin className="w-2.5 h-2.5" />
                        <span>Ohafia, Abia</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-600">
                        Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

