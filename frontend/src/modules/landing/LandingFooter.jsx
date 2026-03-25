export function LandingFooter() {
  const FOOTER_SECTIONS = {
    product: { title: "Product", items: ["Features", "Predictions", "Appointments", "Doctors"] },
    company: { title: "Company", items: ["About Us", "Blog", "Careers", "Press"] },
    legal: { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"] },
  };

  const SOCIALS = [
    { icon: "𝕏", label: "Twitter" },
    { icon: "f", label: "Facebook" },
    { icon: "in", label: "LinkedIn" },
    { icon: "gh", label: "GitHub" },
  ];

  return (
    <footer style={{ background: "#0f172a", padding: "60px 80px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Footer Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, marginBottom: 60
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 20
            }}>
              <div style={{
                width: 26, height: 26, background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 13, height: 13 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: 15, color: "#fff"
              }}>
                HealthPredictor
              </span>
            </div>
            <p style={{
              fontSize: 13, color: "#64748b", lineHeight: 1.6
            }}>
              AI-powered health risk prediction platform connecting patients with doctors.
            </p>
          </div>

          {/* Footer Sections */}
          {Object.values(FOOTER_SECTIONS).map((section, idx) => (
            <div key={idx}>
              <h4 style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: 14, color: "#fff", marginBottom: 16
              }}>
                {section.title}
              </h4>
              <ul style={{
                listStyle: "none", display: "flex", flexDirection: "column", gap: 10
              }}>
                {section.items.map(item => (
                  <li key={item}>
                    <span
                      style={{
                        fontSize: 13, color: "#64748b",
                        cursor: "pointer", transition: "color 0.2s"
                      }}
                      onMouseOver={e => e.target.style.color = "#0ea5e9"}
                      onMouseOut={e => e.target.style.color = "#64748b"}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: 20
        }} />

        {/* Bottom Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 HealthPredictor. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "#475569" }}>·</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>API v1.0</span>
          </div>

          {/* Socials */}
          <div style={{
            display: "flex", gap: 16, alignItems: "center"
          }}>
            {SOCIALS.map(social => (
              <a
                key={social.label}
                href="#"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(14,165,233,0.1)", color: "#0ea5e9",
                  textDecoration: "none", fontSize: 14, fontWeight: 700,
                  transition: "all 0.2s", border: "1px solid rgba(14,165,233,0.2)"
                }}
                onMouseOver={e => e.target.style.background = "rgba(14,165,233,0.2)"}
                onMouseOut={e => e.target.style.background = "rgba(14,165,233,0.1)"}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
