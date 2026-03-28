// ── SectionCard — standard dashboard card with optional title and action ──
export function SectionCard({ title, action, children, noPad = false, accent = "#0ea5e9" }) {
  return (
    <div
      className="feature-card"
      style={{ "--accent": `linear-gradient(135deg,${accent},${accent}99)` }}
    >
      {(title || action) && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: noPad ? 0 : 20,
          paddingBottom: noPad ? 16 : 0,
          borderBottom: noPad ? "1.5px solid #f1f5f9" : "none",
        }}>
          {title && (
            <h3 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700,
              color: "#0f172a", letterSpacing: "-0.01em",
            }}>
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
