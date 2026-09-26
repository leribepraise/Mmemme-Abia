import { Check, MessageSquare, X } from "lucide-react";
import { DetailCard } from "./PropertyDetailParts";

const STATUS_MESSAGES = {
  Suspended:
    "This property is suspended. You can reactivate it from the Properties list.",
};

const VerificationActionCard = ({
  status,
  onApprove,
  onReject,
  onRequestInfo,
  onReopen,
}) => {
  if (status === "Rejected") {
    return (
      <DetailCard title="Verification Action">
        <p className="text-sm text-slate-600">
          This property was rejected. The reason is saved in Additional Notes.
        </p>
        <button
          type="button"
          onClick={onReopen}
          className="mt-4 h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          Reopen review
        </button>
      </DetailCard>
    );
  }

  if (status !== "Pending") {
    return (
      <DetailCard title="Verification Action">
        <p className="text-sm text-slate-600">
          {STATUS_MESSAGES[status] || "No actions are available."}
        </p>
      </DetailCard>
    );
  }

  return (
    <DetailCard title="Verification Action">
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onApprove}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0b6045] text-sm font-semibold text-white transition-colors hover:bg-[#084d37]"
        >
          <Check className="h-4 w-4" />
          Approve Property
        </button>
        <button
          type="button"
          onClick={onReject}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <X className="h-4 w-4" />
          Reject Property
        </button>
        <button
          type="button"
          onClick={onRequestInfo}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          <MessageSquare className="h-4 w-4" />
          Request More Information
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        This will notify the organizer about your decision.
      </p>
    </DetailCard>
  );
};

export default VerificationActionCard;
