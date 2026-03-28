import { useState, useEffect } from "react";
import { GLOBAL_CSS, DASHBOARD_BG } from "../styles/globals.css.js";
import { Toaster, toast } from "../components/common/Toaster";
import { Spinner } from "../components/common/Spinner";
import { DashboardSidebar } from "../components/layout/DashboardSidebar";
import { DashboardTopbar } from "../components/layout/DashboardTopbar";
import { Ico, IC, DOCTOR_NAV_ITEMS } from "../utils/constants";
import { doctorApi, authApi } from "../services/api";
import { CreateProfile } from "../modules/doctor/CreateProfile";
import { AvailabilityToggle } from "../modules/doctor/AvailabilityToggle";
import { Overview } from "../modules/doctor/Overview";
import { Profile } from "../modules/doctor/Profile";
import { Slots } from "../modules/doctor/Slots";
import { Appointments } from "../modules/doctor/Appointments";

// ─────────────────────────────────────────────────────────────────────────────
// DoctorDashboard — root shell for the doctor-facing dashboard
//
// Responsibilities:
//   - Auth gate (token check, role check)
//   - Profile existence check (routes to CreateProfile if missing)
//   - Sidebar / Topbar layout
//   - Page routing via `page` state
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const [user]          = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  const [doctor,         setDoctor]        = useState(null);
  const [profileExists,  setProfileExists] = useState(null);
  const [page,           setPage]          = useState("overview");
  const [collapsed,      setCollapsed]     = useState(false);
  const [booting,        setBooting]       = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setBooting(false); return; }
    (async () => {
      try {
        const check = await doctorApi.checkProfile();
        setProfileExists(!!check.exists);
        if (check.exists) {
          const prof = await doctorApi.getMyProfile();
          setDoctor(prof);
        }
      } catch {
        setProfileExists(false);
      }
      setBooting(false);
    })();
  }, []);

  async function logout() {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  const doctorName = doctor?.user?.first_name || doctor?.user?.username || "Doctor";
  const pageLabel  = DOCTOR_NAV_ITEMS.find((n) => n.id === page)?.label || "Dashboard";

  // ── Loading state ──────────────────────────────────────────────────────────
  if (booting) return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: 52, height: 52, borderRadius: 13, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(14,165,233,0.35)", animation: "float 2s ease-in-out infinite" }}>
        <Ico d={IC.hospital} s={26} color="#fff" stroke={2} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 6 }}>HealthPredictor</p>
        <p style={{ fontSize: 13.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>Loading your dashboard…</p>
      </div>
      <Spinner size={28} />
    </div>
  );

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!token) return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign: "center", maxWidth: 380, padding: 48, "--accent": "linear-gradient(135deg,#f59e0b,#d97706)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "1.5px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Ico d={IC.alert} s={26} color="#d97706" />
        </div>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Not Authenticated</h3>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Please log in to access the Doctor Dashboard.</p>
      </div>
    </div>
  );

  // ── Wrong role ─────────────────────────────────────────────────────────────
  if (user && user.user_type !== "doctor") return (
    <div style={{ minHeight: "100vh", background: DASHBOARD_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign: "center", maxWidth: 380, padding: 48, "--accent": "linear-gradient(135deg,#ef4444,#dc2626)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff1f2", border: "1.5px solid #fecdd3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Ico d={IC.alert} s={26} color="#ef4444" />
        </div>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Access Restricted</h3>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>This dashboard is only accessible to doctor accounts.</p>
      </div>
    </div>
  );

  // ── No profile yet — onboarding ────────────────────────────────────────────
  if (profileExists === false) return (
    <>
      <CreateProfile
        onDone={async () => {
          try {
            const prof = await doctorApi.getMyProfile();
            setDoctor(prof);
            setProfileExists(true);
          } catch (err) {
            toast(err.message, "error");
          }
        }}
      />
      <Toaster />
    </>
  );

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: DASHBOARD_BG, fontFamily: "'DM Sans',sans-serif", color: "#0f172a" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      <DashboardSidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        navItems={DOCTOR_NAV_ITEMS}
        name={doctorName}
        subtitle="Doctor Dashboard"
        avatarGradient="linear-gradient(135deg,#0ea5e9,#0284c7)"
        roleBadge={doctor?.specialization || "Physician"}
        displayPrefix="Dr. "
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>
        <DashboardTopbar
          pageLabel={pageLabel}
          name={doctorName}
          displayPrefix="Dr. "
          avatarGradient="linear-gradient(135deg,#0ea5e9,#0284c7)"
          onLogout={logout}
          rightExtra={
            doctor ? (
              <AvailabilityToggle doctor={doctor} onUpdate={setDoctor} compact />
            ) : null
          }
        />

        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {page === "overview"     && <Overview     doctor={doctor} />}
          {page === "profile"      && <Profile      doctor={doctor} onUpdate={setDoctor} />}
          {page === "slots"        && <Slots />}
          {page === "appointments" && <Appointments />}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
