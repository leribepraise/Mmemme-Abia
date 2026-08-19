import { HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const PaymentForm = () => {
  return (
    <div className="lg:col-span-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-lg text-black">Pay with Card</h2>

          <div className="flex items-center gap-2">
            {/* <span className="text-blue-800 font-black italic text-lg">
              VISA
            </span> */}
            <img src="/visa.png" />

            <div className="flex scale-75 origin-right">
              {/* <div className="w-6 h-6 rounded-full bg-red-500 opacity-90 -mr-2"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div> */}
              <img src="/mastercard.png" />
            </div>

            {/* <span className="font-bold text-xs tracking-tighter">VERVE</span> */}
            <img src="/verve.png" />

            {/* <span className="font-bold text-blue-500 text-xs flex items-center gap-0.5 ml-2">
              <span className="text-[10px]">≡</span>
              paystack
            </span> */}
            <img src="/paystack.png" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Card Number
            </label>

            <input
              type="text"
              placeholder="01234 05678 0912 01112"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Cardholder Name
            </label>

            <input
              type="text"
              placeholder="Enter cardholder name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Expiry Date
              </label>

              <input
                type="text"
                placeholder="MM / YY"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                CVV
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="123"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
                />

                <HelpCircle className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 pb-6 border-b border-dashed border-gray-200">
            <input
              type="checkbox"
              id="saveCard"
              className="w-4 h-4 text-[#48782E] rounded border-gray-300 focus:ring-[#48782E]"
            />

            <label
              htmlFor="saveCard"
              className="text-sm font-semibold text-gray-600 cursor-pointer"
            >
              Save card for future payments.
            </label>
          </div>

          <NavLink to="/Paymentsuccess">
            <div className="bg-[#EAF5EA] rounded-lg p-4 flex justify-between items-center">
              <span className="font-bold text-black text-sm">Pay</span>
              <span className="font-bold text-[#48782E] text-lg">N17,250</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
