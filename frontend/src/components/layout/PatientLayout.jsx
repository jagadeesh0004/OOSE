import { Ico } from "../common/Toast";
import { IC, PATIENT_NAV } from "../../utils/constants";

export function PatientSidebar({ active, onNav, collapsed, onToggle, user }) {
  const name = user?.first_name || user?.username || "Patient";

  return (
    <aside
      style={{
        width: collapsed ? 68 : 232,
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1.5px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        zIndex: 20,
        boxShadow: "2px 0 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 66,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1.5px solid #f1f5f9",
          gap: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            flexShrink: 0,
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
          }}
        >
          <Ico d={IC.hospital} s={17} color="#fff" stroke={2} />
        </div>
        {!collapsed && (
          <div>
            <p
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              HealthPredictor
            </p>
            <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>Patient Portal</p>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: 6,
            borderRadius: 8,
            display: "flex",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0ea5e9")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <Ico d={IC.menu} s={16} />
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {PATIENT_NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            className={`sidebar-item ${active === n.id ? "active" : ""}`}
            style={{
              justifyContent: collapsed ? "center" : "flex-start",
              paddingLeft: collapsed ? 0 : 14,
            }}
          >
            <Ico d={IC[n.icon]} s={17} color="currentColor" />
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* User pill */}
      {!collapsed && user && (
        <div style={{ padding: "12px 16px", borderTop: "1.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'Sora',sans-serif",
                boxShadow: "0 3px 10px rgba(139,92,246,0.3)",
              }}
            >
              {name[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </p>
              <p style={{ fontSize: 11.5, color: "#94a3b8" }}>Patient</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function PatientTopbar({ page, user, onLogout }) {
  const label = PATIENT_NAV.find((n) => n.id === page)?.label || "Dashboard";
  const name = user?.first_name || user?.username || "Patient";

  return (
    <header
      style={{
        height: 66,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 17,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </h1>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px",
            borderRadius: 100,
            border: "1.5px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {name[0].toUpperCase()}
          </div>
          <span
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {name}
          </span>
        </div>
        <button
          className="cta-ghost"
          onClick={onLogout}
          style={{ padding: "8px 16px", fontSize: 13 }}
        >
          <Ico d={IC.logout} s={14} /> Logout
        </button>
      </div>
    </header>
  );
}
