import { Check, X } from "lucide-react";
import { DetailCard } from "./FoodDetailParts";

const VerificationChecklistCard = ({ checklist }) => (
  <DetailCard title="Verification Checklist">
    <ul className="space-y-2.5">
      {checklist.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2.5 text-sm text-slate-700"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              item.done
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {item.done ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  </DetailCard>
);

export default VerificationChecklistCard;
