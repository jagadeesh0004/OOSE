import { useState, useEffect } from "react";
import { PageLoader } from "../../components/common/PageLoader";
import { Field, Inp, SLabel } from "../../components/ui/Field";
import { Spinner } from "../../components/common/Spinner";
import { Ico, IC, DAYS } from "../../utils/constants";
import { doctorApi } from "../../services/api";
import { toast } from "../../components/common/Toaster";
import { AvailabilityToggle } from "./AvailabilityToggle";

// ─────────────────────────────────────────────────────────────────────────────
// Profile — Doctor profile view/edit page
//
// Props:
//   doctor   — doctor profile object
//   onUpdate — (updated) => void
// ─────────────────────────────────────────────────────────────────────────────
export function Profile({ doctor, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (doctor) setForm({ ...doctor });
  }, [doctor]);

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleDay = (d) =>
    up("available_days",
      (form.available_days || []).includes(d)
        ? form.available_days.filter((x) => x !== d)
        : [...(form.available_days || []), d]
    );
  const updSlot = (i, k, v) =>
    up("time_slots", (form.time_slots || []).map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  async function save() {
    setSaving(true);
    try {
      const updated = await doctorApi.updateProfileFull({
        ...form,
        experience_years: +form.experience_years,
        consultation_fee: +form.consultation_fee,
        consultation_duration: +form.consultation_duration,
        slot_duration: +form.slot_duration,
      });
      onUpdate(updated);
      setEditing(false);
      toast("Profile updated successfully!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (!doctor) return <PageLoader />;
  const R = editing ? form : doctor;

  const InfoRow = ({ label, value, editKey, type = "text" }) => (
    <Field label={label}>
      {editing
        ? <input type={type} value={form[editKey] ?? ""} onChange={(e) => up(editKey, e.target.value)} className="dash-input" />
        : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{value || "—"}</p>
      }
    </Field>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.4s ease" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Profile Management</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 10 }}>My Profile</h2>
          <p style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>Manage your professional information and availability</p>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cta-ghost" onClick={() => { setEditing(false); setForm({ ...doctor }); }}>Cancel</button>
            <button className="cta-primary" onClick={save} disabled={saving}>
              {saving
                ? <><Spinner size={15} color="#fff" /> Saving…</>
                : <><Ico d={IC.check} s={14} color="#fff" /> Save Changes</>
              }
            </button>
          </div>
        ) : (
          <button className="cta-ghost" onClick={() => setEditing(true)}>
            <Ico d={IC.edit} s={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Availability ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#22c55e,#16a34a)" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Availability Status</h3>
        <AvailabilityToggle doctor={doctor} onUpdate={onUpdate} />
      </div>

      {/* ── Professional Details ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Professional Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
          <InfoRow label="Specialization"               value={doctor.specialization}        editKey="specialization" />
          <InfoRow label="Qualification"                value={doctor.qualification}         editKey="qualification" />
          <InfoRow label="Experience (years)"           value={doctor.experience_years}      editKey="experience_years"      type="number" />
          <InfoRow label="Consultation Fee (₹)"         value={doctor.consultation_fee}      editKey="consultation_fee"      type="number" />
          <InfoRow label="Consultation Duration (min)"  value={doctor.consultation_duration} editKey="consultation_duration" type="number" />
          <InfoRow label="Slot Duration (min)"          value={doctor.slot_duration}         editKey="slot_duration"         type="number" />
        </div>
      </div>

      {/* ── Hospital Information ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Hospital Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
          <InfoRow label="Hospital Name" value={doctor.hospital_name} editKey="hospital_name" />
          <Field label="Hospital Address">
            {editing
              ? <textarea value={form.hospital_address || ""} onChange={(e) => up("hospital_address", e.target.value)} rows={2} className="dash-input" style={{ resize: "vertical" }} />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{doctor.hospital_address || "—"}</p>
            }
          </Field>
        </div>
      </div>

      {/* ── Schedule ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#f43f5e,#e11d48)" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Schedule</h3>

        <Field label="Available Days">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {DAYS.map((d) => {
              const on = (R.available_days || []).includes(d);
              return (
                <button
                  key={d} type="button"
                  className={`day-chip ${on ? "active" : ""}`}
                  onClick={() => editing && toggleDay(d)}
                  style={{ cursor: editing ? "pointer" : "default", opacity: editing || on ? 1 : 0.55 }}
                >
                  {d.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </Field>

        <div style={{ marginTop: 20 }}>
          <SLabel>Working Hours</SLabel>
          {editing
            ? (form.time_slots || []).map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <input type="time" value={s.start} onChange={(e) => updSlot(i, "start", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                  <span style={{ color: "#94a3b8", fontFamily: "'Sora',sans-serif", fontSize: 13 }}>→</span>
                  <input type="time" value={s.end} onChange={(e) => updSlot(i, "end", e.target.value)} className="dash-input" style={{ flex: 1 }} />
                </div>
              ))
            : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {(doctor.time_slots || []).map((s, i) => (
                  <span key={i} style={{
                    background: "#f0f9ff", border: "1.5px solid #bae6fd",
                    borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#0ea5e9",
                    fontFamily: "'Sora',sans-serif", fontWeight: 600,
                  }}>
                    {s.start} → {s.end}
                  </span>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
