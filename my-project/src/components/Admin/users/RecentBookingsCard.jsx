import { DetailCard, ItemRow } from "./DetailParts";

const RecentBookingsCard = ({ bookings, onViewAll }) => (
  <DetailCard title="Recent Bookings" onViewAll={onViewAll}>
    <div className="space-y-2.5">
      {bookings.map((b) => (
        <ItemRow key={b.id} {...b} />
      ))}
    </div>
  </DetailCard>
);

export default RecentBookingsCard;
