import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAdminOrganizers from "./useAdminOrganizers";
import OrganizersStats from "./OrganizersStats";
import OrganizersFilterBar from "./OrganizersFilterBar";
import OrganizersTable from "./OrganizersTable";
import OrganizersPagination from "./OrganizersPagination";

const AdminOrganizers = () => {
  const o = useAdminOrganizers();
  const navigate = useNavigate();

  const handleView = (org) => navigate(`/admin/organizers/${org.id}`);

  const handleVerify = (org) => {
    o.verify(org.id);
    toast.success(`${org.name} verified`);
  };

  const handleToggleSuspend = (org) => {
    o.toggleSuspend(org.id);
    toast.success(
      org.status === "Suspended"
        ? `${org.name} reactivated`
        : `${org.name} suspended`,
    );
  };

  const handleDelete = (org) => {
    o.remove(org.id);
    toast.success(`${org.name} deleted`);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Organizers</h1>
        <p className="mt-1 text-xs text-gray-600">
          Manage and verify event organizers, vendors and partners on the
          platform.
        </p>
      </div>

      <OrganizersStats stats={o.stats} />

      <section className="rounded-xl bg-white shadow-sm">
        <div className="p-4">
          <OrganizersFilterBar
            search={o.search}
            onSearch={o.setSearch}
            status={o.status}
            onStatus={o.setStatus}
            statusOptions={o.statusOptions}
            category={o.category}
            onCategory={o.setCategory}
            categoryOptions={o.categoryOptions}
          />
        </div>

        <OrganizersTable
          rows={o.rows}
          onView={handleView}
          onVerify={handleVerify}
          onToggleSuspend={handleToggleSuspend}
          onDelete={handleDelete}
        />

        <OrganizersPagination
          page={o.page}
          totalPages={o.totalPages}
          from={o.from}
          to={o.to}
          total={o.total}
          onChange={o.setPage}
        />
      </section>
    </div>
  );
};

export default AdminOrganizers;
