import { DetailCard } from "./OrganizerDetailParts";

const DOT_TONES = {
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  orange: "bg-orange-400",
  purple: "bg-purple-500",
};

const RecentActivityCard = ({ activities }) => (
  <DetailCard title="Recent Activity">
    <ol>
      {activities.map((a, i) => (
        <li key={a.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i !== activities.length - 1 && (
            <span className="absolute bottom-0 left-[5px] top-4 w-px bg-gray-200" />
          )}
          <span
            className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
              DOT_TONES[a.tone] || "bg-gray-400"
            }`}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">{a.title}</p>
            <p className="text-[11px] text-gray-500">{a.date}</p>
          </div>
        </li>
      ))}
    </ol>
  </DetailCard>
);

export default RecentActivityCard;
