import { TrendingUp } from "lucide-react";

export function StatCard({ label, value, trend, icon: Icon }) {
  return (
    <div className="card stat-card" data-testid={`card-stat-${label.toLowerCase().replaceAll(" ", "-")}`}>
      <div className="stat-label">
        <span>{label}</span>
        <Icon className="stat-icon" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">
        <TrendingUp size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
        {trend}
      </div>
    </div>
  );
}
