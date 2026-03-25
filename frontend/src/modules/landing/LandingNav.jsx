export function LandingNav({ scrolled, onNavClick, onSignIn, onGetStarted }) {
  const NAV_LINKS = ["Features", "How It Works", "For Doctors", "Predictions"];

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
        <div style={{
          width: 34, height: 34, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", borderRadius: 9,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <span style={{
          fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17,
          letterSpacing: "-0.02em", color: "#0f172a"
        }}>HealthPredictor</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {NAV_LINKS.map(link => (
          <span
            key={link}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#475569",
              textDecoration: "none", transition: "color 0.2s", cursor: "pointer"
            }}
            onClick={() => onNavClick(link)}
            onMouseOver={e => e.target.style.color = "#0ea5e9"}
            onMouseOut={e => e.target.style.color = "#475569"}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Auth Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          style={{
            background: "transparent", color: "#0f172a",
            fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14,
            padding: "9px 22px", borderRadius: 10, border: "1.5px solid #e2e8f0",
            cursor: "pointer", transition: "all 0.2s"
          }}
          onMouseOver={e => {
            e.target.borderColor = "#0ea5e9";
            e.target.color = "#0ea5e9";
            e.target.background = "rgba(14,165,233,0.04)";
          }}
          onMouseOut={e => {
            e.target.borderColor = "#e2e8f0";
            e.target.color = "#0f172a";
            e.target.background = "transparent";
          }}
          onClick={onSignIn}
        >
          Sign In
        </button>
        <button
          style={{
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)", color: "#fff",
            fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14,
            padding: "9px 22px", borderRadius: 10, border: "none", cursor: "pointer",
            transition: "all 0.2s", boxShadow: "0 4px 24px rgba(14,165,233,0.25)"
          }}
          onMouseOver={e => {
            e.target.transform = "translateY(-2px)";
            e.target.boxShadow = "0 8px 36px rgba(14,165,233,0.35)";
          }}
          onMouseOut={e => {
            e.target.transform = "translateY(0)";
            e.target.boxShadow = "0 4px 24px rgba(14,165,233,0.25)";
          }}
          onClick={onGetStarted}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
