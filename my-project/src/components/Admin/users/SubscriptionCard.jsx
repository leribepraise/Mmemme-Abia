import { DetailCard, Pill } from "./DetailParts";

const SubscriptionCard = ({ subscription, onManage }) => (
  <DetailCard title="Subscription">
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">Plan</span>
        <Pill>{subscription.plan}</Pill>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">Expires</span>
        <span className="text-sm font-medium text-gray-900">
          {subscription.expires}
        </span>
      </div>
      <button
        type="button"
        onClick={onManage}
        className="h-9 w-full rounded-lg border border-gray-300 bg-white text-xs font-semibold text-[#1a6a2a] hover:bg-gray-50"
      >
        Manage Subscription
      </button>
    </div>
  </DetailCard>
);

export default SubscriptionCard;
