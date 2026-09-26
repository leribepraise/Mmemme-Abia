import { DetailCard } from "./OrganizerDetailParts";

const Field = ({ label, children }) => (
  <div>
    <dt className="text-[11px] text-gray-500">{label}</dt>
    <dd className="mt-0.5 break-words text-sm font-medium text-gray-900">
      {children}
    </dd>
  </div>
);

const BusinessInfoCard = ({ business }) => {
  const href = business.website.startsWith("http")
    ? business.website
    : `https://${business.website}`;

  return (
    <DetailCard title="Business Information">
      <dl className="space-y-4">
        <Field label="Business Name">{business.name}</Field>
        <Field label="Business Type">{business.type}</Field>
        <Field label="Registration Number">
          <span className="font-mono text-[13px]">
            {business.registrationNumber}
          </span>
        </Field>
        <Field label="Year Established">{business.yearEstablished}</Field>
        <Field label="Website">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#1a6a2a] hover:underline"
          >
            {business.website}
          </a>
        </Field>
        <Field label="Description">
          <span className="font-normal">{business.description}</span>
        </Field>
      </dl>
    </DetailCard>
  );
};

export default BusinessInfoCard;
