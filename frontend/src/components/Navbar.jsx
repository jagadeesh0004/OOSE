// ─────────────────────────────────────────────────────────────────────────────
// LandingNavbar
//
// Props:
//   scrolled            — boolean (triggers glass effect)
//   onNavLinkClick      — (link) => void
//   onLogin             — () => void
//   onGetStarted        — () => void
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Features", "How It Works", "For Doctors", "Predictions"];

export function LandingNavbar({ scrolled, onNavLinkClick, onLogin, onGetStarted }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px", height: 66,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid #f1f5f9" : "none",
      transition: "all 0.3s",
      boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", color: "#0f172a" }}>HealthPredictor</span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {NAV_LINKS.map((l) => (
          <span key={l} className="nav-link" style={{ fontFamily: "'DM Sans',sans-serif" }} onClick={() => onNavLinkClick(l)}>
            {l}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" className="cta-ghost" style={{ padding: "9px 22px", fontSize: 14 }} onClick={(e) => { e.preventDefault(); onLogin(); }}>Sign In</button>
        <button type="button" className="cta-primary" style={{ padding: "9px 22px", fontSize: 14 }} onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Get Started</button>
      </div>
    </nav>
  );
}
