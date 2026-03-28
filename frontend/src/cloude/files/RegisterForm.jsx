import { EyeIcon } from "./LoginForm";

// ─────────────────────────────────────────────────────────────────────────────
// RegisterForm
//
// Props:
//   rf          — register fields state
//   upRf        — (key, val) => void
//   role        — "patient" | "doctor"
//   setRole     — setter
//   showP       — boolean
//   showP2      — boolean
//   setShowP    — setter
//   setShowP2   — setter
//   loading     — boolean
//   error       — string
//   success     — string
//   onSubmit    — form submit handler
//   onSwitchTab — () => void, go to login
//   direction   — 1 | -1
//   isActive    — boolean
// ─────────────────────────────────────────────────────────────────────────────
export function RegisterForm({ rf, upRf, role, setRole, showP, showP2, setShowP, setShowP2, loading, error, success, onSubmit, onSwitchTab, direction, isActive }) {
  return (
    <div style={{
      transition: "opacity 0.26s ease, transform 0.26s ease",
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translateX(0)" : `translateX(${direction === 1 ? 30 : -30}px)`,
      pointerEvents: isActive ? "auto" : "none",
      position: isActive ? "relative" : "absolute",
      top: 0, left: 0, right: 0,
    }}>
      {error   && <div className="alert-err"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>{error}</div>}
      {success && <div className="alert-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{success}</div>}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {/* Role selector */}
        <label className="lp-label">I am a</label>
        <div className="role-wrap">
          <button type="button" className={`role-btn ${role === "patient" ? "patient-on" : ""}`} onClick={() => setRole("patient")}>
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
            Patient
          </button>
          <button type="button" className={`role-btn ${role === "doctor" ? "doctor-on" : ""}`} onClick={() => setRole("doctor")}>
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            Doctor
          </button>
        </div>

        {/* Fields */}
        <div className="form-scroll">
          <div className="field-row">
            <div>
              <label className="lp-label">First Name</label>
              <input className="lp-input" type="text" placeholder="John" value={rf.first_name} onChange={(e) => upRf("first_name", e.target.value)} required />
            </div>
            <div>
              <label className="lp-label">Last Name</label>
              <input className="lp-input" type="text" placeholder="Doe" value={rf.last_name} onChange={(e) => upRf("last_name", e.target.value)} required />
            </div>
          </div>
          <div className="field-row">
            <div>
              <label className="lp-label">Username</label>
              <input className="lp-input" type="text" placeholder="john_doe" value={rf.username} onChange={(e) => upRf("username", e.target.value)} required autoComplete="username" />
            </div>
            <div>
              <label className="lp-label">Phone</label>
              <input className="lp-input" type="tel" placeholder="+91 98765 43210" value={rf.phone_number} onChange={(e) => upRf("phone_number", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="lp-label">Email</label>
            <input className="lp-input" type="email" placeholder="john@example.com" value={rf.email} onChange={(e) => upRf("email", e.target.value)} required />
          </div>
          <div className="field-row">
            <div>
              <label className="lp-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="lp-input pr" type={showP ? "text" : "password"} placeholder="••••••••" value={rf.password} onChange={(e) => upRf("password", e.target.value)} required autoComplete="new-password" />
                <button type="button" className="eye-btn" onClick={() => setShowP((p) => !p)}>
                  <EyeIcon open={showP} />
                </button>
              </div>
            </div>
            <div>
              <label className="lp-label">Confirm</label>
              <div style={{ position: "relative" }}>
                <input className="lp-input pr" type={showP2 ? "text" : "password"} placeholder="••••••••" value={rf.password2} onChange={(e) => upRf("password2", e.target.value)} required autoComplete="new-password" />
                <button type="button" className="eye-btn" onClick={() => setShowP2((p) => !p)}>
                  <EyeIcon open={showP2} />
                </button>
              </div>
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
          Already registered? <span className="link-text" onClick={onSwitchTab}>Sign in →</span>
        </p>
      </form>
    </div>
  );
}
