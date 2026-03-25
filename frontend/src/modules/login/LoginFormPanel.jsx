import { useState, useRef } from "react";

const BASE = "/api";

export function LoginFormPanel({ onAuthChange }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showP, setShowP] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [lf, setLf] = useState({ username: "", password: "" });
  const [rf, setRf] = useState({
    username: "", email: "", password: "", password2: "",
    first_name: "", last_name: "", phone_number: ""
  });

  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
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
      const res = await fetch(`${BASE}/accounts/login/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lf)
      });
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) data = await res.json();
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
    if (rf.password !== rf.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE}/accounts/register/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rf, user_type: role })
      });
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) data = await res.json();
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

  return (
    <div style={{
      flex: 1, position: "relative", display: "flex", alignItems: "flex-start",
      justifyContent: "center", padding: "52px 48px 28px", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", inset: 0, pointer: "none",
        backgroundImage:
          "linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)",
        backgroundSize: "52px 52px"
      }} />
      <div style={{
        position: "absolute", width: 450, height: 450, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
        top: "-120px", right: "-80px", pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: 380, position: "relative", zIndex: 1,
        animation: "pageEnter 0.5s ease both"
      }}>
        {/* Static header */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(14,165,233,0.09)", border: "1px solid rgba(14,165,233,0.2)",
          color: "#0ea5e9", fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.13em", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: "100px", marginBottom: 14
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 10, height: 10 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure Access
        </div>

        {/* Title */}
        <div style={{ marginBottom: 6 }}>
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26,
            letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, marginBottom: 5
          }}>
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{
            fontSize: 14, color: "#64748b", lineHeight: 1.5, height: 20
          }}>
            {tab === "login" ? "Sign in to access your health dashboard." : "Join thousands on HealthPredictor."}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "#f1f5f9", borderRadius: 10,
          padding: 3, marginBottom: 20
        }}>
          {[["login", "Sign In"], ["register", "Register"]].map(([id, label]) => (
            <button
              key={id}
              style={{
                flex: 1, padding: "7px 0", border: "none", borderRadius: 8,
                cursor: "pointer", fontFamily: "'Sora',sans-serif", fontSize: 13,
                fontWeight: 700, transition: "all 0.22s", background: "transparent",
                color: "#94a3b8",
                ...(tab === id && {
                  background: "#fff", color: "#0f172a",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.09)"
                })
              }}
              onClick={() => switchTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form slot */}
        <div style={{ position: "relative" }}>
          {error && <div style={{
            background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: 8,
            padding: "8px 11px", fontSize: 13, color: "#be123c",
            display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.5,
            marginBottom: 11, animation: "sli .22s ease"
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>}
          {success && <div style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 8,
            padding: "8px 11px", fontSize: 13, color: "#15803d",
            display: "flex", alignItems: "center", gap: 7, marginBottom: 11,
            animation: "sli .22s ease"
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>}

          {/* Login Form */}
          <div style={{
            transition: "opacity 0.26s ease, transform 0.26s ease",
            opacity: tab === "login" ? 1 : 0,
            transform: tab === "login" ? "translateX(0)" : `translateX(${direction === 1 ? -30 : 30}px)`,
            pointerEvents: tab === "login" ? "auto" : "none",
            position: tab === "login" ? "relative" : "absolute",
            top: 0, left: 0, right: 0
          }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{
                  display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                  fontWeight: 700, color: "#374151", marginBottom: 4,
                  letterSpacing: "0.04em", textTransform: "uppercase"
                }}>Username</label>
                <input
                  style={{
                    width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                  }}
                  onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; e.target.boxShadow = "0 0 0 3px rgba(14,165,233,0.09)"; }}
                  onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; e.target.boxShadow = "none"; }}
                  type="text" placeholder="john_doe" value={lf.username} onChange={e => upLf("username", e.target.value)} required autoComplete="username" />
              </div>
              <div>
                <label style={{
                  display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                  fontWeight: 700, color: "#374151", marginBottom: 4,
                  letterSpacing: "0.04em", textTransform: "uppercase"
                }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    style={{
                      width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 9, padding: "8px 12px", paddingRight: 36,
                      fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "#0f172a",
                      outline: "none", transition: "all 0.18s"
                    }}
                    onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; e.target.boxShadow = "0 0 0 3px rgba(14,165,233,0.09)"; }}
                    onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; e.target.boxShadow = "none"; }}
                    type={showP ? "text" : "password"} placeholder="••••••••" value={lf.password} onChange={e => upLf("password", e.target.value)} required autoComplete="current-password" />
                  <button
                    type="button"
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                      display: "flex", alignItems: "center", padding: 2, transition: "color 0.15s"
                    }}
                    onMouseOver={e => e.target.style.color = "#0ea5e9"}
                    onMouseOut={e => e.target.style.color = "#94a3b8"}
                    onClick={() => setShowP(p => !p)}
                  >
                    <Eye open={showP} />
                  </button>
                </div>
              </div>
              <button
                style={{
                  textAlign: "right", marginTop: -4, marginBottom: 2,
                  fontSize: 13, color: "#0ea5e9", cursor: "pointer",
                  fontWeight: 600, background: "none", border: "none"
                }}
              >
                Forgot password?
              </button>
              <button
                style={{
                  width: "100%", padding: 10, border: "none", borderRadius: 10,
                  cursor: "pointer", background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700,
                  fontSize: 14, transition: "all 0.22s", boxShadow: "0 3px 14px rgba(14,165,233,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  marginTop: 2
                }}
                type="submit" disabled={loading}
              >
                {loading ? <span style={{
                  width: 15, height: 15, border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite",
                  display: "inline-block"
                }} /> : <>Sign In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>}
              </button>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                color: "#cbd5e1", fontSize: 12, margin: "9px 0"
              }}>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                or continue with
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              <button type="button" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: 9, border: "1.5px solid #e2e8f0", borderRadius: 10,
                background: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                fontWeight: 500, color: "#334155", cursor: "pointer", transition: "all 0.18s"
              }}
              onMouseOver={e => { e.target.borderColor = "#0ea5e9"; e.target.color = "#0284c7"; }}
              onMouseOut={e => { e.target.borderColor = "#e2e8f0"; e.target.color = "#334155"; }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Continue with Google
              </button>
              <p style={{
                textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 4
              }}>
                No account? <span style={{
                  color: "#0ea5e9", fontWeight: 700, cursor: "pointer"
                }}
                onClick={() => switchTab("register")}
                >Create one →</span>
              </p>
            </form>
          </div>

          {/* Register Form */}
          <div style={{
            transition: "opacity 0.26s ease, transform 0.26s ease",
            opacity: tab === "register" ? 1 : 0,
            transform: tab === "register" ? "translateX(0)" : `translateX(${direction === 1 ? 30 : -30}px)`,
            pointerEvents: tab === "register" ? "auto" : "none",
            position: tab === "register" ? "relative" : "absolute",
            top: 0, left: 0, right: 0
          }}>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
              <label style={{
                display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                fontWeight: 700, color: "#374151", marginBottom: 4,
                letterSpacing: "0.04em", textTransform: "uppercase"
              }}>I am a</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 11 }}>
                {[["patient", "🧑‍💼 Patient"], ["doctor", "👨‍⚕️ Doctor"]].map(([r, label]) => (
                  <button
                    key={r}
                    type="button"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "8px 10px", borderRadius: 9, border: "1.5px solid #e2e8f0",
                      fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s", background: "#fff", color: "#64748b",
                      ...(role === r && {
                        borderColor: r === "patient" ? "#0ea5e9" : "#8b5cf6",
                        background: r === "patient" ? "rgba(14,165,233,0.06)" : "rgba(139,92,246,0.06)",
                        color: r === "patient" ? "#0284c7" : "#7c3aed"
                      })
                    }}
                    onClick={() => setRole(r)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{
                display: "flex", flexDirection: "column", gap: 9,
                overflowY: "auto", maxHeight: "calc(100vh - 360px)", paddingRight: 2
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>First Name</label>
                    <input style={{
                      width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                      fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                    }}
                    onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                    onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                    type="text" placeholder="John" value={rf.first_name} onChange={e => upRf("first_name", e.target.value)} required />
                  </div>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>Last Name</label>
                    <input style={{
                      width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                      fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                    }}
                    onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                    onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                    type="text" placeholder="Doe" value={rf.last_name} onChange={e => upRf("last_name", e.target.value)} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>Username</label>
                    <input style={{
                      width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                      fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                    }}
                    onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                    onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                    type="text" placeholder="john_doe" value={rf.username} onChange={e => upRf("username", e.target.value)} required autoComplete="username" />
                  </div>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>Phone</label>
                    <input style={{
                      width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                      fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                    }}
                    onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                    onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                    type="tel" placeholder="+91 98765 43210" value={rf.phone_number} onChange={e => upRf("phone_number", e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={{
                    display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                    fontWeight: 700, color: "#374151", marginBottom: 4,
                    letterSpacing: "0.04em", textTransform: "uppercase"
                  }}>Email</label>
                  <input style={{
                    width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: 9, padding: "8px 12px", fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14.5, color: "#0f172a", outline: "none", transition: "all 0.18s"
                  }}
                  onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                  onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                  type="email" placeholder="john@example.com" value={rf.email} onChange={e => upRf("email", e.target.value)} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input style={{
                        width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 9, padding: "8px 12px", paddingRight: 36,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "#0f172a",
                        outline: "none", transition: "all 0.18s"
                      }}
                      onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                      onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                      type={showP ? "text" : "password"} placeholder="••••••••" value={rf.password} onChange={e => upRf("password", e.target.value)} required autoComplete="new-password" />
                      <button type="button" style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                        display: "flex", alignItems: "center", padding: 2, transition: "color 0.15s"
                      }}
                      onMouseOver={e => e.target.style.color = "#0ea5e9"}
                      onMouseOut={e => e.target.style.color = "#94a3b8"}
                      onClick={() => setShowP(p => !p)}
                      >
                        <Eye open={showP} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: "block", fontFamily: "'Sora',sans-serif", fontSize: 11,
                      fontWeight: 700, color: "#374151", marginBottom: 4,
                      letterSpacing: "0.04em", textTransform: "uppercase"
                    }}>Confirm</label>
                    <div style={{ position: "relative" }}>
                      <input style={{
                        width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 9, padding: "8px 12px", paddingRight: 36,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "#0f172a",
                        outline: "none", transition: "all 0.18s"
                      }}
                      onFocus={e => { e.target.borderColor = "#0ea5e9"; e.target.background = "#fff"; }}
                      onBlur={e => { e.target.borderColor = "#e2e8f0"; e.target.background = "#f8fafc"; }}
                      type={showP2 ? "text" : "password"} placeholder="••••••••" value={rf.password2} onChange={e => upRf("password2", e.target.value)} required autoComplete="new-password" />
                      <button type="button" style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                        display: "flex", alignItems: "center", padding: 2, transition: "color 0.15s"
                      }}
                      onMouseOver={e => e.target.style.color = "#0ea5e9"}
                      onMouseOut={e => e.target.style.color = "#94a3b8"}
                      onClick={() => setShowP2(p => !p)}
                      >
                        <Eye open={showP2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: 11.5, color: "#94a3b8", marginTop: 6, marginBottom: 11, lineHeight: 1.5
              }}>
                Min 8 chars · uppercase · lowercase · number · special char
              </p>
              <button style={{
                width: "100%", padding: 10, border: "none", borderRadius: 10,
                cursor: "pointer", background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: 14, transition: "all 0.22s", boxShadow: "0 3px 14px rgba(14,165,233,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7
              }}
              type="submit" disabled={loading}
              >
                {loading ? <span style={{
                  width: 15, height: 15, border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite",
                  display: "inline-block"
                }} /> : `Create ${role === "doctor" ? "Doctor" : "Patient"} Account`}
              </button>
              <p style={{
                textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 11
              }}>
                Already registered? <span style={{
                  color: "#0ea5e9", fontWeight: 700, cursor: "pointer"
                }}
                onClick={() => switchTab("login")}
                >Sign in →</span>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pageEnter { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sli { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}
