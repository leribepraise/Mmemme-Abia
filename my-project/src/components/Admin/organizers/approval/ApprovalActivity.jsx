import { ApprovalCard } from "./ApprovalParts";

const ApprovalActivity = ({ items }) => (
  <ApprovalCard title="Organizer Activity">
    <ol>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && (
            <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />
          )}
          <span className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-[#1a6a2a]" />
          <div>
            <p className="text-sm font-medium text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-400">{item.date}</p>
          </div>
        </li>
      ))}
    </ol>
  </ApprovalCard>
);

export default ApprovalActivity;
