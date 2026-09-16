export function MiniChart({ large = false }) {
  return (
    <div className={`chart ${large ? "big-chart" : ""}`} data-testid="chart-sales-overview">
      <div className="chart-grid" />
      <svg viewBox="0 0 520 180" preserveAspectRatio="none" aria-label="Sales over time">
        <path d="M0 139 C55 105, 75 148, 125 116 S205 94, 260 119 S345 65, 400 86 S470 59, 520 46" fill="none" stroke="hsl(149 65% 26%)" strokeWidth="3" />
        <path d="M0 155 C55 133, 75 157, 125 141 S205 122, 260 144 S345 96, 400 116 S470 90, 520 76" fill="none" stroke="hsl(24 100% 57%)" strokeWidth="2.5" />
        <path d="M0 166 C55 151, 75 166, 125 155 S205 143, 260 157 S345 126, 400 137 S470 123, 520 115" fill="none" stroke="hsl(154 20% 50%)" strokeWidth="2" />
        {[0, 125, 260, 400, 520].map((x, i) => (
          <circle key={x} cx={x} cy={[139, 116, 119, 86, 46][i]} r="4" fill="hsl(149 65% 26%)" />
        ))}
      </svg>
      <div style={{ position: "absolute", bottom: 8, left: 17, right: 17, display: "flex", justifyContent: "space-between", color: "hsl(155 9% 43%)", fontSize: 9 }}>
        <span>May 01</span><span>May 08</span><span>May 15</span><span>May 22</span><span>May 29</span>
      </div>
    </div>
  );
}
