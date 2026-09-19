import React, { useState } from "react";
import { Globe } from "lucide-react";

const LanguageCard = () => {
  const [language, setLanguage] = useState("English (Default)");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <Globe className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />

        <div>
          <h3 className="font-bold text-base text-[#172033]">Language</h3>
          <p className="text-sm text-gray-500">
            Choose your preferred language.
          </p>
        </div>
      </div>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-700"
      >
        <option>English (Default)</option>
        <option>Igbo</option>
        <option>Yoruba</option>
        <option>Hausa</option>
        <option>French</option>
      </select>
    </div>
  );
};

export default LanguageCard;
