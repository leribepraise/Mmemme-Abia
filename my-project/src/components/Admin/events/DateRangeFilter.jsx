import { useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

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

const short = (iso) => {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`;
};

const buildLabel = (from, to) => {
  if (from && to) return `${short(from)} – ${short(to)}`;
  if (from) return `From ${short(from)}`;
  if (to) return `Until ${short(to)}`;
  return "Date Range";
};

const DateRangeFilter = ({ from, to, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const active = Boolean(from || to);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          active
            ? "flex h-9 items-center gap-2 rounded-lg border border-[#14481f] bg-white px-3 text-sm text-slate-800"
            : "flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"
        }
      >
        <CalendarDays className="h-4 w-4 text-slate-400" />
        {buildLabel(from, to)}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <label className="block text-xs text-slate-500">
            From
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => onChange(e.target.value, to)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-[#14481f]"
            />
          </label>
          <label className="mt-3 block text-xs text-slate-500">
            To
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => onChange(from, e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-[#14481f]"
            />
          </label>
          <button
            type="button"
            onClick={() => onChange("", "")}
            disabled={!active}
            className="mt-4 h-9 w-full rounded-lg border border-slate-200 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear dates
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
