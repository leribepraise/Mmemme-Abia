import { DetailCard } from "./DetailParts";

const ActivityTimelineCard = ({ activities }) => (
  <DetailCard title="Activity Timeline">
    <ol>
      {activities.map((a, i) => (
        <li key={a.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i !== activities.length - 1 && (
            <span className="absolute bottom-0 left-[7px] top-5 w-px bg-gray-200" />
          )}
          <span className="relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-[3px] border-[#1a6a2a] bg-white" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">{a.title}</p>
            <p className="text-[11px] text-gray-500">{a.date}</p>
          </div>
        </li>
      ))}
    </ol>
  </DetailCard>
);

export default ActivityTimelineCard;
