import { Ban, CheckCircle2, Clock } from "lucide-react";

const STATUS_STYLES = {
  Verified: {
    pill: "border-green-200 bg-green-50 text-green-700",
    Icon: CheckCircle2,
  },
  Pending: {
    pill: "border-orange-200 bg-orange-50 text-orange-600",
    Icon: Clock,
  },
  Suspended: { pill: "border-red-200 bg-red-50 text-red-600", Icon: Ban },
};

export const StatusPill = ({ status }) => {
  const { pill, Icon } = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${pill}`}
    >
      <Icon size={12} aria-hidden="true" />
      {status}
    </span>
  );
};

export const DetailCard = ({ title, children, className = "" }) => (
  <section className={`rounded-xl bg-white p-5 shadow-sm ${className}`}>
    {title && (
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
    )}
    {children}
  </section>
);
