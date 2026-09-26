import { PropertyIdentity, PropertyStatusBadge } from "./PropertyParts";
import PropertyRowActions from "./PropertyRowActions";

const HEAD = "px-5 py-3 text-xs font-medium text-slate-500";

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
const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const PropertiesTable = ({ rows, actions, hasFilters, onClearFilters }) => {
  if (rows.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="text-sm font-medium text-slate-800">
          No properties found
        </p>
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
            <th className={HEAD}>Property</th>
            <th className={HEAD}>Type</th>
            <th className={HEAD}>Location</th>
            <th className={HEAD}>Status</th>
            <th className={`${HEAD} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((property, index) => (
            <tr
              key={property.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="max-w-[260px] px-5 py-3">
                <PropertyIdentity property={property} />
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {property.type}
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {property.location}
              </td>
              <td className="px-5 py-3">
                <PropertyStatusBadge status={property.status} />
              </td>
              <td className="px-5 py-3 text-center">
                <PropertyRowActions
                  property={property}
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
        {rows.map((property, index) => (
          <li key={property.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <PropertyIdentity property={property} />
              <PropertyRowActions
                property={property}
                openUp={index >= openUpFrom}
                {...actions}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{property.type}</span>
              <span>{property.location}</span>
              <span>{formatDate(property.dateAdded)}</span>
              <PropertyStatusBadge status={property.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PropertiesTable;
