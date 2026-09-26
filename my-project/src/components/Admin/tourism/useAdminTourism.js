import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  tourismListings as seed,
  tourismStats,
  ALL_STATUSES,
  ALL_CATEGORIES,
  TOURISM_STATUSES,
  TOURISM_CATEGORIES,
  TOURISM_CATEGORY_PILLS,
} from "@/data/adminTourism";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 8;

// TODO: replace the internals with real API calls (list, approve, reject, suspend, delete)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminTourism = () => {
  const [items, setItems] = useState(() =>
    applyStatusOverrides("tourism", seed),
  );
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState(ALL_STATUSES);
  // "category" is the single source of truth shared by the pill row and the
  // "All Categories" dropdown, so picking either one updates both.
  const [category, setCategoryValue] = useState(ALL_CATEGORIES);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((t) => {
      const matchesSearch =
        !q ||
        [t.name, t.location, t.category].some((v) =>
          v.toLowerCase().includes(q),
        );
      const matchesStatus = status === ALL_STATUSES || t.status === status;
      const matchesCategory =
        category === ALL_CATEGORIES || t.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, search, status, category]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const hasFilters =
    search.trim() !== "" ||
    status !== ALL_STATUSES ||
    category !== ALL_CATEGORIES;

  // Changing any filter sends you back to page 1
  const setSearch = (v) => {
    setSearchValue(v);
    setPage(1);
  };
  const setStatus = (v) => {
    setStatusValue(v);
    setPage(1);
  };
  // Shared by both the pill row and the dropdown. The pill "All" and the
  // dropdown's ALL_CATEGORIES both map to the same value.
  const setCategory = (v) => {
    setCategoryValue(v === "All" ? ALL_CATEGORIES : v);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchValue("");
    setStatusValue(ALL_STATUSES);
    setCategoryValue(ALL_CATEGORIES);
    setPage(1);
  };

  // The pill row shows "All" instead of "All Categories" for the active pill
  const activePill = category === ALL_CATEGORIES ? "All" : category;

  const changeStatus = (id, nextStatus, before, message) => {
    // Saved so a future Tourism Listing Details page can show the same status
    setStatusOverride("tourism", id, { status: nextStatus, before });
    setItems((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: nextStatus, statusBeforeSuspend: before }
          : t,
      ),
    );
    toast.success(message);
  };

  const approve = (id) => {
    const target = items.find((t) => t.id === id);
    if (target) changeStatus(id, "Approved", null, `${target.name} approved`);
  };

  const reject = (id) => {
    const target = items.find((t) => t.id === id);
    if (target) changeStatus(id, "Rejected", null, `${target.name} rejected`);
  };

  // Reactivating restores whatever the status was before suspension
  const toggleSuspend = (id) => {
    const target = items.find((t) => t.id === id);
    if (!target) return;
    if (target.status === "Suspended") {
      changeStatus(
        id,
        target.statusBeforeSuspend || "Approved",
        null,
        `${target.name} reactivated`,
      );
    } else {
      changeStatus(id, "Suspended", target.status, `${target.name} suspended`);
    }
  };

  const remove = (id) => {
    const target = items.find((t) => t.id === id);
    setItems((prev) => prev.filter((t) => t.id !== id));
    if (target) toast.success(`${target.name} deleted`);
  };

  return {
    rows,
    stats: tourismStats,
    total,
    from: total ? start + 1 : 0,
    to: start + rows.length,
    page: currentPage,
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
    statusOptions: [ALL_STATUSES, ...TOURISM_STATUSES],
    categoryOptions: [ALL_CATEGORIES, ...TOURISM_CATEGORIES],
    categoryPills: TOURISM_CATEGORY_PILLS,
    approve,
    reject,
    toggleSuspend,
    remove,
  };
};

export default useAdminTourism;
