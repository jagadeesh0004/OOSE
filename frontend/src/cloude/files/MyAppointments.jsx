import { useState, useEffect, useCallback } from "react";
import { PageLoader } from "../../components/common/PageLoader";
import { Empty } from "../../components/common/Empty";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Spinner } from "../../components/common/Spinner";
import { Field } from "../../components/ui/Field";
import { Ico, IC } from "../../utils/constants";
import { appointmentApi } from "../../services/api";
import { toast } from "../../components/common/Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// MyAppointments — Patient appointments list page
//
// Props:
//   onNav — (page) => void
// ─────────────────────────────────────────────────────────────────────────────
export function MyAppointments({ onNav }) {
  const [allAppts,     setAll]    = useState([]);
  const [loading,      setLoading] = useState(true);
  const [cancelling,   setCanc]   = useState(null);
  const [filterStatus, setFS]     = useState("");
  const [filterDate,   setFD]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await appointmentApi.getMyAppointments();
      setAll(Array.isArray(d) ? d : d?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const appts = allAppts.filter((a) => {
    const sMatch = !filterStatus || (a.status || "").toLowerCase() === filterStatus;
    const dMatch = !filterDate  || (a.appointment_date || "") === filterDate;
    return sMatch && dMatch;
  });

  async function cancel(id) {
    if (!confirm("Cancel this appointment?")) return;
    setCanc(id);
    try {
      await appointmentApi.cancel(id);
      toast("Appointment cancelled", "success");
      load();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setCanc(null);
    }
  }

  const canCancel = (a) => !["completed", "cancelled"].includes((a.status || "").toLowerCase());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-up">

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Appointments</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>My Appointments</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Track and manage your consultations</p>
          </div>
          <button className="cta-primary" onClick={() => onNav("book")} style={{ fontSize: 13 }}>
            <Ico d={IC.plus} s={14} color="#fff" /> Book New
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="feature-card no-hover" style={{ padding: 20, "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>
          <Field label="Filter by Status">
            <select value={filterStatus} onChange={(e) => setFS(e.target.value)} className="dash-input" style={{ width: 170 }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Filter by Date">
            <input type="date" value={filterDate} onChange={(e) => setFD(e.target.value)} className="dash-input" style={{ width: 180 }} />
          </Field>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="cta-ghost" onClick={load} style={{ padding: "10px 14px" }}>
              <Ico d={IC.refresh} s={14} />
            </button>
            {(filterStatus || filterDate) && (
              <button className="cta-ghost" onClick={() => { setFS(""); setFD(""); }} style={{ padding: "10px 14px", fontSize: 13 }}>
                <Ico d={IC.x} s={13} /> Clear
              </button>
            )}
          </div>
        </div>
        {(filterStatus || filterDate) && allAppts.length > 0 && (
          <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 10 }}>
            Showing {appts.length} of {allAppts.length} appointments
          </p>
        )}
      </div>

      {/* ── Cards ── */}
      {loading
        ? <PageLoader />
        : appts.length === 0
        ? <Empty
            icon="calendar"
            title="No appointments found"
            sub={(filterStatus || filterDate) ? "Try clearing your filters." : "You have no appointments yet."}
            action={
              <button className="cta-primary" onClick={() => onNav("book")} style={{ fontSize: 13 }}>
                <Ico d={IC.plus} s={13} color="#fff" /> Book Appointment
              </button>
            }
          />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {appts.map((a, i) => (
              <div key={a.id || i} className="appt-card fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  {/* Doctor avatar */}
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", border: "2px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#0ea5e9", flexShrink: 0 }}>
                    {(a.doctor_name || "D")[3] || "D"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15.5, fontWeight: 800, color: "#0f172a" }}>
                        {a.doctor_name || "Doctor"}
                      </p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 600, marginBottom: 8 }}>
                      {a.doctor_specialization || "Specialist"}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Ico d={IC.calendar} s={14} color="#94a3b8" />
                        <span style={{ fontSize: 13, color: "#475569" }}>{a.appointment_date || "—"}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Ico d={IC.history} s={14} color="#94a3b8" />
                        <span style={{ fontSize: 13, color: "#475569" }}>{a.appointment_time || "—"}</span>
                      </div>
                    </div>
                    {a.symptoms && (
                      <div style={{ marginTop: 10, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1.5px solid #f1f5f9" }}>
                        <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>Symptoms</p>
                        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{a.symptoms}</p>
                      </div>
                    )}
                    {a.notes && (
                      <div style={{ marginTop: 8, background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", border: "1.5px solid #bbf7d0" }}>
                        <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 2 }}>Doctor's Notes</p>
                        <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{a.notes}</p>
                      </div>
                    )}
                  </div>
                  {canCancel(a) && (
                    <button className="cta-danger" onClick={() => cancel(a.id)} disabled={cancelling === a.id} style={{ flexShrink: 0 }}>
                      {cancelling === a.id ? <Spinner size={14} /> : <Ico d={IC.trash} s={14} />}
                      {cancelling === a.id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
