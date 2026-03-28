import { useState, useEffect } from "react";
import { PageLoader } from "./PageLoader";
import { Empty } from "./Empty";
import { Ico } from "../utils/icons";
import { IC, RISK_COLOR } from "../utils/constants";
import { predictionApi } from "../services/api";
import { toast } from "./Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// PredictionHistory — Patient prediction history list
//
// Props:
//   onNav — (page) => void
// ─────────────────────────────────────────────────────────────────────────────
export function PredictionHistory({ onNav }) {
  const [all,      setAll]     = useState([]);
  const [loading,  setLoading] = useState(true);
  const [filter,   setFilter]  = useState("");
  const [expanded, setExp]     = useState(null);

  useEffect(() => {
    predictionApi.getHistory()
      .then((d) => setAll(Array.isArray(d) ? d : d?.results || []))
      .catch((err) => {
        toast(err.message || "Failed to load prediction history", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const list = all.filter((p) => !filter || (p.risk_level || "").toLowerCase() === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-up">

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>History</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>Prediction History</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Track your health risk over time</p>
          </div>
          <button className="cta-primary" onClick={() => onNav("predict")} style={{ fontSize: 13 }}>
            <Ico d={IC.brain} s={13} color="#fff" /> New Prediction
          </button>
        </div>
      </div>

      {/* ── Risk filter pills ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["", "All"], ["low", "Low Risk"], ["medium", "Medium Risk"], ["high", "High Risk"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            style={{
              padding: "8px 18px", borderRadius: 100,
              border: `1.5px solid ${filter === v ? "#0ea5e9" : "#e2e8f0"}`,
              background: filter === v ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#fff",
              color: filter === v ? "#fff" : "#64748b",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
              cursor: "pointer", transition: "all 0.18s",
              boxShadow: filter === v ? "0 3px 12px rgba(14,165,233,0.3)" : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {loading
        ? <PageLoader />
        : list.length === 0
        ? <Empty
            icon="brain"
            title="No predictions found"
            sub={filter ? "Try selecting a different filter." : "You haven't run a health prediction yet."}
            action={
              <button className="cta-primary" onClick={() => onNav("predict")} style={{ fontSize: 13 }}>
                <Ico d={IC.brain} s={13} color="#fff" /> Run Prediction
              </button>
            }
          />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {list.map((p, i) => {
              const risk = (p.risk_level || "low").toLowerCase();
              const [bg, fg, bd] = RISK_COLOR[risk] || RISK_COLOR.low;
              const isOpen = expanded === p.id;

              return (
                <div
                  key={p.id || i}
                  style={{
                    background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 14,
                    overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* ── Summary row (clickable) ── */}
                  <div
                    onClick={() => setExp(isOpen ? null : p.id)}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer", flexWrap: "wrap" }}
                  >
                    {/* Risk indicator */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      background: `linear-gradient(135deg,${fg}20,${fg}10)`,
                      border: `1.5px solid ${bd}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 20 }}>
                        {risk === "high" ? "🚨" : risk === "medium" ? "⚠️" : "✅"}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{
                          background: bg, color: fg, border: `1.5px solid ${bd}`,
                          fontSize: 12, fontWeight: 700, padding: "3px 11px", borderRadius: 100,
                          fontFamily: "'Sora',sans-serif",
                        }}>
                          {p.risk_level?.charAt(0).toUpperCase() + p.risk_level?.slice(1)} Risk
                        </span>
                        {p.risk_score != null && (
                          <span style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 600 }}>
                            Score: {(p.risk_score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 4 }}>
                        {new Date(p.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {new Date(p.created_at).toLocaleTimeString("en-IN", { timeStyle: "short" })}
                      </p>
                    </div>

                    {/* Mini metrics */}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[["Age", p.age], ["BP", p.blood_pressure], ["HR", `${p.heart_rate}bpm`]].map(([l, v]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{l}</p>
                          <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v}</p>
                        </div>
                      ))}
                    </div>

                    <Ico d={IC.chevron} s={16} color="#94a3b8" stroke={2} />
                  </div>

                  {/* ── Expanded detail ── */}
                  {isOpen && (
                    <div style={{
                      padding: "16px 20px", borderTop: "1.5px solid #f1f5f9",
                      background: "#fafafa", animation: "slideIn 0.2s ease",
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10, marginBottom: 16 }}>
                        {[
                          ["Weight",  `${p.weight}kg`],
                          ["Height",  `${p.height}cm`],
                          ["Temp",    `${p.temperature}°C`],
                          ["Sleep",   `${p.sleep}hrs`],
                          ["Smoking", p.smoking ? "Yes" : "No"],
                          ["Alcohol", p.alcohol ? "Yes" : "No"],
                        ].map(([l, v]) => (
                          <div key={l} style={{ background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1.5px solid #f1f5f9" }}>
                            <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{l}</p>
                            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v}</p>
                          </div>
                        ))}
                      </div>
                      {p.prescription && (
                        <div style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", border: "1.5px solid #f1f5f9" }}>
                          <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Prescription</p>
                          <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7 }}>{p.prescription}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
