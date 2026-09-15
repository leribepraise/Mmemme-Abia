import React from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && <ChevronRight className="w-4 h-4" />}
          <span
            className={
              i === items.length - 1 ? "font-semibold text-gray-900" : ""
            }
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
