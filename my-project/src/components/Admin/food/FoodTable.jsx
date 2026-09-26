import { FoodCategoryLabel, FoodIdentity, FoodStatusLabel } from "./FoodParts";
import FoodRowActions from "./FoodRowActions";

const HEAD = "px-5 py-3 text-xs font-medium text-slate-500";

const FoodTable = ({ rows, actions, hasFilters, onClearFilters }) => {
  if (rows.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="text-sm font-medium text-slate-800">No vendors found</p>
        <p className="mt-1 text-xs text-slate-500">
          Try changing your search or filters.
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 h-9 rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const openUpFrom = rows.length > 4 ? rows.length - 3 : rows.length;

  return (
    <>
      {/* Table from md up */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-slate-100">
            <th className={HEAD}>Vendor</th>
            <th className={HEAD}>Category</th>
            <th className={HEAD}>Location</th>
            <th className={HEAD}>Status</th>
            <th className={`${HEAD} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((vendor, index) => (
            <tr
              key={vendor.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="max-w-[260px] px-5 py-3">
                <FoodIdentity vendor={vendor} />
              </td>
              <td className="px-5 py-3">
                <FoodCategoryLabel category={vendor.category} />
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {vendor.location}
              </td>
              <td className="px-5 py-3">
                <FoodStatusLabel status={vendor.status} />
              </td>
              <td className="px-5 py-3 text-center">
                <FoodRowActions
                  vendor={vendor}
                  openUp={index >= openUpFrom}
                  {...actions}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards below md */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {rows.map((vendor, index) => (
          <li key={vendor.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <FoodIdentity vendor={vendor} />
              <FoodRowActions
                vendor={vendor}
                openUp={index >= openUpFrom}
                {...actions}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <FoodCategoryLabel category={vendor.category} />
              <span className="text-slate-500">{vendor.location}</span>
              <FoodStatusLabel status={vendor.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FoodTable;
