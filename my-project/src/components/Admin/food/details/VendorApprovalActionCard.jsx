import { useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { DetailCard } from "./FoodDetailParts";

const MAX_NOTE = 500;

const STATUS_MESSAGES = {
  Suspended:
    "This vendor is suspended. You can reactivate it from the Food Vendors list.",
};

const VendorApprovalActionCard = ({
  status,
  onApprove,
  onReject,
  onRequestInfo,
  onReopen,
}) => {
  const [note, setNote] = useState("");

  if (status === "Rejected") {
    return (
      <DetailCard title="Approval Action">
        <p className="text-sm text-slate-600">
          This vendor was rejected. The reason is saved in Previous Actions.
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
      <DetailCard title="Approval Action">
        <p className="text-sm text-slate-600">
          {STATUS_MESSAGES[status] || "No actions are available."}
        </p>
      </DetailCard>
    );
  }

  const submit = (fn) => () => {
    const text = note.trim();
    fn(text || undefined);
    setNote("");
  };

  return (
    <DetailCard title="Approval Action">
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={submit(onApprove)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0b6045] text-sm font-semibold text-white transition-colors hover:bg-[#084d37]"
        >
          <Check className="h-4 w-4" />
          Approve Vendor
        </button>
        <button
          type="button"
          onClick={submit(onReject)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <X className="h-4 w-4" />
          Reject Vendor
        </button>
        <button
          type="button"
          onClick={submit(onRequestInfo)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          <MessageSquare className="h-4 w-4" />
          Request More Information
        </button>
      </div>

      <div className="mt-4">
        <label
          htmlFor="food-approval-note"
          className="text-xs font-medium text-slate-500"
        >
          Add a note{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <div className="relative mt-1.5">
          <textarea
            id="food-approval-note"
            value={note}
            maxLength={MAX_NOTE}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. Missing document, please provide additional information..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 pb-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b6045]"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
            {note.length}/{MAX_NOTE}
          </span>
        </div>
      </div>
    </DetailCard>
  );
};

export default VendorApprovalActionCard;
