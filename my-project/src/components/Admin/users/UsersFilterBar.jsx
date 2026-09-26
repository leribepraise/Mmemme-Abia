import { ChevronDown, Search } from "lucide-react";
import { lgaOptions, roleOptions, statusOptions } from "@/data/adminUsers";

const FilterSelect = ({ id, label, allLabel, value, onChange, options }) => {
  return (
    <div className="relative lg:w-36">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#14481f]/30"
      >
        <option value="All">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
    </div>
  );
};

const UsersFilterBar = ({ filters, onChange }) => {
  return (
    <section
      aria-label="Filter users"
      className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center"
    >
      <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-[#14481f]/30">
        <Search
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <label htmlFor="users-search" className="sr-only">
          Search users
        </label>
        <input
          id="users-search"
          type="search"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search by name, email, phone..."
          className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
        <FilterSelect
          id="filter-role"
          label="Filter by role"
          allLabel="All Roles"
          value={filters.role}
          onChange={(v) => onChange("role", v)}
          options={roleOptions}
        />
        <FilterSelect
          id="filter-lga"
          label="Filter by local government area"
          allLabel="All L.G.A"
          value={filters.lga}
          onChange={(v) => onChange("lga", v)}
          options={lgaOptions}
        />
        <FilterSelect
          id="filter-status"
          label="Filter by status"
          allLabel="All Status"
          value={filters.status}
          onChange={(v) => onChange("status", v)}
          options={statusOptions}
        />
      </div>
    </section>
  );
};

export default UsersFilterBar;
