export function LandingHowItWorks() {
  const STEPS = [
    { num: "01", title: "Register & Login", desc: "Create your patient or doctor account in seconds with token-based auth." },
    { num: "02", title: "Enter Health Metrics", desc: "Submit 10 key health indicators — vitals, lifestyle, biometrics." },
    { num: "03", title: "Get Instant Prediction", desc: "Our ML model calculates your risk score and generates a prescription." },
    { num: "04", title: "Connect With Doctors", desc: "High-risk? Get matched to a specialist and book an appointment instantly." },
  ];

  return (
    <section style={{
      padding: "80px 80px 96px", background: "#fff", borderTop: "1px solid #f1f5f9"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            color: "#0ea5e9", fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: "100px", marginBottom: 16
          }}>
            How It Works
          </div>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 16, color: "#0f172a"
          }}>
            Four steps to<br />better health insights.
          </h2>
        </div>

        {/* Steps Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute", top: 28, right: -16,
                  width: 32, height: 1, background: "#e2e8f0"
                }} />
              )}
              <div style={{
                fontFamily: "'Sora',sans-serif", fontSize: 56, fontWeight: 800, lineHeight: 1,
                background: "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.04))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {s.num}
              </div>
              <h3 style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: 17, margin: "12px 0 8px", color: "#0f172a"
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: 14, color: "#64748b", lineHeight: 1.65
              }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
