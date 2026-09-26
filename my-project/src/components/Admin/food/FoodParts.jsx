const STATUS_TONES = {
  Approved: "text-green-600",
  Pending: "text-orange-500",
  Suspended: "text-red-600",
  Rejected: "text-red-700",
};

export const FoodStatusLabel = ({ status }) => (
  <span
    className={`text-sm font-medium ${STATUS_TONES[status] || "text-gray-500"}`}
  >
    {status}
  </span>
);

// Category renders as plain colored text (not a pill), matching the screenshot.
const CATEGORY_TONES = {
  Restaurant: "text-rose-500",
  "Fast Food": "text-orange-500",
  Bakery: "text-blue-500",
  Café: "text-teal-500",
  "Food Vendor": "text-orange-600",
  "Street Food": "text-purple-500",
};

export const FoodCategoryLabel = ({ category }) => (
  <span
    className={`text-sm font-medium ${CATEGORY_TONES[category] || "text-slate-600"}`}
  >
    {category}
  </span>
);

export const FoodThumb = ({ vendor }) =>
  vendor.image ? (
    <img
      src={vendor.image}
      alt={vendor.name}
      className="h-9 w-9 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
      {vendor.name
        .split(" ")
        .filter((w) => /^[A-Za-z0-9]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}
    </span>
  );

export const FoodIdentity = ({ vendor }) => (
  <div className="flex min-w-0 items-center gap-3">
    <FoodThumb vendor={vendor} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">
        {vendor.name}
      </p>
      <p className="truncate text-[11px] text-gray-400">@{vendor.handle}</p>
    </div>
  </div>
);
