import { Check, X } from "lucide-react";
import { DetailCard } from "./PropertyDetailParts";

const MAX_NOTE = 500;

const VerificationChecklistCard = ({ checklist, note, onNoteChange }) => (
  <DetailCard title="Verification Checklist">
    <ul className="space-y-2.5">
      {checklist.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2.5 text-sm text-slate-700"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              item.done
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {item.done ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </span>
          {item.label}
        </li>
      ))}
    </ul>

    <div className="mt-4 border-t border-slate-100 pt-4">
      <label
        htmlFor="checklist-note"
        className="text-xs font-medium text-slate-600"
      >
        Notes <span className="font-normal text-slate-400">(optional)</span>
      </label>
      <div className="relative mt-1.5">
        <textarea
          id="checklist-note"
          value={note}
          maxLength={MAX_NOTE}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Add notes about the verification process..."
          className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 pb-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b6045]"
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
          {note.length}/{MAX_NOTE}
        </span>
      </div>
    </div>
  </DetailCard>
);

export default VerificationChecklistCard;
