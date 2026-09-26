import { CheckCircle2, Clock, MapPin, Tag, Ticket } from "lucide-react";
import { DetailCard, IconBox } from "./DestinationDetailParts";

const Field = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <IconBox>
      <Icon className="h-4 w-4" />
    </IconBox>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900">
        {children}
      </p>
    </div>
  </div>
);

const DestinationAboutCard = ({ destination }) => (
  <DetailCard title="About">
    <p className="text-sm leading-relaxed text-slate-600">
      {destination.about}
    </p>

    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
      <Field icon={Tag} label="Category">
        {destination.category}
      </Field>
      <Field icon={MapPin} label="Location">
        {destination.location}
      </Field>
      <Field icon={Clock} label="Operating Hours">
        {destination.hours}
      </Field>
      <Field icon={Ticket} label="Entry Fee">
        {destination.entryFee}
      </Field>
    </div>

    <div className="mt-5 border-t border-slate-100 pt-4">
      <h3 className="text-sm font-semibold text-slate-900">Highlights</h3>
      <ul className="mt-2.5 space-y-2">
        {destination.highlights.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </DetailCard>
);

export default DestinationAboutCard;
