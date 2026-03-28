import { useState, useEffect } from "react";
import { PageLoader } from "../../components/common/PageLoader";
import { Empty } from "../../components/common/Empty";
import { StatusBadge } from "../../components/common/StatusBadge";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatCard } from "../../components/ui/StatCard";
import { Ico, IC } from "../../utils/constants";
import { appointmentApi, predictionApi } from "../../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Overview — Patient dashboard home screen
//
// Props:
//   user  — user profile object
//   onNav — (page) => void
// ─────────────────────────────────────────────────────────────────────────────
export function Overview({ user, onNav }) {
  const [appts,    setAppts]    = useState([]);
  const [lastPred, setLastPred] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const name = user?.first_name || user?.username || "there";

  useEffect(() => {
    (async () => {
      try {
        const [a, p] = await Promise.allSettled([
          appointmentApi.getMyAppointments(),
          predictionApi.getHistory(),
        ]);
        if (a.status === "fulfilled") setAppts(Array.isArray(a.value) ? a.value : a.value?.results || []);
        if (p.status === "fulfilled") {
          const pArr = Array.isArray(p.value) ? p.value : p.value?.results || [];
          if (pArr.length > 0) setLastPred(pArr[0]);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const upcoming = appts.filter((a) =>
    ["pending", "confirmed"].includes((a.status || "").toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* ── Welcome banner ── */}
      <div style={{
        background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
        borderRadius: 20, padding: "28px 32px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="pill-tag" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", marginBottom: 14, display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 2s infinite" }} />
            Patient Portal
          </span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8 }}>
            Hello, {name}! 👋
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Here's your health summary for today.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <button className="cta-primary" onClick={() => onNav("book")} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.4)", boxShadow: "none", color: "#fff", fontSize: 13 }}>
              <Ico d={IC.plus} s={14} color="#fff" /> Book Appointment
            </button>
            <button className="cta-primary" onClick={() => onNav("predict")} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.3)", boxShadow: "none", color: "#fff", fontSize: 13 }}>
              <Ico d={IC.brain} s={14} color="#fff" /> Health Check
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        <StatCard label="Total Appointments" value={appts.length}    icon="calendar" accentColor="#0ea5e9" sub="All time"          delay={0} />
        <StatCard label="Upcoming"           value={upcoming.length} icon="history"  accentColor="#8b5cf6" sub="Pending/Confirmed" delay={60} />
        <StatCard
          label="Completed"
          value={appts.filter((a) => (a.status || "").toLowerCase() === "completed").length}
          icon="check" accentColor="#22c55e" sub="Past sessions" delay={120}
        />
        <StatCard
          label="Last Risk Level"
          value={
            lastPred
              ? lastPred.risk_level?.toUpperCase().slice(0, 1) + lastPred.risk_level?.toLowerCase().slice(1)
              : "None"
          }
          icon="brain" accentColor="#f59e0b"
          sub={lastPred ? new Date(lastPred.created_at).toLocaleDateString() : "No prediction yet"}
          delay={180}
        />
      </div>

      {/* ── Upcoming appointments ── */}
      <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 0 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Upcoming Appointments</h3>
          <button className="cta-ghost" onClick={() => onNav("appointments")} style={{ padding: "7px 14px", fontSize: 12 }}>View All</button>
        </div>
        {upcoming.length === 0
          ? <Empty
              icon="calendar"
              title="No upcoming appointments"
              sub="Book an appointment with a doctor to get started."
              action={
                <button className="cta-primary" onClick={() => onNav("book")} style={{ fontSize: 13 }}>
                  <Ico d={IC.plus} s={13} color="#fff" /> Book Now
                </button>
              }
            />
          : (
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.slice(0, 4).map((a, i) => (
                <div key={a.id || i} className="appt-card fade-up" style={{ animationDelay: `${i * 50}ms`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", border: "2px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#0ea5e9", flexShrink: 0 }}>
                    {(a.doctor_name || "D")[3] || "D"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{a.doctor_name || "Doctor"}</p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 2 }}>📅 {a.appointment_date || "—"} · 🕐 {a.appointment_time || "—"}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* ── Last prediction ── */}
      {lastPred && (
        <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <span className="pill-tag" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", marginBottom: 10, display: "inline-flex" }}>Last Prediction</span>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 8 }}>Health Risk Assessment</h3>
              <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>
                {new Date(lastPred.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
              </p>
            </div>
            <RiskBadge risk={lastPred.risk_level} />
          </div>
          <div style={{ background: "#fafafa", borderRadius: 10, padding: "12px 16px", border: "1.5px solid #f1f5f9" }}>
            <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7 }}>
              {lastPred.prescription || "No prescription available."}
            </p>
          </div>
          <button className="cta-ghost" onClick={() => onNav("history")} style={{ marginTop: 16, fontSize: 13, padding: "8px 16px" }}>
            View All Predictions →
          </button>
        </div>
      )}
    </div>
  );
}
