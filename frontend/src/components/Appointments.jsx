import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { PageLoader } from "./PageLoader";
import { Empty } from "./Empty";
import { StatusBadge } from "./StatusBadge";
import { Spinner } from "./Spinner";
import { Field } from "./Field";
import { DatePicker } from "./DatePicker";
import { Ico } from "../utils/icons";
import { IC, STATUS_OPTS } from "../utils/constants";
import { appointmentApi } from "../services/api";
import { toast } from "./Toaster";
import { CustomSelect } from "./CustomSelect";

const BLANK_FILTERS = { date: "", status: "", search: "" };

// ─────────────────────────────────────────────────────────────────────────────
// Appointments — Doctor appointments management page
// ─────────────────────────────────────────────────────────────────────────────
export function Appointments() {
  const [view,     setView]     = useState("all");
  const [allAppts, setAllAppts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filters,  setFilters]  = useState(BLANK_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const fetchFn =
        view === "today"    ? appointmentApi.getDoctorToday :
        view === "upcoming" ? appointmentApi.getUpcoming :
                              appointmentApi.getDoctorAppointments;
      const d = await fetchFn();
      setAllAppts(Array.isArray(d) ? d : d?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoading(false);
  }, [view]);

  useEffect(() => { load(); }, [load]);

  const displayed = allAppts.filter((a) => {
    const dMatch = !filters.date   || a.appointment_date === filters.date;
    const sMatch = !filters.status || (a.status || "").toLowerCase() === filters.status.toLowerCase();
    const patientName = a.patient_details?.first_name || a.patient_details?.username || "Patient";
    const qMatch = !filters.search || patientName.toLowerCase().includes(filters.search.toLowerCase());
    return dMatch && sMatch && qMatch;
  });

  async function changeStatus(id, newStatus) {
    if (!newStatus || !id) return;
    const oldAppt = allAppts.find((a) => a.id === id);
    if (!oldAppt) return;
    const oldStatus = oldAppt.status || "pending";
    setUpdating(id);
    setAllAppts((p) => p.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    try {
      await appointmentApi.updateStatus(id, newStatus);
      toast(`Status updated to ${newStatus}!`, "success");
    } catch (err) {
      setAllAppts((p) => p.map((a) => (a.id === id ? { ...a, status: oldStatus } : a)));
      toast("Failed to update status: " + err.message, "error");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.4s ease" }}>

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Appointment Management</span>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 10 }}>Appointments</h2>
        <p style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>View, filter and update the status of your consultations</p>
      </div>

      {/* ── View tabs ── */}
      <div style={{ display: "flex", gap: 0, background: "#f8fafc", border: "1.5px solid #f1f5f9", borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[["all", "All"], ["today", "Today"], ["upcoming", "Upcoming"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => { setView(v); setFilters(BLANK_FILTERS); }}
            style={{
              padding: "8px 22px", borderRadius: 9, border: "none", cursor: "pointer",
              background: view === v ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
              color: view === v ? "#fff" : "#64748b",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
              transition: "all 0.18s",
              boxShadow: view === v ? "0 3px 14px rgba(14,165,233,0.3)" : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>
          <Field label="Filter by Date">
            <DatePicker
              value={filters.date ? new Date(filters.date) : null}
              onChange={(date) => setFilters((f) => ({ ...f, date: date ? format(date, "yyyy-MM-dd") : "" }))}
            />
          </Field>
          <Field label="Status">
            <CustomSelect
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
              options={[
                { value: "", label: "All Statuses" },
                ...STATUS_OPTS.map((s) => ({ value: s, label: s })),
              ]}
              style={{ width: 160 }}
            />
          </Field>
          <Field label="Search Patient">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                <Ico d={IC.search} s={14} />
              </div>
              <input
                type="text" placeholder="Patient name…" value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="dash-input" style={{ paddingLeft: 36, width: 200 }}
              />
            </div>
          </Field>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <button className="cta-ghost" onClick={load} style={{ padding: "10px 16px" }}>
              <Ico d={IC.refresh} s={14} />
            </button>
            {(filters.date || filters.status || filters.search) && (
              <button className="cta-ghost" onClick={() => setFilters(BLANK_FILTERS)} style={{ padding: "10px 16px", fontSize: 13 }}>
                <Ico d={IC.x} s={13} /> Clear
              </button>
            )}
          </div>
        </div>
        {(filters.date || filters.status || filters.search) && allAppts.length > 0 && (
          <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 12, fontFamily: "'DM Sans',sans-serif" }}>
            Showing {displayed.length} of {allAppts.length} appointments
          </p>
        )}
      </div>

      {/* ── Appointment cards ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 0 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            {view === "today" ? "Today's Appointments" : view === "upcoming" ? "Upcoming Appointments" : "All Appointments"}
          </h3>
          <span className="pill-tag">{displayed.length} shown</span>
        </div>

        {loading
          ? <PageLoader />
          : displayed.length === 0
          ? <Empty
              icon="calendar"
              title="No appointments found"
              sub={
                filters.date || filters.status || filters.search
                  ? "Try clearing your filters."
                  : "Appointments will appear here once patients book with you."
              }
            />
          : (
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {displayed.map((a, i) => (
                <div key={a.id ? String(a.id) : `appt-${i}`} className="appt-card" style={{ animationDelay: `${i * 25}ms`, flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
                    border: "2px solid #bae6fd",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0ea5e9",
                  }}>
                    {(String(a.patient_details?.first_name || a.patient_details?.username || "P"))[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                      {a.patient_details?.first_name || a.patient_details?.username || "Patient"}
                    </p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
                      📅 {a.appointment_date || "—"} &nbsp;·&nbsp; 🕐 {a.appointment_time || "—"}
                    </p>
                    {a.symptoms && (
                      <p style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans',sans-serif", marginTop: 6, lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600, color: "#475569" }}>Symptoms:</span> {a.symptoms}
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={a.status || "pending"} />

                  {/* Status dropdown */}
                  <div style={{ position: "relative", flexShrink: 0, width: 154 }}>
                    <CustomSelect
                      value={a.status?.toLowerCase() || "pending"}
                      onChange={(v) => changeStatus(a.id, v)}
                      options={STATUS_OPTS.map((s) => ({ value: s.toLowerCase(), label: s }))}
                      style={{ width: 154, pointerEvents: updating === a.id || a.status?.toLowerCase() === "cancelled" ? "none" : "auto", opacity: updating === a.id || a.status?.toLowerCase() === "cancelled" ? 0.6 : 1 }}
                    />
                    {updating === a.id && (
                      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                        <Spinner size={14} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
