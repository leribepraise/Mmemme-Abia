import { BadgeCheck } from "lucide-react";

export const DetailCard = ({ title, action, children }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    {title && (
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
          {title}
        </h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const IconBox = ({ children }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
    {children}
  </span>
);

const PILL_TONES = {
  Approved: { box: "bg-emerald-600 text-white", dot: "bg-white" },
  Pending: { box: "bg-amber-50 text-[#f28c28]", dot: "bg-[#f28c28]" },
  Suspended: { box: "bg-red-50 text-red-600", dot: "bg-red-500" },
  Rejected: { box: "bg-red-100 text-red-700", dot: "bg-red-600" },
};
const FALLBACK_TONE = {
  box: "bg-slate-100 text-slate-600",
  dot: "bg-slate-400",
};

export const StatusPill = ({ status }) => {
  const tone = PILL_TONES[status] || FALLBACK_TONE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${tone.box}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
};

export const VerifiedBadge = ({ label = "Verified" }) => (
  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
    <BadgeCheck className="h-3 w-3" />
    {label}
  </span>
);

const DOC_STATUS_TONES = {
  Verified: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-[#f28c28]",
};

export const DocumentStatusPill = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
      DOC_STATUS_TONES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);
