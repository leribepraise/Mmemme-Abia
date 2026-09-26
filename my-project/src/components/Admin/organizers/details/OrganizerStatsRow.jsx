const formatValue = ({ value, kind }) => {
  if (kind === "currency") return `₦${Number(value).toLocaleString("en-NG")}`;
  if (kind === "number") return Number(value).toLocaleString();
  return String(value);
};

const NOTE_TONES = {
  up: "text-green-600",
  down: "text-red-500",
  muted: "text-gray-500",
};

const OrganizerStatsRow = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {stats.map((s) => (
      <div key={s.id} className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-[11px] text-gray-500">{s.label}</p>
        <p className="mt-1.5 break-words text-lg font-bold text-gray-900">
          {formatValue(s)}
        </p>
        <p
          className={`mt-1 text-[11px] font-medium ${NOTE_TONES[s.tone] || NOTE_TONES.muted}`}
        >
          {s.note}
        </p>
      </div>
    ))}
  </div>
);

export default OrganizerStatsRow;
