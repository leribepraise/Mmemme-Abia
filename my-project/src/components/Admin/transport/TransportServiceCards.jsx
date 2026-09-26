import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const TransportServiceCards = ({ services }) => (
  <section>
    <h2 className="mb-3 text-sm font-semibold text-slate-900">
      Transport Services
    </h2>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {services.map(({ id, label, description, icon: Icon, iconBox, to }) => (
        <div key={id} className="rounded-xl bg-white p-4 shadow-sm">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBox}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          {to ? (
            <Link
              to={to}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#1a6a2a] hover:underline"
            >
              View →
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => toast(`${label} isn't built yet`)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#1a6a2a] hover:underline"
            >
              View →
            </button>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default TransportServiceCards;
