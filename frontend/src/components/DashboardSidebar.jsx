import { Ico } from "../utils/icons";
import { IC } from "../utils/constants";

// ─────────────────────────────────────────────────────────────────────────────
// DashboardSidebar
//
// Props:
//   active        — current page id
//   onNav         — (id) => void
//   collapsed     — boolean
//   onToggle      — () => void
//   navItems      — array of { id, label, icon }
//   name          — display name (string)
//   subtitle      — e.g. "Doctor Dashboard" | "Patient Portal"
//   avatarGradient— CSS gradient string for the avatar bubble
//   roleBadge     — e.g. "Cardiology" | "Patient"
//   displayPrefix — e.g. "Dr. " | ""
// ─────────────────────────────────────────────────────────────────────────────
export function DashboardSidebar({
  active = "",
  onNav = () => {},
  collapsed = false,
  onToggle = () => {},
  navItems = [],
  name = "",
  subtitle = "",
  avatarGradient = "linear-gradient(135deg,#0ea5e9,#0284c7)",
  roleBadge = "",
  displayPrefix = "",
}) {
  const initial = (name || "U")[0].toUpperCase();

  return (
    <aside
      style={{
        width: collapsed ? 68 : 230,
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1.5px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        position: "relative",
        zIndex: 20,
        boxShadow: "2px 0 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        height: 66,
        display: "flex", alignItems: "center",
        padding: collapsed ? "0 18px" : "0 20px",
        borderBottom: "1.5px solid #f1f5f9",
        gap: 10, overflow: "hidden",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
        }}>
          <Ico d={IC.hospital} s={17} color="#fff" stroke={2} />
        </div>

        {!collapsed && (
          <div>
            <p style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15,
              color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>
              HealthPredictor
            </p>
            <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>
              {subtitle}
            </p>
          </div>
        )}

        <button
          onClick={onToggle}
          style={{
            marginLeft: "auto", background: "none", border: "none",
            color: "#94a3b8", cursor: "pointer", padding: 6, borderRadius: 8,
            display: "flex", flexShrink: 0, transition: "all 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0ea5e9")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <Ico d={IC.menu} s={16} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav style={{
        flex: 1, padding: "14px 10px",
        display: "flex", flexDirection: "column", gap: 3,
      }}>
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            className={`sidebar-item ${active === n.id ? "active" : ""}`}
            style={{
              justifyContent: collapsed ? "center" : "flex-start",
              paddingLeft: collapsed ? 0 : 14,
              borderLeft: active === n.id ? "3px solid #0ea5e9" : "3px solid transparent",
            }}
          >
            <Ico d={IC[n.icon]} s={17} color="currentColor" />
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* ── User pill ── */}
      {!collapsed && name && (
        <div style={{ padding: "14px 16px", borderTop: "1.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: avatarGradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
              fontFamily: "'Sora',sans-serif",
              boxShadow: "0 3px 10px rgba(14,165,233,0.3)",
            }}>
              {initial}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{
                fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700,
                color: "#0f172a", whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {displayPrefix}{name}
              </p>
              <p style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>
                {roleBadge}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
