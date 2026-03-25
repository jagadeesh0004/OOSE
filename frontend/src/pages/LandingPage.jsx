import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNav } from "../modules/landing/LandingNav";
import { LandingHero } from "../modules/landing/LandingHero";
import { LandingMetrics } from "../modules/landing/LandingMetrics";
import { LandingFeatures } from "../modules/landing/LandingFeatures";
import { LandingHowItWorks } from "../modules/landing/LandingHowItWorks";
import { LandingRoles } from "../modules/landing/LandingRoles";
import { LandingCTA } from "../modules/landing/LandingCTA";
import { LandingFooter } from "../modules/landing/LandingFooter";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Sora:wght@300;600;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  body { font-family:"'DM Sans','Segoe UI',sans-serif"; background:"#ffffff"; color:"#0f172a"; }

  .hero-glow {
    position:absolute; width:700px; height:700px; border-radius:50%;
    background:radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%);
    top:-200px; right:-200px; pointer-events:none;
  }
  .hero-glow2 {
    position:absolute; width:500px; height:500px; border-radius:50%;
    background:radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);
    top:200px; left:-150px; pointer-events:none;
  }
  .grid-bg {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px);
    background-size:60px 60px; pointer-events:none;
  }

  .fade-in { opacity:0; transform:translateY(24px); transition:opacity 0.8s ease, transform 0.8s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  .ecg-line { stroke-dasharray:1000; stroke-dashoffset:1000; animation:draw 3s ease forwards 0.5s; }
  @keyframes draw { to { stroke-dashoffset:0; } }

  .pulse-dot { animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

  .float-card { animation:float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  .nav-link { font-size:14px; color:#475569; text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .nav-link:hover { color:#0ea5e9; }
`;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
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
      "Features": "features",
      "How It Works": "how-it-works",
      "For Doctors": "for-doctors",
      "Predictions": "predictions"
    };
    scrollToSection(sectionMap[link]);
  };

  const goToDoctorRegistration = () => navigate("/login?role=doctor&tab=register");
  const goToPatientRegistration = () => navigate("/login?role=patient&tab=register");
  const goToLogin = () => navigate("/login?tab=login");

  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#ffffff",
      color: "#0f172a",
      minHeight: "100vh",
      overflowX: "hidden"
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* Navigation */}
      <LandingNav
        scrolled={scrolled}
        onNavClick={handleNavClick}
        onSignIn={goToLogin}
        onGetStarted={goToPatientRegistration}
      />

      {/* Hero Section */}
      <LandingHero
        visible={visible}
        onPatientSignUp={goToPatientRegistration}
        onDoctorSignUp={goToDoctorRegistration}
      />

      {/* Metrics Strip */}
      <LandingMetrics />

      {/* Features Section */}
      <section id="features">
        <LandingFeatures />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <LandingHowItWorks />
      </section>

      {/* Roles Section */}
      <section id="for-doctors">
        <LandingRoles
          onPatientSignUp={goToPatientRegistration}
          onDoctorSignUp={goToDoctorRegistration}
        />
      </section>

      {/* CTA Section */}
      <section id="predictions">
        <LandingCTA
          onGetStarted={goToPatientRegistration}
          onAPIDocsClick={() => window.open("/api-docs", "_blank")}
        />
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
