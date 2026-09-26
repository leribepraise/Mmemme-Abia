import { ApprovalCard } from "./ApprovalParts";

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <div className="mt-0.5 break-words text-sm font-medium text-slate-900">
      {children}
    </div>
  </div>
);

const ApprovalBusinessInfo = ({ info }) => (
  <ApprovalCard title="Business Information">
    <div className="space-y-4">
      <Field label="Business Name">{info.businessName}</Field>
      <Field label="Business Type">{info.businessType}</Field>
      <Field label="Registration Number">{info.registrationNumber}</Field>
      <Field label="Year Established">{info.yearEstablished}</Field>
      <Field label="Website">
        {info.website === "—" ? (
          "—"
        ) : (
          <a
            href={`https://${info.website.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#1a6a2a] hover:underline"
          >
            {info.website}
          </a>
        )}
      </Field>
      <Field label="Description">
        <span className="font-normal text-slate-700">{info.description}</span>
      </Field>
    </div>
  </ApprovalCard>
);

export default ApprovalBusinessInfo;
