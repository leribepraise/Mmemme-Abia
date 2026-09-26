import { DetailCard, Pill } from "./DetailParts";

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-right text-sm font-medium text-gray-900">
      {children}
    </span>
  </div>
);

const RoleStatusCard = ({ user }) => (
  <DetailCard title="Role & Status">
    <div className="space-y-4">
      <Row label="Role">{user.role}</Row>
      <Row label="Status">
        <Pill>{user.status}</Pill>
      </Row>
      <Row label="Joined">{user.joined}</Row>
      <Row label="Last Login">{user.lastLogin}</Row>
    </div>
  </DetailCard>
);

export default RoleStatusCard;
