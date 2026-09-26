import { Link } from "react-router-dom";
import { getBookingStatusTone } from "@/data/adminTransport";

const HEAD =
  "px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400";

const RecentBookingsCard = ({ bookings }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-900">Recent Bookings</h2>
      <Link
        to="/admin/transport/bookings"
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        View All Bookings →
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className={HEAD}>ID</th>
            <th className={HEAD}>Service</th>
            <th className={HEAD}>Customer</th>
            <th className={HEAD}>Driver</th>
            <th className={HEAD}>Status</th>
            <th className={HEAD}>Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-slate-50 last:border-0">
              <td className="px-3 py-2.5 font-semibold text-slate-900">
                {b.id}
              </td>
              <td className="px-3 py-2.5 text-slate-600">{b.service}</td>
              <td className="px-3 py-2.5 font-medium text-slate-800">
                {b.customer}
              </td>
              <td className="px-3 py-2.5 text-slate-500">{b.driver || "-"}</td>
              <td
                className={`px-3 py-2.5 font-medium ${getBookingStatusTone(b.status)}`}
              >
                {b.status}
              </td>
              <td className="px-3 py-2.5 text-slate-500">{b.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default RecentBookingsCard;
