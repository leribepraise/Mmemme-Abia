import { FiMapPin } from "react-icons/fi";

const LocationCard = () => {
  return (
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

            <p className="text-sm text-slate-500 mb-1">Umuahia, Abia</p>

            <button className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
