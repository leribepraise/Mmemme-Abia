import toast from "react-hot-toast";
import { DetailCard, IconBox } from "./DestinationDetailParts";
import { VerifiedBadge } from "./DestinationDetailParts";
import { Mail, Phone } from "lucide-react";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ApprovalOrganizerCard = ({ organizer }) => (
  <DetailCard
    title="Organizer Information"
    action={
      <button
        type="button"
        onClick={() => toast("Organizer profile isn't linked yet")}
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        View Profile
      </button>
    }
  >
    <div className="flex items-center gap-3">
      {organizer.avatar ? (
        <img
          src={organizer.avatar}
          alt={organizer.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f3d1b] text-sm font-semibold text-white">
          {initials(organizer.name)}
        </span>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {organizer.name}
          </p>
          {organizer.verified && <VerifiedBadge label="Verified Organizer" />}
        </div>
        <p className="text-xs text-slate-500">{organizer.business}</p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
      <div className="flex items-start gap-3">
        <IconBox>
          <Mail className="h-4 w-4" />
        </IconBox>
        <div className="min-w-0">
          <p className="text-[11px] text-slate-400">Email</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            {organizer.email}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <IconBox>
          <Phone className="h-4 w-4" />
        </IconBox>
        <div className="min-w-0">
          <p className="text-[11px] text-slate-400">Phone</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {organizer.phone}
          </p>
        </div>
      </div>
    </div>
  </DetailCard>
);

export default ApprovalOrganizerCard;
