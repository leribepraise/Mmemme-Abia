import { useState } from "react";
import { Check, Eye, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./EventDetailParts";

const MAX_NOTE = 500;

const PANELS = {
  reject: {
    title: "Reason for rejection",
    placeholder: "e.g. The event details are incomplete.",
    confirmLabel: "Confirm rejection",
    confirmClass:
      "h-9 flex-1 rounded-lg bg-rose-600 text-sm font-medium text-white transition-colors hover:bg-rose-700",
  },
  changes: {
    title: "What changes are needed?",
    placeholder: "e.g. Please add a clearer event description.",
    confirmLabel: "Send request",
    confirmClass:
      "h-9 flex-1 rounded-lg bg-[#0b6045] text-sm font-medium text-white transition-colors hover:bg-[#084d37]",
  },
};

const STATUS_MESSAGES = {
  Verified: "This event has been approved.",
  Suspended:
    "This event is suspended. You can reactivate it from the Events list.",
  Rejected: "This event was rejected.",
};

const BTN =
  "flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors";
const BTN_APPROVE = `${BTN} bg-[#0b6045] font-semibold text-white hover:bg-[#084d37]`;
const BTN_REJECT = `${BTN} border border-rose-200 bg-rose-50/40 text-rose-600 hover:bg-rose-50`;
const BTN_REVIEW = `${BTN} border border-orange-200 bg-orange-50/40 text-[#f28c28] hover:bg-orange-50`;
const BTN_CHANGES = `${BTN} border border-slate-200 bg-white text-slate-800 hover:bg-slate-50`;

const EventKeyActions = ({
  status,
  onApprove,
  onReject,
  onRequestChanges,
  onReview,
}) => {
  const [panel, setPanel] = useState(null); // null | "reject" | "changes"
  const [note, setNote] = useState("");

  const openPanel = (key) => {
    setPanel(key);
    setNote("");
  };

  const closePanel = () => {
    setPanel(null);
    setNote("");
  };

  const handleConfirm = () => {
    const text = note.trim();
    if (!text) {
      toast.error("Please add a note first");
      return;
    }
    if (panel === "reject") onReject(text);
    else onRequestChanges(text);
    closePanel();
  };

  if (status !== "Pending") {
    return (
      <DetailCard title="Key Actions" muted>
        <p className="text-sm text-slate-600">
          {STATUS_MESSAGES[status] || "No actions are available."}
        </p>
      </DetailCard>
    );
  }

  const active = panel ? PANELS[panel] : null;

  return (
    <DetailCard title="Key Actions" muted>
      <div className="space-y-3">
        <button type="button" onClick={onApprove} className={BTN_APPROVE}>
          <Check className="h-4 w-4" />
          Approve Event
        </button>
        <button
          type="button"
          onClick={() => openPanel("reject")}
          className={BTN_REJECT}
        >
          <X className="h-4 w-4" />
          Reject Event
        </button>
        <button type="button" onClick={onReview} className={BTN_REVIEW}>
          <Eye className="h-4 w-4" />
          Review Event
        </button>
        <button
          type="button"
          onClick={() => openPanel("changes")}
          className={BTN_CHANGES}
        >
          <Pencil className="h-4 w-4" />
          Request Changes
        </button>
      </div>

      {active && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label
            htmlFor="event-action-note"
            className="text-xs font-medium text-slate-600"
          >
            {active.title}
          </label>
          <div className="relative mt-2">
            <textarea
              id="event-action-note"
              autoFocus
              value={note}
              maxLength={MAX_NOTE}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={active.placeholder}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 pb-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b6045]"
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
              {note.length}/{MAX_NOTE}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={closePanel}
              className="h-9 flex-1 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={active.confirmClass}
            >
              {active.confirmLabel}
            </button>
          </div>
        </div>
      )}
    </DetailCard>
  );
};

export default EventKeyActions;
