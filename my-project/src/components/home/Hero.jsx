import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";

const heroData = [
  {
    id: 1,
    image: "/hero1.png",
    title: "Hotel Oris Live Concert",
    date: "25th - 27th Oct, 2026",
    location: "Umueze Sports Arena, Umuahia",
    attendees: "15.7k + Attending",
    buttonText: "Get Ticket",
    color: "#F46F1A",
  },
  {
    id: 2,
    image: "/hero2.png",
    title: "St. Thomas Catholic Church 25th Anniversary",
    date: "13th - 14th Aug, 2026",
    location: "St Thomas Catholic Church, Umuahia",
    attendees: "",
    buttonText: "Attend",
    color: "#F46F1A",
  },
  {
    id: 3,
    image: "/hero3.png",
    title: "Apostolic Invasion Grand Finale",
    date: "13th - 14th Sept, 2026",
    location: "Aba Mega Mall",
    attendees: "14.7k + Attending",
    buttonText: "Attend",
    color: "#F46F1A",
  },
  {
    id: 4,
    image: "/hero4.png",
    title: "ABA The Gathering on n'abia",
    date: "23rd - 29th Oct, 2026",
    location: "Aba Mega Mall",
    attendees: "",
    buttonText: "Get Ticket",
    color: "#F46F1A",
  },
  {
    id: 5,
    image: "/hero5.png",
    title: "Techrise Cohort 3 by LearnFactory",
    date: "20th May - 21st Aug, 2026",
    location: "Hotel de la Poste, Aba",
    attendees: "14.7k + Attending",
    buttonText: "Attend",
    color: "#F46F1A",
  },
  {
    id: 6,
    image: "/hero6.png",
    title: "Abia State Tech Conference",
    date: "2nd May - 4th Dec, 2026",
    location: "JMAC, Umuahia",
    attendees: "14.7k + Attending",
    buttonText: "Get Ticket",
    color: "#F46F1A",
  },
  {
    id: 7,
    image: "/hero7.png",
    title: "Techrise Alumni Homecoming",
    date: "Community Appreciation Walk - Umuahia Edition",
    location: "Umuahia, Abia State",
    attendees: "",
    buttonText: "Get Ticket",
    color: "#F46F1A",
  },
];

const Hero = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const currentSlide = heroData[slideIndex];

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === heroData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? heroData.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden pt-28 lg:pt-36 pb-12 px-4 md:px-8">
      {/* Centered Max-Width Wrapper */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 space-y-5 text-left">
          <h1 className="font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight text-gray-900">
            Discover. Experience. Celebrate
            <span className="text-[#3f783d]"> Abia</span>
            <span className="text-[#F46F1A]">.</span>
          </h1>

          <p className="font-normal text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
            Your go-to platform for discovering amazing events happening around
            Abia State and beyond.
          </p>

          <div className="flex gap-4 flex-wrap pt-2">
            <NavLink
              to="/events"
              className="bg-[#F46F1A] text-white inline-flex justify-center items-center py-3.5 px-6 rounded-xl gap-3 font-bold w-full sm:w-auto transition-transform active:scale-95 shadow-md hover:bg-[#d95e12]"
            >
              <span>Explore Events</span>
              <IoArrowForward />
            </NavLink>

            <NavLink
              to="/organizer/login"
              className="border-[#3C6E16] border-2 text-[#3C6E16] inline-flex justify-center items-center py-3.5 px-6 rounded-xl gap-3 font-bold w-full sm:w-auto transition-all hover:bg-[#3C6E16] hover:text-white"
            >
              <span>Become an Organizer</span>
              <IoPlay />
            </NavLink>
          </div>
        </div>

        {/* HERO SLIDER */}
        <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96 w-full lg:w-1/2 shadow-xl z-10">
          {/* Current Image */}
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* SLIDE CONTENT */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* TOP BAR */}
            <div className="flex justify-between items-center">
              <span
                className="inline-block text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                style={{ backgroundColor: currentSlide.color }}
              >
                Featured Event
              </span>

              {/* Navigation Controls */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black transition-all shadow-md"
                  aria-label="Previous Slide"
                >
                  <IoArrowBack size={14} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black transition-all shadow-md"
                  aria-label="Next Slide"
                >
                  <IoArrowForward size={14} />
                </button>
              </div>
            </div>

            {/* BOTTOM DETAILS */}
            <div className="text-white max-w-md">
              <h2 className="font-bold text-xl sm:text-2xl leading-snug drop-shadow-sm">
                {currentSlide.title}
              </h2>

              <div className="mt-2 space-y-1 text-xs font-medium text-gray-200">
                <p>📅 {currentSlide.date}</p>
                <p>📍 {currentSlide.location}</p>
                {currentSlide.attendees && <p>👥 {currentSlide.attendees}</p>}
              </div>

              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: currentSlide.color }}
              >
                <span>{currentSlide.buttonText}</span>
                <IoArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DECORATIVE BACKGROUND GRAPHICS (SOCIALLY BOUNDED) */}
      <div className="hidden lg:block pointer-events-none opacity-60">
        <img
          src="/Ellipse 7.png"
          alt=""
          className="absolute right-4 top-10 w-16 h-auto"
        />
        <img
          src="/Ellipse 9.png"
          alt=""
          className="absolute right-10 bottom-10 w-20 h-auto"
        />
        <img
          src="/Ellipse 7 (1).png"
          alt=""
          className="absolute left-6 top-20 w-12 h-auto"
        />
      </div>
    </section>
  );
};

export default Hero;