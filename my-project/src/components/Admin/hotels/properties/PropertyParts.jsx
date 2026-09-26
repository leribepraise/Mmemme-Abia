const STATUS_TONES = {
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-orange-50 text-orange-600",
  Suspended: "bg-red-50 text-red-600",
  Rejected: "bg-red-100 text-red-700",
};

export const PropertyStatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
      STATUS_TONES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {status}
  </span>
);

export const PropertyThumb = ({ property }) =>
  property.image ? (
    <img
      src={property.image}
      alt={property.name}
      className="h-11 w-11 shrink-0 rounded-lg object-cover"
    />
  ) : (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-medium text-emerald-600">
      No image
    </span>
  );

export const PropertyIdentity = ({ property }) => (
  <div className="flex min-w-0 items-center gap-3">
    <PropertyThumb property={property} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">
        {property.name}
      </p>
      <p className="truncate text-[11px] text-gray-500">{property.host}</p>
    </div>
  </div>
);
