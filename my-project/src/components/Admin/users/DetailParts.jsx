import {
  Building2,
  CalendarDays,
  ArrowLeftRight,
  Ticket,
  CreditCard,
} from "lucide-react";

export const formatNaira = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const PILL_TONES = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-700",
  gray: "bg-gray-100 text-gray-600",
};

const STATUS_TONE = {
  Active: "green",
  Confirmed: "green",
  Success: "green",
  Completed: "blue",
  Silver: "blue",
  Gold: "amber",
  Pending: "amber",
  Suspended: "red",
  Failed: "red",
  Cancelled: "red",
};

export const Pill = ({ children, tone }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
      PILL_TONES[tone || STATUS_TONE[children] || "gray"]
    }`}
  >
    {children}
  </span>
);

const ICONS = {
  hotel: Building2,
  event: CalendarDays,
  ticket: Ticket,
  card: CreditCard,
  transport: ArrowLeftRight,
};

export const IconBox = ({ type }) => {
  const Icon = ICONS[type] || CreditCard;
  const tone =
    type === "transport"
      ? "bg-blue-50 text-blue-600"
      : "bg-green-50 text-[#1a6a2a]";
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}
    >
      <Icon size={16} />
    </span>
  );
};

export const DetailCard = ({ title, onViewAll, children, className = "" }) => (
  <section className={`rounded-xl bg-white p-5 shadow-sm ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-[#1a6a2a] hover:underline"
        >
          View all
        </button>
      )}
    </div>
    {children}
  </section>
);

export const ItemRow = ({ type, title, date, amount, status }) => (
  <div className="flex items-center gap-3 rounded-lg bg-[#f7f9f6] px-3 py-3">
    <IconBox type={type} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-gray-900">{title}</p>
      <p className="text-[11px] text-gray-500">
        {date} • {formatNaira(amount)}
      </p>
    </div>
    <Pill>{status}</Pill>
  </div>
);
