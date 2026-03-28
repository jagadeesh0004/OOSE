import { useState, useEffect } from "react";
import { GLOBAL_CSS, DASHBOARD_BG } from "../styles/globals.css.js";
import { Toaster } from "../components/common/Toaster";
import { Spinner } from "../components/common/Spinner";
import { DashboardSidebar } from "../components/layout/DashboardSidebar";
import { DashboardTopbar } from "../components/layout/DashboardTopbar";
import { Ico, IC, PATIENT_NAV_ITEMS } from "../utils/constants";
import { authApi } from "../services/api";
import { Overview } from "../modules/patient/Overview";
import { MyAppointments } from "../modules/patient/MyAppointments";
import { BookAppointment } from "../modules/patient/BookAppointment";
import { Prediction } from "../modules/patient/Prediction";
import { PredictionHistory } from "../modules/patient/PredictionHistory";
import { Profile } from "../modules/patient/Profile";

// ─────────────────────────────────────────────────────────────────────────────
// PatientDashboard — root shell for the patient-facing dashboard
//
// Responsibilities:
//   - Auth gate (token check, role check)
//   - Fetches and keeps user profile fresh
//   - Sidebar / Topbar layout
//   - Page routing via `page` state
// ─────────────────────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const [user,      setUser]      = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  const [page,      setPage]      = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [booting,   setBooting]   = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setBooting(false); return; }
    authApi.getProfile()
      .then((u) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {})
      .finally(() => setBooting(false));
  }, []);

  async function logout() {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  const patientName = user?.first_name || user?.username || "Patient";
  const pageLabel   = PATIENT_NAV_ITEMS.find((n) => n.id === page)?.label || "Dashboard";

  // ── Loading state ──────────────────────────────────────────────────────────
  if (booting) return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: 52, height: 52, borderRadius: 13, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(14,165,233,0.35)", animation: "float 2s ease-in-out infinite" }}>
        <Ico d={IC.hospital} s={26} color="#fff" stroke={2} />
      </div>
      <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0f172a" }}>HealthPredictor</p>
      <Spinner size={28} />
    </div>
  );

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!token) return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign: "center", maxWidth: 380, padding: 48, "--accent": "linear-gradient(135deg,#f59e0b,#d97706)" }}>
        <Ico d={IC.alert} s={40} color="#d97706" /><br /><br />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Not Authenticated</h3>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.6 }}>Please log in to access the Patient Dashboard.</p>
      </div>
    </div>
  );

  // ── Wrong role ─────────────────────────────────────────────────────────────
  if (user && user.user_type !== "patient") return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign: "center", maxWidth: 380, padding: 48, "--accent": "linear-gradient(135deg,#ef4444,#dc2626)" }}>
        <Ico d={IC.alert} s={40} color="#ef4444" /><br /><br />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Access Restricted</h3>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.6 }}>This dashboard is for patient accounts only.</p>
      </div>
    </div>
  );

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: DASHBOARD_BG, fontFamily: "'DM Sans',sans-serif", color: "#0f172a" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light" />

      <DashboardSidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        navItems={PATIENT_NAV_ITEMS}
        name={patientName}
        subtitle="Patient Portal"
        avatarGradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
        roleBadge="Patient"
        displayPrefix=""
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>
        <DashboardTopbar
          pageLabel={pageLabel}
          name={patientName}
          displayPrefix=""
          avatarGradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
          onLogout={logout}
        />

        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {page === "overview"      && <Overview      user={user} onNav={setPage} />}
          {page === "appointments"  && <MyAppointments onNav={setPage} />}
          {page === "book"          && <BookAppointment onNav={setPage} />}
          {page === "predict"       && <Prediction    onNav={setPage} />}
          {page === "history"       && <PredictionHistory onNav={setPage} />}
          {page === "profile"       && (
            <Profile
              user={user}
              onUserUpdate={(u) => {
                setUser(u);
                localStorage.setItem("user", JSON.stringify(u));
              }}
            />
          )}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
