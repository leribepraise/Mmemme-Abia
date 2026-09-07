import React from "react";

import SectionHeader from "./common/SectionHeader";
import BookingCard from "./common/BookingCard";

const MyBookings = () => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="My Bookings"
        description="View all your bookings and their current status."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BookingCard
          image="/event1.png"
          title="Hotel Oris Live Concert"
          location="Ohafia, Abia"
          status="Confirmed"
          price="₦2,500"
        />

        <BookingCard
          image="/event2.png"
          title="Abia Cultural Festival"
          location="Ohafia, Abia"
          status="Confirmed"
          price="Free"
        />

        <BookingCard
          image="/event3.png"
          title="Abia Food & Drinks Carnival"
          location="Arochukwu, Abia"
          status="Pending"
          price="₦2,000"
        />
      </div>
    </div>
  );
};

export default MyBookings;
