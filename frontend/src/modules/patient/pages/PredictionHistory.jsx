import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty, toast } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { RiskBadge, SectionCard } from "../../../components/common/UI";

export function PatientPredictionHistory({ user }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api("/predictions/history/");
        setPredictions(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        toast(err.message, "error");
      }
      setLoading(false);
    })();
  }, []);

  const filtered = predictions
    .filter((p) => {
      if (filter === "all") return true;
      return (p.risk_level || "").toLowerCase() === filter.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === "risk_high") {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return (riskOrder[(b.risk_level || "").toLowerCase()] || 0) - (riskOrder[(a.risk_level || "").toLowerCase()] || 0);
      }
      return 0;
    });

  if (loading) return <PageLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Filter & Sort Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>
            Filter by Risk Level
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              background: "#fff",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            <option value="all">All Predictions</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1.5px solid #e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              background: "#fff",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="risk_high">Highest Risk</option>
          </select>
        </div>
      </div>

      {/* Predictions list */}
      {filtered.length === 0 ? (
        <Empty icon="brain" title="No predictions found" sub="Start a new health assessment to get personalized recommendations." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((pred, i) => (
            <SectionCard
              key={pred.id || i}
              noPad
              style={{
                animation: `fadeUp 0.45s ease ${i * 50}ms both`,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "start",
                  padding: "16px 18px",
                }}
              >
                {/* Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ico d={IC.brain} s={18} color="#8b5cf6" />
                      <span
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Health Assessment
                      </span>
                    </div>
                    <RiskBadge risk={pred.risk_level} />
                  </div>

                  <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
                    📅 {new Date(pred.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })} · 🕐{" "}
                    {new Date(pred.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Metrics grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))",
                      gap: 10,
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Risk Probability</p>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginTop: 2,
                        }}
                      >
                        {pred.risk_probability || pred.probability
                          ? ((pred.risk_probability || pred.probability) * 100).toFixed(1) + "%"
                          : "—"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: "8px 10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Confidence</p>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginTop: 2,
                        }}
                      >
                        {pred.confidence_score ? (pred.confidence_score * 100).toFixed(1) + "%" : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Health details */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                      gap: 8,
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    {pred.age && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Age</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.age}</p>
                      </div>
                    )}
                    {pred.bmi && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>BMI</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.bmi}</p>
                      </div>
                    )}
                    {pred.heart_rate && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Heart Rate</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.heart_rate} bpm</p>
                      </div>
                    )}
                    {pred.blood_pressure && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>BP</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.blood_pressure}</p>
                      </div>
                    )}
                    {pred.cholesterol && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Cholesterol</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.cholesterol} mg/dL</p>
                      </div>
                    )}
                    {pred.blood_sugar && (
                      <div>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>Blood Sugar</p>
                        <p style={{ fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{pred.blood_sugar} mg/dL</p>
                      </div>
                    )}
                  </div>

                  {/* Prescription */}
                  {pred.prescription && (
                    <div
                      style={{
                        background: "#f0f9ff",
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: "1px solid #bae6fd",
                        marginTop: 8,
                      }}
                    >
                      <p style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600, marginBottom: 4 }}>
                        Recommendations
                      </p>
                      <p style={{ fontSize: 12, color: "#0c4a6e", lineHeight: 1.5 }}>{pred.prescription}</p>
                    </div>
                  )}
                </div>

                {/* Right side - Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <button
                    className="cta-ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(pred, null, 2));
                      toast("Assessment details copied!", "success");
                    }}
                    style={{
                      padding: "7px 12px",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Ico d={IC.check} s={12} /> Copy
                  </button>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {predictions.length > 0 && (
        <SectionCard title="Your Health Summary" noPad accent="#8b5cf6">
          <div
            style={{
              padding: "16px 18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12,
              background: "#faf5ff",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Total Assessments</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {predictions.length}
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Average Risk</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {predictions.length > 0
                  ? (predictions.map((p) => (p.risk_probability || p.probability || 0)).reduce((a, b) => a + b, 0) / predictions.length * 100).toFixed(1)
                  : "—"}
                %
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Latest Assessment</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {predictions.length > 0
                  ? new Date(predictions[0].created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
