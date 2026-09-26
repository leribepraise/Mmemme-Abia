import { DetailCard } from "./DestinationDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const CommentRow = ({ name, date, text }) => (
  <div className="flex gap-3 rounded-lg bg-slate-50 p-3.5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
      {initials(name)}
    </span>
    <div className="min-w-0">
      <p className="text-sm">
        <span className="font-medium text-slate-900">{name}</span>{" "}
        <span className="text-xs text-slate-400">{date}</span>
      </p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  </div>
);

const PreviousCommentsCard = ({ seedComments, notes }) => {
  const liveComments = notes.map((n) => ({
    id: n.id,
    name: "Admin",
    date: new Date(n.createdAt).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    text: n.text,
  }));

  const all = [...seedComments, ...liveComments];
  if (all.length === 0) return null;

  return (
    <DetailCard title="Previous Comments">
      <div className="space-y-3">
        {all.map((c) => (
          <CommentRow key={c.id} name={c.name} date={c.date} text={c.text} />
        ))}
      </div>
    </DetailCard>
  );
};

export default PreviousCommentsCard;
