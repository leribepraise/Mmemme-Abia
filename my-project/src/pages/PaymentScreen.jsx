import React, { useState } from "react";
import {
  CreditCard,
  Landmark,
  Hash,
  Smartphone,
  Wallet,
  HelpCircle,
  ArrowLeft,
  HeadphonesIcon,
} from "lucide-react";

export default function PaymentScreen() {
  const [activeMethod, setActiveMethod] = useState("card");

  // Reusable component for the left sidebar payment methods
  const PaymentMethod = ({ id, icon: Icon, title, subtitle }) => (
    <button
      onClick={() => setActiveMethod(id)}
      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all ${
        activeMethod === id
          ? "bg-white border-green-500 shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-300"
      }`}
    >
      <div
        className={`mt-0.5 ${activeMethod === id ? "text-[#48782E]" : "text-gray-500"}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3
          className={`font-bold text-sm ${activeMethod === id ? "text-black" : "text-gray-700"}`}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header & Breadcrumbs */}
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-4 flex gap-2">
            <span>Events</span> &gt;
            <span>Abia Business Summit 2026</span> &gt;
            <span>Checkout</span> &gt;
            <span className="text-gray-300">Payment</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-2 text-black">Payment</h1>
          <p className="text-gray-600 font-medium">
            Complete your payment to confirm your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* COLUMN 1: Payment Methods Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-bold text-lg text-black mb-4">
              Payment Methods
            </h2>

            <PaymentMethod
              id="card"
              icon={CreditCard}
              title="Card Payment"
              subtitle="Visa, Mastercard, Verve"
            />
            <PaymentMethod
              id="bank"
              icon={Landmark}
              title="Bank Transfer"
              subtitle="Pay directly from your bank"
            />
            <PaymentMethod
              id="ussd"
              icon={Hash}
              title="USSD"
              subtitle="*330* and other codes"
            />
            <PaymentMethod
              id="mobile"
              icon={Smartphone}
              title="Mobile Money"
              subtitle="MTN, Airtel, Glo"
            />
            <PaymentMethod
              id="paystack"
              icon={Wallet}
              title="Pay with Paystack"
              subtitle="Fast and secure"
            />
          </div>

          {/* COLUMN 2: Main Payment Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-lg text-black">Pay with Card</h2>
                {/* Payment Logos Placeholder */}
                <div className="flex items-center gap-2">
                  <span className="text-blue-800 font-black italic text-lg">
                    VISA
                  </span>
                  <div className="flex scale-75 origin-right">
                    <div className="w-6 h-6 rounded-full bg-red-500 opacity-90 -mr-2"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div>
                  </div>
                  <span className="font-bold text-xs tracking-tighter">
                    VERVE
                  </span>
                  <span className="font-bold text-blue-500 text-xs flex items-center gap-0.5 ml-2">
                    <span className="text-[10px]">≡</span> paystack
                  </span>
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

                <div className="bg-[#EAF5EA] rounded-lg p-4 flex justify-between items-center">
                  <span className="font-bold text-black text-sm">
                    Total Amount
                  </span>
                  <span className="font-bold text-[#48782E] text-lg">
                    N17,250
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Payment Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-black mb-6">
                Payment Summary
              </h2>

              {/* Event Mini-Card */}
              <div className="flex gap-4 mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                  <img
                    src="/checkout.jpg"
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-black mb-2 leading-tight">
                    Abia Business Summit 2026
                  </h3>
                  <p className="text-[10px] text-gray-500 mb-1">
                    Fri, 25 - Sun, 27 Oct, 2026
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Umueze Sports Arena, Umuahia, Abia
                  </p>
                </div>
              </div>

              {/* Tickets List */}
              <div className="mb-6">
                <h3 className="font-bold text-black text-sm mb-4">Tickets</h3>
                <div className="space-y-3 text-sm font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Regular (x2)</span>
                    <span className="text-black">N6,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VIP (x1)</span>
                    <span className="text-black">N10,000</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* Fees */}
              <div className="space-y-3 mb-6 text-sm font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black">N16,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-black">N1,250</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="font-bold text-black text-lg">Total</span>
                <span className="font-bold text-[#48782E] text-xl">
                  N17,250
                </span>
              </div>
            </div>

            {/* 24/7 Support Box */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
              <div className="bg-gray-200/50 p-2.5 rounded-lg h-fit text-[#48782E]">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  24/7 Support
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  We are here to help you anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Back Button */}
        <div className="mt-8">
          <button className="flex items-center gap-2 text-[#48782E] font-bold text-sm hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
