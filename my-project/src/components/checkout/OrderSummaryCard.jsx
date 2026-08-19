import { NavLink } from "react-router-dom";

const OrderSummaryCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-black mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 text-sm font-semibold text-gray-600">
        <div className="flex justify-between">
          <span className="font-semibold text-[18px] text-[#3D3E3E]">
            Subtotal
          </span>
          <span className="text-black">N16,000</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-[18px] text-[#3D3E3E]">
            Service Fee
          </span>
          <span className="text-black">N1,250</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-8">
        <span className="font-bold text-black text-lg">Total</span>

        <span className="font-bold text-[#48782E] text-xl">N17,250</span>
      </div>

      <NavLink to="/Payment">
        <button className="w-full bg-[#F46F1A] hover:bg-[#d95d1d] text-white font-bold py-3.5 rounded-lg transition-colors mb-6 shadow-sm">
          Proceed to Payment
        </button>
      </NavLink>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500 mb-4">We accept</p>

        <div className="flex items-center justify-center gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
          <span className="text-blue-800 font-black italic text-xl">VISA</span>

          <div className="flex">
            <div className="w-6 h-6 rounded-full bg-red-500 opacity-90 -mr-2"></div>
            <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div>
          </div>

          <span className="font-bold tracking-tighter">VERVE</span>

          <span className="font-bold text-blue-500 text-sm flex items-center gap-1">
            <span className="text-[10px]">≡</span>
            paystack
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
