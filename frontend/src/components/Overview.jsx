import { useState, useEffect } from "react";
import { PageLoader } from "./PageLoader";
import { Empty } from "./Empty";
import { StatusBadge } from "./StatusBadge";
import { StatCard } from "./StatCard";
import { SectionCard } from "./SectionCard";
import { appointmentApi, predictionApi } from "../services/api";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview — Dashboard home screen (Doctor or Patient)
//
// Props:
//   doctor — doctor profile object (for doctor view)
//   user   — user profile object (for patient view)
//   onNav  — navigation callback (for patient view)
// ─────────────────────────────────────────────────────────────────────────────
export function Overview({ doctor, user, onNav }) {
  const isDoctor = !!doctor;
  const isPatient = !!user && !doctor;
  
  const [stats, setStats]      = useState({ all: null, today: null, upcoming: null, predictions: null });
  const [todayAppts, setToday] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (isDoctor) {
          const [all, today, upcoming] = await Promise.allSettled([
            appointmentApi.getDoctorAppointments(),
            appointmentApi.getDoctorToday(),
            appointmentApi.getUpcoming(),
          ]);
          const toArr = (r) =>
            r.status === "fulfilled"
              ? Array.isArray(r.value) ? r.value : r.value?.results || []
              : [];
          const a = toArr(all), t = toArr(today), u = toArr(upcoming);
          setStats({ all: a.length, today: t.length, upcoming: u.length, predictions: null });
          setToday(t.slice(0, 5));
        } else if (isPatient) {
          const [appts, preds] = await Promise.allSettled([
            appointmentApi.getMyAppointments(),
            predictionApi.getHistory(),
          ]);
          const apptArr = appts.status === "fulfilled" ? (Array.isArray(appts.value) ? appts.value : appts.value?.results || []) : [];
          const predArr = preds.status === "fulfilled" ? (Array.isArray(preds.value) ? preds.value : preds.value?.results || []) : [];
          const upcoming = apptArr.filter((a) => ["pending", "confirmed"].includes((a.status || "").toLowerCase()));
          const completed = apptArr.filter((a) => (a.status || "").toLowerCase() === "completed");
          setStats({ all: apptArr.length, today: completed.length, upcoming: upcoming.length, predictions: predArr.length });
          setToday(upcoming.slice(0, 5));
        }
      } catch {}
      setLoading(false);
    })();
  }, [isDoctor, isPatient]);


  if (loading) return <PageLoader />;

  if (isPatient) {
    const patientName = user?.first_name || user?.username || "there";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22, animation: "fadeUp 0.4s ease" }}>
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
              Hello, {patientName}! 👋
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              Here's your health summary for today.
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          <StatCard label="Total Appointments" value={stats.all}    icon="calendar" accentColor="#0ea5e9" sub="All time"          delay={0} />
          <StatCard label="Upcoming"           value={stats.upcoming} icon="history"  accentColor="#8b5cf6" sub="Pending/Confirmed" delay={60} />
          <StatCard label="Completed"         value={stats.today}  icon="check" accentColor="#22c55e" sub="Past sessions" delay={120} />
          <StatCard label="Total Predictions" value={stats.predictions} icon="brain" accentColor="#f59e0b" sub="Health checks" delay={180} />
        </div>

        {/* ── Upcoming appointments ── */}
        <SectionCard
          title="Upcoming Appointments"
          accent="#0ea5e9"
          action={todayAppts.length > 0 && <span className="pill-tag" style={{ fontSize: 11 }}>{todayAppts.length} appointment{todayAppts.length !== 1 ? "s" : ""}</span>}
        >
          {todayAppts.length === 0
            ? <Empty icon="calendar" title="No upcoming appointments" sub="Book an appointment with a doctor to get started." />
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                {todayAppts.map((a, i) => (
                  <div key={a.id || i} className="appt-card" style={{ animationDelay: `${i * 50}ms` }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, color: "#0ea5e9",
                    }}>
                      {(String(a.doctor_name || "D")[0] || "D").toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        {a.doctor_name || "Doctor"}
                      </p>
                      <p style={{ fontSize: 12.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>
                        📅 {a.appointment_date || "—"} · 🕐 {a.appointment_time || "—"}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )
          }
        </SectionCard>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, animation: "fadeUp 0.4s ease" }}>

      {/* ── Welcome banner ── */}
      <div style={{
        background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
        borderRadius: 20, padding: "28px 32px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="pill-tag" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", marginBottom: 12, display: "inline-flex" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 2s infinite" }} />
              Good {greeting()}
            </span>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Dr. {doctor?.user?.first_name || doctor?.user?.username || "Doctor"} 👋
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>
              {doctor?.specialization} · {doctor?.hospital_name}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["Today", stats.today, "📅"], ["Upcoming", stats.upcoming, "⏳"]].map(([l, v, emoji]) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)",
                borderRadius: 14, padding: "14px 20px", textAlign: "center",
                border: "1.5px solid rgba(255,255,255,0.25)", minWidth: 90,
              }}>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {v ?? "—"}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>
                  {emoji} {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 16 }}>
        <StatCard label="Total Appointments" value={stats.all}      icon="calendar" accentColor="#0ea5e9" sub="All time"        delay={0} />
        <StatCard label="Today's Schedule"   value={stats.today}    icon="clock"    accentColor="#22c55e" sub="Scheduled today" delay={60} />
        <StatCard label="Upcoming"           value={stats.upcoming} icon="calendar" accentColor="#f59e0b" sub="Future bookings" delay={120} />
        <StatCard
          label="Consult Fee"
          value={doctor ? `₹${doctor.consultation_fee}` : "—"}
          icon="star" accentColor="#8b5cf6" sub="Per session" delay={180}
        />
      </div>

      {/* ── Today's appointments ── */}
      <SectionCard
        title="Today's Schedule"
        accent="#0ea5e9"
        action={
          <span className="pill-tag" style={{ fontSize: 11 }}>
            {todayAppts.length} appointment{todayAppts.length !== 1 ? "s" : ""}
          </span>
        }
      >
        {todayAppts.length === 0
          ? <Empty icon="calendar" title="All clear for today" sub="No appointments scheduled. Enjoy your day!" />
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {todayAppts.map((a, i) => (
                <div key={a.id || i} className="appt-card" style={{ animationDelay: `${i * 50}ms` }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, color: "#0ea5e9",
                  }}>
                    {(String(a.patient_details?.first_name || a.patient_details?.username || a.patient_name || a.patient || "P"))[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      {a.patient_details?.first_name || a.patient_details?.username || a.patient_name || a.patient || "Patient"}
                    </p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>
                      🕐 {a.slot_start_time && a.slot_end_time ? `${a.slot_start_time} – ${a.slot_end_time}` : (a.appointment_time || a.time || "—")}
                    </p>
                  </div>
                  <StatusBadge status={a.status || "pending"} />
                </div>
              ))}
            </div>
          )
        }
      </SectionCard>
    </div>
  );
}
