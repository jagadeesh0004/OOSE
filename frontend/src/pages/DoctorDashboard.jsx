import { useState, useEffect } from "react";
import { DoctorSidebar, DoctorTopbar } from "../components/layout/DoctorLayout";
import { Toaster, Ico } from "../components/common/Toast";
import { PageLoader, Spinner } from "../components/common/Toast";
import { Empty } from "../components/common/Toast";
import { api } from "../services/api";
import { IC } from "../utils/constants";

// Import doctor page modules
import { DoctorOverview } from "../modules/doctor/pages/Overview";
import { DoctorProfile } from "../modules/doctor/pages/Profile";
import { DoctorSlots } from "../modules/doctor/pages/Slots";
import { DoctorAppointments } from "../modules/doctor/pages/Appointments";
import { DoctorCreateProfile } from "../modules/doctor/pages/CreateProfile";

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@300;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body { font-family:'DM Sans','Segoe UI',sans-serif; background:#fff; color:#0f172a; }
  input,select,textarea,button { font-family:'DM Sans',sans-serif; }

  .cta-primary {
    background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff;
    font-family:'Sora',sans-serif; font-weight:700; font-size:14px;
    padding:11px 24px; border-radius:10px; border:none; cursor:pointer;
    transition:all 0.2s; box-shadow:0 4px 20px rgba(14,165,233,0.28);
    letter-spacing:0.01em; display:inline-flex; align-items:center; gap:7px;
  }
  .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(14,165,233,0.38); }
  .cta-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  .cta-ghost {
    background:transparent; color:#0f172a;
    font-family:'Sora',sans-serif; font-weight:600; font-size:14px;
    padding:11px 24px; border-radius:10px;
    border:1.5px solid #e2e8f0; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .cta-ghost:hover { border-color:#0ea5e9; color:#0ea5e9; background:rgba(14,165,233,0.04); }
  .cta-ghost:disabled { opacity:0.6; cursor:not-allowed; }

  .cta-danger {
    background:transparent; color:#ef4444;
    font-family:'Sora',sans-serif; font-weight:600; font-size:13px;
    padding:9px 18px; border-radius:10px;
    border:1.5px solid #fecaca; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:6px;
  }
  .cta-danger:hover { background:#fef2f2; border-color:#ef4444; }
  .cta-danger:disabled { opacity:0.6; cursor:not-allowed; }

  .feature-card {
    background:#ffffff; border:1.5px solid #f1f5f9; border-radius:18px;
    padding:28px; transition:all 0.3s; position:relative; overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,0.04);
  }
  .feature-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:var(--accent,linear-gradient(135deg,#0ea5e9,#0284c7));
    opacity:0; transition:opacity 0.3s;
  }
  .feature-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.09); border-color:#e2e8f0; transform:translateY(-3px); }
  .feature-card:hover::before { opacity:1; }
  .feature-card.no-hover:hover { transform:none; box-shadow:0 2px 12px rgba(0,0,0,0.04); border-color:#f1f5f9; }
  .feature-card.no-hover::before { display:none; }

  .pill-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.2);
    color:#0ea5e9; font-family:'Sora',sans-serif; font-size:10px;
    font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    padding:5px 12px; border-radius:100px;
  }

  .sidebar-item {
    display:flex; align-items:center; gap:11px;
    padding:10px 14px; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    color:#64748b; cursor:pointer; transition:all 0.18s;
    border:none; background:none; width:100%; text-align:left;
    white-space:nowrap; overflow:hidden; border-left:3px solid transparent;
  }
  .sidebar-item:hover { background:#f0f9ff; color:#0ea5e9; }
  .sidebar-item.active {
    background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(2,132,199,0.06));
    color:#0ea5e9; font-weight:600; border-left:3px solid #0ea5e9;
  }

  .appt-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:14px;
    padding:18px 22px; transition:all 0.22s;
    box-shadow:0 1px 6px rgba(0,0,0,0.04);
  }
  .appt-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); border-color:#e2e8f0; transform:translateY(-2px); }

  .doctor-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:16px;
    padding:22px; transition:all 0.25s; cursor:pointer;
    box-shadow:0 2px 10px rgba(0,0,0,0.04); position:relative; overflow:hidden;
  }
  .doctor-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(135deg,#0ea5e9,#0284c7); opacity:0; transition:opacity 0.25s;
  }
  .doctor-card:hover { box-shadow:0 10px 32px rgba(14,165,233,0.14); border-color:#bae6fd; transform:translateY(-3px); }
  .doctor-card:hover::before { opacity:1; }
  .doctor-card.selected { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,0.15); }
  .doctor-card.selected::before { opacity:1; }

  .slot-chip {
    padding:9px 16px; border-radius:10px; border:1.5px solid #e2e8f0;
    font-family:'Sora',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.18s; background:#fff; color:#475569;
    text-align:center;
  }
  .slot-chip:hover:not(.taken) { border-color:#0ea5e9; color:#0ea5e9; background:#f0f9ff; }
  .slot-chip.selected { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; border-color:transparent; box-shadow:0 3px 12px rgba(14,165,233,0.3); }
  .slot-chip.taken { background:#f8fafc; color:#cbd5e1; cursor:not-allowed; border-color:#f1f5f9; }

  .dash-input {
    width:100%; background:#fff; border:1.5px solid #e2e8f0;
    color:#0f172a; border-radius:10px; padding:10px 14px; font-size:14px;
    font-family:'DM Sans',sans-serif; transition:border-color 0.18s, box-shadow 0.18s; outline:none;
  }
  .dash-input:focus { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,0.1); }
  select.dash-input option { background:#fff; color:#0f172a; }

  .risk-low    { background:#f0fdf4; border:1.5px solid #bbf7d0; color:#16a34a; }
  .risk-medium { background:#fffbeb; border:1.5px solid #fde68a; color:#d97706; }
  .risk-high   { background:#fff1f2; border:1.5px solid #fecdd3; color:#dc2626; }

  .grid-bg-light {
    position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none; z-index:0;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes toastIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .fade-up { animation:fadeUp 0.45s ease both; }
  .float-card { animation:float 3.5s ease-in-out infinite; }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   PAGE ROUTES DEFINITION
═══════════════════════════════════════════════════════════════════════ */
const PAGES = {
  overview: { label: "Overview", component: DoctorOverview },
  profile: { label: "My Profile", component: DoctorProfile },
  slots: { label: "Manage Slots", component: DoctorSlots },
  appointments: { label: "Appointments", component: DoctorAppointments },
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN DOCTOR DASHBOARD ORCHESTRATOR
═══════════════════════════════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [currentPage, setCurrentPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [booting, setBooting] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const token = localStorage.getItem("token");
  const BG = "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)";

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }
    api("/doctors/profile/")
      .then((u) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        // Check if doctor profile is completed
        if (u.profile_completed === false || u.profile_created === false) {
          setShowOnboarding(true);
          setCurrentPage("profile");
        }
      })
      .catch(() => {})
      .finally(() => setBooting(false));
  }, []);

  async function logout() {
    try {
      await api("/accounts/logout/", { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  // Loading state
  if (booting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <style>{GLOBAL_CSS}</style>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 28px rgba(14,165,233,0.35)",
            animation: "float 2s ease-in-out infinite",
          }}
        >
          <Ico d={IC.hospital} s={26} color="#fff" stroke={2} />
        </div>
        <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
          HealthPredictor
        </p>
        <Spinner size={28} />
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{GLOBAL_CSS}</style>
        <div
          className="feature-card"
          style={{
            textAlign: "center",
            maxWidth: 380,
            padding: 48,
            "--accent": "linear-gradient(135deg,#f59e0b,#d97706)",
          }}
        >
          <Ico d={IC.alert} s={40} color="#d97706" />
          <br />
          <br />
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Not Authenticated
          </h3>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.6 }}>
            Please log in to access the Doctor Dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Access restricted
  if (user && user.user_type !== "doctor") {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{GLOBAL_CSS}</style>
        <div
          className="feature-card"
          style={{
            textAlign: "center",
            maxWidth: 380,
            padding: 48,
            "--accent": "linear-gradient(135deg,#ef4444,#dc2626)",
          }}
        >
          <Ico d={IC.alert} s={40} color="#ef4444" />
          <br />
          <br />
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Access Restricted
          </h3>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.6 }}>
            This dashboard is for doctor accounts only.
          </p>
        </div>
      </div>
    );
  }

  // Show onboarding for new doctors
  if (showOnboarding) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{GLOBAL_CSS}</style>
        <div style={{ width: "100%", maxWidth: 600 }}>
          <DoctorCreateProfile
            user={user}
            onComplete={() => {
              setShowOnboarding(false);
              setCurrentPage("overview");
            }}
          />
        </div>
      </div>
    );
  }

  // Get current page component
  const PageComponent = PAGES[currentPage]?.component;

  // Main dashboard render
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: BG,
        fontFamily: "'DM Sans',sans-serif",
        color: "#0f172a",
      }}
    >
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light" />

      {/* Sidebar */}
      <DoctorSidebar
        active={currentPage}
        onNav={setCurrentPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        user={user}
      />

      {/* Main content area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Topbar */}
        <DoctorTopbar page={currentPage} user={user} onLogout={logout} />

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {PageComponent ? (
            <PageComponent
              onNav={setCurrentPage}
              user={user}
              onUserUpdate={(u) => {
                setUser(u);
                localStorage.setItem("user", JSON.stringify(u));
              }}
            />
          ) : (
            <Empty icon="alert" title="Page not found" sub="The requested page does not exist." />
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
