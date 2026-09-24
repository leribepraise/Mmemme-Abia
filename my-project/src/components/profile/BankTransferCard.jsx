import toast from 'react-hot-toast';
import React from "react";
import { Landmark, Plus } from "lucide-react";

const BankTransferCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Landmark className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">Bank Transfer</h3>
          <p className="text-sm text-gray-500">
            Bank transfer instructions are provided at Paystack checkout.
          </p>
        </div>
      </div>

      <button onClick={() => toast("Choose bank transfer at Paystack checkout when it is available.")} className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-3 text-sm font-medium text-[#3F783D] hover:bg-gray-50 transition">
        <Plus className="w-4 h-4" />
        Add Bank Account
      </button>
    </div>
  );
};

export default BankTransferCard;
