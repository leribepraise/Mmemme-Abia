import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import useAdminTourism from "./useAdminTourism";
import TourismStats from "./TourismStats";
import TourismCategoryPills from "./TourismCategoryPills";
import TourismFilterBar from "./TourismFilterBar";
import TourismTable from "./TourismTable";
import TourismPagination from "./TourismPagination";

const AdminTourism = () => {
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
    activePill,
    hasFilters,
    setSearch,
    setStatus,
    setCategory,
    clearFilters,
    setPage,
    statusOptions,
    categoryOptions,
    categoryPills,
    approve,
    reject,
    toggleSuspend,
    remove,
  } = useAdminTourism();

  const actions = {
    onView: (id) => navigate(`/admin/tourism/${id}`),
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
            Tourism Listings
          </h1>
          <p className="text-sm text-slate-500">
            Manage and review all tourism listings on the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Add Listing isn't built yet")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
        >
          <Plus className="h-4 w-4" />
          Add Listing
        </button>
      </div>

      <TourismStats stats={stats} />

      <div className="space-y-3">
        <TourismFilterBar
          search={search}
          status={status}
          category={category}
          statusOptions={statusOptions}
          categoryOptions={categoryOptions}
          onSearch={setSearch}
          onStatus={setStatus}
          onCategory={setCategory}
        />
        <TourismCategoryPills
          pills={categoryPills}
          active={activePill}
          onSelect={setCategory}
        />
      </div>

      <section className="rounded-xl bg-white shadow-sm">
        <TourismTable
          rows={rows}
          actions={actions}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
        />
        {rows.length > 0 && (
          <TourismPagination
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

export default AdminTourism;
