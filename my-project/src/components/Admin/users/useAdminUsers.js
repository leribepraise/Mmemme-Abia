import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { initialUsers, userStats } from "@/data/adminUsers";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS = { search: "", role: "All", lga: "All", status: "All" };

const stripSpaces = (text) => text.replace(/\s/g, "");

// Same idea as useChat(): components only talk to this hook, so when the Django
// backend is ready only the inside of this file changes (fetch with filters + page).
const useAdminUsers = () => {
  // Lazy init so saved Suspend/Reactivate changes are picked up every time the list mounts
  const [users, setUsers] = useState(() =>
    applyStatusOverrides("users", initialUsers),
  );
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return users.filter((u) => {
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        stripSpaces(u.phone).includes(stripSpaces(query));

      return (
        matchesSearch &&
        (filters.role === "All" || u.role === filters.role) &&
        (filters.lga === "All" || u.lga === filters.lga) &&
        (filters.status === "All" || u.status === filters.status)
      );
    });
  }, [users, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filtered.slice(start, start + PAGE_SIZE);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const toggleSuspend = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    const isSuspended = target.status === "Suspended";
    const nextStatus = isSuspended
      ? target.statusBeforeSuspend || "Active"
      : "Suspended";
    const before = isSuspended ? null : target.status;

    // Saved so the User Details page shows the same status
    setStatusOverride("users", id, { status: nextStatus, before });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: nextStatus, statusBeforeSuspend: before }
          : u,
      ),
    );
    toast.success(
      nextStatus === "Suspended"
        ? `${target.name} suspended`
        : `${target.name} reactivated`,
    );
  };

  const deleteUser = (id) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (target) toast.success(`${target.name} deleted`);
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("No users to export");
      return;
    }
    const header = ["Name", "Email", "Phone", "Role", "L.G.A", "Status"];
    const rows = filtered.map((u) => [
      u.name,
      u.email,
      u.phone,
      u.role,
      u.lga,
      u.status,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mmemme-abia-users.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} users`);
  };

  return {
    stats: userStats,
    filters,
    updateFilter,
    clearFilters,
    pageUsers,
    total: filtered.length,
    page: currentPage,
    totalPages,
    pageStart: filtered.length ? start + 1 : 0,
    pageEnd: Math.min(start + PAGE_SIZE, filtered.length),
    setPage,
    toggleSuspend,
    deleteUser,
    exportCsv,
  };
};

export default useAdminUsers;
