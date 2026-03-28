import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { authApi } from "../services/api";

const BASE = "/api";

// ─────────────────────────────────────────────────────────────────────────────
// LoginPage — thin shell that owns state and delegates rendering to auth modules
//
// Props:
//   onAuthChange — (user) => void, called after successful login/register
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage({ onAuthChange }) {
  const [searchParams] = useSearchParams();
  const initialTab  = searchParams.get("tab")  || "login";
  const initialRole = searchParams.get("role") || "patient";

  const [tab,      setTab]      = useState(initialTab);
  const [role,     setRole]     = useState(initialRole);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [showP,    setShowP]    = useState(false);
  const [showP2,   setShowP2]   = useState(false);
  const [lf,       setLf]       = useState({ username: "", password: "" });
  const [rf,       setRf]       = useState({ username: "", email: "", password: "", password2: "", first_name: "", last_name: "", phone_number: "" });

  const [animating,  setAnimating]  = useState(false);
  const [direction,  setDirection]  = useState(1); // 1 = login→register, -1 = reverse
  const timerRef = useRef(null);
  const secondTimerRef = useRef(null);

  const upLf = (k, v) => setLf((p) => ({ ...p, [k]: v }));
  const upRf = (k, v) => setRf((p) => ({ ...p, [k]: v }));

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (secondTimerRef.current) clearTimeout(secondTimerRef.current);
    };
  }, []);

  const switchTab = (t) => {
    if (t === tab || animating) return;
    setError(""); setSuccess("");
    setDirection(t === "register" ? 1 : -1);
    setAnimating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (secondTimerRef.current) clearTimeout(secondTimerRef.current);
    
    timerRef.current = setTimeout(() => {
      setTab(t);
      secondTimerRef.current = setTimeout(() => setAnimating(false), 320);
    }, 240);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = await authApi.login(lf);
      // Validate response
      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server: missing token or user");
      }
      // Store with error handling for localStorage quota
      try {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (storageErr) {
        if (storageErr.name === 'QuotaExceededError') {
          throw new Error("Storage limit exceeded. Please clear browser data and try again.");
        } else if (storageErr.name === 'SecurityError') {
          throw new Error("Storage access denied. Check your browser privacy settings.");
        }
        throw storageErr;
      }
      if (onAuthChange) onAuthChange(data.user);
      setSuccess(`Welcome back, ${data.user.first_name || data.user.username}!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    if (rf.password !== rf.password2) { setError("Passwords do not match."); setLoading(false); return; }
    try {
      const data = await authApi.register({ ...rf, user_type: role });
      // Validate response
      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server: missing token or user");
      }
      // Store with error handling for localStorage quota
      try {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (storageErr) {
        if (storageErr.name === 'QuotaExceededError') {
          throw new Error("Storage limit exceeded. Please clear browser data and try again.");
        } else if (storageErr.name === 'SecurityError') {
          throw new Error("Storage access denied. Check your browser privacy settings.");
        }
        throw storageErr;
      }
      if (onAuthChange) onAuthChange(data.user);
      setSuccess(`Account created! Welcome, ${data.user.first_name || data.user.username}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", background: "#fff", color: "#0f172a", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .grid-bg { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px); background-size: 52px 52px; }

        .pill-tag { display: inline-flex; align-items: center; gap: 5px; background: rgba(14,165,233,0.09); border: 1px solid rgba(14,165,233,0.2); color: #0ea5e9; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; margin-bottom: 14px; }

        .tab-wrap { display: flex; background: #f1f5f9; border-radius: 10px; padding: 3px; margin-bottom: 20px; }
        .tab-btn { flex: 1; padding: 7px 0; border: none; border-radius: 8px; cursor: pointer; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; transition: all 0.22s; background: transparent; color: #94a3b8; }
        .tab-btn.on { background: #fff; color: #0f172a; box-shadow: 0 1px 5px rgba(0,0,0,0.09); }

        .lp-label { display: block; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; letter-spacing: 0.04em; text-transform: uppercase; }
        .lp-input { width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px; padding: 8px 12px; font-family: 'DM Sans', sans-serif; font-size: 14.5px; color: #0f172a; outline: none; transition: all 0.18s; }
        .lp-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.09); }
        .lp-input::placeholder { color: #c7d2dd; }
        .lp-input.pr { padding-right: 36px; }

        .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; padding: 2px; transition: color 0.15s; }
        .eye-btn:hover { color: #0ea5e9; }

        .role-wrap { display: flex; gap: 8px; margin-bottom: 11px; }
        .role-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 10px; border-radius: 9px; border: 1.5px solid #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #fff; color: #64748b; }
        .role-btn.patient-on { border-color: #0ea5e9; background: rgba(14,165,233,0.06); color: #0284c7; }
        .role-btn.doctor-on  { border-color: #8b5cf6; background: rgba(139,92,246,0.06); color: #7c3aed; }

        .lp-submit { width: 100%; padding: 10px; border: none; border-radius: 10px; cursor: pointer; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px; transition: all 0.22s; box-shadow: 0 3px 14px rgba(14,165,233,0.28); display: flex; align-items: center; justify-content: center; gap: 7px; }
        .lp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(14,165,233,0.38); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .sp { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .div-line { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 12px; margin: 9px 0; }
        .div-line::before, .div-line::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

        .alert-err { background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 8px 11px; font-size: 13px; color: #be123c; display: flex; align-items: flex-start; gap: 7px; line-height: 1.5; margin-bottom: 11px; animation: sli .22s ease; }
        .alert-ok  { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 8px 11px; font-size: 13px; color: #15803d; display: flex; align-items: center; gap: 7px; margin-bottom: 11px; animation: sli .22s ease; }
        @keyframes sli { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .form-scroll { display: flex; flex-direction: column; gap: 9px; overflow-y: auto; max-height: calc(100vh - 360px); padding-right: 2px; }
        .form-scroll::-webkit-scrollbar { width: 3px; }
        .form-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .g-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #334155; cursor: pointer; transition: all 0.18s; }
        .g-btn:hover { border-color: #0ea5e9; color: #0284c7; }

        .link-text { color: #0ea5e9; font-weight: 700; cursor: pointer; }
        .link-text:hover { text-decoration: underline; }

        .feat-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22); border-radius: 100px; padding: 6px 13px; font-size: 13.5px; color: rgba(255,255,255,0.9); font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .stat-card { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 14px 10px; text-align: center; transition: background 0.2s; }
        .stat-card:hover { background: rgba(255,255,255,0.18); }

        .fbadge { position: absolute; background: #fff; border-radius: 11px; padding: 9px 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 28px rgba(0,0,0,0.14); font-family: 'DM Sans', sans-serif; }
        .fbadge-1 { top: 10%; left: 5%; animation: fl 4s ease-in-out infinite; }
        .fbadge-2 { bottom: 14%; right: 4%; animation: fl 4s ease-in-out infinite 2s; }
        @keyframes fl { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

        .page-enter { animation: pe 0.5s ease both; }
        @keyframes pe { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Left panel ── */}
      <div style={{
        flex: "0 0 42%", position: "relative", overflow: "hidden",
        background: "linear-gradient(148deg, #0c4a6e 0%, #075985 35%, #0f172a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "44px 42px",
      }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)", top: "2%", right: "-14%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", bottom: "8%", left: "-8%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        {/* Floating badges */}
        <div className="fbadge fbadge-1">
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.07 12.93a11.96 11.96 0 003.527 5.857A11.956 11.956 0 0112 21.036a11.957 11.957 0 018.403-2.249 11.955 11.955 0 003.527-5.857A11.96 11.96 0 0020.402 6a11.959 11.959 0 01-5.402-2.286A11.959 11.959 0 0112 2.714z" /></svg>
          </div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Risk Assessed</div><div style={{ fontSize: 11, color: "#64748b" }}>Low Risk · Score 91</div></div>
        </div>
        <div className="fbadge fbadge-2">
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Appointment Booked</div><div style={{ fontSize: 11, color: "#64748b" }}>Dr. Sharma · 10:30 AM</div></div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 340 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32 }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#0ea5e9,#0284c7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: "-0.02em" }}>HealthPredictor</span>
          </div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-0.03em", lineHeight: 1.18, color: "#fff", marginBottom: 12 }}>
            Your health,<br />
            <span style={{ background: "linear-gradient(90deg,#38bdf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>predicted precisely.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 24 }}>
            AI-powered risk assessment, smart appointment booking, and verified doctor connections.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
            {[["🧠", "ML Risk Prediction"], ["📅", "Smart Booking"], ["👨‍⚕️", "Verified Doctors"], ["📊", "Health History"]].map(([icon, label]) => (
              <div key={label} className="feat-pill"><span style={{ fontSize: 13 }}>{icon}</span>{label}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
            {[["24K+", "Patients"], ["94.2%", "Accuracy"], ["380+", "Doctors"]].map(([val, label]) => (
              <div key={label} className="stat-card">
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 2 }}>{val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right — form panel ── */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "52px 48px 28px", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)", top: "-120px", right: "-80px", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }} className="page-enter">
          {/* Static header */}
          <div className="pill-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 10, height: 10 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Secure Access
          </div>
          <div style={{ marginBottom: 6 }}>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, marginBottom: 5 }}>
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, height: 20 }}>
              {tab === "login" ? "Sign in to access your health dashboard." : "Join thousands on HealthPredictor."}
            </p>
          </div>

          {/* Tabs */}
          <div className="tab-wrap">
            {[["login", "Sign In"], ["register", "Register"]].map(([id, label]) => (
              <button key={id} className={`tab-btn ${tab === id ? "on" : ""}`} onClick={() => switchTab(id)}>{label}</button>
            ))}
          </div>

          {/* Form slot */}
          <div style={{ position: "relative" }}>
            <LoginForm
              lf={lf} upLf={upLf}
              showP={showP} setShowP={setShowP}
              loading={loading} error={tab === "login" ? error : ""} success={tab === "login" ? success : ""}
              onSubmit={handleLogin}
              onSwitch={() => switchTab("register")}
              direction={direction}
              tab={tab}
            />
            <RegisterForm
              rf={rf} upRf={upRf}
              role={role} setRole={setRole}
              showP={showP} showP2={showP2} setShowP={setShowP} setShowP2={setShowP2}
              loading={loading} error={tab === "register" ? error : ""} success={tab === "register" ? success : ""}
              onSubmit={handleRegister}
              onSwitch={() => switchTab("login")}
              direction={direction}
              tab={tab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
