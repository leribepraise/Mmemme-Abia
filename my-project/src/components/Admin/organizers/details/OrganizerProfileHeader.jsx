import {
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { StatusPill } from "./OrganizerDetailParts";

const initials = (name) =>
  name
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ContactItem = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#1a6a2a]">
      <Icon size={15} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1a6a2a]">
        {label}
      </p>
      <p className="break-words text-xs text-gray-800">{value}</p>
    </div>
  </div>
);

const OrganizerProfileHeader = ({ organizer }) => {
  const soon = (what) => () => toast(`${what} isn't built yet`);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-4">
          {organizer.avatar ? (
            <img
              src={organizer.avatar}
              alt={organizer.name}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-lg font-semibold text-white">
              {initials(organizer.name)}
            </span>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                {organizer.name}
              </h2>
              <StatusPill status={organizer.status} />
            </div>
            <p className="text-xs text-gray-500">@{organizer.handle}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
              <Building2 size={12} aria-hidden="true" />
              {organizer.category}
            </span>
            <p className="mt-2 text-xs text-gray-600">{organizer.tagline}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={soon("Messaging")}
            aria-label="Send message"
            className="flex h-9 items-center gap-2 rounded-lg border border-[#1a6a2a] bg-white px-3 text-xs font-medium text-[#1a6a2a] hover:bg-green-50"
          >
            <MessageCircle size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Message</span>
          </button>
          <button
            type="button"
            onClick={soon("More actions")}
            aria-label="More actions"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
        <ContactItem icon={Mail} label="Email" value={organizer.email} />
        <ContactItem icon={Phone} label="Phone" value={organizer.phone} />
        <ContactItem
          icon={MapPin}
          label="Location"
          value={organizer.location}
        />
      </div>
    </div>
  );
};

export default OrganizerProfileHeader;
