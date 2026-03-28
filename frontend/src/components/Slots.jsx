import { useState, useEffect, useCallback } from "react";
import { PageLoader } from "./PageLoader";
import { Empty } from "./Empty";
import { Spinner } from "./Spinner";
import { Field, Inp, SLabel } from "./Field";
import { Ico } from "../utils/icons";
import { IC, DAYS } from "../utils/constants";
import { doctorApi } from "../services/api";
import { toast } from "./Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// Slots — Doctor slot management page
// ─────────────────────────────────────────────────────────────────────────────
export function Slots() {
  const [allSlots,   setAllSlots]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [filterDate, setFDate]     = useState("");
  const [filterBook, setFBook]     = useState("all");
  const [showGen,    setShowGen]   = useState(false);
  const [delDate,    setDelDate]   = useState("");
  const [genLoading, setGenLoad]   = useState(false);
  const [genForm,    setGenForm]   = useState({
    start_date: "", end_date: "",
    time_slots: [{ start: "09:00", end: "12:00" }],
    days_to_generate: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  });

  const upG = (k, v) => setGenForm((p) => ({ ...p, [k]: v }));
  const toggleGenDay = (d) =>
    upG("days_to_generate",
      genForm.days_to_generate.includes(d)
        ? genForm.days_to_generate.filter((x) => x !== d)
        : [...genForm.days_to_generate, d]
    );
  const updGenSlot = (i, k, v) =>
    upG("time_slots", genForm.time_slots.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  const load = async () => {
    setLoading(true);
    try {
      const d = await doctorApi.getMySlots();
      setAllSlots(Array.isArray(d) ? d : d?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Client-side filtering
  const slots = allSlots.filter((s) => {
    const dMatch = !filterDate || s.date === filterDate;
    const bMatch = filterBook === "all" ? true : filterBook === "booked" ? s.is_booked === true : s.is_booked === false;
    return dMatch && bMatch;
  });

  async function generate() {
    if (!genForm.start_date || !genForm.end_date) { toast("Select start and end dates", "error"); return; }
    setGenLoad(true);
    try {
      const res = await doctorApi.generateSlots(genForm);
      toast(`Generated ${res.generated_slots_count || "?"} slots!`, "success");
      setShowGen(false);
      load();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setGenLoad(false);
    }
  }

  async function deleteSlot(id) {
    if (!confirm("Delete this slot?")) return;
    try {
      await doctorApi.deleteSlot(id);
      toast("Slot deleted", "success");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function deleteByDate() {
    if (!delDate) { toast("Pick a date first", "error"); return; }
    if (!confirm(`Delete all slots for ${delDate}?`)) return;
    try {
      const res = await doctorApi.deleteSlotsByDate(delDate);
      toast(`Deleted ${res.deleted_count || "?"} slots`, "success");
      setDelDate("");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function deleteAll() {
    if (!confirm("Delete ALL your slots? This cannot be undone.")) return;
    try {
      const res = await doctorApi.deleteAllSlots();
      toast(`Deleted ${res.deleted_count || "?"} slots`, "success");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.4s ease" }}>

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Slot Management</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>Manage Slots</h2>
            <p style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>Generate, view and manage your consultation time slots</p>
          </div>
          <button className="cta-primary" onClick={() => setShowGen(!showGen)}>
            <Ico d={IC.plus} s={14} color="#fff" /> Generate Slots
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>
          <Field label="Filter by Date">
            <input type="date" value={filterDate} onChange={(e) => setFDate(e.target.value)} className="dash-input" style={{ width: 180 }} />
          </Field>
          <Field label="Booking Status">
            <select value={filterBook} onChange={(e) => setFBook(e.target.value)} className="dash-input" style={{ width: 160 }}>
              <option value="all">All Slots</option>
              <option value="booked">Booked</option>
              <option value="unbooked">Available</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <button className="cta-ghost" onClick={load} style={{ padding: "10px 16px" }}>
              <Ico d={IC.refresh} s={14} />
            </button>
            {(filterDate || filterBook !== "all") && (
              <button className="cta-ghost" onClick={() => { setFDate(""); setFBook("all"); }} style={{ padding: "10px 16px", fontSize: 13 }}>
                <Ico d={IC.x} s={13} /> Clear
              </button>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="date" value={delDate} onChange={(e) => setDelDate(e.target.value)} className="dash-input" style={{ width: 165 }} title="Delete slots by date" />
              <button className="cta-danger" onClick={deleteByDate} style={{ padding: "10px 14px" }}>
                <Ico d={IC.trash} s={14} />
              </button>
            </div>
            <button className="cta-danger" onClick={deleteAll}>Delete All</button>
          </div>
        </div>
        {(filterDate || filterBook !== "all") && allSlots.length > 0 && (
          <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 12, fontFamily: "'DM Sans',sans-serif" }}>
            Showing {slots.length} of {allSlots.length} slots
          </p>
        )}
      </div>

      {/* ── Generate panel ── */}
      {showGen && (
        <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", border: "1.5px solid #bae6fd", animation: "slideIn 0.22s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1.5px solid #f0f9ff" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>⚡</span>
            </div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0ea5e9" }}>Auto-Generate Slots</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Inp label="Start Date *" type="date" value={genForm.start_date} onChange={(e) => upG("start_date", e.target.value)} />
            <Inp label="End Date *"   type="date" value={genForm.end_date}   onChange={(e) => upG("end_date", e.target.value)} />
          </div>
          <Field label="Days to Generate">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {DAYS.map((d) => (
                <button key={d} type="button" className={`day-chip ${genForm.days_to_generate.includes(d) ? "active" : ""}`} onClick={() => toggleGenDay(d)}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </Field>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <SLabel>Time Ranges</SLabel>
              <button type="button" className="cta-ghost" onClick={() => upG("time_slots", [...genForm.time_slots, { start: "09:00", end: "10:00" }])} style={{ padding: "5px 12px", fontSize: 12 }}>+ Add</button>
            </div>
            {genForm.time_slots.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input type="time" value={s.start} onChange={(e) => updGenSlot(i, "start", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'Sora',sans-serif" }}>to</span>
                <input type="time" value={s.end} onChange={(e) => updGenSlot(i, "end", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                {genForm.time_slots.length > 1 && (
                  <button type="button" onClick={() => upG("time_slots", genForm.time_slots.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 6, borderRadius: 8 }}>
                    <Ico d={IC.x} s={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="cta-primary" onClick={generate} disabled={genLoading}>
              {genLoading ? <><Spinner size={16} color="#fff" /> Generating…</> : "Generate"}
            </button>
            <button className="cta-ghost" onClick={() => setShowGen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Slots list ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 0 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>My Time Slots</h3>
          <span className="pill-tag">{allSlots.length} total</span>
        </div>

        {loading
          ? <PageLoader />
          : slots.length === 0
          ? <Empty
              icon="clock"
              title={allSlots.length === 0 ? "No slots yet" : "No slots match your filters"}
              sub={allSlots.length === 0 ? "Click 'Generate Slots' to create your availability." : "Try changing the date or status filter."}
            />
          : (
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {slots.map((s, i) => (
                <div key={s.id} className="appt-card" style={{ animationDelay: `${i * 20}ms` }}>
                  {/* Date badge */}
                  <div style={{
                    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                    border: "1.5px solid #bae6fd", borderRadius: 10,
                    padding: "8px 14px", textAlign: "center", flexShrink: 0,
                  }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {s.day?.slice(0, 3) || "—"}
                    </p>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginTop: 2 }}>
                      {s.date?.split("-")[2] || "—"}
                    </p>
                    <p style={{ fontSize: 10.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>
                      {s.date?.slice(0, 7) || ""}
                    </p>
                  </div>
                  {/* Time */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      {s.start_time?.slice(0, 5)} — {s.end_time?.slice(0, 5)}
                    </p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
                      Duration: {s.slot_duration} min
                    </p>
                  </div>
                  {/* Booked status */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: s.is_booked ? "#fffbeb" : "#f0fdf4",
                    color: s.is_booked ? "#d97706" : "#16a34a",
                    border: `1.5px solid ${s.is_booked ? "#fde68a" : "#bbf7d0"}`,
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
                    fontFamily: "'Sora',sans-serif", whiteSpace: "nowrap",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.is_booked ? "#d97706" : "#16a34a" }} />
                    {s.is_booked ? "Booked" : "Available"}
                  </span>
                  {/* Delete */}
                  {!s.is_booked && (
                    <button className="cta-danger" onClick={() => deleteSlot(s.id)} style={{ padding: "7px 12px", flexShrink: 0 }}>
                      <Ico d={IC.trash} s={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
