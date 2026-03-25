import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty, Spinner, toast } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { StatusBadge, SectionCard } from "../../../components/common/UI";

export function DoctorAppointments({ doctor }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notesId, setNotesId] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(null);

  const fetchAppts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/appointments/doctor-appointments/");
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

  const handleSaveNotes = useCallback(
    async (apptId, newNotes) => {
      setSaving(apptId);
      try {
        await api(`/appointments/${apptId}/`, {
          method: "PATCH",
          body: JSON.stringify({ notes: newNotes }),
        });
        toast("Notes saved successfully", "success");
        setAppts((prev) =>
          prev.map((a) => (a.id === apptId ? { ...a, notes: newNotes } : a))
        );
        setNotesId(null);
        setNotes("");
      } catch (err) {
        toast(err.message, "error");
      }
      setSaving(null);
    },
    []
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
        <Empty icon="calendar" title="No appointments found" sub="Your appointment list will appear here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a, i) => (
            <div key={a.id || i}>
              {/* Main appointment card */}
              <div
                className="appt-card fade-up"
                style={{
                  animationDelay: `${i * 50}ms`,
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 16,
                  alignItems: "start",
                  padding: "16px 18px",
                }}
              >
                {/* Patient avatar */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                    border: "2px solid #fde68a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Sora',sans-serif",
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#b45309",
                    flexShrink: 0,
                  }}
                >
                  {(a.patient_name || "P")[0] || "P"}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {a.patient_name || "Patient"}
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
                  {a.symptoms && (
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#94a3b8",
                        marginTop: 6,
                        fontStyle: "italic",
                      }}
                    >
                      Symptoms: {a.symptoms}
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
                  <button
                    onClick={() => {
                      if (notesId === a.id) {
                        setNotesId(null);
                        setNotes("");
                      } else {
                        setNotesId(a.id);
                        setNotes(a.notes || "");
                      }
                    }}
                    className="cta-ghost"
                    style={{
                      padding: "7px 14px",
                      fontSize: 12,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ico d={IC.edit} s={12} /> Notes
                  </button>
                </div>
              </div>

              {/* Notes editor */}
              {notesId === a.id && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "12px 18px",
                    background: "#f8fafb",
                    borderRadius: "0 0 12px 12px",
                    borderTop: "1.5px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add clinical notes for this appointment..."
                    style={{
                      width: "100%",
                      minHeight: 80,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #e2e8f0",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      color: "#0f172a",
                      resize: "vertical",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => {
                        setNotesId(null);
                        setNotes("");
                      }}
                      className="cta-ghost"
                      style={{ fontSize: 12, padding: "7px 14px" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveNotes(a.id, notes)}
                      disabled={saving === a.id}
                      className="cta-primary"
                      style={{
                        fontSize: 12,
                        padding: "7px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: saving === a.id ? 0.6 : 1,
                      }}
                    >
                      {saving === a.id ? <Spinner size={12} color="#fff" /> : <Ico d={IC.check} s={12} color="#fff" />}
                      {saving === a.id ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {appts.length > 0 && (
        <SectionCard title="Appointments Summary" accent="#8b5cf6" noPad>
          <div
            style={{
              padding: "16px 18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12,
              background: "#faf5ff",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Total</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {appts.length}
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Confirmed</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {appts.filter((a) => (a.status || "").toLowerCase() === "confirmed").length}
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Completed</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {appts.filter((a) => (a.status || "").toLowerCase() === "completed").length}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
