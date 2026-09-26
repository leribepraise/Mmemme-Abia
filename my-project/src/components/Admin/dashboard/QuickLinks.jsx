import { Link } from "react-router-dom";

const QuickLinks = ({ links }) => {
  return (
    <section className="h-full rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold text-[#0f172a]">Quick Links</h2>

      <ul className="mt-3 space-y-2">
        {links.map(({ label, to, icon: Icon }) => (
          <li key={label}>
            <Link
              to={to}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:border-[#14481f]/40 hover:bg-green-50/50"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-[#14481f]"
                aria-hidden="true"
              />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QuickLinks;
