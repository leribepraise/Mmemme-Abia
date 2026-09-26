import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import useAdminFood from "./useAdminFood";
import FoodStats from "./FoodStats";
import FoodCategoryPills from "./FoodCategoryPills";
import FoodFilterBar from "./FoodFilterBar";
import FoodTable from "./FoodTable";
import FoodPagination from "./FoodPagination";

const AdminFood = () => {
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
    setPill,
    clearFilters,
    setPage,
    statusOptions,
    categoryOptions,
    categoryPills,
    approve,
    reject,
    toggleSuspend,
    remove,
  } = useAdminFood();

  const actions = {
    onView: (id) => navigate(`/admin/food/${id}`),
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
            Food Vendors
          </h1>
          <p className="text-sm text-slate-500">
            Manage and verify food vendors on the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Add Vendor isn't built yet")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <FoodStats stats={stats} />

      <div className="space-y-3">
        <FoodFilterBar
          search={search}
          status={status}
          category={category}
          statusOptions={statusOptions}
          categoryOptions={categoryOptions}
          onSearch={setSearch}
          onStatus={setStatus}
          onCategory={setCategory}
        />
        <FoodCategoryPills
          pills={categoryPills}
          active={activePill}
          onSelect={setPill}
        />
      </div>

      <section className="rounded-xl bg-white shadow-sm">
        <FoodTable
          rows={rows}
          actions={actions}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
        />
        {rows.length > 0 && (
          <FoodPagination
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

export default AdminFood;
