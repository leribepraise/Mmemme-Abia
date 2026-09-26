import { CheckCircle2 } from "lucide-react";
import { DetailCard } from "./PropertyDetailParts";

const AboutPropertyCard = ({ property }) => (
  <DetailCard title="About Property">
    <p className="text-sm leading-relaxed text-slate-600">{property.about}</p>

    <div className="mt-4 border-t border-slate-100 pt-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Property Highlights
      </h3>
      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {property.highlights.map((item) => (
          <span
            key={item}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </span>
        ))}
      </div>
    </div>
  </DetailCard>
);

export default AboutPropertyCard;
