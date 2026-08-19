import React from "react";

const DiscoverCTA = () => {
  return (
    <section className="bg-[#204A1D] rounded-2xl px-8 py-8 flex flex-col lg:flex-row justify-between items-center gap-6">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">
          Ready to Experience the Best of Abia?
        </h2>

        <p className="text-green-100">
          Join thousands exploring, connecting and growing every day.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="bg-[#F97316] hover:bg-[#df5f18] text-white px-6 py-3 rounded-lg font-semibold">
          Get Started Now
        </button>

        <button className="border border-white text-white hover:bg-white hover:text-[#204A1D] px-6 py-3 rounded-lg font-semibold transition">
          Explore Events
        </button>
      </div>
    </section>
  );
};

export default DiscoverCTA;
