import { RISK_BADGE_MAP } from "../../utils/constants";

export function RiskBadge({ risk }) {
  const r = RISK_BADGE_MAP[(risk || "").toLowerCase()] || RISK_BADGE_MAP.low;
  return (
    <span
      className={r.cls}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 100,
        fontFamily: "'Sora',sans-serif",
      }}
    >
      {r.icon} {r.label}
    </span>
  );
}
