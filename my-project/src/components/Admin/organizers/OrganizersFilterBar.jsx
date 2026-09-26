import { ChevronDown, Search } from "lucide-react";

const SelectBox = ({ value, onChange, options, label, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-9 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-xs text-gray-700 outline-none focus:border-[#1a6a2a]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      size={14}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
    />
  </div>
);

const OrganizersFilterBar = ({
  search,
  onSearch,
  status,
  onStatus,
  statusOptions,
  category,
  onCategory,
  categoryOptions,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className="relative flex-1">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name, email or business name..."
        aria-label="Search organizers"
        className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#1a6a2a]"
      />
    </div>
    <div className="grid grid-cols-2 gap-3 sm:flex">
      <SelectBox
        value={status}
        onChange={onStatus}
        options={statusOptions}
        label="Filter by status"
        className="sm:w-36"
      />
      <SelectBox
        value={category}
        onChange={onCategory}
        options={categoryOptions}
        label="Filter by category"
        className="sm:w-40"
      />
    </div>
  </div>
);

export default OrganizersFilterBar;
