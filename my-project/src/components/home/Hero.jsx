import SiteImage from '@/components/SiteImage';
import { useApi } from "@/hooks/useApi";
import PageSkeleton from '@/components/PageSkeleton';
import { eventCard } from "@/lib/catalog";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { eventTicketPath } from '@/lib/navigation';
import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";
const SLIDE_DURATION_MS = 7000;

const Hero = () => {
  const { data, loading } = useApi('/events/');
  const events = (data?.results || data || []).slice(0, 7).map(eventCard);
  const heroData = events.length ? events.map(event => ({
    ...event,
    title: event.text,
    date: new Date(event.start_datetime).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
    location: event.venue,
    description: event.description?.trim() || 'Discover the details and reserve your place at this event.',
    buttonText: 'Get Ticket',
  })) : [{ image: '/hero1.jpg', title: 'Explore events in Abia', description: 'Find your next experience in Abia.', buttonText: 'Explore Events' }];
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndex = slideIndex % heroData.length;

  const nextSlide = () => {
    setSlideIndex(index => (index + 1) % heroData.length);
  };

  const previousSlide = () => {
    setSlideIndex(index => (index - 1 + heroData.length) % heroData.length);
  };

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (heroData.length < 2 || paused || reducedMotion || !pageVisible) return undefined;
    const timer = window.setTimeout(() => setSlideIndex(index => (index + 1) % heroData.length), SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, heroData.length, paused, reducedMotion, pageVisible]);

  if (loading) return <PageSkeleton cards={1}/>;
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
          <h1 className="font-semibold text-3xl md:text-4xl lg:text-[48px] leading-tight">
            Discover. Experience. Celebrate
            <span className="text-[#3f783d]"> Abia</span>
            <span className="text-[#F46F1A]">.</span>
          </h1>

          <p className="font-normal text-sm md:text-base lg:text-[18px] leading-tight">
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
              to="/organizer/apply"
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
            bg-slate-900
          "
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured events"
        >
          {heroData.map((currentSlide, index) => <div
            key={currentSlide.id || currentSlide.image}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${index === activeIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          >
          {/* Current Image */}
          <SiteImage priority={index === 0} loading={index === activeIndex || index === (activeIndex + 1) % heroData.length ? 'eager' : 'lazy'}
            src={currentSlide.image_detail || currentSlide.image}
            srcSet={currentSlide.image_card && currentSlide.image_detail ? `${currentSlide.image_card} 640w, ${currentSlide.image_detail} 1280w` : undefined}
            sizes="(max-width: 1024px) 100vw, 50vw"
            alt={currentSlide.title}
            className={`h-full w-full object-contain transition-transform duration-[7000ms] ease-out motion-reduce:transition-none ${index === activeIndex ? 'scale-[1.035]' : 'scale-100'}`}
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/15" />

          {/* SLIDE CONTENT */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            {/* TOP */}
            <div className="flex justify-between items-start">
              {/* Featured Badge */}
              <span
                className="inline-block rounded-full bg-[#F46F1A] px-4 py-2 text-[10px] font-semibold text-white"
              >
                {events.length ? 'Featured Event' : 'Explore Abia'}
              </span>

              {/* Navigation */}
              {heroData.length > 1 && <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous featured event"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <IoArrowBack size={14} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next featured event"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <IoArrowForward size={14} />
                </button>
              </div>}
            </div>

            {/* BOTTOM INFORMATION */}
            <div className="max-w-[430px] text-white">
              <h2 className="line-clamp-2 text-xl font-bold leading-tight md:text-[25px]">
                {currentSlide.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-snug text-white/90">
                {currentSlide.description}
              </p>

              <div className="mt-2 space-y-1 text-xs font-medium">
                {currentSlide.date && <p>📅 {currentSlide.date}</p>}
                {currentSlide.location && <p className="line-clamp-1">📍 {currentSlide.location}</p>}
              </div>

              <NavLink
                to={currentSlide.id ? eventTicketPath(currentSlide) : '/events'}
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
                  bg-[#F46F1A]
                  hover:bg-[#d95d10]
                "
              >
                {currentSlide.buttonText}

                <IoArrowForward />
              </NavLink>
            </div>
          </div>
          </div>)}
        </div>

        {/* DECORATIVE ELEMENTS */}
        <div className="hidden lg:block">
          <div className="absolute right-1 top-30 w-fit h-fit rounded-full">
            <SiteImage src="/Ellipse 7.png" alt="" />
          </div>

          <div className="absolute right-5 top-80 w-fit h-fit rounded-full">
            <SiteImage src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-210 top-60 w-fit h-fit rounded-full">
            <SiteImage src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-1 top-95 w-fit h-fit rounded-full">
            <SiteImage src="/Ellipse 9.png" alt="" />
          </div>

          <div className="absolute right-306 top-50 w-fit h-fit rounded-full">
            <SiteImage src="/Ellipse 7 (1).png" alt="" />
          </div>

          <div className="absolute right-306 top-90 w-fit h-fit rounded-full">
            <SiteImage src="/Line 4 (1).png" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
