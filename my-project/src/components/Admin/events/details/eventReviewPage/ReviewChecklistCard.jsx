import { Check } from "lucide-react";

// Static placeholder — every item shows as complete until the backend
// can report real checks (ticket config, content flags, etc.).
const CHECKLIST = [
  "Event information is complete",
  "Organizer is verified",
  "Tickets are properly configured",
  "Content is appropriate",
  "No policy violations",
];

const ReviewChecklistCard = () => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <h2 className="text-sm font-semibold text-slate-900">Review Checklist</h2>
    <ul className="mt-3 space-y-2.5">
      {CHECKLIST.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 text-sm text-slate-700"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check className="h-3.5 w-3.5" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default ReviewChecklistCard;
