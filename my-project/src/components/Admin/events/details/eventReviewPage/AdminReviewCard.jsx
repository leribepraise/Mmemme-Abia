import { Check, RotateCcw, X } from "lucide-react";

const MAX_NOTE = 500;

const AdminReviewCard = ({
  note,
  onNoteChange,
  onApprove,
  onReject,
  onRequestChanges,
}) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <h2 className="text-sm font-semibold text-slate-900">Admin Review</h2>
    <p className="mt-0.5 text-xs text-slate-500">
      Add your comments (optional)
    </p>

    <div className="relative mt-3">
      <textarea
        value={note}
        maxLength={MAX_NOTE}
        onChange={(e) => onNoteChange(e.target.value)}
        rows={4}
        placeholder="Write your review notes here..."
        className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 pb-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b6045]"
      />
      <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
        {note.length}/{MAX_NOTE}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onApprove}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0b6045] px-4 text-sm font-medium text-white transition-colors hover:bg-[#084d37]"
      >
        <Check className="h-4 w-4" />
        Approve Event
      </button>
      <button
        type="button"
        onClick={onReject}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
      >
        <X className="h-4 w-4" />
        Reject Event
      </button>
      <button
        type="button"
        onClick={onRequestChanges}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" />
        Request Changes
      </button>
    </div>

    <p className="mt-3 text-xs text-slate-400">
      The organizer will be notified of your decision.
    </p>
  </section>
);

export default AdminReviewCard;
