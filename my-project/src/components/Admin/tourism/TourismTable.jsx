import {
  TourismIdentity,
  TourismStatusBadge,
  formatTourismDate,
} from "./TourismParts";
import TourismRowActions from "./TourismRowActions";

const HEAD = "px-5 py-3 text-xs font-medium text-slate-500";

const TourismTable = ({ rows, actions, hasFilters, onClearFilters }) => {
  if (rows.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="text-sm font-medium text-slate-800">No listings found</p>
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
            <th className={HEAD}>Name</th>
            <th className={HEAD}>Category</th>
            <th className={HEAD}>Location</th>
            <th className={HEAD}>Status</th>
            <th className={HEAD}>Date Added</th>
            <th className={`${HEAD} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((listing, index) => (
            <tr
              key={listing.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="max-w-[260px] px-5 py-3">
                <TourismIdentity listing={listing} />
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {listing.category}
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {listing.location},{" "}
                <span className="text-slate-400">Abia State</span>
              </td>
              <td className="px-5 py-3">
                <TourismStatusBadge status={listing.status} />
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-sm text-slate-500">
                {formatTourismDate(listing.dateAdded)}
              </td>
              <td className="px-5 py-3 text-center">
                <TourismRowActions
                  listing={listing}
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
        {rows.map((listing, index) => (
          <li key={listing.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <TourismIdentity listing={listing} />
              <TourismRowActions
                listing={listing}
                openUp={index >= openUpFrom}
                {...actions}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{listing.location}, Abia State</span>
              <span>{formatTourismDate(listing.dateAdded)}</span>
              <TourismStatusBadge status={listing.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TourismTable;
