import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  BadgeCheck,
  Ban,
  CircleCheck,
  Trash2,
} from "lucide-react";

const itemBase =
  "flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50";
const itemClass = `${itemBase} text-slate-700`;
const dangerClass = `${itemBase} text-red-600 hover:bg-red-50`;

const OrganizerRowActions = ({
  organizer,
  onView,
  onVerify,
  onToggleSuspend,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isSuspended = organizer.status === "Suspended";
  const isPending = organizer.status === "Pending";

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const run = (action) => () => {
    setOpen(false);
    action();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${organizer.name}? This can't be undone.`))
      onDelete(organizer);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Actions for ${organizer.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={run(() => onView(organizer))}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            View details
          </button>
          {isPending && (
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={run(() => onVerify(organizer))}
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verify organizer
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={run(() => onToggleSuspend(organizer))}
          >
            {isSuspended ? (
              <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Ban className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {isSuspended ? "Reactivate organizer" : "Suspend organizer"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={dangerClass}
            onClick={run(handleDelete)}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete organizer
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizerRowActions;
