import { useState } from "react";
import toast from "react-hot-toast";
import { useCollection } from "@/hooks/useApi";
import { allPages } from "@/lib/api";
import { useBooking } from "@/hooks/useBooking";
import React from "react";
import { NavLink } from "react-router-dom";

const BookingCard = ({ hotel }) => {
  const { data: rooms } = useCollection(`/room-types/?hotel=${hotel.id}`);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomId, setRoomId] = useState('');
  const [checking, setChecking] = useState(false);
  const { book, busy } = useBooking();
  const reserve = async () => {
    if (checking || busy) return;
    const nights = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
    if (!roomId || !Number.isInteger(nights) || nights < 1 || nights > 30) { toast.error('Select a room and a stay of 1 to 30 nights.'); return; }
    setChecking(true);
    try {
      const inventory = await allPages(`/room-nights/?room_type=${roomId}&date_from=${checkIn}&date_to=${checkOut}`);
      if (inventory.length !== nights || inventory.some(n => n.quantity_available < 1)) throw new Error('This room is not available for every night of your stay. Choose other dates.');
      await book('HOTEL', inventory.map(n => ({ id: n.id, quantity: 1 })), { guests: 1 });
    } catch (error) { toast.error(error.message); } finally { setChecking(false); }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
      <h3 className="text-2xl font-bold mb-2">Book This Hotel</h3>

      <p className="text-xl font-bold text-[#F36B25] mb-6">
        From ₦{hotel.price?.toLocaleString() || "—"}{" "}
        <span className="text-sm font-normal text-gray-500">/ night</span>
      </p>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Check-in Date
          </label>

          <input
            type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Check-out Date
          </label>

          <input
            type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Room Type
          </label>

          <select value={roomId} onChange={e => setRoomId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3">
            <option value="">Select room type</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name} (up to {room.max_guests} guests)</option>)}
          </select>
        </div>

        <div>
          <button onClick={reserve} disabled={checking || busy} className="w-full bg-[#F36B25] hover:bg-[#dd5c17] text-white font-semibold py-3 rounded-lg">
            Reserve Room
          </button>
        </div>

        <button className="w-full border border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 rounded-lg mt-3">
          Send Enquiry
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
