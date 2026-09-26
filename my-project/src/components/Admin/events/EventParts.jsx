import {
  Building2,
  Bus,
  Landmark,
  Mountain,
  Music,
  UtensilsCrossed,
} from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2025-01-12" -> "12 Jan 2025"
export const formatEventDate = (iso) => {
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};

const STATUS_STYLES = {
  Pending:
    "inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-[#f28c28]",
  Verified:
    "inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600",
  Suspended:
    "inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600",
  Rejected:
    "inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600",
};
const DEFAULT_STATUS_STYLE =
  "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600";

export const EventStatusBadge = ({ status }) => (
  <span className={STATUS_STYLES[status] || DEFAULT_STATUS_STYLE}>
    {status}
  </span>
);

// Placeholder tiles until real event images exist (set `image` on an event to use it)
const TILES = {
  Culture: { icon: Landmark, box: "bg-amber-100 text-amber-700" },
  Hospitality: { icon: Building2, box: "bg-sky-100 text-sky-700" },
  "Food & Drink": {
    icon: UtensilsCrossed,
    box: "bg-orange-100 text-orange-700",
  },
  Transport: { icon: Bus, box: "bg-slate-200 text-slate-600" },
  Tourism: { icon: Mountain, box: "bg-emerald-100 text-emerald-700" },
  Entertainment: { icon: Music, box: "bg-violet-100 text-violet-700" },
};
const DEFAULT_TILE = { icon: Landmark, box: "bg-slate-100 text-slate-500" };

export const EventThumb = ({ event }) => {
  if (event.image) {
    return (
      <img
        src={event.image}
        alt={event.title}
        className="h-10 w-10 shrink-0 rounded-md object-cover"
      />
    );
  }
  const tile = TILES[event.category] || DEFAULT_TILE;
  const Icon = tile.icon;
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tile.box}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
};

export const EventIdentity = ({ event }) => (
  <div className="flex min-w-0 items-center gap-3">
    <EventThumb event={event} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-900">
        {event.title}
      </p>
      <p className="truncate text-xs text-slate-400">{event.subtitle}</p>
    </div>
  </div>
);
