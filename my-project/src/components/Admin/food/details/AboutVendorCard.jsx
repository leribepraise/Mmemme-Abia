import { Clock, Globe, Mail, MapPin, Phone, Tag } from "lucide-react";
import { DetailCard, IconBox } from "./FoodDetailParts";

const Field = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <IconBox>
      <Icon className="h-4 w-4" />
    </IconBox>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900">
        {children}
      </p>
    </div>
  </div>
);

const AboutVendorCard = ({ vendor }) => {
  const href = vendor.website.startsWith("http")
    ? vendor.website
    : `https://${vendor.website}`;

  return (
    <DetailCard title="About">
      <p className="text-sm leading-relaxed text-slate-600">{vendor.about}</p>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <Field icon={Tag} label="Category">
          {vendor.category}
        </Field>
        <Field icon={MapPin} label="Location">
          {vendor.location}
        </Field>
        <Field icon={Phone} label="Phone">
          {vendor.phone}
        </Field>
        <Field icon={Mail} label="Email">
          {vendor.email}
        </Field>
        <Field icon={Clock} label="Operating Hours">
          {vendor.hours}
        </Field>
        <Field icon={Globe} label="Website">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#1a6a2a] hover:underline"
          >
            {vendor.website}
          </a>
        </Field>
      </div>
    </DetailCard>
  );
};

export default AboutVendorCard;
