import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const PaymentForm = ({
  booking,
  event,
  tickets,
  attendee,
  subtotal,
  serviceFee,
  total,
}) => {
  const [busy, setBusy] = useState(false);
  const pay = async () => {
    if (busy || !booking) return;
    setBusy(true);
    try {
      const payment = await api('/payments/initialize/', { method: 'POST', body: { booking: booking.id } });
      const url = new URL(payment.authorization_url);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.paystack.com') throw new Error('The payment provider returned an invalid checkout address.');
      window.location.assign(url.href);
    } catch (error) { toast.error(error.message); setBusy(false); }
  };
  return (
    <div className="lg:col-span-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-lg text-black">Pay securely with Paystack</h2>

          <div className="flex items-center gap-2">
            <img src="/visa.png" />

            <div className="flex scale-75 origin-right">
              <img src="/mastercard.png" />
            </div>

            <img src="/verve.png" />

            <img src="/paystack.png" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Card Number
            </label>

            <input disabled
              type="text"
              placeholder="Enter securely on Paystack"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Cardholder Name
            </label>

            <input disabled
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

              <input disabled
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
                <input disabled
                  type="text"
                  placeholder="On Paystack"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300"
                />

                <HelpCircle className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 pb-6 border-b border-dashed border-gray-200">
            <input disabled
              type="checkbox"
              id="saveCard"
              className="w-4 h-4 text-[#48782E] rounded border-gray-300 focus:ring-[#48782E]"
            />

            <label
              htmlFor="saveCard"
              className="text-sm font-semibold text-gray-600 cursor-pointer"
            >
              Card details are entered securely on Paystack.
            </label>
          </div>

          <button type="button" onClick={pay} disabled={busy} className="w-full">
            <div className="bg-[#EAF5EA] rounded-lg p-4 flex justify-between items-center">
              <span className="font-bold text-black text-sm">
                {busy ? "Connecting..." : "Pay"}
              </span>

              <span className="font-bold text-[#48782E] text-lg">
                N{total?.toLocaleString() || "0"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

