import { useMemo, useState } from "react";
import {
  organizers as seed,
  organizerStats,
  ALL_STATUSES,
  ALL_CATEGORIES,
  ORGANIZER_STATUSES,
  ORGANIZER_CATEGORIES,
} from "@/data/adminOrganizers";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 10;

// TODO: replace the internals with real API calls (list, verify, suspend, delete)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminOrganizers = () => {
  // Lazy init so saved Verify / Suspend / Reactivate changes are picked up on every mount
  const [items, setItems] = useState(() =>
    applyStatusOverrides("organizers", seed),
  );
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState(ALL_STATUSES);
  const [category, setCategoryValue] = useState(ALL_CATEGORIES);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((o) => {
      const matchesSearch =
        !q ||
        [o.name, o.handle, o.email].some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === ALL_STATUSES || o.status === status;
      const matchesCategory =
        category === ALL_CATEGORIES || o.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, search, status, category]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  // Changing any filter sends you back to page 1
  const setSearch = (v) => {
    setSearchValue(v);
    setPage(1);
  };
  const setStatus = (v) => {
    setStatusValue(v);
    setPage(1);
  };
  const setCategory = (v) => {
    setCategoryValue(v);
    setPage(1);
  };

  const verify = (id) => {
    // Saved so the Organizer Details page shows the same status
    setStatusOverride("organizers", id, { status: "Verified", before: null });
    setItems((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "Verified", statusBeforeSuspend: null }
          : o,
      ),
    );
  };

  // Reactivating restores whatever the status was before suspension
  const toggleSuspend = (id) => {
    const target = items.find((o) => o.id === id);
    if (!target) return;

    const isSuspended = target.status === "Suspended";
    const nextStatus = isSuspended
      ? target.statusBeforeSuspend || "Verified"
      : "Suspended";
    const before = isSuspended ? null : target.status;

    setStatusOverride("organizers", id, { status: nextStatus, before });
    setItems((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: nextStatus, statusBeforeSuspend: before }
          : o,
      ),
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((o) => o.id !== id));

  return {
    rows,
    stats: organizerStats,
    total,
    from: total ? start + 1 : 0,
    to: start + rows.length,
    page: currentPage,
    totalPages,
    search,
    status,
    category,
    setSearch,
    setStatus,
    setCategory,
    setPage,
    statusOptions: [ALL_STATUSES, ...ORGANIZER_STATUSES],
    categoryOptions: [ALL_CATEGORIES, ...ORGANIZER_CATEGORIES],
    verify,
    toggleSuspend,
    remove,
  };
};

export default useAdminOrganizers;
