export function LandingHero({ visible, onPatientSignUp, onDoctorSignUp }) {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center",
      padding: "120px 80px 80px",
      background: "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px", pointer: "none"
      }} />

      {/* Glows */}
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)",
        top: "-200px", right: "-200px", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        top: "200px", left: "-150px", pointerEvents: "none"
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 80 }}>

        {/* LEFT */}
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          {/* Pill tag */}
          <div style={{
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0s forwards" : "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            color: "#0ea5e9", fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: "100px", marginBottom: 24
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#0ea5e9",
              display: "inline-block", animation: "pulse 2s ease-in-out infinite"
            }} />
            AI-Powered Health Intelligence
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800,
            fontSize: "clamp(40px,5.5vw,68px)", lineHeight: 1.08,
            letterSpacing: "-0.03em", marginBottom: 24,
            color: "#0f172a",
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0.1s forwards" : "none"
          }}>
            Know Your Health<br />
            <span style={{
              background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Before It Knows You.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 18, lineHeight: 1.7, color: "#64748b",
            maxWidth: 480, marginBottom: 40, fontWeight: 400,
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0.2s forwards" : "none"
          }}>
            Predict health risks using machine learning. Connect with verified doctors.
            Manage appointments — all in one intelligent platform.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap",
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0.3s forwards" : "none"
          }}>
            <button
              style={{
                background: "linear-gradient(135deg,#0ea5e9,#0284c7)", color: "#fff",
                fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15,
                padding: "14px 32px", borderRadius: 10, border: "none", cursor: "pointer",
                transition: "all 0.2s", boxShadow: "0 4px 24px rgba(14,165,233,0.25)",
                letterSpacing: "0.01em"
              }}
              onClick={onPatientSignUp}
            >
              Start Free — As Patient
            </button>
            <button
              style={{
                background: "transparent", color: "#0f172a",
                fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15,
                padding: "14px 32px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onClick={onDoctorSignUp}
            >
              Join as Doctor →
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 32, marginTop: 48,
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0.4s forwards" : "none"
          }}>
            {[["94.2%", "ML Accuracy"], ["24K+", "Patients"], ["380+", "Doctors"]].map(([v, l]) => (
              <div key={l}>
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 800,
                  fontSize: 22, color: "#0ea5e9"
                }}>
                  {v}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — DEMO CARD */}
        <div style={{ flex: "0 0 420px", position: "relative", zIndex: 1 }}>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 24, padding: 28,
            boxShadow: "0 20px 60px rgba(14,165,233,0.12),0 4px 20px rgba(0,0,0,0.06)",
            opacity: 0, transform: "translateY(24px)",
            animation: visible ? "fadeUp 0.8s ease 0.2s forwards" : "none"
          }}>
            {/* ECG Line */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11, color: "#94a3b8", marginBottom: 8,
                fontFamily: "'Sora',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase"
              }}>
                Live Health Monitor
              </div>
              <svg viewBox="0 0 360 70" style={{ width: "100%", height: 70 }}>
                <path
                  style={{
                    strokeDasharray: 1000, strokeDashoffset: 1000,
                    animation: visible ? "draw 3s ease forwards 0.5s" : "none"
                  }}
                  d="M0,35 L40,35 L50,15 L60,55 L70,20 L80,50 L90,35 L130,35 L140,15 L150,55 L160,20 L170,50 L180,35 L220,35 L230,15 L240,55 L250,20 L260,50 L270,35 L360,35"
                  fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Risk Score */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
              }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Risk Score</span>
                <span style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 800,
                  fontSize: 20, color: "#0ea5e9"
                }}>
                  0.24
                </span>
              </div>
              <div style={{
                height: 6, background: "#f1f5f9", borderRadius: 100, overflow: "hidden"
              }}>
                <div style={{
                  width: "24%", height: "100%",
                  background: "linear-gradient(90deg,#0ea5e9,#0284c7)", borderRadius: 100
                }} />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", marginTop: 4,
                fontSize: 10, color: "#cbd5e1"
              }}>
                <span>Low</span><span>Medium</span><span>High</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["❤️", "Heart Rate", "72 bpm"], ["🩺", "BP", "120/80"], ["🌙", "Sleep", "7.5 hrs"], ["🌡️", "Temp", "37.0°C"]].map(([icon, label, val]) => (
                <div key={label} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px"
                }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>{icon} {label}</div>
                  <div style={{
                    fontFamily: "'Sora',sans-serif", fontWeight: 700,
                    fontSize: 15, color: "#0f172a"
                  }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Result */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
              border: "1.5px solid #bae6fd", borderRadius: 12, padding: "12px 16px"
            }}>
              <div>
                <div style={{
                  fontSize: 11, color: "#0284c7", fontFamily: "'Sora',sans-serif",
                  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2
                }}>
                  Prediction Result
                </div>
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 800,
                  fontSize: 17, color: "#0ea5e9"
                }}>
                  ✓ Low Risk
                </div>
              </div>
              <div style={{
                fontSize: 12, color: "#64748b", textAlign: "right",
                maxWidth: 130, lineHeight: 1.5
              }}>
                Stay hydrated, maintain exercise
              </div>
            </div>

            {/* Doctor Chip */}
            <div style={{
              position: "absolute", bottom: -20, left: -30,
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 50,
              padding: "10px 18px", display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
              }}>
                👨‍⚕️
              </div>
              <div>
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 700,
                  fontSize: 13, color: "#0f172a"
                }}>
                  Dr. Sharma
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Cardiologist · Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </section>
  );
}
