import { useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/components/context/AuthContext";
import BookingAlert from "../components/bookingComfire/BookingAlert";
import BookSurmary from "../components/bookingComfire/BookSurmary";
import WhatNext from "../components/bookingComfire/WhatNext";
import DownloadTicketButton from "../components/bookingComfire/bookTicketDownload/DownloadTicketButton";

export default function BookingComfirmationPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: booking, loading, error } = useApi(`/bookings/${id}/`);
  const { data: listing } = useApi(booking?.details?.hotel_id ? `/hotels/${booking.details.hotel_id}/` : null);
  const hotel = { name: booking?.details?.title, location: booking?.details?.location, image: listing?.image || '/hotel.png' };
  if (loading || error || booking?.kind !== 'HOTEL' || booking.status !== 'CONFIRMED') return <div className="grid min-h-screen place-items-center px-4 py-8"><p role="status">{error?.message || (loading ? 'Loading your booking...' : 'This hotel reservation is not confirmed. Check My Bookings for its status.')}</p></div>;
  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-[1000px]">
        <div className="rounded-[12px] border-2 border-[#C1C9BB] bg-white p-4 shadow-md sm:p-5">
          <div className="grid grid-cols-1 justify-items-center gap-8 p-2 sm:p-5 md:grid-cols-2">
            <BookingAlert hotel={hotel} bookingRef={booking.booking_reference} email={user?.email} />
            <BookSurmary hotel={hotel} booking={booking} />
          </div><hr />
          <div className="flex flex-col items-center gap-5 p-4 sm:p-6 md:p-10">
            <WhatNext hotel={hotel} />
            <DownloadTicketButton hotel={hotel} bookingRef={booking.booking_reference} booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}
