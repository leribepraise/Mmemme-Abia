import { Link } from "react-router-dom";
import React from "react";

const DestinationCard = ({hotels=[]}) => {
  const places=Object.entries(hotels.reduce((counts,h)=>({...counts,[h.city]:(counts[h.city]||0)+1}),{})).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <div className="flex justify-between mb-5">
        <h3 className="font-bold">Top Destinations</h3>
        <Link to="/search?category=Stay" className="text-green-700 text-sm font-semibold">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {places.map(([name, hotels]) => (
          <Link className="block" key={name} to={`/search?category=Stay&q=${encodeURIComponent(name)}`}>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-gray-500">{hotels} properties</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DestinationCard;
