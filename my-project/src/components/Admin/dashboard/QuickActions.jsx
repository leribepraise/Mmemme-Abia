import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const QuickActions = ({ actions }) => {
  return (
    <section
      aria-label="Quick actions"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {actions.map(({ label, to, icon: Icon, tint }) => (
        <Link
          key={label}
          to={to}
          className="group flex items-center gap-3 rounded-xl bg-white p-3.5 shadow-sm transition hover:shadow-md"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex-1 text-xs font-medium text-slate-700">
            {label}
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[#14481f]"
            aria-hidden="true"
          />
        </Link>
      ))}
    </section>
  );
};

export default QuickActions;
