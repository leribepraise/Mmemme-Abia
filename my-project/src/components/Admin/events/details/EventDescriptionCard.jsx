import { Globe, Phone, Tag, Ticket, UserCheck, Users } from "lucide-react";
import { DetailCard, IconBox } from "./EventDetailParts";

const Field = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <IconBox>
      <Icon className="h-4 w-4" />
    </IconBox>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500">{label}</p>
      <div className="mt-0.5 break-words text-sm font-semibold text-slate-900">
        {children}
      </div>
    </div>
  </div>
);

const EventDescriptionCard = ({ event }) => {
  const href = event.website.startsWith("http")
    ? event.website
    : `https://${event.website}`;

  return (
    <DetailCard title="Event Description">
      <p className="text-sm leading-relaxed text-slate-600">
        {event.description}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 md:grid-cols-3">
        <Field icon={Tag} label="Category">
          {event.categoryLabel}
        </Field>
        <Field icon={Users} label="Expected Attendees">
          {event.expectedAttendees}
        </Field>
        <Field icon={Ticket} label="Ticket Price">
          {event.ticketPrice}
        </Field>
        <Field icon={UserCheck} label="Age Restriction">
          {event.ageRestriction}
        </Field>
        <Field icon={Globe} label="Website">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#1a6a2a] hover:underline"
          >
            {event.website}
          </a>
        </Field>
        <Field icon={Phone} label="Contact">
          {event.contact}
        </Field>
      </div>
    </DetailCard>
  );
};

export default EventDescriptionCard;
