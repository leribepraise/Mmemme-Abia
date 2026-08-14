import { FiHeart, FiMapPin } from "react-icons/fi";

const SimilarEventCard = ({ image, alt, date, title, location, price }) => {
  return (
    <div className="flex space-x-3 border border-slate-100 rounded-xl p-2 hover:shadow-md transition bg-slate-50/50">
      <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0">
        <img src={image} alt={alt} className="w-full h-full object-cover" />

        <span className="absolute top-1 left-1 bg-white/90 text-[9px] font-bold text-slate-900 px-1.5 py-0.5 rounded">
          {date}
        </span>

        <button className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full cursor-pointer">
          <FiHeart className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="flex flex-col justify-between py-0.5 w-full">
        <div>
          <h4 className="text-[10px] font-semibold text-[#000000] line-clamp-1">
            {title}
          </h4>

          <p className="text-[12px] font-medium text-slate-500 flex items-center space-x-1 mt-0.5">
            <FiMapPin className="w-2.5 h-2.5" />
            <span>{location}</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[16px] font-semibold text-[#3C6E16]">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimilarEventCard;
