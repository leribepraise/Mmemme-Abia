import React from "react";
import { HelpCircle, Phone, Mail } from "lucide-react";

const NeedHelpCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-xl text-[#48782E]">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div>
          <h4 className="font-bold text-black text-lg">Need Help?</h4>
          <p className="text-sm text-gray-500 font-medium">Contact support</p>
        </div>
      </div>

      <div className="space-y-4 text-sm font-bold text-gray-700">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>Call: 09123456709</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>Email: support@mmemmeabia.com</span>
        </div>
      </div>
    </div>
  );
};

export default NeedHelpCard;
