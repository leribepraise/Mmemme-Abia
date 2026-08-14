import React from "react";
import EventCard from "./EventCard";

const EventGrid = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 place-items-center">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
