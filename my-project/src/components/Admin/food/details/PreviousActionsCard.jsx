import toast from "react-hot-toast";
import { DetailCard } from "./FoodDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const PreviousActionsCard = ({ seedActions, notes }) => {
  const liveActions = notes.map((n) => ({
    id: n.id,
    name: "Admin",
    text: `${n.type}: ${n.text}`,
    date: new Date(n.createdAt).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  const all = [...seedActions, ...liveActions];

  return (
    <DetailCard title="Previous Actions">
      <div className="space-y-3">
        {all.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
                {initials(a.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{a.name}</p>
                <p className="text-sm text-slate-600">{a.text}</p>
                <p className="text-[11px] text-slate-400">{a.date}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast("Viewing details isn't built yet")}
              className="shrink-0 text-xs font-medium text-[#1a6a2a] hover:underline"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </DetailCard>
  );
};

export default PreviousActionsCard;
