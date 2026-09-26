import { DetailCard } from "./PropertyDetailParts";

const Field = ({ label, children }) => (
  <div>
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-slate-900">{children}</p>
  </div>
);

const PropertyInformationCard = ({ property }) => (
  <DetailCard title="Property Information">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Property Name">{property.name}</Field>
      <Field label="Type">{property.type}</Field>
      <Field label="Location">{property.location}</Field>
      <Field label="Host Name">{property.host}</Field>
      <Field label="Contact">{property.contact}</Field>
      <Field label="Email">{property.email}</Field>
    </div>
  </DetailCard>
);

export default PropertyInformationCard;
