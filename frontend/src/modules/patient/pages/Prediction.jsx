import { useState, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, Spinner, toast } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { RiskBadge, SectionCard, SLabel, Inp } from "../../../components/common/UI";

export function PatientPrediction({ user }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Form state
  const [personal, setPersonal] = useState({
    age: "",
    gender: "",
    bmi: "",
  });

  const [vitals, setVitals] = useState({
    heart_rate: "",
    blood_pressure: "",
    cholesterol: "",
    blood_sugar: "",
  });

  const [lifestyle, setLifestyle] = useState({
    smoking: "no",
    exercise_frequency: "never",
    diet_type: "mixed",
    sleep_hours: "",
    stress_level: "low",
  });

  const handleSubmit = useCallback(async () => {
    if (!personal.age || !personal.gender || !personal.bmi) {
      toast("Please fill in all personal information", "error");
      return;
    }
    if (!vitals.heart_rate || !vitals.blood_pressure || !vitals.cholesterol || !vitals.blood_sugar) {
      toast("Please fill in all vital signs", "error");
      return;
    }
    if (!lifestyle.sleep_hours) {
      toast("Please fill in sleep hours", "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api("/predictions/predict/", {
        method: "POST",
        body: JSON.stringify({
          age: parseInt(personal.age),
          gender: personal.gender,
          bmi: parseFloat(personal.bmi),
          heart_rate: parseInt(vitals.heart_rate),
          blood_pressure: vitals.blood_pressure,
          cholesterol: parseInt(vitals.cholesterol),
          blood_sugar: parseInt(vitals.blood_sugar),
          smoking: lifestyle.smoking === "yes",
          exercise_frequency: lifestyle.exercise_frequency,
          diet_type: lifestyle.diet_type,
          sleep_hours: parseInt(lifestyle.sleep_hours),
          stress_level: lifestyle.stress_level,
        }),
      });
      setResult(data);
      setStep(2);
      toast("Health assessment completed!", "success");
    } catch (err) {
      toast(err.message, "error");
    }
    setSubmitting(false);
  }, [personal, vitals, lifestyle]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {step === 1 && (
        <>
          {/* Personal Information */}
          <SectionCard title="Personal Information" accent="#8b5cf6" noPad>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp
                  label="Age"
                  type="number"
                  value={personal.age}
                  onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                  placeholder="e.g., 30"
                  min="1"
                  max="120"
                />
                <div>
                  <SLabel>Gender</SLabel>
                  <select
                    value={personal.gender}
                    onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                    className="dash-input"
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
              <Inp
                label="BMI (Body Mass Index)"
                type="number"
                value={personal.bmi}
                onChange={(e) => setPersonal({ ...personal, bmi: e.target.value })}
                placeholder="e.g., 24.5"
                step="0.1"
                min="10"
                max="60"
              />
            </div>
          </SectionCard>

          {/* Vital Signs */}
          <SectionCard title="Vital Signs" accent="#8b5cf6" noPad>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp
                label="Heart Rate (bpm)"
                type="number"
                value={vitals.heart_rate}
                onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                placeholder="e.g., 72"
                min="40"
                max="200"
              />
              <Inp
                label="Blood Pressure (mmHg)"
                type="text"
                value={vitals.blood_pressure}
                onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })}
                placeholder="e.g., 120/80"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp
                  label="Cholesterol (mg/dL)"
                  type="number"
                  value={vitals.cholesterol}
                  onChange={(e) => setVitals({ ...vitals, cholesterol: e.target.value })}
                  placeholder="e.g., 200"
                  min="100"
                  max="400"
                />
                <Inp
                  label="Blood Sugar (mg/dL)"
                  type="number"
                  value={vitals.blood_sugar}
                  onChange={(e) => setVitals({ ...vitals, blood_sugar: e.target.value })}
                  placeholder="e.g., 100"
                  min="50"
                  max="400"
                />
              </div>
            </div>
          </SectionCard>

          {/* Lifestyle */}
          <SectionCard title="Lifestyle & Habits" accent="#8b5cf6" noPad>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SLabel>Smoking</SLabel>
                  <select
                    value={lifestyle.smoking}
                    onChange={(e) => setLifestyle({ ...lifestyle, smoking: e.target.value })}
                    className="dash-input"
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <SLabel>Exercise Frequency</SLabel>
                  <select
                    value={lifestyle.exercise_frequency}
                    onChange={(e) => setLifestyle({ ...lifestyle, exercise_frequency: e.target.value })}
                    className="dash-input"
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    <option value="never">Never</option>
                    <option value="rarely">Rarely</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="regularly">Regularly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <SLabel>Diet Type</SLabel>
                  <select
                    value={lifestyle.diet_type}
                    onChange={(e) => setLifestyle({ ...lifestyle, diet_type: e.target.value })}
                    className="dash-input"
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    <option value="mixed">Mixed</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                  </select>
                </div>
                <Inp
                  label="Sleep Hours (per day)"
                  type="number"
                  value={lifestyle.sleep_hours}
                  onChange={(e) => setLifestyle({ ...lifestyle, sleep_hours: e.target.value })}
                  placeholder="e.g., 7"
                  min="1"
                  max="24"
                  step="0.5"
                />
              </div>
              <div>
                <SLabel>Stress Level</SLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 8 }}>
                  {["low", "moderate", "high", "very_high"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setLifestyle({ ...lifestyle, stress_level: level })}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: lifestyle.stress_level === level ? "2px solid #8b5cf6" : "1.5px solid #e2e8f0",
                        background: lifestyle.stress_level === level ? "#f3e8ff" : "#fff",
                        color: lifestyle.stress_level === level ? "#8b5cf6" : "#64748b",
                        fontWeight: 600,
                        fontSize: 12.5,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {level === "very_high" ? "Very High" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Submit */}
          <button
            className="cta-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 14,
              padding: "12px 20px",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? <Spinner size={16} color="#fff" /> : <Ico d={IC.brain} s={16} color="#fff" />}
            {submitting ? "Analyzing..." : "Run Health Assessment"}
          </button>
        </>
      )}

      {step === 2 && result && (
        <>
          {/* Result display */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                borderRadius: 16,
                padding: "28px 24px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 13, opacity: 0.85 }}>Your Health Risk Level</p>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12 }}>
                <RiskBadge risk={result.risk_level} />
              </div>
              <p style={{ fontSize: 13, marginTop: 16, opacity: 0.85 }}>
                Risk: <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15 }}>{result.risk_level?.toUpperCase()}</span>
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "#f0f9ff",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: "1.5px solid #bae6fd",
                }}
              >
                <p style={{ fontSize: 12, color: "#0284c7", fontWeight: 600 }}>Risk Probability</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0284c7", marginTop: 4 }}>
                  {result.risk_probability || result.probability ? ((result.risk_probability || result.probability) * 100).toFixed(1) + "%" : "—"}
                </p>
              </div>
              <div
                style={{
                  background: "#faf5ff",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: "1.5px solid #d8b4fe",
                }}
              >
                <p style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>Confidence Score</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#7c3aed", marginTop: 4 }}>
                  {result.confidence_score ? (result.confidence_score * 100).toFixed(1) + "%" : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <SectionCard title="Health Recommendations" accent="#8b5cf6" noPad>
            <div
              style={{
                padding: "18px 22px",
                background: "#faf5ff",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "16px",
                  border: "1.5px solid #e9d5ff",
                  lineHeight: 1.8,
                  fontSize: 13.5,
                  color: "#475569",
                }}
              >
                {result.prescription ? (
                  result.prescription
                ) : (
                  <>
                    Based on your health assessment:
                    <ul style={{ marginTop: 10, marginLeft: 20, listStyle: "disc" }}>
                      <li>Maintain regular exercise routine</li>
                      <li>Monitor vital signs regularly</li>
                      <li>Follow recommended diet guidelines</li>
                      <li>Ensure adequate sleep (7-9 hours)</li>
                      <li>Manage stress levels effectively</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="cta-ghost"
              onClick={() => {
                setStep(1);
                setResult(null);
                setPersonal({ age: "", gender: "", bmi: "" });
                setVitals({ heart_rate: "", blood_pressure: "", cholesterol: "", blood_sugar: "" });
                setLifestyle({
                  smoking: "no",
                  exercise_frequency: "never",
                  diet_type: "mixed",
                  sleep_hours: "",
                  stress_level: "low",
                });
              }}
              style={{ flex: 1, fontSize: 13 }}
            >
              <Ico d={IC.refresh} s={14} /> New Assessment
            </button>
            <button
              className="cta-primary"
              onClick={() => {
                toast("Assessment saved to your history!", "success");
              }}
              style={{ flex: 1, fontSize: 13 }}
            >
              <Ico d={IC.check} s={14} color="#fff" /> Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
