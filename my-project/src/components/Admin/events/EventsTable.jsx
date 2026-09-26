import { EventIdentity, EventStatusBadge, formatEventDate } from "./EventParts";
import EventRowActions from "./EventRowActions";

const HEAD = "px-5 py-3 text-xs font-medium text-slate-500";

const EventsTable = ({ rows, actions, hasFilters, onClearFilters }) => {
  if (rows.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="text-sm font-medium text-slate-800">No events found</p>
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

  // The last rows open their menu upwards so it isn't cut off at the bottom of the card
  const openUpFrom = rows.length > 4 ? rows.length - 3 : rows.length;

  return (
    <>
      {/* Table from md up */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-slate-100">
            <th className={HEAD}>Event</th>
            <th className={HEAD}>Organizer</th>
            <th className={HEAD}>Date</th>
            <th className={HEAD}>Status</th>
            <th className={`${HEAD} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((event, index) => (
            <tr
              key={event.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="max-w-[280px] px-5 py-3">
                <EventIdentity event={event} />
              </td>
              <td className="px-5 py-3 text-sm text-slate-700">
                {event.organizer}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-sm text-slate-500">
                {formatEventDate(event.date)}
              </td>
              <td className="px-5 py-3">
                <EventStatusBadge status={event.status} />
              </td>
              <td className="px-5 py-3 text-center">
                <EventRowActions
                  event={event}
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
        {rows.map((event, index) => (
          <li key={event.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <EventIdentity event={event} />
              <EventRowActions
                event={event}
                openUp={index >= openUpFrom}
                {...actions}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{event.organizer}</span>
              <span>{formatEventDate(event.date)}</span>
              <EventStatusBadge status={event.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventsTable;
