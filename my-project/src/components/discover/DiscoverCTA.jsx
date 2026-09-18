import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

const DiscoverCTA = ({
  title = "Ready to Experience the Best of Abia?",
  subtitle = "Join thousands exploring, connecting, and growing every day.",
  primaryBtnText = "Get Started Now",
  primaryBtnLink = "/signup",
  secondaryBtnText = "Explore Events",
  secondaryBtnLink = "/events",
}) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#265F27] p-8 md:p-12 shadow-lg">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        {/* TEXT CONTENT */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-3 text-base font-semibold text-green-100 md:text-lg">
            {subtitle}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex w-full flex-col sm:flex-row sm:w-auto gap-4">
          <Link
            to={primaryBtnLink}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-8 py-4 text-center text-sm font-extrabold text-white shadow-md transition hover:bg-[#ea580c] active:scale-[0.98] md:text-base"
          >
            <span>{primaryBtnText}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            to={secondaryBtnLink}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-8 py-4 text-center text-sm font-extrabold text-white transition hover:bg-white hover:text-[#265F27] active:scale-[0.98] md:text-base"
          >
            <Compass className="h-5 w-5" />
            <span>{secondaryBtnText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoverCTA;