import { Ico } from "./Toast";
import { IC, STATUS_COLORS, RISK_COLORS } from "../../utils/constants";

export function StatusBadge({ status }) {
  const s = STATUS_COLORS[(status || "").toLowerCase()] || STATUS_COLORS.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.fg,
        border: `1.5px solid ${s.bd}`,
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 100,
        fontFamily: "'Sora',sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.fg,
        }}
      />
      {s.label}
    </span>
  );
}

export function RiskBadge({ risk }) {
  const r = RISK_COLORS[(risk || "").toLowerCase()] || RISK_COLORS.low;
  return (
    <span
      className={`risk-${risk}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 700,
        padding: "6px 14px",
        borderRadius: 100,
        fontFamily: "'Sora',sans-serif",
        background: r.bg,
        border: `1.5px solid ${r.bd}`,
        color: r.fg,
      }}
    >
      {r.icon} {r.label}
    </span>
  );
}

export function StatCard({ label, value, icon, color = "#0ea5e9", sub, delay = 0 }) {
  return (
    <div
      className="feature-card no-hover fade-up"
      style={{
        animationDelay: `${delay}ms`,
        "--accent": `linear-gradient(135deg,${color},${color}88)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -28,
          right: -28,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: color,
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `linear-gradient(135deg,${color}20,${color}10)`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          <Ico d={IC[icon] || IC.star} s={18} color={color} />
        </div>
        <span
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: 36,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {value ?? "—"}
      </p>
      {sub && <p style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</p>}
    </div>
  );
}

export function SectionCard({ title, action, children, noPad = false, accent = "#0ea5e9" }) {
  return (
    <div className="feature-card" style={{ "--accent": `linear-gradient(135deg,${accent},${accent}99)` }}>
      {(title || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: noPad ? 0 : 20,
            paddingBottom: noPad ? 16 : 0,
            borderBottom: noPad ? "1.5px solid #f1f5f9" : "none",
          }}
        >
          {title && (
            <h3
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function SLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "'Sora',sans-serif",
        fontSize: 11,
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <SLabel>{label}</SLabel>
      {children}
    </div>
  );
}

export function Inp({ label, ...props }) {
  return (
    <Field label={label}>
      <input className="dash-input" {...props} />
    </Field>
  );
}
