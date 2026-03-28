import { Ico, IC } from "../../utils/constants";

export function StatCard({ label, value, icon, accentColor = "#0ea5e9", sub, delay = 0 }) {
  return (
    <div
      className="stat-chip"
      style={{ animationDelay: `${delay}ms`, "--accent": accentColor }}
    >
      {/* Decorative bubble */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 90, height: 90, borderRadius: "50%",
        background: accentColor, opacity: 0.07, pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `linear-gradient(135deg,${accentColor}20,${accentColor}10)`,
          border: `1px solid ${accentColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor,
        }}>
          <Ico d={IC[icon] || IC.star} s={18} color={accentColor} />
        </div>
        <span style={{
          fontFamily: "'Sora',sans-serif", fontSize: 10, fontWeight: 700,
          color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase",
          marginTop: 4,
        }}>
          {label}
        </span>
      </div>

      <p style={{
        fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800,
        lineHeight: 1, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 6,
      }}>
        {value ?? "—"}
      </p>

      {sub && (
        <p style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
