import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (page, total, size = 5) => {
  const half = Math.floor(size / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const arrowClass =
  "flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const OrganizersPagination = ({
  page,
  totalPages,
  from,
  to,
  total,
  onChange,
}) => (
  <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-gray-500">
      {total
        ? `Showing ${from} to ${to} of ${total} organizers`
        : "No organizers to show"}
    </p>

    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrowClass}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages(page, totalPages).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-7 min-w-7 rounded-md px-2 text-xs font-medium ${
            p === page
              ? "bg-[#0f3d1b] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={arrowClass}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  </div>
);

export default OrganizersPagination;
