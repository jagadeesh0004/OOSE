// ─────────────────────────────────────────────────────────────────────────────
// MetricsSection — stat strip below hero
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { label: "Patients Served",  value: "24K+",  sub: "and growing"          },
  { label: "Doctors Onboard",  value: "380+",  sub: "verified specialists"  },
  { label: "Predictions Made", value: "91K+",  sub: "ML assessments"        },
  { label: "Accuracy Rate",    value: "94.2%", sub: "model precision"       },
];

export function MetricsSection() {
  return (
    <section style={{ padding: "56px 80px", background: "#fff", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {METRICS.map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-value">{m.value}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, marginTop: 8, marginBottom: 4, color: "#0f172a" }}>{m.label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeaturesSection
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.07 12.93a11.96 11.96 0 003.527 5.857A11.956 11.956 0 0112 21.036a11.957 11.957 0 018.403-2.249 11.955 11.955 0 003.527-5.857A11.96 11.96 0 0020.402 6a11.959 11.959 0 01-5.402-2.286A11.959 11.959 0 0112 2.714z" />
      </svg>
    ),
    title: "AI Risk Prediction",
    desc: "Our ML model analyzes 10 health metrics to classify your risk level — low, medium, or high — with personalized prescriptions.",
    accent: "#0ea5e9",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Smart Appointments",
    desc: "Book, track, and manage doctor appointments with real-time slot availability and double-booking prevention.",
    accent: "#8b5cf6",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Doctor Profiles",
    desc: "Browse verified doctors by specialization, view availability, and get auto-matched to the right specialist for your risk profile.",
    accent: "#f43f5e",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Health History",
    desc: "Track your prediction history over time, filter by risk level, and monitor health metric trends to make informed decisions.",
    accent: "#f59e0b",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "96px 80px", background: "#fafbff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="pill-tag" style={{ marginBottom: 16, display: "inline-flex" }}>Platform Features</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(30px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 16, color: "#0f172a" }}>
            Everything you need.<br />
            <span style={{ color: "#94a3b8", fontWeight: 300 }}>Nothing you don't.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ "--accent": f.accent }}>
              <div style={{ color: f.accent, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 10, color: "#0f172a" }}>{f.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HowItWorksSection
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", title: "Register & Login",       desc: "Create your patient or doctor account in seconds with token-based auth." },
  { num: "02", title: "Enter Health Metrics",   desc: "Submit 10 key health indicators — vitals, lifestyle, biometrics." },
  { num: "03", title: "Get Instant Prediction", desc: "Our ML model calculates your risk score and generates a prescription." },
  { num: "04", title: "Connect With Doctors",   desc: "High-risk? Get matched to a specialist and book an appointment instantly." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: "80px 80px 96px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="pill-tag" style={{ marginBottom: 16, display: "inline-flex" }}>How It Works</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 16, color: "#0f172a" }}>
            Four steps to<br />better health insights.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              {i < STEPS.length - 1 && (
                <div style={{ position: "absolute", top: 28, right: -16, width: 32, height: 1, background: "#e2e8f0" }} />
              )}
              <div className="step-num">{s.num}</div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, margin: "12px 0 8px", color: "#0f172a" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RolesSection — For Patients / For Doctors cards
//
// Props:
//   onJoinAsPatient — () => void
//   onJoinAsDoctor  — () => void
// ─────────────────────────────────────────────────────────────────────────────
export function RolesSection({ onJoinAsPatient, onJoinAsDoctor }) {
  return (
    <section id="for-doctors" style={{ padding: "96px 80px", background: "#fafbff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Patient */}
        <div style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", border: "1.5px solid #bae6fd", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🧑‍💼</div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 16, letterSpacing: "-0.02em", color: "#0f172a" }}>For Patients</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Register and create your profile", "Browse and find verified doctors", "Submit health metrics for ML analysis", "Book and manage appointments", "Track your complete health history"].map((item) => (
              <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                <span style={{ color: "#0ea5e9", marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✓</span>{item}
              </li>
            ))}
          </ul>
          <button className="cta-primary" style={{ marginTop: 28, width: "100%" }} onClick={onJoinAsPatient}>
            Join as Patient
          </button>
        </div>

        {/* Doctor */}
        <div style={{ background: "linear-gradient(135deg,#faf5ff,#f3e8ff)", border: "1.5px solid #ddd6fe", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👨‍⚕️</div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 16, letterSpacing: "-0.02em", color: "#0f172a" }}>For Doctors</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Create your professional profile", "Generate and manage time slots", "View all your appointments", "Update status with clinical notes", "Get matched with high-risk patients"].map((item) => (
              <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                <span style={{ color: "#8b5cf6", marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✓</span>{item}
              </li>
            ))}
          </ul>
          <button
            className="cta-ghost"
            style={{ marginTop: 28, width: "100%", borderColor: "#c4b5fd", color: "#7c3aed" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#8b5cf6"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}
            onClick={onJoinAsDoctor}
          >
            Join as Doctor
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTASection — CTA banner + Footer
//
// Props:
//   onGetStarted — () => void
// ─────────────────────────────────────────────────────────────────────────────
export function CTASection({ onGetStarted }) {
  return (
    <>
      {/* ── CTA Banner ── */}
      <section id="predictions" style={{ padding: "0 80px 96px", background: "#fafbff" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
          borderRadius: 24, padding: "64px 80px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: "#fff" }}>
            Your health data, working for you.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join thousands of patients and doctors using HealthPredictor to deliver better outcomes, faster.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{ background: "#fff", color: "#0ea5e9", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, padding: "13px 32px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "all 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "")}
              onClick={onGetStarted}
            >
              Get Started Free
            </button>
            <button style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, padding: "13px 32px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(8px)" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              View API Docs
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0f172a", padding: "60px 80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, marginBottom: 60 }}>
            {/* Company */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>HealthPredictor</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>AI-powered health risk prediction platform connecting patients with doctors.</p>
            </div>
            {/* Product */}
            <div>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16 }}>Product</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Features", "Predictions", "Appointments", "Doctors"].map((item) => (
                  <li key={item}><span style={{ fontSize: 13, color: "#64748b", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => (e.target.style.color = "#0ea5e9")} onMouseOut={(e) => (e.target.style.color = "#64748b")}>{item}</span></li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16 }}>Company</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["About Us", "Blog", "Careers", "Press"].map((item) => (
                  <li key={item}><span style={{ fontSize: 13, color: "#64748b", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => (e.target.style.color = "#0ea5e9")} onMouseOut={(e) => (e.target.style.color = "#64748b")}>{item}</span></li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16 }}>Legal</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"].map((item) => (
                  <li key={item}><span style={{ fontSize: 13, color: "#64748b", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => (e.target.style.color = "#0ea5e9")} onMouseOut={(e) => (e.target.style.color = "#64748b")}>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: 20 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 HealthPredictor. All rights reserved.</span>
              <span style={{ fontSize: 12, color: "#475569" }}>·</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>API v1.0</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {[["𝕏", "Twitter"], ["f", "Facebook"], ["in", "LinkedIn"], ["gh", "GitHub"]].map(([icon, label]) => (
                <a key={label} href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(14,165,233,0.1)", color: "#0ea5e9", textDecoration: "none", fontSize: 14, fontWeight: 700, transition: "all 0.2s", border: "1px solid rgba(14,165,233,0.2)" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.2)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.1)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
