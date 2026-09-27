import { Link } from "react-router-dom";

const RecentActivities = ({ activities }) => {
  return (
    <section className="h-full rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#0f172a]">
          Recent Activities
        </h2>
        <span className="text-xs text-slate-400">Latest 10 entries</span>
      </div>

      <ul className="mt-2 divide-y divide-slate-100">
        {activities.map(
          ({ id, title, description, time, icon: Icon, tint }) => (
            <li key={id} className="flex items-start gap-3 py-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tint}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1 sm:flex sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {description}
                  </p>
                </div>
                <p className="mt-1 shrink-0 text-[11px] text-slate-400 sm:mt-0">
                  {time}
                </p>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default RecentActivities;
