import { Ban, CheckCircle2, Clock } from "lucide-react";

const TONES = {
  Verified: {
    box: "bg-[#e8f3ea]",
    text: "text-green-700",
    Icon: CheckCircle2,
    title: "Verified",
    message:
      "This organizer has been verified and approved to list events, properties and services on the platform.",
  },
  Pending: {
    box: "bg-orange-50",
    text: "text-orange-600",
    Icon: Clock,
    title: "Pending Verification",
    message:
      "This organizer is waiting for verification. Review their documents before approving.",
  },
  Suspended: {
    box: "bg-red-50",
    text: "text-red-600",
    Icon: Ban,
    title: "Suspended",
    message:
      "This organizer is suspended and can't list events, properties or services until reactivated.",
  },
};

const primaryBtn =
  "h-10 w-full rounded-lg bg-[#0f3d1b] text-xs font-semibold text-white hover:bg-[#0a2c13]";
const outlineBtn =
  "h-10 w-full rounded-lg border border-gray-300 bg-white text-xs font-semibold text-[#1a6a2a] hover:bg-gray-50";

const VerificationStatusCard = ({
  status,
  onVerify,
  onReactivate,
  onViewDocuments,
}) => {
  const tone = TONES[status] || TONES.Pending;
  const { Icon } = tone;

  return (
    <section className={`rounded-xl p-5 shadow-sm ${tone.box}`}>
      <h2 className="text-base font-semibold text-gray-900">
        Verification Status
      </h2>

      <div
        className={`mt-3 flex items-center gap-2 text-sm font-semibold ${tone.text}`}
      >
        <Icon size={16} aria-hidden="true" />
        {tone.title}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-600">
        {tone.message}
      </p>

      <div className="mt-4 space-y-2">
        {status === "Pending" && (
          <button type="button" onClick={onVerify} className={primaryBtn}>
            Verify Organizer
          </button>
        )}
        {status === "Suspended" && (
          <button type="button" onClick={onReactivate} className={primaryBtn}>
            Reactivate Organizer
          </button>
        )}
        <button
          type="button"
          onClick={onViewDocuments}
          className={status === "Verified" ? primaryBtn : outlineBtn}
        >
          View Documents
        </button>
      </div>
    </section>
  );
};

export default VerificationStatusCard;
