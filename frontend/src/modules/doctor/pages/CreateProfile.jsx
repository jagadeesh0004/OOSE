import { useState, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, Spinner, toast } from "../../../components/common/Toast";
import { IC, DAYS } from "../../../utils/constants";
import { SectionCard, SLabel } from "../../../components/common/UI";

export function DoctorCreateProfile({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    specialization: "",
    license_number: "",
    experience_years: "",
    hospital: "",
    consultation_fee: "",
    bio: "",
    phone: "",
    schedule_day: DAYS[0] || "Monday",
    schedule_start: "09:00",
    schedule_end: "17:00",
  });

  const handleCreate = useCallback(async () => {
    if (!form.specialization || !form.license_number) {
      toast("Please fill in required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api("/doctors/create-profile/", {
        method: "POST",
        body: JSON.stringify({
          specialization: form.specialization,
          license_number: form.license_number,
          experience_years: form.experience_years ? parseInt(form.experience_years) : 0,
          hospital: form.hospital,
          consultation_fee: form.consultation_fee ? parseFloat(form.consultation_fee) : 500,
          bio: form.bio,
          phone: form.phone,
        }),
      });

      // Create initial schedule slots
      if (form.schedule_start && form.schedule_end) {
        try {
          await api("/appointments/create-slots/", {
            method: "POST",
            body: JSON.stringify({
              day_of_week: form.schedule_day,
              start_time: form.schedule_start,
              end_time: form.schedule_end,
              slot_duration: 30,
            }),
          });
        } catch {}
      }

      toast("Profile created successfully! Welcome aboard! 🎉", "success");
      if (onComplete) onComplete(data);
    } catch (err) {
      toast(err.message, "error");
    }
    setSubmitting(false);
  }, [form, onComplete]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: "100%" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
        {[
          { num: 1, label: "Professional" },
          { num: 2, label: "Schedule" },
          { num: 3, label: "Review" },
        ].map((s) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: step >= s.num ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#f1f5f9",
                border: "2px solid " + (step >= s.num ? "#0284c7" : "#cbd5e1"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: step >= s.num ? "#fff" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              {step > s.num ? <Ico d={IC.check} s={16} color="#fff" /> : s.num}
            </div>
            {s.num < 3 && (
              <div
                style={{
                  height: 2,
                  flex: 1,
                  background: step > s.num ? "linear-gradient(90deg,#0ea5e9,#0284c7)" : "#e2e8f0",
                  transition: "all 0.2s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Professional Details */}
      {step === 1 && (
        <SectionCard title="Professional Information" accent="#0ea5e9" noPad>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <SLabel>Specialization *</SLabel>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="e.g., Cardiology"
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
              <div>
                <SLabel>License Number *</SLabel>
                <input
                  type="text"
                  value={form.license_number}
                  onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                  placeholder="Medical license"
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <SLabel>Years of Experience</SLabel>
                <input
                  type="number"
                  value={form.experience_years}
                  onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  placeholder="e.g., 10"
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                  min="0"
                />
              </div>
              <div>
                <SLabel>Consultation Fee (₹)</SLabel>
                <input
                  type="number"
                  value={form.consultation_fee}
                  onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
                  placeholder="500"
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                  step="50"
                  min="0"
                />
              </div>
            </div>
            <div>
              <SLabel>Hospital / Clinic</SLabel>
              <input
                type="text"
                value={form.hospital}
                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                placeholder="Hospital name"
                className="dash-input"
                style={{ marginTop: 8, width: "100%" }}
              />
            </div>
            <div>
              <SLabel>Phone</SLabel>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="dash-input"
                style={{ marginTop: 8, width: "100%" }}
              />
            </div>
            <div>
              <SLabel>Bio / About Yourself</SLabel>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell patients about your expertise..."
                className="dash-input"
                style={{
                  marginTop: 8,
                  width: "100%",
                  minHeight: 90,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              />
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                className="cta-ghost"
                onClick={() => {}}
                style={{ flex: 1, fontSize: 13, opacity: 0.5, pointerEvents: "none" }}
              >
                Back
              </button>
              <button
                className="cta-primary"
                onClick={() => setStep(2)}
                style={{ flex: 1, fontSize: 13 }}
              >
                Next <Ico d={IC.chevron} s={14} color="#fff" />
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <SectionCard title="Initial Schedule" accent="#0ea5e9" noPad>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>
              Set your initial availability. You can customize this later.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <SLabel>Day of Week</SLabel>
                <select
                  value={form.schedule_day}
                  onChange={(e) => setForm({ ...form, schedule_day: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <SLabel>Start Time</SLabel>
                <input
                  type="time"
                  value={form.schedule_start}
                  onChange={(e) => setForm({ ...form, schedule_start: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
              <div>
                <SLabel>End Time</SLabel>
                <input
                  type="time"
                  value={form.schedule_end}
                  onChange={(e) => setForm({ ...form, schedule_end: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
            </div>

            {/* Preview */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "16px",
                border: "1.5px solid #e2e8f0",
                marginTop: 12,
              }}
            >
              <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>Preview</p>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, fontSize: 13 }}>
                <div>
                  <p style={{ color: "#94a3b8" }}>Day:</p>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a" }}>
                    {form.schedule_day}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8" }}>Hours:</p>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a" }}>
                    {form.schedule_start} - {form.schedule_end} (30-min slots)
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                className="cta-ghost"
                onClick={() => setStep(1)}
                style={{ flex: 1, fontSize: 13 }}
              >
                <Ico d={IC.chevDown} s={14} /> Back
              </button>
              <button
                className="cta-primary"
                onClick={() => setStep(3)}
                style={{ flex: 1, fontSize: 13 }}
              >
                Review <Ico d={IC.chevron} s={14} color="#fff" />
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <SectionCard title="Review Your Information" accent="#0ea5e9" noPad>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Summary */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "16px",
                border: "1.5px solid #e2e8f0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 13,
              }}
            >
              <div>
                <p style={{ color: "#94a3b8", fontWeight: 600 }}>Specialization</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  {form.specialization || "—"}
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontWeight: 600 }}>License</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  {form.license_number || "—"}
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontWeight: 600 }}>Experience</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  {form.experience_years || "0"} years
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontWeight: 600 }}>Fee</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  ₹{form.consultation_fee || "500"}
                </p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ color: "#94a3b8", fontWeight: 600 }}>Hospital</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  {form.hospital || "—"}
                </p>
              </div>
            </div>

            {/* Confirmation */}
            <div
              style={{
                background: "#f0f9ff",
                borderRadius: 10,
                padding: "14px 16px",
                border: "1.5px solid #bae6fd",
              }}
            >
              <p style={{ fontSize: 12.5, color: "#0c4a6e" }}>
                ✓ Your profile will be created with the information above. You can edit these details anytime later.
              </p>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                className="cta-ghost"
                onClick={() => setStep(2)}
                style={{ flex: 1, fontSize: 13 }}
              >
                <Ico d={IC.chevDown} s={14} /> Back
              </button>
              <button
                className="cta-primary"
                onClick={handleCreate}
                disabled={submitting}
                style={{
                  flex: 1,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? <Spinner size={14} color="#fff" /> : <Ico d={IC.check} s={14} color="#fff" />}
                {submitting ? "Creating..." : "Complete Setup"}
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
