import toast from "react-hot-toast";
import { DetailCard } from "./PropertyDetailParts";

const naira = (n) => `₦${n.toLocaleString("en-US")}`;

const RoomsPricingCard = ({ rooms }) => (
  <DetailCard
    title="Rooms & Pricing"
    action={
      <button
        type="button"
        onClick={() => toast("Viewing all rooms isn't built yet")}
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        View All Rooms
      </button>
    }
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="overflow-hidden rounded-xl border border-slate-100"
        >
          <div className="flex h-28 items-center justify-center bg-emerald-50 text-xs text-emerald-300">
            No image
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-slate-900">{room.name}</p>
            <p className="mt-0.5 text-sm font-semibold text-[#1a6a2a]">
              {naira(room.price)}
              <span className="text-xs font-normal text-slate-400">
                {" "}
                / night
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {room.guests} guests • {room.beds} bed{room.beds > 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={() => toast(`${room.name} details aren't built yet`)}
              className="mt-3 h-8 w-full rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </DetailCard>
);

export default RoomsPricingCard;
