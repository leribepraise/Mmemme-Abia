import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import useAdminEvents from "./useAdminEvents";
import EventsStats from "./EventsStats";
import EventsFilterBar from "./EventsFilterBar";
import EventsTable from "./EventsTable";
import EventsPagination from "./EventsPagination";

const AdminEvents = () => {
  const navigate = useNavigate();
  const {
    rows,
    stats,
    total,
    from,
    to,
    page,
    totalPages,
    search,
    status,
    category,
    dateFrom,
    dateTo,
    hasFilters,
    setSearch,
    setStatus,
    setCategory,
    setDateRange,
    clearFilters,
    setPage,
    statusOptions,
    categoryOptions,
    approve,
    reject,
    toggleSuspend,
    remove,
  } = useAdminEvents();

  const actions = {
    onView: (id) => navigate(`/admin/events/${id}`),
    onApprove: approve,
    onReject: reject,
    onToggleSuspend: toggleSuspend,
    onDelete: remove,
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Events
          </h1>
          <p className="text-sm text-slate-500">
            Manage and moderate all events on the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Add Event isn't built yet")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <EventsStats stats={stats} />

      <EventsFilterBar
        search={search}
        status={status}
        category={category}
        dateFrom={dateFrom}
        dateTo={dateTo}
        statusOptions={statusOptions}
        categoryOptions={categoryOptions}
        onSearch={setSearch}
        onStatus={setStatus}
        onCategory={setCategory}
        onDateRange={setDateRange}
      />

      <section className="rounded-xl bg-white shadow-sm">
        <EventsTable
          rows={rows}
          actions={actions}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
        />
        {rows.length > 0 && (
          <EventsPagination
            from={from}
            to={to}
            total={total}
            page={page}
            totalPages={totalPages}
            onPage={setPage}
          />
        )}
      </section>
    </div>
  );
};

export default AdminEvents;
