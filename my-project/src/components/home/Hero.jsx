import { useCollection } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";



const Hero = () => {
  const { data: events } = useCollection('/events/', eventCard);
  const heroData = events.length ? events.slice(0, 7).map(event => ({ ...event, title: event.text, date: new Date(event.start_datetime).toLocaleDateString(), location: event.venue, attendees: '', buttonText: 'Get Ticket', color: '#F46F1A' })) : [{ image: '/hero1.png', title: 'Explore events in Abia', date: '', location: '', attendees: '', buttonText: 'Explore Events', color: '#F46F1A' }];
  const [slideIndex, setSlideIndex] = useState(0);

  const currentSlide = heroData[slideIndex % heroData.length];

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === heroData.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const previousSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? heroData.length - 1 : prevIndex - 1,
    );
  };

  // Automatic slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, [heroData.length]);
//   useEffect(() => {
//   const nextIndex = slideIndex === heroData.length - 1 ? 0 : slideIndex + 1;
//   const img = new Image();
//   img.src = heroData[nextIndex].image;
// }, [slideIndex]);

  return (
    <>
      <section
        className="
          mx-8 pt-10
          flex flex-col lg:flex-row
          justify-center
        "
      >
        {/* LEFT CONTENT */}
        <div
          className="
            max-w-full lg:max-w-1/2
            space-y-3 z-10
          "
        >
          <h1 className="font-semibold text-[48px] leading-tight">
            Discover. Experience. Celebrate
            <span className="text-[#3f783d]"> Abia</span>
            <span className="text-[#F46F1A]">.</span>
          </h1>

          <p className="font-normal text-[18px] leading-tight">
            Your go-to platform for discovering amazing events happening around
            Abia State and beyond.
          </p>

          <div className="flex gap-3 flex-wrap">
            <NavLink
              to="/events"
              className="
                bg-[#F46F1A]
                text-white
                inline-flex
                justify-center
                items-center
                py-[15px]
                px-[25px]
                rounded-md
                gap-5
                pl-4
                font-bold
                w-full
                md:w-fit
              "
            >
              <span>Explore Events</span>

              <span>
                <IoArrowForward />
              </span>
            </NavLink>

            <NavLink
              to="/organizer/login"
              className="
    border-[#3C6E16]
    border-2
    text-[#3C6E16]
    inline-flex
    justify-center
    items-center
    py-[15px]
    px-[25px]
    rounded-md
    gap-5
    pl-4
    font-bold
    w-full
    md:w-fit
  "
            >
              <span>Become an Organizer</span>

              <span>
                <IoPlay />
              </span>
            </NavLink>
          </div>
        </div>

        {/* HERO SLIDER */}
        <div
          className="
            relative
            rounded-xl
            overflow-hidden
            h-80
            w-full
            lg:w-3xl
            z-10
            mt-5
          "
        >
          {/* Current Image */}
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="
              w-full
              h-full
              object-cover
              transition-opacity
              duration-500
            "
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* SLIDE CONTENT */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            {/* TOP */}
            <div className="flex justify-between items-start">
              {/* Featured Badge */}
              <span
                className="inline-block text-white px-4 py-2 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: currentSlide.color,
                }}
              >
                Featured Event
              </span>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  className={`
      flex
      items-center
      justify-center
      w-8
      h-8
      rounded-full
      transition
      ${
        slideIndex === 0
          ? "bg-black/60 text-white hover:bg-black/80"
          : "bg-white text-black hover:bg-gray-100"
      }
    `}
                >
                  <IoArrowBack size={14} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className={`
      flex
      items-center
      justify-center
      w-8
      h-8
      rounded-full
      transition
      ${
        slideIndex === heroData.length - 1
          ? "bg-black/60 text-white hover:bg-black/80"
          : "bg-white text-black hover:bg-gray-100"
      }
    `}
                >
                  <IoArrowForward size={14} />
                </button>
              </div>
            </div>

            {/* BOTTOM INFORMATION */}
            <div className="text-white max-w-[400px]">
              <h2 className="font-bold text-[25px] leading-tight">
                {currentSlide.title}
              </h2>

              <div className="mt-2 space-y-1 text-[11px] font-medium">
                <p>📅 {currentSlide.date}</p>

                <p>📍 {currentSlide.location}</p>

                {currentSlide.attendees && <p>👥 {currentSlide.attendees}</p>}
              </div>

              <button
                type="button"
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  text-white
                  px-5
                  py-2
                  rounded-md
                  text-[11px]
                  font-semibold
                  transition
                  hover:opacity-90
                "
                style={{
                  backgroundColor: currentSlide.color,
                }}
              >
                {currentSlide.buttonText}

                <IoArrowForward />
              </button>
            </div>
          </div>
        </div>

        {/* DECORATIVE ELEMENTS */}
        <div className="hidden lg:block">
          <div className="absolute right-1 top-30 w-fit h-fit rounded-full">
            <img src="/Ellipse 7.png" alt="" />
          </div>

          <div className="absolute right-5 top-80 w-fit h-fit rounded-full">
            <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-210 top-60 w-fit h-fit rounded-full">
            <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-1 top-95 w-fit h-fit rounded-full">
            <img src="/Ellipse 9.png" alt="" />
          </div>

          <div className="absolute right-306 top-50 w-fit h-fit rounded-full">
            <img src="/Ellipse 7 (1).png" alt="" />
          </div>

          <div className="absolute right-306 top-90 w-fit h-fit rounded-full">
            <img src="/Line 4 (1).png" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
