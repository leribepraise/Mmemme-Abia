import React from "react";

const HeroBannerImage = ({ title, description, features, image }) => {
  return (
    <div
      className="relative rounded-2xl p-6 md:p-10 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-white font-bold text-3xl md:text-4xl">{title}</h1>

        <p className="text-gray-200 mt-3 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        <hr className="border-white/20 my-6" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title: fTitle, subtitle }) => (
            <div key={fTitle} className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-white shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">{fTitle}</p>
                <p className="text-gray-300 text-[11px]">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBannerImage;
