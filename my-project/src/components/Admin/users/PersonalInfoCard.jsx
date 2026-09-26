import { DetailCard } from "./DetailParts";

const PersonalInfoCard = ({ user }) => {
  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "WhatsApp", value: user.whatsapp },
    { label: "Date of Birth", value: user.dob },
    { label: "Gender", value: user.gender },
    { label: "L.G.A", value: user.lga },
    { label: "Address", value: user.address },
  ];

  return (
    <DetailCard title="Personal Information">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="min-w-0">
            <dt className="text-[11px] text-gray-500">{f.label}</dt>
            <dd className="mt-0.5 break-words text-sm font-medium text-gray-900">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </DetailCard>
  );
};

export default PersonalInfoCard;
