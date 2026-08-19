import React from "react";
import { AlertTriangle } from "lucide-react";

const ImportantNotes = () => {
  return (
    <div className="bg-[#FFF8F6] border border-[#FFE8E3] rounded-2xl p-6">
      <div className="flex items-center gap-2 text-[#F36B25] mb-4">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="font-bold text-base">Important Notes</h3>
      </div>

      <ul className="space-y-3 text-sm font-bold text-gray-700">
        <li className="flex gap-3">
          <span className="text-[#F36B25]">•</span>
          Show this QR code at the entrance for verification.
        </li>

        <li className="flex gap-3">
          <span className="text-[#F36B25]">•</span>
          This ticket is non-transferable and non-refundable.
        </li>

        <li className="flex gap-3">
          <span className="text-[#F36B25]">•</span>
          Please arrive early to avoid delays.
        </li>
      </ul>
    </div>
  );
};

export default ImportantNotes;
