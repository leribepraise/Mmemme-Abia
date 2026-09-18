import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({
  items = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ],
}) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500 md:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label || index} className="flex items-center gap-2">
              {isLast ? (
                <span
                  className="font-extrabold text-gray-900"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href || "#"}
                  className="transition hover:text-[#265F27] hover:underline"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;