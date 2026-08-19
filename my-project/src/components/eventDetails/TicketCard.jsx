import { NavLink } from "react-router-dom";
import { FiBookmark, FiMinus, FiPlus } from "react-icons/fi";

const TicketCard = ({ tickets, updateQuantity }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="bg-[#E4FCE4] -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-emerald-100">
        <span className="text-[12px] font-medium text-[#000000] uppercase tracking-wider">
          From
        </span>

        <p className="text-[18px] font-bold text-[#3C6E16]">N3,000</p>
      </div>

      <div className="">
        <h3 className="text-[12px] font-semibold text-[#000000] tracking-wider mb-3">
          Available Tickets
        </h3>

        <div className="space-y-3.5 divide-y divide-slate-100">
          <div className="pt-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <h4 className="font-bold text-[18px]">Regular</h4>
              <p className="font-bold text-[18px]">N3,000</p>
            </div>

            <div className="flex justify-between">
              <p className="text-[12px] font-medium">
                Choose the number of tickets to buy
              </p>

              <div className="flex items-center border rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity("regular", "decrease")}
                  className="p-1 cursor-pointer"
                >
                  <FiMinus className="w-3 h-3" />
                </button>

                <span className="px-2 text-sm font-bold">
                  {tickets.regular}
                </span>

                <button
                  onClick={() => updateQuantity("regular", "increase")}
                  className="p-1 cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <h4 className="font-bold text-[18px]">VIP</h4>
              <p className="font-bold text-[18px]">N10,000</p>
            </div>

            <div className="flex justify-between">
              <p className="text-[12px] font-medium">
                Choose the number of tickets to buy
              </p>

              <div className="flex items-center border rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity("vip", "decrease")}
                  className="p-1 cursor-pointer"
                >
                  <FiMinus className="w-3 h-3" />
                </button>

                <span className="px-2 text-sm font-bold">{tickets.vip}</span>

                <button
                  onClick={() => updateQuantity("vip", "increase")}
                  className="p-1 cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <h4 className="font-bold text-[18px]">VVIP</h4>
              <p className="font-bold text-[18px]">N20,000</p>
            </div>

            <div className="flex justify-between">
              <p className="text-[12px] font-medium">
                Choose the number of tickets to buy
              </p>

              <div className="flex items-center border rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity("vvip", "decrease")}
                  className="p-1 cursor-pointer"
                >
                  <FiMinus className="w-3 h-3" />
                </button>

                <span className="px-2 text-sm font-bold">{tickets.vvip}</span>

                <button
                  onClick={() => updateQuantity("vvip", "increase")}
                  className="p-1 cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <NavLink to="/checkout">
          <button className="w-full bg-[#F46F1A] hover:bg-[#e05600] text-white font-bold py-3 rounded-xl cursor-pointer mb-2">
            Buy Tickets
          </button>
        </NavLink>

        <button className="w-full border border-emerald-600 text-emerald-700 py-2.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer">
          <span>Save Events</span>

          <FiBookmark className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <div className="flex -space-x-2">
          <img
            src="/Ellipse1.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="/Ellipse2.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="/Ellipse3.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
        </div>

        <p className="text-[12px] font-semibold">15.7k people are interested</p>
      </div>
    </div>
  );
};

export default TicketCard;
