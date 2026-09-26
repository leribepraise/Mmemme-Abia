import { useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_NOTE = 500;

const PANELS = {
  reject: {
    title: "Reason for rejection",
    placeholder: "e.g. The business registration certificate has expired.",
    confirmLabel: "Confirm rejection",
    confirmClass:
      "h-9 flex-1 rounded-lg bg-rose-600 text-sm font-medium text-white transition-colors hover:bg-rose-700",
  },
  info: {
    title: "What information do you need?",
    placeholder: "e.g. Please upload a valid business permit.",
    confirmLabel: "Send request",
    confirmClass:
      "h-9 flex-1 rounded-lg bg-[#0b6045] text-sm font-medium text-white transition-colors hover:bg-[#084d37]",
  },
};

const VerificationAction = ({
  entityLabel = "Organizer",
  status,
  onApprove,
  onReject,
  onRequestInfo,
  onReopen,
}) => {
  const [panel, setPanel] = useState(null); // null | "reject" | "info"
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
    else onRequestInfo(text);
    closePanel();
  };

  if (status === "Rejected") {
    return (
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
          Verification Action
        </h2>
        <p className="mt-4 text-sm text-slate-600">
          This {entityLabel.toLowerCase()} was rejected. The reason is saved in
          Additional Notes.
        </p>
        <button
          type="button"
          onClick={onReopen}
          className="mt-4 h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          Reopen review
        </button>
      </section>
    );
  }

  const active = panel ? PANELS[panel] : null;

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
        Verification Action
      </h2>

      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onApprove}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b6045] text-sm font-semibold text-white transition-colors hover:bg-[#084d37]"
        >
          <Check className="h-4 w-4" />
          Approve {entityLabel}
        </button>
        <button
          type="button"
          onClick={() => openPanel("reject")}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <X className="h-4 w-4" />
          Reject {entityLabel}
        </button>
        <button
          type="button"
          onClick={() => openPanel("info")}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
        >
          Request More Information
        </button>
      </div>

      {active ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label
            htmlFor="verification-note"
            className="text-xs font-medium text-slate-600"
          >
            {active.title}
          </label>
          <div className="relative mt-2">
            <textarea
              id="verification-note"
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
      ) : (
        <p className="mt-4 text-center text-sm text-slate-400">
          This will notify the organizer about your decision.
        </p>
      )}
    </section>
  );
};

export default VerificationAction;
