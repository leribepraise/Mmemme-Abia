import { ChevronDown, Clock, Ticket } from "lucide-react";
import { DetailCard, IconBox } from "./DestinationDetailParts";

// Read-only, dropdown-styled display. Editing listing details isn't built yet.
const StaticSelect = ({ label, value }) => (
  <div>
    <p className="text-[11px] text-slate-400">{label}</p>
    <div className="mt-1 flex h-10 items-center justify-between rounded-lg bg-slate-50 px-3">
      <span className="text-sm font-semibold text-slate-800">{value}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </div>
  </div>
);

const Field = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <IconBox>
      <Icon className="h-4 w-4" />
    </IconBox>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{children}</p>
    </div>
  </div>
);

const ListingInformationCard = ({ destination }) => (
  <DetailCard title="Listing Information">
    <div>
      <p className="text-[11px] text-slate-400">Description</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        {destination.about}
      </p>
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StaticSelect label="Category" value={destination.category} />
      <StaticSelect label="Location" value={destination.location} />
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
      <Field icon={Clock} label="Operating Hours">
        {destination.hours}
      </Field>
      <Field icon={Ticket} label="Entry Fee">
        {destination.entryFee}
      </Field>
    </div>
  </DetailCard>
);

export default ListingInformationCard;
