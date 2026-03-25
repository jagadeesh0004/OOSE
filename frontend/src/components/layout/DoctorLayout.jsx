import { useState } from "react";
import { Ico, Spinner, toast } from "../common/Toast";
import { IC, DOCTOR_NAV } from "../../utils/constants";
import { api } from "../../services/api";

export function DoctorSidebar({ active, onNav, collapsed, onToggle, doctor }) {
  const name = doctor?.user?.first_name || doctor?.user?.username || "Doctor";
  const initial = name[0].toUpperCase();

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
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 10.5,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Doctor Dashboard
            </p>
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
            transition: "all 0.15s",
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
          gap: 3,
        }}
      >
        {DOCTOR_NAV.map((n) => (
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

      {/* Doctor pill */}
      {!collapsed && doctor && (
        <div style={{ padding: "14px 16px", borderTop: "1.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              {initial}
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
                Dr. {name}
              </p>
              <p
                style={{
                  fontSize: 11.5,
                  color: "#94a3b8",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {doctor.specialization || "Physician"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function DoctorTopbar({ page, doctor, onUpdate, onLogout }) {
  const pageLabel = DOCTOR_NAV.find((n) => n.id === page)?.label || "Dashboard";
  const name = doctor?.user?.first_name || doctor?.user?.username || "Doctor";
  const initial = name[0].toUpperCase();

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
          {pageLabel}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            fontFamily: "'DM Sans',sans-serif",
            marginTop: 1,
          }}
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {doctor && <AvailabilityToggle doctor={doctor} onUpdate={onUpdate} compact />}

        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 12px",
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
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {initial}
          </div>
          <span
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Dr. {name}
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

export function AvailabilityToggle({ doctor, onUpdate, compact = false }) {
  const [loading, setLoading] = useState(false);
  const avail = doctor?.is_available ?? false;

  async function toggle() {
    if (!doctor || loading) return;
    const next = !avail;
    onUpdate({ ...doctor, is_available: next });
    setLoading(true);
    try {
      const updated = await api("/doctors/update-profile/", {
        method: "PATCH",
        body: { is_available: next },
      });
      onUpdate(updated);
      toast(
        `You are now ${updated.is_available ? "available for bookings" : "unavailable"}`,
        "success"
      );
    } catch (err) {
      onUpdate({ ...doctor, is_available: avail });
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 16px 7px 12px",
          borderRadius: 100,
          background: avail ? "#f0fdf4" : "#f8fafc",
          border: `1.5px solid ${avail ? "#bbf7d0" : "#e2e8f0"}`,
          color: avail ? "#16a34a" : "#64748b",
          cursor: loading ? "wait" : "pointer",
          fontSize: 13,
          fontFamily: "'Sora',sans-serif",
          fontWeight: 700,
          transition: "all 0.2s",
        }}
      >
        {loading ? (
          <Spinner size={12} color={avail ? "#16a34a" : "#94a3b8"} />
        ) : (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: avail ? "#16a34a" : "#94a3b8",
              animation: avail ? "pulse 2s infinite" : "none",
            }}
          />
        )}
        {avail ? "Available" : "Offline"}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button
        onClick={toggle}
        className="toggle-track"
        style={{
          background: avail ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#e2e8f0",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        <div
          className="toggle-knob"
          style={{
            left: avail ? 24 : 4,
          }}
        />
      </button>
      <div>
        <p
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: avail ? "#16a34a" : "#64748b",
          }}
        >
          {avail ? "Accepting Appointments" : "Not Available"}
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
          {loading ? "Updating…" : "Toggle to change your availability instantly"}
        </p>
      </div>
    </div>
  );
}
