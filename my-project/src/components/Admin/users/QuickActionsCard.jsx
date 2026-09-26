import {
  AlertTriangle,
  Bell,
  ClipboardList,
  CreditCard,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { DetailCard } from "./DetailParts";

const QuickActionsCard = ({
  isSuspended,
  onViewBookings,
  onViewPayments,
  onNotify,
  onEdit,
  onToggleSuspend,
}) => {
  const items = [
    { label: "View Bookings", icon: ClipboardList, onClick: onViewBookings },
    { label: "View Payments", icon: CreditCard, onClick: onViewPayments },
    { label: "Send Notification", icon: Bell, onClick: onNotify },
    { label: "Edit User", icon: Pencil, onClick: onEdit },
  ];

  return (
    <DetailCard title="Quick Actions">
      <div className="space-y-2">
        {items.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg bg-[#f7f9f6] px-3 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <Icon size={14} className="text-gray-500" />
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={onToggleSuspend}
          className={`flex w-full items-center gap-3 rounded-lg bg-[#f7f9f6] px-3 py-2.5 text-left text-xs font-medium hover:bg-gray-100 ${
            isSuspended ? "text-green-700" : "text-red-600"
          }`}
        >
          {isSuspended ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          {isSuspended ? "Reactivate User" : "Suspend User"}
        </button>
      </div>
    </DetailCard>
  );
};

export default QuickActionsCard;
