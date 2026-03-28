import { STATUS_BADGE_MAP } from "../../utils/constants";

export function StatusBadge({ status }) {
  const s = STATUS_BADGE_MAP[(status || "").toLowerCase()] || STATUS_BADGE_MAP.pending;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: s.bg, color: s.color, border: `1.5px solid ${s.border}`,
        fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
        fontFamily: "'Sora',sans-serif", letterSpacing: "0.03em", whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  );
}
