import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty, toast, Spinner } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { StatusBadge, SectionCard } from "../../../components/common/UI";

export function PatientMyAppointments({ user }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [canceling, setCanceling] = useState(null);

  const fetchAppts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/appointments/my-appointments/");
      setAppts(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppts();
  }, [fetchAppts]);

  const filtered = appts.filter((a) => {
    if (filter === "all") return true;
    return (a.status || "").toLowerCase() === filter.toLowerCase();
  });

  const handleCancel = useCallback(
    async (Id) => {
      if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
      setCanceling(Id);
      try {
        await api(`/appointments/cancel/`, { method: "POST", body: JSON.stringify({ appointment_id: Id }) });
        toast("Appointment cancelled", "success");
        await fetchAppts();
      } catch (err) {
        toast(err.message, "error");
      }
      setCanceling(null);
    },
    [fetchAppts]
  );

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? "stat-chip" : "pill-tag"}
            style={{
              background: filter === s ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#f8fafc",
              color: filter === s ? "#fff" : "#475569",
              border: filter === s ? "none" : "1.5px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: 13,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {s === "all" ? "All Appointments" : s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <Empty icon="calendar" title="No appointments found" sub="Book your first appointment with a doctor." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a, i) => (
            <div
              key={a.id || i}
              className="appt-card fade-up"
              style={{
                animationDelay: `${i * 50}ms`,
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap: 16,
                alignItems: "center",
              }}
            >
              {/* Doctor avatar */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
                  border: "2px solid #bae6fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#0ea5e9",
                  flexShrink: 0,
                }}
              >
                {(a.doctor_name || "D")[0] || "D"}
              </div>

              {/* Info */}
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {a.doctor_name || "Doctor"}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginTop: 4,
                  }}
                >
                  📅 {a.appointment_date || "—"} · 🕐 {a.appointment_time || "—"}
                </p>
                {a.notes && (
                  <p
                    style={{
                      fontSize: 12.5,
                      color: "#94a3b8",
                      marginTop: 6,
                      fontStyle: "italic",
                    }}
                  >
                    📝 {a.notes}
                  </p>
                )}
              </div>

              {/* Status & Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <StatusBadge status={a.status} />
                {["pending", "confirmed"].includes((a.status || "").toLowerCase()) && (
                  <button
                    onClick={() => handleCancel(a.id)}
                    disabled={canceling === a.id}
                    className="cta-danger"
                    style={{
                      padding: "7px 14px",
                      fontSize: 12,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      opacity: canceling === a.id ? 0.6 : 1,
                    }}
                  >
                    {canceling === a.id ? <Spinner size={12} color="#fff" /> : <Ico d={IC.trash} s={12} color="#fff" />}
                    {canceling === a.id ? "..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
