import { useAuth } from '@/components/context/AuthContext';
import toast from 'react-hot-toast';
import React, { useState } from "react";
import { Compass } from "lucide-react";

const interestsList = [
  "Nature & Parks",
  "Historical Sites",
  "Caves & Hills",
  "Religious Sites",
  "Adventure",
  "Food & Drinks",
  "Culture",
  "Others",
];

const travelStyles = ["Solo", "Couple", "Family", "Group"];

const TravelPreferencesCard = () => {
  const { user, updateUser } = useAuth();
  const selectedInterests = user?.interests || [];
  const [busy, setBusy] = useState(false);
  const [travelStyle, setTravelStyle] = useState("Couple");
  const [budget, setBudget] = useState("₦50,000 - ₦100,000");

  const toggleInterest = async interest => {
    if (busy) return;
    setBusy(true);
    try { await updateUser({ interests: selectedInterests.includes(interest) ? selectedInterests.filter(item => item !== interest) : [...selectedInterests, interest] }); }
    catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <Compass className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Travel Preferences
          </h3>
          <p className="text-sm text-gray-500">
            Help us suggest the best experiences for you.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Interests (select multiple)
        </p>

        <div className="flex flex-wrap gap-2">
          {interestsList.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedInterests.includes(interest)
                  ? "bg-[#3F783D] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Preferred Travel Style
        </p>

        <div className="flex flex-wrap gap-2">
          {travelStyles.map((style) => (
            <button
              key={style}
              onClick={() => toast("Travel style preferences are not available yet.")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                travelStyle === style
                  ? "bg-[#3F783D] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Preferred Budget Range
        </p>

        <select
          value={budget}
          onChange={() => toast("Budget preferences are not available yet.")}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-700"
        >
          <option>₦0 - ₦50,000</option>
          <option>₦50,000 - ₦100,000</option>
          <option>₦100,000 - ₦200,000</option>
          <option>₦200,000+</option>
        </select>
      </div>
    </div>
  );
};

export default TravelPreferencesCard;
