import { useRef, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import toast from "react-hot-toast";
import useClickOutside from "@/hooks/useClickOutside";

const SELECT =
  "h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#0f3d1b]";

const TourismFilterBar = ({
  search,
  status,
  category,
  statusOptions,
  categoryOptions,
  onSearch,
  onStatus,
  onCategory,
}) => {
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef(null);
  useClickOutside(dateRef, () => setDateOpen(false), dateOpen);

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, location, or category..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#0f3d1b]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => onCategory(e.target.value)}
            className={SELECT}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className={SELECT}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div ref={dateRef} className="relative">
            <button
              type="button"
              onClick={() => setDateOpen((v) => !v)}
              className={`${SELECT} flex items-center gap-2`}
            >
              <CalendarDays className="h-4 w-4 text-slate-400" />
              Date Range
            </button>
            {dateOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 shadow-lg">
                Date filtering isn't built yet.
                <button
                  type="button"
                  onClick={() => {
                    setDateOpen(false);
                    toast("Date Range isn't built yet");
                  }}
                  className="mt-2 h-8 w-full rounded-md bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismFilterBar;
