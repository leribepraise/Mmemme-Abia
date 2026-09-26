import { useState } from "react";
import UserNotFound from "./UserNotFound";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useAdminUserDetail from "./useAdminUserDetail";
import UserProfileHeader from "./UserProfileHeader";
import UserDetailTabs from "./UserDetailTabs";
import PersonalInfoCard from "./PersonalInfoCard";
import RecentBookingsCard from "./RecentBookingsCard";
import ActivityTimelineCard from "./ActivityTimelineCard";
import RoleStatusCard from "./RoleStatusCard";
import SubscriptionCard from "./SubscriptionCard";
import PaymentHistoryCard from "./PaymentHistoryCard";
import QuickActionsCard from "./QuickActionsCard";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const { user, notFound, bookings, payments, activities, toggleSuspend } =
    useAdminUserDetail(id);

  if (notFound) return <UserNotFound id={id} />;

  const soon = (what) => () => toast(`${what} isn't built yet`);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="mb-2 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={14} />
          Back to Users
        </button>
        <h1 className="text-xl font-bold text-gray-900">User Details</h1>
      </div>

      <UserProfileHeader user={user} onToggleSuspend={toggleSuspend} />
      <UserDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "Overview" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <PersonalInfoCard user={user} />
            <RecentBookingsCard
              bookings={bookings}
              onViewAll={() => setActiveTab("Bookings")}
            />
            <ActivityTimelineCard activities={activities} />
          </div>

          <div className="space-y-4">
            <RoleStatusCard user={user} />
            <SubscriptionCard
              subscription={user.subscription}
              onManage={soon("Subscription management")}
            />
            <PaymentHistoryCard
              payments={payments}
              onViewAll={() => setActiveTab("Payments")}
            />
            <QuickActionsCard
              isSuspended={user.status === "Suspended"}
              onViewBookings={() => setActiveTab("Bookings")}
              onViewPayments={() => setActiveTab("Payments")}
              onNotify={soon("Notifications")}
              onEdit={soon("Edit user")}
              onToggleSuspend={toggleSuspend}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          The {activeTab} tab isn't built yet.
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
