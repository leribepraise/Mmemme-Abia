import { DetailCard } from "./FoodDetailParts";

const Field = ({ label, children }) => (
  <div>
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-slate-900">{children}</p>
  </div>
);

const BusinessInformationCard = ({ business }) => {
  const href = business.website.startsWith("http")
    ? business.website
    : `https://${business.website}`;

  return (
    <DetailCard title="Business Information">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-[11px] text-slate-400">Description</p>
        <p className="mt-0.5 text-sm text-slate-600">{business.description}</p>
      </div>
    </DetailCard>
  );
};

export default BusinessInformationCard;
