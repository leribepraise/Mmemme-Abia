import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  foodVendors as seed,
  foodStats,
  ALL_STATUSES,
  ALL_CATEGORIES,
  FOOD_STATUSES,
  FOOD_CATEGORIES,
  FOOD_CATEGORY_PILLS,
} from "@/data/adminFood";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 10;

// TODO: replace the internals with real API calls (list, approve, reject, suspend, delete)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminFood = () => {
  const [items, setItems] = useState(() => applyStatusOverrides("food", seed));
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState(ALL_STATUSES);
  const [category, setCategoryValue] = useState(ALL_CATEGORIES);
  const [activePill, setActivePill] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((v) => {
      const matchesSearch =
        !q ||
        [v.name, v.handle, v.location, v.category].some((val) =>
          val.toLowerCase().includes(q),
        );
      const matchesStatus = status === ALL_STATUSES || v.status === status;
      const matchesCategory =
        category === ALL_CATEGORIES || v.category === category;
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

  const setSearch = (v) => {
    setSearchValue(v);
    setPage(1);
  };
  const setStatus = (v) => {
    setStatusValue(v);
    setPage(1);
  };

  // Shared by both the pill row and the "All Categories" dropdown.
  // Pills can map to more than one category (e.g. "Cafes & Bakeries"),
  // so the dropdown itself only supports single-category selection: picking
  // it sets both the dropdown value AND clears/matches the closest pill.
  const setCategory = (v) => {
    setCategoryValue(v);
    setPage(1);
    const matchingPill = FOOD_CATEGORY_PILLS.find(
      (p) => p.categories?.length === 1 && p.categories[0] === v,
    );
    setActivePill(v === ALL_CATEGORIES ? "All" : matchingPill?.label || "All");
  };

  const setPill = (pillLabel) => {
    const pill = FOOD_CATEGORY_PILLS.find((p) => p.label === pillLabel);
    setActivePill(pillLabel);
    setPage(1);
    if (!pill || !pill.categories) {
      setCategoryValue(ALL_CATEGORIES);
    } else if (pill.categories.length === 1) {
      setCategoryValue(pill.categories[0]);
    } else {
      // Multi-category pill (Cafes & Bakeries): the dropdown can't represent
      // this exactly, so leave it on "All Categories" while filtering both.
      setCategoryValue(ALL_CATEGORIES);
    }
  };

  // Recompute filtered rows against the active pill's category set when it
  // covers more than one category (dropdown-only "category" can't express that).
  const activePillDef = FOOD_CATEGORY_PILLS.find((p) => p.label === activePill);
  const pillFiltered =
    activePillDef?.categories?.length > 1
      ? filtered.filter((v) => activePillDef.categories.includes(v.category))
      : filtered;

  const clearFilters = () => {
    setSearchValue("");
    setStatusValue(ALL_STATUSES);
    setCategoryValue(ALL_CATEGORIES);
    setActivePill("All");
    setPage(1);
  };

  const changeStatus = (id, nextStatus, before, message) => {
    setStatusOverride("food", id, { status: nextStatus, before });
    setItems((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: nextStatus, statusBeforeSuspend: before }
          : v,
      ),
    );
    toast.success(message);
  };

  const approve = (id) => {
    const target = items.find((v) => v.id === id);
    if (target) changeStatus(id, "Approved", null, `${target.name} approved`);
  };

  const reject = (id) => {
    const target = items.find((v) => v.id === id);
    if (target) changeStatus(id, "Rejected", null, `${target.name} rejected`);
  };

  const toggleSuspend = (id) => {
    const target = items.find((v) => v.id === id);
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
    const target = items.find((v) => v.id === id);
    setItems((prev) => prev.filter((v) => v.id !== id));
    if (target) toast.success(`${target.name} deleted`);
  };

  const pillTotal = pillFiltered.length;
  const pillTotalPages = Math.max(1, Math.ceil(pillTotal / PAGE_SIZE));
  const pillPage = Math.min(page, pillTotalPages);
  const pillStart = (pillPage - 1) * PAGE_SIZE;
  const pillRows = pillFiltered.slice(pillStart, pillStart + PAGE_SIZE);

  return {
    rows: pillRows,
    stats: foodStats,
    total: pillTotal,
    from: pillTotal ? pillStart + 1 : 0,
    to: pillStart + pillRows.length,
    page: pillPage,
    totalPages: pillTotalPages,
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
    statusOptions: [ALL_STATUSES, ...FOOD_STATUSES],
    categoryOptions: [ALL_CATEGORIES, ...FOOD_CATEGORIES],
    categoryPills: FOOD_CATEGORY_PILLS.map((p) => p.label),
    approve,
    reject,
    toggleSuspend,
    remove,
  };
};

export default useAdminFood;
