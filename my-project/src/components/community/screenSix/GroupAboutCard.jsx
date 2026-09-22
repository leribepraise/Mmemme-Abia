import React from "react";
import { Globe, Eye } from "lucide-react";

const GroupAboutCard = ({ group }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-3">About</h3>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {group.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#172033]">Public</p>
            <p className="text-xs text-gray-400">
              Anyone can see who's in the group
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Eye className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#172033]">Visible</p>
            <p className="text-xs text-gray-400">Anyone can find this group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAboutCard;
