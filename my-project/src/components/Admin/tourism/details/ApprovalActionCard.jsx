import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { DetailCard } from "./DestinationDetailParts";

const MAX_NOTE = 500;

const ApprovalActionCard = ({
  status,
  onApprove,
  onReject,
  onRequestChanges,
  onReopen,
}) => {
  const [note, setNote] = useState("");

  if (status === "Rejected") {
    return (
      <DetailCard title="Approval Action">
        <p className="text-sm text-slate-600">
          This listing was rejected. The reason is saved in Previous Comments.
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
          Approve Listing
        </button>
        <button
          type="button"
          onClick={submit(onReject)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <X className="h-4 w-4" />
          Reject Listing
        </button>
        <button
          type="button"
          onClick={submit(onRequestChanges)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          Request Changes
        </button>
      </div>

      <div className="mt-4">
        <label
          htmlFor="approval-note"
          className="text-xs font-medium text-slate-500"
        >
          Add a note{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <div className="relative mt-1.5">
          <textarea
            id="approval-note"
            value={note}
            maxLength={MAX_NOTE}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. Please provide more images of the hiking trails..."
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

export default ApprovalActionCard;
