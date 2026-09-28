import React, {useState} from "react";

const VenueTabs = ({hotel}) => {
  const [active,setActive]=useState('Overview');
  const tabs = [
    "Overview",
    "Facilities",
    "Pricing",
    "Gallery",
    "Reviews unavailable",
    "Location",
  ];

  return (
    <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          disabled={tab === 'Reviews unavailable'}
          onClick={()=>{setActive(tab);if(tab==='Location')window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address || hotel.location || hotel.name)}`,'_blank','noopener,noreferrer');else document.getElementById(`hotel-${tab.toLowerCase()}`)?.scrollIntoView({behavior:'smooth',block:'start'});}}
          className={`pb-3 whitespace-nowrap text-sm font-semibold ${
            active === tab
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default VenueTabs;
