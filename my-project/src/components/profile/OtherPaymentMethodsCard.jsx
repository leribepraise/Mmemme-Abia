import React from "react";
import { Wallet } from "lucide-react";

const OtherPaymentMethodsCard = () => {
  const methods = [
    { label: "PayPal", color: "text-blue-600" },
    { label: "VERVE", color: "text-red-600" },
    { label: "mastercard", color: "text-gray-700", sub: true },
    { label: " Pay", color: "text-black", icon: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Other Payment Methods
          </h3>
          <p className="text-sm text-gray-500">
            We also support other secure payment options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {methods.map((m) => (
          <div
            key={m.label}
            className="border border-gray-200 rounded-lg py-3 flex items-center justify-center"
          >
            <span className={`font-bold text-sm ${m.color}`}>
              {m.icon ? "🍎" : ""}
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherPaymentMethodsCard;
