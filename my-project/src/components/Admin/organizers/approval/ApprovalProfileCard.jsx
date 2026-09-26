import { Mail, MapPin, Phone } from "lucide-react";
import { ApprovalCard, ApprovalStatusChip } from "./ApprovalParts";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ContactItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2 sm:border-l sm:border-slate-200 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
    <Icon className="mt-3 h-4 w-4 shrink-0 text-[#1a6a2a]" />
    <div className="min-w-0">
      <p className="text-[11px] text-[#1a6a2a]">{label}</p>
      <p className="break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

const ApprovalProfileCard = ({ info, status }) => (
  <ApprovalCard>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        {info.avatar ? (
          <img
            src={info.avatar}
            alt={info.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a6a2a] text-lg font-semibold text-white">
            {getInitials(info.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              {info.name}
            </h2>
            <ApprovalStatusChip status={status} />
          </div>
          <p className="text-sm text-slate-500">{info.handle}</p>
          <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {info.eventsCount} Events
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-y-3">
        <ContactItem icon={Mail} label="Email" value={info.email} />
        <ContactItem icon={Phone} label="Phone" value={info.phone} />
        <ContactItem icon={MapPin} label="Location" value={info.location} />
      </div>
    </div>
  </ApprovalCard>
);

export default ApprovalProfileCard;
