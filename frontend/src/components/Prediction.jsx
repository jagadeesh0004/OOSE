import { useState } from "react";
import { Spinner } from "./Spinner";
import { Field, Inp } from "./Field";
import { Ico } from "../utils/icons";
import { IC, RISK_GRAD } from "../utils/constants";
import { predictionApi } from "../services/api";
import { toast } from "./Toaster";

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
                <select value={form.gender} onChange={(e) => up("gender", e.target.value)} className="dash-input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Smoking *">
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {["no", "yes"].map((v) => (
                    <button key={v} type="button" onClick={() => up("smoking", v)} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10,
                      border: `1.5px solid ${form.smoking === v ? "#0ea5e9" : "#e2e8f0"}`,
                      background: form.smoking === v ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#fff",
                      color: form.smoking === v ? "#fff" : "#64748b",
                      fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
                      cursor: "pointer", transition: "all 0.18s",
                    }}>
                      {v === "no" ? "🚭 No" : "🚬 Yes"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Alcohol *">
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {["no", "yes"].map((v) => (
                    <button key={v} type="button" onClick={() => up("alcohol", v)} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10,
                      border: `1.5px solid ${form.alcohol === v ? "#0ea5e9" : "#e2e8f0"}`,
                      background: form.alcohol === v ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#fff",
                      color: form.alcohol === v ? "#fff" : "#64748b",
                      fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
                      cursor: "pointer", transition: "all 0.18s",
                    }}>
                      {v === "no" ? "🚫 No" : "🍺 Yes"}
                    </button>
                  ))}
                </div>
              </Field>
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
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18 }}>📋</span>
                </div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Personalised Prescription</h3>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 18px", border: "1.5px solid #f1f5f9" }}>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{result.prescription}</p>
              </div>
            </div>
          )}

          {/* Recommended doctor */}
          {result.recommended_doctor && (
            <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#f43f5e,#e11d48)", border: "1.5px solid #fecdd3", background: "#fff1f2" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>🚨</span>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#dc2626" }}>Immediate Consultation Recommended</h3>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1.5px solid #fecdd3", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#0284c7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Sora',sans-serif" }}>
                  {(result.recommended_doctor.name || "D")[3]?.toUpperCase() || "D"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14.5, color: "#0f172a" }}>{result.recommended_doctor.name}</p>
                  <p style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 600 }}>{result.recommended_doctor.specialization}</p>
                  <p style={{ fontSize: 12.5, color: "#64748b" }}>{result.recommended_doctor.hospital} · ₹{result.recommended_doctor.fee}</p>
                </div>
              </div>
            </div>
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
