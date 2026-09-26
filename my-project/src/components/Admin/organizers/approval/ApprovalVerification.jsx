import {
  Building2,
  CheckCircle2,
  Contact,
  FileText,
  Image as ImageIcon,
  Landmark,
  MapPin,
} from "lucide-react";
import { ApprovalCard } from "./ApprovalParts";

const ICONS = {
  business: Building2,
  identification: Contact,
  address: MapPin,
  photo: ImageIcon,
  bank: Landmark,
  additional: FileText,
};

const ApprovalVerification = ({ items }) => (
  <ApprovalCard title="Verification Details">
    <ul className="space-y-4">
      {items.map((item) => {
        const Icon = ICONS[item.key] || FileText;
        return (
          <li
            key={item.key}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
            {item.done ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1a6a2a]" />
            ) : (
              <span className="text-xs font-medium text-[#f28c28]">
                Pending
              </span>
            )}
          </li>
        );
      })}
    </ul>
  </ApprovalCard>
);

export default ApprovalVerification;
