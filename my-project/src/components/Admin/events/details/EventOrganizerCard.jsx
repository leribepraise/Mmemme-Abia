import { DetailCard, VerifiedBadge } from "./EventDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const EventOrganizerCard = ({ organizer, onViewProfile }) => (
  <DetailCard title="Organizer Information" muted>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {organizer.avatar ? (
          <img
            src={organizer.avatar}
            alt={organizer.name}
            className="h-11 w-11 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f3d1b] text-sm font-semibold text-white">
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
          <p className="mt-1 text-xs text-slate-500">{organizer.about}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewProfile}
        className="h-9 shrink-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
      >
        View Profile
      </button>
    </div>
  </DetailCard>
);

export default EventOrganizerCard;
