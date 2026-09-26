import toast from "react-hot-toast";
import { DetailCard } from "./FoodDetailParts";

const naira = (n) => `₦${n.toLocaleString("en-US")}`;

const MenuPreviewCard = ({ items }) => (
  <DetailCard
    title="Menu Preview"
    action={
      <button
        type="button"
        onClick={() => toast("Full menu isn't built yet")}
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        View All Menu
      </button>
    }
  >
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.name}
          className="overflow-hidden rounded-xl border border-slate-100"
        >
          <div className="flex h-20 items-center justify-center bg-emerald-50 text-[10px] text-emerald-300">
            No image
          </div>
          <div className="p-2.5">
            <p className="truncate text-xs font-semibold text-slate-900">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#1a6a2a]">
              {naira(item.price)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </DetailCard>
);

export default MenuPreviewCard;
