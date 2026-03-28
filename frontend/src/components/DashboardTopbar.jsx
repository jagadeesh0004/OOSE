import { Ico } from "../utils/icons";
import { IC } from "../utils/constants";

// ─────────────────────────────────────────────────────────────────────────────
// DashboardTopbar
//
// Props:
//   pageLabel       — string, current page label
//   name            — display name
//   displayPrefix   — e.g. "Dr. " | ""
//   avatarGradient  — CSS gradient for avatar circle
//   onLogout        — () => void
//   rightExtra      — optional JSX inserted between avatar and logout (e.g. AvailabilityToggle)
// ─────────────────────────────────────────────────────────────────────────────
export function DashboardTopbar({
  pageLabel,
  name,
  displayPrefix = "",
  avatarGradient = "linear-gradient(135deg,#0ea5e9,#0284c7)",
  onLogout,
  rightExtra,
}) {
  const initial = (name || "U")[0].toUpperCase();

  return (
    <header
      style={{
        height: 66,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", flexShrink: 0,
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Left — page title + date ── */}
      <div>
        <h1 style={{
          fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800,
          color: "#0f172a", letterSpacing: "-0.02em",
        }}>
          {pageLabel}
        </h1>
        <p style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", marginTop: 1 }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* ── Right — optional extra, avatar, logout ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {rightExtra}

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 12px", borderRadius: 100,
          border: "1.5px solid #f1f5f9", background: "#fafafa",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: avatarGradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#fff",
            fontFamily: "'Sora',sans-serif",
          }}>
            {initial}
          </div>
          <span style={{
            fontFamily: "'Sora',sans-serif", fontSize: 13,
            fontWeight: 700, color: "#0f172a",
          }}>
            {displayPrefix}{name}
          </span>
        </div>

        <button
          className="cta-ghost"
          onClick={onLogout}
          style={{ padding: "8px 18px", fontSize: 13 }}
        >
          <Ico d={IC.logout} s={14} /> Logout
        </button>
      </div>
    </header>
  );
}
