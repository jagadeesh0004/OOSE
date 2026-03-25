import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty, toast, Spinner } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { SectionCard, SLabel, Inp } from "../../../components/common/UI";

export function PatientBookAppointment({ user, onNav }) {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // Derived
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Get available doctors
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api("/doctors/list/");
        setDoctors(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        toast(err.message, "error");
      }
      setLoading(false);
    })();
  }, []);

  // Get slots when date changes
  useEffect(() => {
    if (!selectedDate || !selectedDoctor) {
      setSlots([]);
      return;
    }

    (async () => {
      setLoadingSlots(true);
      try {
        const data = await api(
          `/appointments/available-slots/?doctor_id=${selectedDoctor.id}&date=${selectedDate}`
        );
        const slotList = Array.isArray(data) ? data : data?.results || [];
        setSlots(slotList);
      } catch (err) {
        toast(err.message, "error");
      }
      setLoadingSlots(false);
    })();
  }, [selectedDate, selectedDoctor]);

  // Submit booking
  const handleSubmit = useCallback(async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast("Please select doctor, date, and time slot", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api("/appointments/book/", {
        method: "POST",
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedSlot,
          symptoms: symptoms,
          notes: notes,
        }),
      });
      toast("Appointment booked successfully!", "success");
      setStep(5);
      setTimeout(() => onNav("appointments"), 2000);
    } catch (err) {
      toast(err.message, "error");
    }
    setSubmitting(false);
  }, [selectedDoctor, selectedDate, selectedSlot, symptoms, notes, onNav]);

  if (loading && step === 1) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Progress steps */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
        {[
          { num: 1, label: "Doctor" },
          { num: 2, label: "Date" },
          { num: 3, label: "Slot" },
          { num: 4, label: "Confirm" },
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
            {s.num < 4 && (
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

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <SectionCard title="Select a Doctor" noPad accent="#0ea5e9">
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {doctors.length === 0 ? (
              <Empty icon="hospital" title="No doctors available" sub="Please try again later." />
            ) : (
              doctors.map((doc, i) => (
                <div
                  key={doc.id || i}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(2);
                  }}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #f1f5f9",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0ea5e9";
                    e.currentTarget.style.background = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
                      border: "2px solid #bae6fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Sora',sans-serif",
                      fontWeight: 800,
                      fontSize: 17,
                      color: "#0ea5e9",
                      flexShrink: 0,
                    }}
                  >
                    {(doc.user?.first_name || "D")[0] || "D"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      Dr. {doc.user?.first_name} {doc.user?.last_name}
                    </p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 2 }}>
                      {doc.specialization || "—"} · {doc.hospital || "—"}
                    </p>
                  </div>
                  <Ico d={IC.chevron} s={16} color="#94a3b8" />
                </div>
              ))
            )}
          </div>
        </SectionCard>
      )}

      {/* Step 2: Select Date */}
      {step === 2 && selectedDoctor && (
        <SectionCard title="Select Date" noPad accent="#0ea5e9">
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <SLabel>Appointment Date</SLabel>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="dash-input"
                style={{
                  marginTop: 8,
                  width: "100%",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="cta-ghost"
                onClick={() => setStep(1)}
                style={{ flex: 1, fontSize: 13 }}
              >
                <Ico d={IC.chevDown} s={13} /> Back
              </button>
              <button
                className="cta-primary"
                onClick={() => selectedDate && setStep(3)}
                disabled={!selectedDate}
                style={{ flex: 2, fontSize: 13, opacity: selectedDate ? 1 : 0.5 }}
              >
                Next <Ico d={IC.chevron} s={13} color="#fff" />
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 3: Select Slot */}
      {step === 3 && selectedDoctor && selectedDate && (
        <SectionCard title="Select Time Slot" noPad accent="#0ea5e9">
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            {loadingSlots ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spinner size={28} color="#0ea5e9" />
              </div>
            ) : slots.length === 0 ? (
              <Empty icon="clock" title="No slots available" sub="Try selecting a different date." />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(80px,1fr))",
                  gap: 10,
                }}
              >
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className="slot-chip"
                    style={{
                      background: selectedSlot === slot ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#fff",
                      color: selectedSlot === slot ? "#fff" : "#0f172a",
                      border:
                        selectedSlot === slot
                          ? "2px solid #0284c7"
                          : "1.5px solid #e2e8f0",
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="cta-ghost"
                onClick={() => setStep(2)}
                style={{ flex: 1, fontSize: 13 }}
              >
                <Ico d={IC.chevDown} s={13} /> Back
              </button>
              <button
                className="cta-primary"
                onClick={() => selectedSlot && setStep(4)}
                disabled={!selectedSlot}
                style={{ flex: 2, fontSize: 13, opacity: selectedSlot ? 1 : 0.5 }}
              >
                Next <Ico d={IC.chevron} s={13} color="#fff" />
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && selectedDoctor && selectedDate && selectedSlot && (
        <SectionCard title="Confirm Appointment" noPad accent="#0ea5e9">
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "14px 16px",
                border: "1.5px solid #f1f5f9",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
                <Ico d={IC.hospital} s={20} color="#0ea5e9" />
                <div>
                  <p style={{ fontSize: 12.5, color: "#94a3b8" }}>Doctor</p>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                    Dr. {selectedDoctor.user?.first_name} {selectedDoctor.user?.last_name}
                  </p>
                </div>
              </div>
              <div style={{ height: 1, background: "#e2e8f0", margin: "12px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5 }}>
                <div>
                  <p style={{ color: "#94a3b8" }}>Date</p>
                  <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{selectedDate}</p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8" }}>Time</p>
                  <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{selectedSlot}</p>
                </div>
              </div>
            </div>

            <Inp
              label="Symptoms (optional)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms..."
              style={{ minHeight: 70 }}
              as="textarea"
            />

            <Inp
              label="Additional Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information for the doctor..."
              style={{ minHeight: 70 }}
              as="textarea"
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="cta-ghost"
                onClick={() => setStep(3)}
                style={{ flex: 1, fontSize: 13 }}
              >
                <Ico d={IC.chevDown} s={13} /> Back
              </button>
              <button
                className="cta-primary"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  flex: 2,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? <Spinner size={14} color="#fff" /> : <Ico d={IC.check} s={14} color="#fff" />}
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeUp 0.5s ease",
            }}
          >
            <Ico d={IC.check} s={40} color="#fff" />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Appointment Booked!
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>
              Your appointment with Dr. {selectedDoctor?.user?.first_name} is confirmed.
            </p>
          </div>
          <button className="cta-primary" onClick={() => onNav("appointments")} style={{ fontSize: 13 }}>
            View My Appointments
          </button>
        </div>
      )}
    </div>
  );
}
