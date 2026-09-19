import React from "react";
import { CreditCard, Plus, MoreVertical } from "lucide-react";

const SavedCardsCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">Saved Cards</h3>
          <p className="text-sm text-gray-500">Your saved payment cards</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-blue-800 font-black italic text-sm">
              VISA
            </span>

            <div>
              <p className="text-sm font-semibold text-[#172033]">
                Visa **** 4242
              </p>
              <p className="text-xs text-gray-400">Expires 04/28</p>
            </div>

            <span className="bg-[#EAF4EB] text-[#3F783D] text-xs font-semibold px-2 py-0.5 rounded-full">
              Default
            </span>
          </div>

          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <button className="w-full flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition">
          <div className="w-8 h-8 rounded-full bg-[#EAF4EB] flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-[#3F783D]" />
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-[#172033]">Add New Card</p>
            <p className="text-xs text-gray-400">
              Save a card for quick and secure payments.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SavedCardsCard;
