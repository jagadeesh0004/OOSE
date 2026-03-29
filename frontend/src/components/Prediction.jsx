import { useState } from "react";
import { Spinner } from "./Spinner";
import { Field, Inp } from "./Field";
import { Ico } from "../utils/icons";
import { IC, RISK_GRAD } from "../utils/constants";
import { predictionApi } from "../services/api";
import { toast } from "./Toaster";
import { CustomSelect } from "./CustomSelect";

// ─────────────────────────────────────────────────────────────────────────────
// Prediction — Health risk prediction form + result display
//
// Props:
//   onNav — (page) => void
// ─────────────────────────────────────────────────────────────────────────────
export function Prediction({ onNav }) {
  const [form, setForm] = useState({
    age: "", gender: "male", weight: "", height: "",
    temperature: "", blood_pressure: "", sleep: "", heart_rate: "",
    smoking: "no", alcohol: "no",
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function predict(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await predictionApi.predict({
        ...form,
        age:            +form.age,
        weight:         +form.weight,
        height:         +form.height,
        temperature:    +form.temperature,
        blood_pressure: +form.blood_pressure,
        sleep:          +form.sleep,
        heart_rate:     +form.heart_rate,
      });
      setResult(res);
      toast("Prediction complete!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function bookWithDoctor(doctor) {
    // Store just the doctor ID for BookAppointment to look up
    sessionStorage.setItem("preSelectedDoctorId", doctor.id.toString());
    onNav("book");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="fade-up">

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>AI Health Check</span>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 10 }}>Health Risk Prediction</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Enter your health metrics and our ML model will assess your risk level.</p>
      </div>

      {!result ? (
        /* ── Prediction Form ── */
        <form onSubmit={predict} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Personal */}
          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Personal Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              <Inp label="Age (years) *" type="number" min="1" max="120" placeholder="35" value={form.age} onChange={(e) => up("age", e.target.value)} required />
              <Field label="Gender *">
                <CustomSelect
                  value={form.gender}
                  onChange={(v) => up("gender", v)}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </Field>
              <Inp label="Weight (kg) *" type="number" min="20" max="300" step="0.1" placeholder="70" value={form.weight} onChange={(e) => up("weight", e.target.value)} required />
              <Inp label="Height (cm) *" type="number" min="50" max="250" placeholder="170" value={form.height} onChange={(e) => up("height", e.target.value)} required />
            </div>
          </div>

          {/* Vital Signs */}
          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Vital Signs</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              <Inp label="Body Temperature (°C) *" type="number" min="35" max="42" step="0.1" placeholder="37.0" value={form.temperature}    onChange={(e) => up("temperature",    e.target.value)} required />
              <Inp label="Blood Pressure (systolic) *" type="number" min="50" max="250" placeholder="120"  value={form.blood_pressure} onChange={(e) => up("blood_pressure", e.target.value)} required />
              <Inp label="Heart Rate (bpm) *"  type="number" min="30" max="200" placeholder="72"   value={form.heart_rate}     onChange={(e) => up("heart_rate",     e.target.value)} required />
              <Inp label="Sleep (hours/day) *" type="number" min="0"  max="24"  step="0.5" placeholder="7" value={form.sleep} onChange={(e) => up("sleep", e.target.value)} required />
            </div>
          </div>

          {/* Lifestyle */}
          <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#f43f5e,#e11d48)" }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Lifestyle Factors</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Smoking Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{
                  fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.09em", textTransform: "uppercase", minWidth: 70, flexShrink: 0
                }}>
                  Smoking *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => up("smoking", form.smoking === "yes" ? "no" : "yes")}
                    className="toggle-track"
                    style={{
                      background: form.smoking === "yes" ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <div className="toggle-knob" style={{ left: form.smoking === "yes" ? 24 : 4 }} />
                  </button>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: form.smoking === "yes" ? "#0284c7" : "#64748b" }}>
                    {form.smoking === "yes" ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Alcohol Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{
                  fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.09em", textTransform: "uppercase", minWidth: 70, flexShrink: 0
                }}>
                  Alcohol *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => up("alcohol", form.alcohol === "yes" ? "no" : "yes")}
                    className="toggle-track"
                    style={{
                      background: form.alcohol === "yes" ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <div className="toggle-knob" style={{ left: form.alcohol === "yes" ? 24 : 4 }} />
                  </button>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: form.alcohol === "yes" ? "#0284c7" : "#64748b" }}>
                    {form.alcohol === "yes" ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="cta-primary" style={{ alignSelf: "flex-start", fontSize: 14.5, padding: "13px 32px" }}>
            {loading
              ? <><Spinner size={18} color="#fff" /> Analyzing…</>
              : <><Ico d={IC.brain} s={16} color="#fff" /> Predict My Risk</>
            }
          </button>
        </form>

      ) : (
        /* ── Result View ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Risk banner */}
          <div style={{
            background: RISK_GRAD[result.risk_level?.toLowerCase()] || RISK_GRAD.low,
            borderRadius: 20, padding: "32px 36px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Your Health Risk Assessment
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>
                    {result.risk_level?.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>RISK</p>
                </div>
                {result.risk_score != null && (
                  <div style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "14px 20px", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                      {(result.risk_score * 100).toFixed(0)}%
                    </p>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginTop: 4, fontWeight: 600 }}>Risk Score</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prescription */}
          {result.prescription && (
            <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Prescription</p>
              <p style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.8, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{result.prescription}</p>
            </div>
          )}

          {/* Recommended doctor */}
          {result.risk_level?.toLowerCase() === 'high' && (
            <>
              {result.doctors_available ? (
                <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", border: "1.5px solid #bae6fd", background: "#f0f9ff" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                    <span style={{ fontSize: 22 }}>🚨</span>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0284c7" }}>
                      Available Specialists ({result.available_doctors?.length || 0})
                    </h3>
                  </div>

                  {/* Doctors Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                    {result.available_doctors?.map((doctor) => (
                      <div key={doctor.id} style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px",
                        border: "1.5px solid #bae6fd",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        transition: "all 0.2s"
                      }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,165,233,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
                        
                        {/* Doctor Header */}
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'Sora',sans-serif",
                            flexShrink: 0
                          }}>
                            {(doctor.name || "D")[0]?.toUpperCase() || "D"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#0f172a", lineHeight: 1.4 }}>
                              {doctor.name}
                            </p>
                            <p style={{ fontSize: 12, color: "#0ea5e9", fontWeight: 600, marginTop: 2 }}>
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>

                        {/* Doctor Details */}
                        <div style={{ fontSize: 12.5, color: "#64748b", display: "flex", flexDirection: "column", gap: 4 }}>
                          <p>🏥 {doctor.hospital}</p>
                          <p>💰 ₹{doctor.fee} per consultation</p>
                          {doctor.experience && doctor.experience !== 'N/A' && (
                            <p>📅 {doctor.experience} years experience</p>
                          )}
                        </div>

                        {/* Book Button */}
                        <button
                          onClick={() => bookWithDoctor(doctor)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: 8,
                            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                            color: "#fff",
                            border: "none",
                            fontFamily: "'Sora',sans-serif",
                            fontWeight: 700,
                            fontSize: 12.5,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            marginTop: "auto"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          📅 Book Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="feature-card no-hover" style={{
                  "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  border: "1.5px solid #bae6fd",
                  background: "#f0f9ff",
                  textAlign: "center",
                  padding: "32px 24px"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#0284c7", marginBottom: 8 }}>
                    No Available Doctors
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                    {result.hospital_message || "No doctors are available for consultation at the moment. Please visit your nearest hospital for immediate medical attention."}
                  </p>
                </div>
              )}
            </>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="cta-primary" onClick={() => setResult(null)}>
              <Ico d={IC.refresh} s={14} color="#fff" /> New Prediction
            </button>
            <button className="cta-ghost" onClick={() => onNav("history")}>View History →</button>
          </div>
        </div>
      )}
    </div>
  );
}
