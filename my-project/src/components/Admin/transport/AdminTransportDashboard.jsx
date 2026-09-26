import toast from "react-hot-toast";
import {
  transportStats,
  transportServices,
  recentBookings,
  liveTrips,
  transportOverview,
  totalBookingsAllTime,
} from "@/data/adminTransport";
import TransportStats from "./TransportStats";
import TransportServiceCards from "./TransportServiceCards";
import RecentBookingsCard from "./RecentBookingsCard";
import LiveTripsCard from "./LiveTripsCard";
import TransportOverviewDonut from "./TransportOverviewDonut";

const AdminTransportDashboard = () => (
  <div className="space-y-4 p-4 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Transport Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage and monitor all transport services on the platform.
        </p>
      </div>
      <button
        type="button"
        onClick={() => toast("Drivers list isn't built yet")}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
      >
        See Drivers
      </button>
    </div>

    <TransportStats stats={transportStats} />
    <TransportServiceCards services={transportServices} />
    <RecentBookingsCard bookings={recentBookings} />

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <LiveTripsCard trips={liveTrips} />
      <TransportOverviewDonut
        segments={transportOverview}
        total={totalBookingsAllTime}
      />
    </div>
  </div>
);

export default AdminTransportDashboard;
