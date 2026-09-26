import { FileX } from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatNoteDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const hours = d.getHours();
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = String(hours % 12 || 12).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hour12}:${minutes} ${suffix}`;
};

const TYPE_STYLES = {
  Rejected:
    "inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600",
  "Info requested":
    "inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-[#f28c28]",
};
const DEFAULT_TYPE_STYLE =
  "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600";

const AdditionalNotes = ({ notes = [] }) => (
  <section className="rounded-xl bg-white p-5 shadow-sm">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
      Additional Notes
    </h2>

    {notes.length === 0 ? (
      <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10">
        <p className="text-sm text-slate-400">No additional notes.</p>
        <FileX className="h-5 w-5 text-[#0b6045]" />
      </div>
    ) : (
      <ul className="mt-4 space-y-3">
        {notes.map((note) => (
          <li key={note.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={TYPE_STYLES[note.type] || DEFAULT_TYPE_STYLE}>
                {note.type}
              </span>
              <span className="text-xs text-slate-400">
                {formatNoteDate(note.createdAt)}
              </span>
            </div>
            <p className="mt-2 break-words text-sm text-slate-700">
              {note.text}
            </p>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default AdditionalNotes;
