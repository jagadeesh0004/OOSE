import { useState, useEffect, useCallback } from "react";
import { PageLoader } from "./PageLoader";
import { Empty } from "./Empty";
import { Spinner } from "./Spinner";
import { Field } from "./Field";
import { Ico } from "../utils/icons";
import { IC } from "../utils/constants";
import { doctorApi, appointmentApi } from "../services/api";
import { toast } from "./Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// StepDot — visual stepper indicator
// ─────────────────────────────────────────────────────────────────────────────
function StepDot({ n, currentStep }) {
  const labels = { 1: "Select Doctor", 2: "Pick a Slot", 3: "Confirm", 4: "Done!" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 800,
        background: currentStep >= n ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#f1f5f9",
        color: currentStep >= n ? "#fff" : "#94a3b8",
        boxShadow: currentStep === n ? "0 3px 10px rgba(14,165,233,0.35)" : "none",
        transition: "all 0.25s",
      }}>
        {currentStep > n ? <Ico d={IC.check} s={13} color="#fff" /> : n}
      </div>
      <span style={{
        fontFamily: "'Sora',sans-serif", fontSize: 12.5, fontWeight: 700,
        color: currentStep >= n ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap",
      }}>
        {labels[n]}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BookAppointment — 4-step appointment booking flow
//
// Props:
//   onNav — (page) => void
// ─────────────────────────────────────────────────────────────────────────────
export function BookAppointment({ onNav }) {
  const [doctors,   setDoctors]   = useState([]);
  const [selDoc,    setSelDoc]    = useState(null);
  const [slots,     setSlots]     = useState([]);
  const [selSlot,   setSelSlot]   = useState(null);
  const [selDate,   setSelDate]   = useState("");
  const [symptoms,  setSymptoms]  = useState("");
  const [step,      setStep]      = useState(1);
  const [loadDocs,  setLoadDocs]  = useState(true);
  const [loadSlots, setLoadSlots] = useState(false);
  const [booking,   setBooking]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [booked,    setBooked]    = useState(null);

  useEffect(() => {
    doctorApi.listDoctors()
      .then((d) => setDoctors(Array.isArray(d) ? d : d?.results || []))
      .catch(() => {})
      .finally(() => setLoadDocs(false));
  }, []);

  function pickDoctor(doc) {
    setSelDoc(doc);
    setSelSlot(null);
    setSlots([]);
    setSelDate("");
    setStep(2);
  }

  const fetchSlots = useCallback(async () => {
    if (!selDate || !selDoc) return;
    setLoadSlots(true);
    try {
      const d = await doctorApi.getAvailableSlots(selDoc.id, selDate);
      setSlots(Array.isArray(d) ? d : d?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoadSlots(false);
  }, [selDate, selDoc]);

  useEffect(() => {
    if (selDate && selDoc) fetchSlots();
  }, [fetchSlots]);

  async function book() {
    if (!selSlot || !symptoms.trim()) {
      toast("Please select a slot and describe your symptoms", "error");
      return;
    }
    setBooking(true);
    try {
      const res = await appointmentApi.book({
        doctor_id: selDoc.id,
        date: selDate,
        slot_number: selSlot.slot_number,
        start_time: selSlot.start_time,
        symptoms,
      });
      setBooked(res.appointment || res);
      toast("Appointment booked successfully! 🎉", "success");
      setStep(4);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBooking(false);
    }
  }

  const filteredDocs = doctors.filter((d) =>
    !search ||
    (d.user?.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.user?.username   || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization   || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.hospital_name    || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="fade-up">

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>New Booking</span>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 10 }}>Book an Appointment</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Find your doctor, pick a slot, and you're done.</p>
      </div>

      {/* ── Stepper ── */}
      <div className="feature-card no-hover" style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <StepDot n={1} currentStep={step} />
          <div style={{ flex: 1, height: 2, background: step > 1 ? "linear-gradient(90deg,#0ea5e9,#0284c7)" : "#f1f5f9", borderRadius: 1, transition: "background 0.3s", minWidth: 24 }} />
          <StepDot n={2} currentStep={step} />
          <div style={{ flex: 1, height: 2, background: step > 2 ? "linear-gradient(90deg,#0ea5e9,#0284c7)" : "#f1f5f9", borderRadius: 1, transition: "background 0.3s", minWidth: 24 }} />
          <StepDot n={3} currentStep={step} />
          <div style={{ flex: 1, height: 2, background: step > 3 ? "linear-gradient(90deg,#0ea5e9,#0284c7)" : "#f1f5f9", borderRadius: 1, transition: "background 0.3s", minWidth: 24 }} />
          <StepDot n={4} currentStep={step} />
        </div>
      </div>

      {/* ── Step 1 — Select Doctor ── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
              <Ico d={IC.search} s={16} />
            </div>
            <input
              className="dash-input"
              placeholder="Search by name, specialization, hospital…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 42, fontSize: 14 }}
            />
          </div>

          {loadDocs
            ? <PageLoader />
            : filteredDocs.length === 0
            ? <Empty icon="user" title="No doctors found" sub="Try a different search term." />
            : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="doctor-card" onClick={() => pickDoctor(doc)}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", flexShrink: 0, boxShadow: "0 4px 14px rgba(14,165,233,0.3)" }}>
                        {(doc.user?.first_name || doc.user?.username || "D")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                          Dr. {doc.user?.first_name || doc.user?.username}
                        </p>
                        <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 600, margin: "4px 0" }}>{doc.specialization}</p>
                        <p style={{ fontSize: 12.5, color: "#64748b" }}>{doc.hospital_name}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                      <span style={{ background: "#f0f9ff", color: "#0ea5e9", border: "1px solid #bae6fd", fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6, fontFamily: "'Sora',sans-serif" }}>
                        ₹{doc.consultation_fee}
                      </span>
                      <span style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>
                        {doc.experience_years} yrs exp
                      </span>
                      {doc.is_available && (
                        <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6, fontFamily: "'Sora',sans-serif" }}>
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* ── Step 2 — Pick a Slot ── */}
      {step === 2 && selDoc && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="cta-ghost" onClick={() => setStep(1)} style={{ padding: "8px 14px", fontSize: 13 }}>← Back</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
                Dr. {selDoc.user?.first_name || selDoc.user?.username} · {selDoc.specialization}
              </p>
              <p style={{ fontSize: 12.5, color: "#64748b" }}>{selDoc.hospital_name}</p>
            </div>
          </div>

          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <Field label="Select Date">
              <input
                type="date"
                value={selDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => { setSelDate(e.target.value); setSelSlot(null); }}
                className="dash-input"
                style={{ maxWidth: 220 }}
              />
            </Field>
          </div>

          {selDate && (
            <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                Available Slots for {selDate}
              </h4>
              {loadSlots
                ? <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Spinner /></div>
                : slots.length === 0
                ? <Empty icon="history" title="No slots available" sub="Try a different date or doctor." />
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
                    {slots.map((sl) => (
                      <button
                        key={sl.id}
                        onClick={() => sl.is_booked ? null : setSelSlot(sl)}
                        className={`slot-chip ${sl.is_booked ? "taken" : ""} ${selSlot?.id === sl.id ? "selected" : ""}`}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{sl.start_time?.slice(0, 5)}</div>
                        <div style={{ fontSize: 11, marginTop: 2, opacity: 0.75 }}>Slot #{sl.slot_number}</div>
                      </button>
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {selSlot && (
            <button className="cta-primary" onClick={() => setStep(3)} style={{ alignSelf: "flex-start" }}>
              Continue → Confirm
            </button>
          )}
        </div>
      )}

      {/* ── Step 3 — Confirm ── */}
      {step === 3 && selDoc && selSlot && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="cta-ghost" onClick={() => setStep(2)} style={{ padding: "8px 14px", fontSize: 13 }}>← Back</button>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Confirm Appointment</h3>
          </div>

          {/* Summary card */}
          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", background: "linear-gradient(135deg,#f0f9ff,#fafbff)", border: "1.5px solid #bae6fd" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", boxShadow: "0 4px 14px rgba(14,165,233,0.3)" }}>
                {(selDoc.user?.first_name || selDoc.user?.username || "D")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                  Dr. {selDoc.user?.first_name || selDoc.user?.username}
                </p>
                <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 600 }}>{selDoc.specialization}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Date",   selDate],
                ["Time",   `${selSlot.start_time?.slice(0, 5)} – ${selSlot.end_time?.slice(0, 5)}`],
                ["Slot #", selSlot.slot_number],
                ["Fee",    `₹${selDoc.consultation_fee}`],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1.5px solid #e0f2fe" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{l}</p>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <Field label="Describe Your Symptoms *">
              <textarea
                className="dash-input" rows={4}
                placeholder="Describe what you're experiencing — chest pain, headache, fever…"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </Field>
          </div>

          <button
            className="cta-primary" onClick={book} disabled={booking}
            style={{ alignSelf: "flex-start", fontSize: 14, padding: "12px 28px" }}
          >
            {booking
              ? <><Spinner size={18} color="#fff" /> Booking…</>
              : <>Confirm Appointment ✓</>
            }
          </button>
        </div>
      )}

      {/* ── Step 4 — Success ── */}
      {step === 4 && booked && (
        <div className="feature-card no-hover" style={{ textAlign: "center", padding: "48px 32px", "--accent": "linear-gradient(135deg,#22c55e,#16a34a)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
            <Ico d={IC.check} s={32} color="#fff" stroke={2.5} />
          </div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Appointment Booked!</h3>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.7 }}>
            Your appointment is confirmed with{" "}
            <strong>{booked.doctor || selDoc?.user?.first_name}</strong> on{" "}
            <strong>{booked.date || selDate}</strong> at{" "}
            <strong>{booked.start_time?.slice(0, 5) || selSlot?.start_time?.slice(0, 5)}</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="cta-primary"
              onClick={() => { setStep(1); setSelDoc(null); setSelSlot(null); setSelDate(""); setSymptoms(""); setBooked(null); }}
            >
              Book Another
            </button>
            <button className="cta-ghost" onClick={() => onNav("appointments")}>
              View All Appointments
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
