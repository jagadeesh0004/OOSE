import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { StatCard, SectionCard, StatusBadge } from "../../../components/common/UI";

export function DoctorOverview({ doctor, onNav }) {
  const [appts, setAppts] = useState([]);
  const [todayAppts, setTodayAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/appointments/doctor-appointments/");
        const appointmentList = Array.isArray(data) ? data : data?.results || [];
        setAppts(appointmentList);

        // Filter today's appointments
        const today = new Date().toISOString().split("T")[0];
        const today_appts = appointmentList.filter((a) => a.appointment_date === today);
        setTodayAppts(today_appts);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const upcoming = appts.filter((a) => ["pending", "confirmed"].includes((a.status || "").toLowerCase()));
  const completed = appts.filter((a) => (a.status || "").toLowerCase() === "completed");

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
          borderRadius: 20,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            className="pill-tag"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              marginBottom: 14,
              display: "inline-flex",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                animation: "pulse 2s infinite",
              }}
            />
            Doctor Portal
          </span>
          <h2
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            Hello, Dr. {doctor?.user?.first_name}! 👋
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            {todayAppts.length} appointments today
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <button
              className="cta-primary"
              onClick={() => onNav("appointments")}
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                boxShadow: "none",
                color: "#fff",
                fontSize: 13,
              }}
            >
              <Ico d={IC.calendar} s={14} color="#fff" /> View Appointments
            </button>
            <button
              className="cta-primary"
              onClick={() => onNav("slots")}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                boxShadow: "none",
                color: "#fff",
                fontSize: 13,
              }}
            >
              <Ico d={IC.plus} s={14} color="#fff" /> Manage Slots
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 14,
        }}
      >
        <StatCard label="Total Appointments" value={appts.length} icon="hospital" color="#0ea5e9" sub="All time" delay={0} />
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          icon="clock"
          color="#8b5cf6"
          sub="Pending/Confirmed"
          delay={60}
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon="check"
          color="#22c55e"
          sub="Finished sessions"
          delay={120}
        />
        <StatCard
          label="Consultation Fee"
          value={doctor?.consultation_fee ? `₹${doctor.consultation_fee}` : "—"}
          icon="star"
          color="#f59e0b"
          sub="Per appointment"
          delay={180}
        />
      </div>

      {/* Today's Schedule */}
      <SectionCard
        title="Today's Schedule"
        action={<button className="cta-ghost" onClick={() => onNav("appointments")} style={{ padding: "7px 14px", fontSize: 12 }}>View All</button>}
        noPad
        accent="#0ea5e9"
      >
        {todayAppts.length === 0 ? (
          <div style={{ padding: "40px 20px" }}>
            <Empty icon="calendar" title="No appointments today" sub="Your schedule is free!" />
          </div>
        ) : (
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {todayAppts.map((a, i) => (
              <div
                key={a.id || i}
                className="appt-card fade-up"
                style={{
                  animationDelay: `${i * 50}ms`,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0ea5e9",
                    fontFamily: "'Sora',sans-serif",
                    minWidth: 50,
                  }}
                >
                  {a.appointment_time}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {a.patient_name || "Patient"}
                  </p>
                  <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 2 }}>
                    {a.symptoms || "No symptoms noted"}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
        }}
      >
        <button
          className="feature-card"
          onClick={() => onNav("profile")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <Ico d={IC.edit} s={20} color="#0ea5e9" />
          <div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Edit Profile
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Update info</p>
          </div>
        </button>
        <button
          className="feature-card"
          onClick={() => onNav("appointments")}
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <Ico d={IC.calendar} s={20} color="#8b5cf6" />
          <div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Appointments
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Manage all</p>
          </div>
        </button>
      </div>
    </div>
  );
}
