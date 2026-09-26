import {
  CategoryBadge,
  StatusBadge,
  OrganizerIdentity,
} from "./OrganizerParts";
import OrganizerRowActions from "./OrganizerRowActions";

const Th = ({ children, className = "" }) => (
  <th
    className={`px-4 py-3 text-left text-[11px] font-medium text-gray-500 ${className}`}
  >
    {children}
  </th>
);

const OrganizersTable = ({
  rows,
  onView,
  onVerify,
  onToggleSuspend,
  onDelete,
}) => {
  if (rows.length === 0) {
    return (
      <div className="border-t border-gray-100 px-4 py-14 text-center">
        <p className="text-sm font-medium text-gray-800">No organizers found</p>
        <p className="mt-1 text-xs text-gray-500">
          Try a different search or clear the filters.
        </p>
      </div>
    );
  }

  const actionProps = { onView, onVerify, onToggleSuspend, onDelete };

  return (
    <>
      {/* Desktop table (md and up). No overflow wrapper, so the row menu never gets clipped. */}
      <table className="hidden w-full md:table">
        <thead className="bg-[#f8faf7]">
          <tr>
            <Th>Name / Business</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Joined</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((o) => (
            <tr key={o.id} className="hover:bg-[#fafcf9]">
              <td className="px-4 py-3">
                <OrganizerIdentity organizer={o} />
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={o.category} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={o.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">
                {o.joined}
              </td>
              <td className="px-4 py-3 text-right">
                <OrganizerRowActions organizer={o} {...actionProps} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards (below md) */}
      <ul className="divide-y divide-gray-100 border-t border-gray-100 md:hidden">
        {rows.map((o) => (
          <li key={o.id} className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <OrganizerIdentity organizer={o} />
              <OrganizerRowActions organizer={o} {...actionProps} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={o.category} />
              <StatusBadge status={o.status} />
              <span className="text-[11px] text-gray-500">
                Joined {o.joined}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrganizersTable;
