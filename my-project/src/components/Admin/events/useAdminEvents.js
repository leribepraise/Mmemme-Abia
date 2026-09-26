import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  events as seed,
  eventStats,
  ALL_STATUSES,
  ALL_CATEGORIES,
  EVENT_STATUSES,
  EVENT_CATEGORIES,
} from "@/data/adminEvents";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 10;

// TODO: replace the internals with real API calls (list, approve, reject, suspend, delete)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminEvents = () => {
  const [items, setItems] = useState(() =>
    applyStatusOverrides("events", seed),
  );
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState(ALL_STATUSES);
  const [category, setCategoryValue] = useState(ALL_CATEGORIES);
  const [dateFrom, setDateFromValue] = useState("");
  const [dateTo, setDateToValue] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((e) => {
      const matchesSearch =
        !q ||
        [e.title, e.organizer, e.location].some((v) =>
          v.toLowerCase().includes(q),
        );
      const matchesStatus = status === ALL_STATUSES || e.status === status;
      const matchesCategory =
        category === ALL_CATEGORIES || e.category === category;
      const matchesFrom = !dateFrom || e.date >= dateFrom;
      const matchesTo = !dateTo || e.date <= dateTo;
      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [items, search, status, category, dateFrom, dateTo]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const hasFilters =
    search.trim() !== "" ||
    status !== ALL_STATUSES ||
    category !== ALL_CATEGORIES ||
    dateFrom !== "" ||
    dateTo !== "";

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
  const setDateRange = (from, to) => {
    setDateFromValue(from);
    setDateToValue(to);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchValue("");
    setStatusValue(ALL_STATUSES);
    setCategoryValue(ALL_CATEGORIES);
    setDateFromValue("");
    setDateToValue("");
    setPage(1);
  };

  const changeStatus = (id, nextStatus, before, message) => {
    // Saved so a future Event Details page can show the same status
    setStatusOverride("events", id, { status: nextStatus, before });
    setItems((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: nextStatus, statusBeforeSuspend: before }
          : e,
      ),
    );
    toast.success(message);
  };

  const approve = (id) => {
    const target = items.find((e) => e.id === id);
    if (target) changeStatus(id, "Verified", null, `${target.title} approved`);
  };

  const reject = (id) => {
    const target = items.find((e) => e.id === id);
    if (target) changeStatus(id, "Rejected", null, `${target.title} rejected`);
  };

  // Reactivating restores whatever the status was before suspension
  const toggleSuspend = (id) => {
    const target = items.find((e) => e.id === id);
    if (!target) return;
    if (target.status === "Suspended") {
      changeStatus(
        id,
        target.statusBeforeSuspend || "Verified",
        null,
        `${target.title} reactivated`,
      );
    } else {
      changeStatus(id, "Suspended", target.status, `${target.title} suspended`);
    }
  };

  const remove = (id) => {
    const target = items.find((e) => e.id === id);
    setItems((prev) => prev.filter((e) => e.id !== id));
    if (target) toast.success(`${target.title} deleted`);
  };

  return {
    rows,
    stats: eventStats,
    total,
    from: total ? start + 1 : 0,
    to: start + rows.length,
    page: currentPage,
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
    statusOptions: [ALL_STATUSES, ...EVENT_STATUSES],
    categoryOptions: [ALL_CATEGORIES, ...EVENT_CATEGORIES],
    approve,
    reject,
    toggleSuspend,
    remove,
  };
};

export default useAdminEvents;
