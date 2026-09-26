const CATEGORY_TONES = {
  Events: "bg-blue-50 text-blue-600",
  Hotels: "bg-amber-50 text-amber-700",
  Transport: "bg-purple-50 text-purple-600",
  Tourism: "bg-teal-50 text-teal-700",
  Food: "bg-rose-50 text-rose-600",
};

const STATUS_TONES = {
  Verified: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-600",
  Suspended: "bg-red-50 text-red-600",
  Rejected: "bg-red-100 text-red-700",
};

export const CategoryBadge = ({ category }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-medium ${
      CATEGORY_TONES[category] || "bg-gray-100 text-gray-600"
    }`}
  >
    {category}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-medium ${
      STATUS_TONES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

const initials = (name) =>
  name
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const OrganizerAvatar = ({ organizer }) =>
  organizer.avatar ? (
    <img
      src={organizer.avatar}
      alt={organizer.name}
      className="h-9 w-9 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
      {initials(organizer.name)}
    </span>
  );

export const OrganizerIdentity = ({ organizer }) => (
  <div className="flex min-w-0 items-center gap-3">
    <OrganizerAvatar organizer={organizer} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">
        {organizer.name}
      </p>
      <p className="truncate text-[11px] text-gray-500">@{organizer.handle}</p>
    </div>
  </div>
);