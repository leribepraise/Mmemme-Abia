import toast from "react-hot-toast";
import { DetailCard } from "./FoodDetailParts";

const naira = (n) => `₦${n.toLocaleString("en-US")}`;
const HEAD =
  "px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400";

const RecentOrdersCard = ({ orders }) => {
  if (orders.length === 0) return null;

  return (
    <DetailCard
      title="Recent Orders"
      action={
        <button
          type="button"
          onClick={() => toast("Full order history isn't built yet")}
          className="text-sm font-medium text-[#1a6a2a] hover:underline"
        >
          View All Orders
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className={HEAD}>Customer</th>
              <th className={HEAD}>Item</th>
              <th className={HEAD}>Amount</th>
              <th className={HEAD}>Date</th>
              <th className={HEAD}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0">
                <td className="px-3 py-2.5 font-medium text-slate-800">
                  {o.customer}
                </td>
                <td className="px-3 py-2.5 text-slate-600">{o.item}</td>
                <td className="px-3 py-2.5 text-slate-600">
                  {naira(o.amount)}
                </td>
                <td className="px-3 py-2.5 text-slate-500">{o.date}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DetailCard>
  );
};

export default RecentOrdersCard;
