import useAdminDashboard from "./useAdminDashboard";
import WelcomeBar from "./WelcomeBar";
import StatsGrid from "./StatsGrid";
import PlatformActivity from "./PlatformActivity";
import TopCategories from "./TopCategories";
import QuickActions from "./QuickActions";
import RecentActivities from "./RecentActivities";
import QuickLinks from "./QuickLinks";

const AdminDashboard = () => {
  const {
    range,
    setRange,
    stats,
    activityLabels,
    activitySeries,
    categories,
    quickActions,
    recentActivities,
    quickLinks,
  } = useAdminDashboard();

  return (
    <div className="space-y-4">
      <WelcomeBar range={range} onRangeChange={setRange} />
      <StatsGrid stats={stats} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlatformActivity labels={activityLabels} series={activitySeries} />
        </div>
        <TopCategories categories={categories} />
      </div>

      <QuickActions actions={quickActions} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivities activities={recentActivities} />
        </div>
        <QuickLinks links={quickLinks} />
      </div>
    </div>
  );
};

export default AdminDashboard;
