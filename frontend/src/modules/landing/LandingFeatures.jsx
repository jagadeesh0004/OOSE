export function LandingFeatures() {
  const FEATURES = [
    {
      icon: "🧠", title: "AI Risk Prediction",
      desc: "Our ML model analyzes 10 health metrics to classify your risk level — low, medium, or high — with personalized prescriptions.",
      accent: "#0ea5e9",
    },
    {
      icon: "📅", title: "Smart Appointments",
      desc: "Book, track, and manage doctor appointments with real-time slot availability and double-booking prevention.",
      accent: "#8b5cf6",
    },
    {
      icon: "👨‍⚕️", title: "Doctor Profiles",
      desc: "Browse verified doctors by specialization, view availability, and get auto-matched to the right specialist for your risk profile.",
      accent: "#f43f5e",
    },
    {
      icon: "📊", title: "Health History",
      desc: "Track your prediction history over time, filter by risk level, and monitor health metric trends to make informed decisions.",
      accent: "#f59e0b",
    },
  ];

  return (
    <section style={{ padding: "96px 80px", background: "#fafbff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            color: "#0ea5e9", fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: "100px", marginBottom: 16
          }}>
            Platform Features
          </div>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontSize: "clamp(30px,4vw,48px)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 16, color: "#0f172a"
          }}>
            Everything you need.<br />
            <span style={{ color: "#94a3b8", fontWeight: 300 }}>Nothing you don't.</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: "#ffffff", border: "1.5px solid #f1f5f9", borderRadius: 18,
              padding: 32, transition: "all 0.3s", position: "relative", overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              cursor: "pointer",
              "--accent": f.accent
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.09)";
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#f1f5f9";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: f.accent, opacity: 0, transition: "opacity 0.3s"
              }} className="top-bar" />
              <div style={{ color: f.accent, marginBottom: 16, fontSize: 32 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: 19, marginBottom: 10, color: "#0f172a"
              }}>
                {f.title}
              </h3>
              <p style={{
                color: "#64748b", lineHeight: 1.7, fontSize: 15
              }}>
                {f.desc}
              </p>
              <style>{`
                div:hover .top-bar { opacity: 1; }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
