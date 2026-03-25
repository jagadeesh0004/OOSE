export function LandingMetrics() {
  const METRICS = [
    { label: "Patients Served", value: "24K+", sub: "and growing" },
    { label: "Doctors Onboard", value: "380+", sub: "verified specialists" },
    { label: "Predictions Made", value: "91K+", sub: "ML assessments" },
    { label: "Accuracy Rate", value: "94.2%", sub: "model precision" },
  ];

  return (
    <section style={{
      padding: "56px 80px", background: "#fff",
      borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9"
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20
      }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{
            background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16,
            padding: "28px 24px", textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              fontFamily: "'Sora',sans-serif", fontSize: 40, fontWeight: 800,
              background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", lineHeight: 1.1
            }}>
              {m.value}
            </div>
            <div style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 700,
              fontSize: 14, marginTop: 8, marginBottom: 4, color: "#0f172a"
            }}>
              {m.label}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
