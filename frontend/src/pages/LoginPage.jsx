import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const BASE = "/api";

export default function LoginPage({ onAuthChange }) {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "login";
  const initialRole = searchParams.get("role") || "patient";

  const [tab, setTab] = useState(initialTab);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showP, setShowP] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [lf, setLf] = useState({ username: "", password: "" });
  const [rf, setRf] = useState({ username: "", email: "", password: "", password2: "", first_name: "", last_name: "", phone_number: "" });

  // Animation state
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = login→register, -1 = reverse
  const timerRef = useRef(null);

  const upLf = (k, v) => setLf(p => ({ ...p, [k]: v }));
  const upRf = (k, v) => setRf(p => ({ ...p, [k]: v }));

  const switchTab = (t) => {
    if (t === tab || animating) return;
    setError(""); setSuccess("");
    setDirection(t === "register" ? 1 : -1);
    setAnimating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTab(t);
      timerRef.current = setTimeout(() => setAnimating(false), 320);
    }, 240);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${BASE}/accounts/login/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lf) });
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      }
      if (!res.ok) throw new Error(data.non_field_errors?.[0] || "Invalid credentials. Please try again.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onAuthChange) onAuthChange(data.user);
      setSuccess(`Welcome back, ${data.user.first_name || data.user.username}!`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    if (rf.password !== rf.password2) { setError("Passwords do not match."); setLoading(false); return; }
    try {
      const res = await fetch(`${BASE}/accounts/register/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rf, user_type: role }) });
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      }
      if (!res.ok) throw new Error(Object.values(data).flat()[0] || "Registration failed. Please try again.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onAuthChange) onAuthChange(data.user);
      setSuccess(`Account created! Welcome, ${data.user.first_name || data.user.username}.`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const Eye = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 15, height: 15 }}>
      {open
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>}
    </svg>
  );

  // Slide direction helpers — outgoing exits opposite of incoming direction
  const loginStyle = () => {
    if (!animating) return { opacity: tab === "login" ? 1 : 0, transform: "translateX(0)", pointerEvents: tab === "login" ? "auto" : "none" };
    if (tab === "login") {
      // login is visible, animating out → exits left (going forward to register)
      return { opacity: 0, transform: `translateX(${direction === 1 ? -32 : 32}px)`, pointerEvents: "none" };
    } else {
      // login just became active, animating in
      return { opacity: 1, transform: "translateX(0)", pointerEvents: "auto" };
    }
  };
  const registerStyle = () => {
    if (!animating) return { opacity: tab === "register" ? 1 : 0, transform: "translateX(0)", pointerEvents: tab === "register" ? "auto" : "none" };
    if (tab === "register") {
      // register is visible, animating out
      return { opacity: 0, transform: `translateX(${direction === 1 ? 32 : -32}px)`, pointerEvents: "none" };
    } else {
      // register just became active, animating in
      return { opacity: 1, transform: "translateX(0)", pointerEvents: "auto" };
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", background: "#fff", color: "#0f172a", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Right panel subtle grid */
        .grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* Pill tag */
        .pill-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(14,165,233,0.09); border: 1px solid rgba(14,165,233,0.2);
          color: #0ea5e9; font-family: 'Sora', sans-serif; font-size: 11px;
          font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; margin-bottom: 14px;
        }

        /* Tabs */
        .tab-wrap { display: flex; background: #f1f5f9; border-radius: 10px; padding: 3px; margin-bottom: 20px; }
        .tab-btn {
          flex: 1; padding: 7px 0; border: none; border-radius: 8px; cursor: pointer;
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
          transition: all 0.22s; background: transparent; color: #94a3b8;
        }
        .tab-btn.on { background: #fff; color: #0f172a; box-shadow: 0 1px 5px rgba(0,0,0,0.09); }

        /* Inputs */
        .lp-label {
          display: block; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700;
          color: #374151; margin-bottom: 4px; letter-spacing: 0.04em; text-transform: uppercase;
        }
        .lp-input {
          width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 9px; padding: 8px 12px; font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; color: #0f172a; outline: none; transition: all 0.18s;
        }
        .lp-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.09); }
        .lp-input::placeholder { color: #c7d2dd; }
        .lp-input.pr { padding-right: 36px; }
        .eye-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center; padding: 2px; transition: color 0.15s;
        }
        .eye-btn:hover { color: #0ea5e9; }

        /* Role buttons */
        .role-wrap { display: flex; gap: 8px; margin-bottom: 11px; }
        .role-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 10px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; background: #fff; color: #64748b;
        }
        .role-btn.patient-on { border-color: #0ea5e9; background: rgba(14,165,233,0.06); color: #0284c7; }
        .role-btn.doctor-on  { border-color: #8b5cf6; background: rgba(139,92,246,0.06); color: #7c3aed; }

        /* Submit */
        .lp-submit {
          width: 100%; padding: 10px; border: none; border-radius: 10px; cursor: pointer;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px;
          transition: all 0.22s; box-shadow: 0 3px 14px rgba(14,165,233,0.28);
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .lp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(14,165,233,0.38); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .sp { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .div-line { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 12px; margin: 9px 0; }
        .div-line::before, .div-line::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

        /* Alerts */
        .alert-err {
          background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px;
          padding: 8px 11px; font-size: 13px; color: #be123c;
          display: flex; align-items: flex-start; gap: 7px; line-height: 1.5; margin-bottom: 11px;
          animation: sli .22s ease;
        }
        .alert-ok {
          background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px;
          padding: 8px 11px; font-size: 13px; color: #15803d;
          display: flex; align-items: center; gap: 7px; margin-bottom: 11px;
          animation: sli .22s ease;
        }
        @keyframes sli { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }

        /* Field grid */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }

        /* Form scroll (register) */
        .form-scroll { display: flex; flex-direction: column; gap: 9px; overflow-y: auto; max-height: calc(100vh - 360px); padding-right: 2px; }
        .form-scroll::-webkit-scrollbar { width: 3px; }
        .form-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        /* Google btn */
        .g-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #334155; cursor: pointer; transition: all 0.18s;
        }
        .g-btn:hover { border-color: #0ea5e9; color: #0284c7; }

        .link-text { color: #0ea5e9; font-weight: 700; cursor: pointer; }
        .link-text:hover { text-decoration: underline; }

        /* Left panel elements */
        .feat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 100px; padding: 6px 13px; font-size: 13.5px; color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .stat-card {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px; padding: 14px 10px; text-align: center; transition: background 0.2s;
        }
        .stat-card:hover { background: rgba(255,255,255,0.18); }
        .fbadge {
          position: absolute; background: #fff; border-radius: 11px;
          padding: 9px 13px; display: flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.14); font-family: 'DM Sans', sans-serif;
        }
        .fbadge-1 { top: 10%; left: 5%; animation: fl 4s ease-in-out infinite; }
        .fbadge-2 { bottom: 14%; right: 4%; animation: fl 4s ease-in-out infinite 2s; }
        @keyframes fl { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

        /* Page entry */
        .page-enter { animation: pe 0.5s ease both; }
        @keyframes pe { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div style={{
        flex: "0 0 42%", position: "relative", overflow: "hidden",
        background: "linear-gradient(148deg, #0c4a6e 0%, #075985 35%, #0f172a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "44px 42px",
      }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)", top: "2%", right: "-14%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", bottom: "8%", left: "-8%", pointerEvents: "none" }} />
        {/* Grid overlay */}
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
          {/* Logo */}
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

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
            {[["🧠", "ML Risk Prediction"], ["📅", "Smart Booking"], ["👨‍⚕️", "Verified Doctors"], ["📊", "Health History"]].map(([icon, label]) => (
              <div key={label} className="feat-pill"><span style={{ fontSize: 13 }}>{icon}</span>{label}</div>
            ))}
          </div>

          {/* Stats */}
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

      {/* ══════════ RIGHT — FORM PANEL ══════════ */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "52px 48px 28px", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)", top: "-120px", right: "-80px", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }} className="page-enter">

          {/* ── STATIC HEADER — never moves ── */}
          <div className="pill-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 10, height: 10 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Secure Access
          </div>

          {/* Title — always same height since strings are same length */}
          <div style={{ marginBottom: 6 }}>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, marginBottom: 5 }}>
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, height: 20 }}>
              {tab === "login" ? "Sign in to access your health dashboard." : "Join thousands on HealthPredictor."}
            </p>
          </div>

          {/* Tabs — fixed, always at the same Y */}
          <div className="tab-wrap">
            {[["login", "Sign In"], ["register", "Register"]].map(([id, label]) => (
              <button key={id} className={`tab-btn ${tab === id ? "on" : ""}`} onClick={() => switchTab(id)}>{label}</button>
            ))}
          </div>

          {/* ── FORM SLOT — overlay approach, zero layout shift ── */}
          <div style={{ position: "relative" }}>

            {/* Alerts float above both forms */}
            {error && <div className="alert-err"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>{error}</div>}
            {success && <div className="alert-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{success}</div>}

            {/* ── LOGIN FORM — always relative (sets height when active, hidden when not) ── */}
            <div style={{
              transition: "opacity 0.26s ease, transform 0.26s ease",
              opacity: tab === "login" ? 1 : 0,
              transform: tab === "login" ? "translateX(0)" : `translateX(${direction === 1 ? -30 : 30}px)`,
              pointerEvents: tab === "login" ? "auto" : "none",
              position: tab === "login" ? "relative" : "absolute",
              top: 0, left: 0, right: 0,
            }}>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label className="lp-label">Username</label>
                  <input className="lp-input" type="text" placeholder="john_doe" value={lf.username} onChange={e => upLf("username", e.target.value)} required autoComplete="username" />
                </div>
                <div>
                  <label className="lp-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input className="lp-input pr" type={showP ? "text" : "password"} placeholder="••••••••" value={lf.password} onChange={e => upLf("password", e.target.value)} required autoComplete="current-password" />
                    <button type="button" className="eye-btn" onClick={() => setShowP(p => !p)}><Eye open={showP} /></button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                  <span style={{ fontSize: 13, color: "#0ea5e9", cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
                </div>
                <button className="lp-submit" type="submit" disabled={loading} style={{ marginTop: 2 }}>
                  {loading ? <span className="sp" /> : <>Sign In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>}
                </button>
                <div className="div-line">or continue with</div>
                <button type="button" className="g-btn">
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  No account? <span className="link-text" onClick={() => switchTab("register")}>Create one →</span>
                </p>
              </form>
            </div>

            {/* ── REGISTER FORM — always relative when active, drives height ── */}
            <div style={{
              transition: "opacity 0.26s ease, transform 0.26s ease",
              opacity: tab === "register" ? 1 : 0,
              transform: tab === "register" ? "translateX(0)" : `translateX(${direction === 1 ? 30 : -30}px)`,
              pointerEvents: tab === "register" ? "auto" : "none",
              position: tab === "register" ? "relative" : "absolute",
              top: 0, left: 0, right: 0,
            }}>
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
                <label className="lp-label">I am a</label>
                <div className="role-wrap">
                  <button type="button" className={`role-btn ${role === "patient" ? "patient-on" : ""}`} onClick={() => setRole("patient")}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>Patient
                  </button>
                  <button type="button" className={`role-btn ${role === "doctor" ? "doctor-on" : ""}`} onClick={() => setRole("doctor")}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>Doctor
                  </button>
                </div>
                <div className="form-scroll">
                  <div className="field-row">
                    <div><label className="lp-label">First Name</label><input className="lp-input" type="text" placeholder="John" value={rf.first_name} onChange={e => upRf("first_name", e.target.value)} required /></div>
                    <div><label className="lp-label">Last Name</label><input className="lp-input" type="text" placeholder="Doe" value={rf.last_name} onChange={e => upRf("last_name", e.target.value)} required /></div>
                  </div>
                  <div className="field-row">
                    <div><label className="lp-label">Username</label><input className="lp-input" type="text" placeholder="john_doe" value={rf.username} onChange={e => upRf("username", e.target.value)} required autoComplete="username" /></div>
                    <div><label className="lp-label">Phone</label><input className="lp-input" type="tel" placeholder="+91 98765 43210" value={rf.phone_number} onChange={e => upRf("phone_number", e.target.value)} required /></div>
                  </div>
                  <div><label className="lp-label">Email</label><input className="lp-input" type="email" placeholder="john@example.com" value={rf.email} onChange={e => upRf("email", e.target.value)} required /></div>
                  <div className="field-row">
                    <div>
                      <label className="lp-label">Password</label>
                      <div style={{ position: "relative" }}><input className="lp-input pr" type={showP ? "text" : "password"} placeholder="••••••••" value={rf.password} onChange={e => upRf("password", e.target.value)} required autoComplete="new-password" /><button type="button" className="eye-btn" onClick={() => setShowP(p => !p)}><Eye open={showP} /></button></div>
                    </div>
                    <div>
                      <label className="lp-label">Confirm</label>
                      <div style={{ position: "relative" }}><input className="lp-input pr" type={showP2 ? "text" : "password"} placeholder="••••••••" value={rf.password2} onChange={e => upRf("password2", e.target.value)} required autoComplete="new-password" /><button type="button" className="eye-btn" onClick={() => setShowP2(p => !p)}><Eye open={showP2} /></button></div>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 6, marginBottom: 11, lineHeight: 1.5 }}>
                  Min 8 chars · uppercase · lowercase · number · special char
                </p>
                <button className="lp-submit" type="submit" disabled={loading}>
                  {loading ? <span className="sp" /> : `Create ${role === "doctor" ? "Doctor" : "Patient"} Account`}
                </button>
                <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 11 }}>
                  Already registered? <span className="link-text" onClick={() => switchTab("login")}>Sign in →</span>
                </p>
              </form>
            </div>

          </div>{/* end form slot */}
        </div>
      </div>
    </div>
  );
}