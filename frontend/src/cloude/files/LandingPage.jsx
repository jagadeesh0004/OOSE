import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "../modules/landing/Navbar";
import { HeroSection } from "../modules/landing/HeroSection";
import {
  MetricsSection,
  FeaturesSection,
  HowItWorksSection,
  RolesSection,
  CTASection,
} from "../modules/landing/Sections";

// ─────────────────────────────────────────────────────────────────────────────
// LandingPage — thin shell that composes all landing modules
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible,  setVisible]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (link) => {
    const sectionMap = {
      "Features":     "features",
      "How It Works": "how-it-works",
      "For Doctors":  "for-doctors",
      "Predictions":  "predictions",
    };
    scrollToSection(sectionMap[link]);
  };

  const goToDoctorRegistration  = () => navigate("/login?role=doctor&tab=register");
  const goToPatientRegistration = () => navigate("/login?role=patient&tab=register");
  const goToLogin               = () => navigate("/login?tab=login");

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Sora:wght@300;600;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .hero-glow { position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%); top:-200px; right:-200px; pointer-events:none; }
        .hero-glow2 { position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%); top:200px; left:-150px; pointer-events:none; }
        .grid-bg { position:absolute; inset:0; background-image: linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px); background-size:60px 60px; pointer-events:none; }

        .fade-in { opacity:0; transform:translateY(24px); transition:opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity:1; transform:translateY(0); }

        .pill-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.2); color:#0ea5e9; font-family:'Sora',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; padding:6px 14px; border-radius:100px; }

        .cta-primary { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; font-family:'Sora',sans-serif; font-weight:700; font-size:15px; padding:14px 32px; border-radius:10px; border:none; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 24px rgba(14,165,233,0.25); letter-spacing:0.01em; }
        .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 36px rgba(14,165,233,0.35); }

        .cta-ghost { background:transparent; color:#0f172a; font-family:'Sora',sans-serif; font-weight:600; font-size:15px; padding:14px 32px; border-radius:10px; border:1.5px solid #e2e8f0; cursor:pointer; transition:all 0.2s; }
        .cta-ghost:hover { border-color:#0ea5e9; color:#0ea5e9; background:rgba(14,165,233,0.04); }

        .feature-card { background:#ffffff; border:1.5px solid #f1f5f9; border-radius:18px; padding:32px; transition:all 0.3s; position:relative; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.04); }
        .feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--accent); opacity:0; transition:opacity 0.3s; }
        .feature-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.09); border-color:#e2e8f0; transform:translateY(-4px); }
        .feature-card:hover::before { opacity:1; }

        .step-num { font-family:'Sora',sans-serif; font-size:56px; font-weight:800; line-height:1; background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.04)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .metric-card { background:#fff; border:1.5px solid #f1f5f9; border-radius:16px; padding:28px 24px; text-align:center; box-shadow:0 2px 12px rgba(0,0,0,0.04); }
        .metric-value { font-family:'Sora',sans-serif; font-size:40px; font-weight:800; background:linear-gradient(135deg,#0ea5e9,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.1; }

        .nav-link { font-size:14px; color:#475569; text-decoration:none; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:#0ea5e9; }

        .ecg-line { stroke-dasharray:1000; stroke-dashoffset:1000; animation:draw 3s ease forwards 0.5s; }
        @keyframes draw { to { stroke-dashoffset:0; } }

        .pulse-dot { animation:pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .float-card { animation:float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>

      <LandingNavbar
        scrolled={scrolled}
        onNavLinkClick={handleNavClick}
        onLogin={goToLogin}
        onGetStarted={goToPatientRegistration}
      />
      <HeroSection
        visible={visible}
        onGetStarted={goToPatientRegistration}
        onJoinAsDoctor={goToDoctorRegistration}
      />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection
        onJoinAsPatient={goToPatientRegistration}
        onJoinAsDoctor={goToDoctorRegistration}
      />
      <CTASection onGetStarted={goToPatientRegistration} />
    </div>
  );
}
