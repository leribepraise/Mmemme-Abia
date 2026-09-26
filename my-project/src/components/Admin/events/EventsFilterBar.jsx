import { ChevronDown, Search } from "lucide-react";
import DateRangeFilter from "./DateRangeFilter";

const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="relative">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-[#14481f]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  </div>
);

const EventsFilterBar = ({
  search,
  status,
  category,
  dateFrom,
  dateTo,
  statusOptions,
  categoryOptions,
  onSearch,
  onStatus,
  onCategory,
  onDateRange,
}) => (
  <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
    <div className="relative w-full lg:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search events, organizers, or locations..."
        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#14481f]"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        label="Filter by status"
        value={status}
        options={statusOptions}
        onChange={onStatus}
      />
      <FilterSelect
        label="Filter by category"
        value={category}
        options={categoryOptions}
        onChange={onCategory}
      />
      <DateRangeFilter from={dateFrom} to={dateTo} onChange={onDateRange} />
    </div>
  </div>
);

export default EventsFilterBar;
