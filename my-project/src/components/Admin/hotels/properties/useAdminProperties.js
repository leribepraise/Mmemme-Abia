import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  properties as seed,
  propertyStats,
  ALL_STATUSES,
  ALL_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "@/data/adminProperties";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const PAGE_SIZE = 10;

// TODO: replace the internals with real API calls (list, approve, reject, suspend, delete)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminProperties = () => {
  const [items, setItems] = useState(() =>
    applyStatusOverrides("properties", seed),
  );
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState(ALL_STATUSES);
  const [type, setTypeValue] = useState(ALL_TYPES);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      const matchesSearch =
        !q ||
        [p.name, p.host, p.location].some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === ALL_STATUSES || p.status === status;
      const matchesType = type === ALL_TYPES || p.type === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [items, search, status, type]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const hasFilters =
    search.trim() !== "" || status !== ALL_STATUSES || type !== ALL_TYPES;

  const setSearch = (v) => {
    setSearchValue(v);
    setPage(1);
  };
  const setStatus = (v) => {
    setStatusValue(v);
    setPage(1);
  };
  const setType = (v) => {
    setTypeValue(v);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchValue("");
    setStatusValue(ALL_STATUSES);
    setTypeValue(ALL_TYPES);
    setPage(1);
  };

  const changeStatus = (id, nextStatus, before, message) => {
    setStatusOverride("properties", id, { status: nextStatus, before });
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: nextStatus, statusBeforeSuspend: before }
          : p,
      ),
    );
    toast.success(message);
  };

  const approve = (id) => {
    const target = items.find((p) => p.id === id);
    if (target) changeStatus(id, "Approved", null, `${target.name} approved`);
  };

  const reject = (id) => {
    const target = items.find((p) => p.id === id);
    if (target) changeStatus(id, "Rejected", null, `${target.name} rejected`);
  };

  const toggleSuspend = (id) => {
    const target = items.find((p) => p.id === id);
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
    const target = items.find((p) => p.id === id);
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (target) toast.success(`${target.name} deleted`);
  };

  return {
    rows,
    stats: propertyStats,
    total,
    from: total ? start + 1 : 0,
    to: start + rows.length,
    page: currentPage,
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
    statusOptions: [ALL_STATUSES, ...PROPERTY_STATUSES],
    typeOptions: [ALL_TYPES, ...PROPERTY_TYPES],
    approve,
    reject,
    toggleSuspend,
    remove,
  };
};

export default useAdminProperties;
