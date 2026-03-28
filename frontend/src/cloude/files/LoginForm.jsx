// ─────────────────────────────────────────────────────────────────────────────
// LoginForm
//
// Props:
//   lf       — { username, password }
//   upLf     — (key, value) => void
//   loading  — boolean
//   showP    — boolean (show/hide password)
//   setShowP — setter
//   onSubmit — form submit handler
//   onSwitch — () => void  (go to register)
//   direction — 1 | -1
//   tab      — "login" | "register"
// ─────────────────────────────────────────────────────────────────────────────
export function LoginForm({ lf, upLf, loading, showP, setShowP, onSubmit, onSwitch, direction, tab }) {
  const Eye = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 15, height: 15 }}>
      {open
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        : <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
      }
    </svg>
  );

  return (
    <div style={{
      transition: "opacity 0.26s ease, transform 0.26s ease",
      opacity: tab === "login" ? 1 : 0,
      transform: tab === "login" ? "translateX(0)" : `translateX(${direction === 1 ? -30 : 30}px)`,
      pointerEvents: tab === "login" ? "auto" : "none",
      position: tab === "login" ? "relative" : "absolute",
      top: 0, left: 0, right: 0,
    }}>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label className="lp-label">Username</label>
          <input className="lp-input" type="text" placeholder="john_doe" value={lf.username} onChange={(e) => upLf("username", e.target.value)} required autoComplete="username" />
        </div>
        <div>
          <label className="lp-label">Password</label>
          <div style={{ position: "relative" }}>
            <input className="lp-input pr" type={showP ? "text" : "password"} placeholder="••••••••" value={lf.password} onChange={(e) => upLf("password", e.target.value)} required autoComplete="current-password" />
            <button type="button" className="eye-btn" onClick={() => setShowP((p) => !p)}><Eye open={showP} /></button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
          <span style={{ fontSize: 13, color: "#0ea5e9", cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
        </div>
        <button className="lp-submit" type="submit" disabled={loading} style={{ marginTop: 2 }}>
          {loading
            ? <span className="sp" />
            : <>Sign In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 13, height: 13 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>
          }
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
          No account? <span className="link-text" onClick={onSwitch}>Create one →</span>
        </p>
      </form>
    </div>
  );
}
