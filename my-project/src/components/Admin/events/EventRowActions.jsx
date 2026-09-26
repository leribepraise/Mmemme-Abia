import { useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

const ITEM =
  "block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50";
const ITEM_DANGER =
  "block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50";

const EventRowActions = ({
  event,
  openUp,
  onView,
  onApprove,
  onReject,
  onToggleSuspend,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const run = (fn) => () => {
    setOpen(false);
    fn(event.id);
  };

  const handleDelete = () => {
    setOpen(false);
    if (window.confirm(`Delete "${event.title}"? This can't be undone.`)) {
      onDelete(event.id);
    }
  };

  const isPending = event.status === "Pending";
  const isSuspended = event.status === "Suspended";
  const canSuspend = event.status === "Verified" || isSuspended;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={`Actions for ${event.title}`}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-20 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <button type="button" className={ITEM} onClick={run(onView)}>
            View details
          </button>
          {isPending && (
            <button type="button" className={ITEM} onClick={run(onApprove)}>
              Approve event
            </button>
          )}
          {isPending && (
            <button type="button" className={ITEM} onClick={run(onReject)}>
              Reject event
            </button>
          )}
          {canSuspend && (
            <button
              type="button"
              className={ITEM}
              onClick={run(onToggleSuspend)}
            >
              {isSuspended ? "Reactivate" : "Suspend"}
            </button>
          )}
          <button type="button" className={ITEM_DANGER} onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventRowActions;
