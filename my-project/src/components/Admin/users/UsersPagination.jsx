import { ChevronLeft, ChevronRight } from "lucide-react";

// Shows a window of up to 5 page numbers around the current page
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
};

const buttonBase =
  "flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-xs transition-colors";

const UsersPagination = ({
  page,
  totalPages,
  pageStart,
  pageEnd,
  total,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:px-5">
      <p className="text-xs text-slate-500">
        {total === 0
          ? "No users to show"
          : `Showing ${pageStart} to ${pageEnd} of ${total.toLocaleString()} users`}
      </p>

      {totalPages > 1 && (
        <nav aria-label="Users pagination" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${buttonBase} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {getPageNumbers(page, totalPages).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? "page" : undefined}
              className={`${buttonBase} ${
                n === page
                  ? "border-[#14481f] bg-[#14481f] font-semibold text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className={`${buttonBase} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default UsersPagination;
