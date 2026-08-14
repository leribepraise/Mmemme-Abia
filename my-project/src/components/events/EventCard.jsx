import React from "react";
import { NavLink } from "react-router-dom";

const EventCard = ({ event }) => {
  const card = (
    <div className="w-[313px] h-[240px] rounded-3xl bg-[#FEFEFE] transition duration-300 hover:bg-[#F1FCEE] hover:-translate-y-1 hover:shadow-md cursor-pointer">
      <img src={event.image} alt={event.text} className="w-full" />

      <div className="p-3 space-y-3">
        <p className="font-semibold text-[16px]">{event.text}</p>

        <div className="flex justify-between">
          <p className="font-medium text-[12px]">{event.text2}</p>

          <p className="font-semibold text-[16px] text-[#3C6E16]">
            {event.text3}
          </p>
        </div>
      </div>
    </div>
  );

  return event.addLink ? <NavLink to={event.addLink}>{card}</NavLink> : card;
};

export default EventCard;
