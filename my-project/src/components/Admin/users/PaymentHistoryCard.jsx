import { DetailCard, ItemRow } from "./DetailParts";

const PaymentHistoryCard = ({ payments, onViewAll }) => (
  <DetailCard title="Payment History" onViewAll={onViewAll}>
    <div className="space-y-2.5">
      {payments.map((p) => (
        <ItemRow key={p.id} {...p} />
      ))}
    </div>
  </DetailCard>
);

export default PaymentHistoryCard;
