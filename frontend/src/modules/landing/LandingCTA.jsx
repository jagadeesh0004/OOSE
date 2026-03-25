export function LandingCTA({ onGetStarted, onAPIDocsClick }) {
  return (
    <section style={{
      padding: "0 80px 96px", background: "#fafbff"
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
        borderRadius: 24, padding: "64px 80px", textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Glows */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none"
        }} />

        <h2 style={{
          fontFamily: "'Sora',sans-serif", fontSize: "clamp(26px,3.5vw,42px)",
          fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: "#fff"
        }}>
          Your health data, working for you.
        </h2>
        <p style={{
          fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36,
          maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7
        }}>
          Join thousands of patients and doctors using HealthPredictor to deliver better outcomes, faster.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
          position: "relative", zIndex: 1
        }}>
          <button
            style={{
              background: "#fff", color: "#0ea5e9",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15,
              padding: "13px 32px", borderRadius: 10, border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "all 0.2s"
            }}
            onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.target.style.transform = ""}
            onClick={onGetStarted}
          >
            Get Started Free
          </button>
          <button
            style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15,
              padding: "13px 32px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.35)",
              cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(8px)"
            }}
            onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.25)"}
            onMouseOut={e => e.target.style.background = "rgba(255,255,255,0.15)"}
            onClick={onAPIDocsClick}
          >
            View API Docs
          </button>
        </div>
      </div>
    </section>
  );
}
