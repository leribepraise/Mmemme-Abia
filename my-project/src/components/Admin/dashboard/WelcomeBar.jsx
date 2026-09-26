import { ChevronDown } from "lucide-react";

const WelcomeBar = ({ range, onRangeChange }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a] sm:text-2xl">
          Welcome back, Admin 👋
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Here's what's happening on Mmemme Abia today.
        </p>
      </div>

      <div className="relative w-full sm:w-auto">
        <label htmlFor="dashboard-range" className="sr-only">
          Time range
        </label>
        <select
          id="dashboard-range"
          value={range}
          onChange={(e) => onRangeChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-xs font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#14481f]/30 sm:w-36"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default WelcomeBar;
