import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (page, total) => {
  const size = 5;
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, page - 2);
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const ARROW =
  "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
const PAGE_ACTIVE =
  "h-8 min-w-8 rounded-md bg-[#14481f] px-2 text-sm font-medium text-white";
const PAGE_IDLE =
  "h-8 min-w-8 rounded-md border border-slate-200 px-2 text-sm text-slate-600 transition-colors hover:bg-slate-50";

const EventsPagination = ({ from, to, total, page, totalPages, onPage }) => (
  <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
    <p className="text-xs text-slate-500">
      Showing <span className="font-semibold text-slate-800">{from}</span> to{" "}
      <span className="font-semibold text-slate-800">{to}</span> of{" "}
      <span className="font-semibold text-slate-800">{total}</span> events
    </p>

    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className={ARROW}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPages(page, totalPages).map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPage(p)}
          className={p === page ? PAGE_ACTIVE : PAGE_IDLE}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className={ARROW}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default EventsPagination;
