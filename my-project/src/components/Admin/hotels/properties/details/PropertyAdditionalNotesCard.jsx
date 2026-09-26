import { DetailCard } from "./PropertyDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const PropertyAdditionalNotesCard = ({ notes }) => (
  <DetailCard title="Additional Notes">
    {notes.length === 0 ? (
      <p className="rounded-lg bg-slate-50 p-3.5 text-sm text-slate-400">
        No additional notes.
      </p>
    ) : (
      <div className="space-y-2.5">
        {notes.map((n) => (
          <div key={n.id} className="flex gap-3 rounded-lg bg-slate-50 p-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
              {initials("Admin")}
            </span>
            <div className="min-w-0">
              <p className="text-sm">
                <span className="font-medium text-slate-900">Admin</span>{" "}
                <span className="text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">{n.text}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </DetailCard>
);

export default PropertyAdditionalNotesCard;
