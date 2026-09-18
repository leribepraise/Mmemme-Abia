import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return [...new Set(pages)];
  };

  const pages = getPageNumbers();

  const goPrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-6 flex justify-center gap-1">
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className="flex h-6 w-6 items-center justify-center rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={13} />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-6 w-8 items-center justify-center text-[10px] text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-6 w-6 rounded text-[10px] ${
              page === currentPage
                ? "bg-green-700 text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className="flex h-6 w-6 items-center justify-center rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

export default Pagination;
