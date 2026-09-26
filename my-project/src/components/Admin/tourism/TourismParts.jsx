const STATUS_TONES = {
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-600",
  Suspended: "bg-red-50 text-red-600",
  Rejected: "bg-red-100 text-red-700",
};

export const TourismStatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
      STATUS_TONES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

// "2025-04-12" -> "12 Apr 2025" (string split, so no timezone surprises)
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

export const formatTourismDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export const TourismThumb = ({ listing }) =>
  listing.image ? (
    <img
      src={listing.image}
      alt={listing.name}
      className="h-11 w-11 shrink-0 rounded-lg object-cover"
    />
  ) : (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-medium text-emerald-600">
      No image
    </span>
  );

export const TourismIdentity = ({ listing }) => (
  <div className="flex min-w-0 items-center gap-3">
    <TourismThumb listing={listing} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">
        {listing.name}
      </p>
      <p className="truncate text-[11px] text-gray-500">{listing.category}</p>
    </div>
  </div>
);
