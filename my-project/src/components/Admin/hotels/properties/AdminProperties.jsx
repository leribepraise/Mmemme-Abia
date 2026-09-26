import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import useAdminProperties from "./useAdminProperties";
import PropertiesStats from "./PropertiesStats";
import PropertiesFilterBar from "./PropertiesFilterBar";
import PropertiesTable from "./PropertiesTable";
import PropertiesPagination from "./PropertiesPagination";

const AdminProperties = () => {
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
    type,
    hasFilters,
    setSearch,
    setStatus,
    setType,
    clearFilters,
    setPage,
    statusOptions,
    typeOptions,
    approve,
    reject,
    toggleSuspend,
    remove,
  } = useAdminProperties();

  const actions = {
    onView: (id) => navigate(`/admin/hotels/properties/${id}`),
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
            Properties
          </h1>
          <p className="text-sm text-slate-500">
            Manage and review all properties (hotels, hostels, and short-stays)
            on the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Add Property isn't built yet")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      <PropertiesStats stats={stats} />

      <PropertiesFilterBar
        search={search}
        status={status}
        type={type}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        onSearch={setSearch}
        onStatus={setStatus}
        onType={setType}
      />

      <section className="rounded-xl bg-white shadow-sm">
        <PropertiesTable
          rows={rows}
          actions={actions}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
        />
        {rows.length > 0 && (
          <PropertiesPagination
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

export default AdminProperties;
