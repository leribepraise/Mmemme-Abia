import useAdminUsers from "./useAdminUsers";
import UsersHeader from "./UsersHeader";
import UsersFilterBar from "./UsersFilterBar";
import UsersStats from "./UsersStats";
import UsersTable from "./UsersTable";
import UsersPagination from "./UsersPagination";

const AdminUsers = () => {
  const {
    stats,
    filters,
    updateFilter,
    clearFilters,
    pageUsers,
    total,
    page,
    totalPages,
    pageStart,
    pageEnd,
    setPage,
    toggleSuspend,
    deleteUser,
    exportCsv,
  } = useAdminUsers();

  return (
    <div className="space-y-4">
      <UsersHeader onExport={exportCsv} />
      <UsersFilterBar filters={filters} onChange={updateFilter} />
      <UsersStats stats={stats} />

      <section className="rounded-xl bg-white shadow-sm">
        <UsersTable
          users={pageUsers}
          onToggleSuspend={toggleSuspend}
          onDelete={deleteUser}
          onClearFilters={clearFilters}
        />
        <UsersPagination
          page={page}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          total={total}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
};

export default AdminUsers;
