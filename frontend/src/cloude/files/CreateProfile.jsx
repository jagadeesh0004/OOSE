import { useState } from "react";
import { Spinner } from "../../components/common/Spinner";
import { Field, Inp, SLabel } from "../../components/ui/Field";
import { Ico, IC, DAYS } from "../../utils/constants";
import { doctorApi } from "../../services/api";
import { toast } from "../../components/common/Toaster";
import { GLOBAL_CSS } from "../../styles/globals.css.js";

// ─────────────────────────────────────────────────────────────────────────────
// CreateProfile — one-time onboarding form shown when doctor has no profile
//
// Props:
//   onDone — () => void, called after successful profile creation
// ─────────────────────────────────────────────────────────────────────────────
export function CreateProfile({ onDone }) {
  const [form, setForm] = useState({
    specialization: "", qualification: "", experience_years: "",
    consultation_fee: "", consultation_duration: 30, slot_duration: 15,
    hospital_name: "", hospital_address: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time_slots: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "17:00" }],
  });
  const [saving, setSaving] = useState(false);

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleDay = (d) =>
    up("available_days",
      form.available_days.includes(d)
        ? form.available_days.filter((x) => x !== d)
        : [...form.available_days, d]
    );
  const updSlot = (i, k, v) =>
    up("time_slots", form.time_slots.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  const addSlot = () => up("time_slots", [...form.time_slots, { start: "09:00", end: "10:00" }]);
  const remSlot = (i) => up("time_slots", form.time_slots.filter((_, j) => j !== i));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorApi.createProfile({
        ...form,
        experience_years: +form.experience_years,
        consultation_fee: +form.consultation_fee,
        consultation_duration: +form.consultation_duration,
        slot_duration: +form.slot_duration,
      });
      toast("Profile created! Welcome to HealthPredictor 🎉", "success");
      onDone();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "56px 24px 80px", position: "relative",
    }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light" />

      <div style={{ width: "100%", maxWidth: 700, position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20,
            background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 14,
            padding: "10px 18px", boxShadow: "0 4px 20px rgba(14,165,233,0.1)",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(14,165,233,0.3)",
            }}>
              <Ico d={IC.hospital} s={18} color="#fff" stroke={2} />
            </div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
              HealthPredictor
            </span>
          </div>

          <span className="pill-tag" style={{ marginBottom: 20, display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ea5e9", animation: "pulse 2s infinite" }} />
            One-Time Setup
          </span>

          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 800,
            color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 10, marginTop: 14,
          }}>
            Set Up Your Doctor Profile
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
            Complete your profile to start managing appointments and connecting with patients.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Professional Details ── */}
          <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1.5px solid #f8fafc" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico d={IC.user} s={16} color="#0ea5e9" />
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>Professional Details</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Inp label="Specialization *" placeholder="e.g. Cardiology" value={form.specialization} onChange={(e) => up("specialization", e.target.value)} required />
              <Inp label="Qualification *" placeholder="e.g. MD, MBBS" value={form.qualification} onChange={(e) => up("qualification", e.target.value)} required />
              <Inp label="Experience (years) *" type="number" min="0" value={form.experience_years} onChange={(e) => up("experience_years", e.target.value)} required />
              <Inp label="Consultation Fee (₹) *" type="number" min="0" step="0.01" value={form.consultation_fee} onChange={(e) => up("consultation_fee", e.target.value)} required />
              <Inp label="Consultation Duration (min) *" type="number" min="5" max="120" value={form.consultation_duration} onChange={(e) => up("consultation_duration", e.target.value)} required />
              <Inp label="Slot Duration (min) *" type="number" min="5" max="120" value={form.slot_duration} onChange={(e) => up("slot_duration", e.target.value)} required />
            </div>
          </div>

          {/* ── Hospital Information ── */}
          <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1.5px solid #f8fafc" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico d={IC.hospital} s={16} color="#8b5cf6" />
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>Hospital Information</p>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <Inp label="Hospital Name *" placeholder="City General Hospital" value={form.hospital_name} onChange={(e) => up("hospital_name", e.target.value)} required />
              <Field label="Hospital Address *">
                <textarea
                  value={form.hospital_address}
                  onChange={(e) => up("hospital_address", e.target.value)}
                  placeholder="123 Main Street, Hyderabad — 500001"
                  rows={2} required className="dash-input" style={{ resize: "vertical" }}
                />
              </Field>
            </div>
          </div>

          {/* ── Schedule ── */}
          <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#f43f5e,#e11d48)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1.5px solid #f8fafc" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#fff1f2,#fecdd3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico d={IC.calendar} s={16} color="#f43f5e" />
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>Schedule</p>
            </div>

            <Field label="Available Days *">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {DAYS.map((d) => (
                  <button
                    key={d} type="button"
                    className={`day-chip ${form.available_days.includes(d) ? "active" : ""}`}
                    onClick={() => toggleDay(d)}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </Field>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <SLabel>Working Hours *</SLabel>
                <button type="button" className="cta-ghost" onClick={addSlot} style={{ padding: "5px 14px", fontSize: 12 }}>
                  <Ico d={IC.plus} s={12} /> Add Range
                </button>
              </div>
              {form.time_slots.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <input type="time" value={s.start} onChange={(e) => updSlot(i, "start", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                  <span style={{ color: "#94a3b8", fontSize: 13, flexShrink: 0, fontFamily: "'Sora',sans-serif" }}>to</span>
                  <input type="time" value={s.end} onChange={(e) => updSlot(i, "end", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                  {form.time_slots.length > 1 && (
                    <button
                      type="button" onClick={() => remSlot(i)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", transition: "all 0.15s" }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#fff1f2")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <Ico d={IC.x} s={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={saving} className="cta-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15 }}
          >
            {saving
              ? <><Spinner size={18} color="#fff" /> Creating Profile…</>
              : <>Create Profile & Continue →</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
