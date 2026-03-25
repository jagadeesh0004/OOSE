export function LoginLeftPanel() {
  return (
    <div style={{
      flex: "0 0 42%", position: "relative", overflow: "hidden",
      background: "linear-gradient(148deg, #0c4a6e 0%, #075985 35%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "44px 42px",
    }}>
      {/* Ambient glows */}
      <div style={{
        position: "absolute", width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
        top: "2%", right: "-14%", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
        bottom: "8%", left: "-8%", pointerEvents: "none"
      }} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
        backgroundSize: "48px 48px", pointerEvents: "none"
      }} />

      {/* Floating badges */}
      <div style={{
        position: "absolute", top: "10%", left: "5%",
        background: "#fff", borderRadius: 11, padding: "9px 13px",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 8px 28px rgba(0,0,0,0.14)", fontFamily: "'DM Sans',sans-serif",
        animation: "float 4s ease-in-out infinite"
      }}>
        <div style={{
          width: 28, height: 28, background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
          borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" style={{ width: 13, height: 13 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.07 12.93a11.96 11.96 0 003.527 5.857A11.956 11.956 0 0112 21.036a11.957 11.957 0 018.403-2.249 11.955 11.955 0 003.527-5.857A11.96 11.96 0 0120.402 6a11.959 11.959 0 01-5.402-2.286A11.959 11.959 0 0112 2.714z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Risk Assessed</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Low Risk · Score 91</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: "14%", right: "4%",
        background: "#fff", borderRadius: 11, padding: "9px 13px",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 8px 28px rgba(0,0,0,0.14)", fontFamily: "'DM Sans',sans-serif",
        animation: "float 4s ease-in-out infinite 2s"
      }}>
        <div style={{
          width: 28, height: 28, background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
          borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" style={{ width: 13, height: 13 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Appointment Booked</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Dr. Sharma · 10:30 AM</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 340 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32 }}>
          <div style={{
            width: 30, height: 30, background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 14, height: 14 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 700,
            fontSize: 17, color: "#fff", letterSpacing: "-0.02em"
          }}>
            HealthPredictor
          </span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Sora',sans-serif", fontWeight: 800,
          fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-0.03em",
          lineHeight: 1.18, color: "#fff", marginBottom: 12
        }}>
          Your health,<br />
          <span style={{
            background: "linear-gradient(90deg,#38bdf8,#a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            predicted precisely.
          </span>
        </h2>

        <p style={{
          color: "rgba(255,255,255,0.55)", fontSize: 14.5,
          lineHeight: 1.7, marginBottom: 24
        }}>
          AI-powered risk assessment, smart appointment booking, and verified doctor connections.
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
          {[["🧠", "ML Risk Prediction"], ["📅", "Smart Booking"], ["👨‍⚕️", "Verified Doctors"], ["📊", "Health History"]].map(([icon, label]) => (
            <div key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "100px", padding: "6px 13px", fontSize: 13.5,
              color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans',sans-serif", fontWeight: 500
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span>{label}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
          {[["24K+", "Patients"], ["94.2%", "Accuracy"], ["380+", "Doctors"]].map(([val, label]) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 12, padding: "14px 10px", textAlign: "center", transition: "background 0.2s",
              cursor: "pointer"
            }}
            onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              <div style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 800,
                fontSize: 20, color: "#fff", marginBottom: 2
              }}>
                {val}
              </div>
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      `}</style>
    </div>
  );
}
