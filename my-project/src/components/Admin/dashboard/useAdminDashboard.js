import { useState } from "react";
import {
  dashboardStats,
  activityLabels,
  activitySeries,
  topCategories,
  quickActions,
  recentActivities,
  quickLinks,
} from "@/data/adminDashboard";

// Same idea as useChat(): components only talk to this hook, so when the Django
// backend is ready only the inside of this file changes (fetch using `range`).
const useAdminDashboard = () => {
  const [range, setRange] = useState("30");

  return {
    range,
    setRange,
    stats: dashboardStats,
    activityLabels,
    activitySeries,
    categories: topCategories,
    quickActions,
    recentActivities,
    quickLinks,
  };
};

export default useAdminDashboard;
