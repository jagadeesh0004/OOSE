import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — exact mirror of LandingPage.jsx + LoginPage.jsx
   Fonts:   Sora (headings/buttons) · DM Sans (body/data)
   Primary: #0ea5e9 → #0284c7
   BG:      linear-gradient(160deg,#f0f9ff,#faf5ff,#f0fdf4)
═══════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@300;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body { font-family:'DM Sans','Segoe UI',sans-serif; background:#fff; color:#0f172a; }
  input,select,textarea,button { font-family:'DM Sans',sans-serif; }

  /* ── Copied exactly from LandingPage ── */
  .cta-primary {
    background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff;
    font-family:'Sora',sans-serif; font-weight:700; font-size:14px;
    padding:11px 24px; border-radius:10px; border:none; cursor:pointer;
    transition:all 0.2s; box-shadow:0 4px 20px rgba(14,165,233,0.28);
    letter-spacing:0.01em; display:inline-flex; align-items:center; gap:7px;
  }
  .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(14,165,233,0.38); }
  .cta-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  .cta-ghost {
    background:transparent; color:#0f172a;
    font-family:'Sora',sans-serif; font-weight:600; font-size:14px;
    padding:11px 24px; border-radius:10px;
    border:1.5px solid #e2e8f0; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .cta-ghost:hover { border-color:#0ea5e9; color:#0ea5e9; background:rgba(14,165,233,0.04); }
  .cta-ghost:disabled { opacity:0.6; cursor:not-allowed; }

  .cta-danger {
    background:transparent; color:#ef4444;
    font-family:'Sora',sans-serif; font-weight:600; font-size:13px;
    padding:9px 18px; border-radius:10px;
    border:1.5px solid #fecaca; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:6px;
  }
  .cta-danger:hover { background:#fef2f2; border-color:#ef4444; }
  .cta-danger:disabled { opacity:0.6; cursor:not-allowed; }

  .feature-card {
    background:#ffffff; border:1.5px solid #f1f5f9; border-radius:18px;
    padding:28px; transition:all 0.3s; position:relative; overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,0.04);
  }
  .feature-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:var(--accent,linear-gradient(135deg,#0ea5e9,#0284c7));
    opacity:0; transition:opacity 0.3s;
  }
  .feature-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.09); border-color:#e2e8f0; transform:translateY(-3px); }
  .feature-card:hover::before { opacity:1; }

  .feature-card.no-hover:hover { transform:none; box-shadow:0 2px 12px rgba(0,0,0,0.04); border-color:#f1f5f9; }
  .feature-card.no-hover::before { display:none; }

  .pill-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.2);
    color:#0ea5e9; font-family:'Sora',sans-serif; font-size:10px;
    font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    padding:5px 12px; border-radius:100px;
  }

  .metric-value {
    font-family:'Sora',sans-serif; font-size:38px; font-weight:800;
    background:linear-gradient(135deg,#0ea5e9,#8b5cf6);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; line-height:1.1;
  }

  .nav-link { font-size:14px; color:#475569; cursor:pointer; transition:color 0.2s; }
  .nav-link:hover { color:#0ea5e9; }

  /* ── Patient-specific ── */
  .sidebar-item {
    display:flex; align-items:center; gap:11px;
    padding:10px 14px; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    color:#64748b; cursor:pointer; transition:all 0.18s;
    border:none; background:none; width:100%; text-align:left;
    white-space:nowrap; overflow:hidden; border-left:3px solid transparent;
  }
  .sidebar-item:hover { background:#f0f9ff; color:#0ea5e9; }
  .sidebar-item.active {
    background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(2,132,199,0.06));
    color:#0ea5e9; font-weight:600; border-left:3px solid #0ea5e9;
  }

  .appt-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:14px;
    padding:18px 22px; transition:all 0.22s;
    box-shadow:0 1px 6px rgba(0,0,0,0.04);
  }
  .appt-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); border-color:#e2e8f0; transform:translateY(-2px); }

  .doctor-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:16px;
    padding:22px; transition:all 0.25s; cursor:pointer;
    box-shadow:0 2px 10px rgba(0,0,0,0.04); position:relative; overflow:hidden;
  }
  .doctor-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(135deg,#0ea5e9,#0284c7); opacity:0; transition:opacity 0.25s;
  }
  .doctor-card:hover { box-shadow:0 10px 32px rgba(14,165,233,0.14); border-color:#bae6fd; transform:translateY(-3px); }
  .doctor-card:hover::before { opacity:1; }
  .doctor-card.selected { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,0.15); }
  .doctor-card.selected::before { opacity:1; }

  .slot-chip {
    padding:9px 16px; border-radius:10px; border:1.5px solid #e2e8f0;
    font-family:'Sora',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.18s; background:#fff; color:#475569;
    text-align:center;
  }
  .slot-chip:hover:not(.taken) { border-color:#0ea5e9; color:#0ea5e9; background:#f0f9ff; }
  .slot-chip.selected { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; border-color:transparent; box-shadow:0 3px 12px rgba(14,165,233,0.3); }
  .slot-chip.taken { background:#f8fafc; color:#cbd5e1; cursor:not-allowed; border-color:#f1f5f9; }

  .dash-input {
    width:100%; background:#fff; border:1.5px solid #e2e8f0;
    color:#0f172a; border-radius:10px; padding:10px 14px; font-size:14px;
    font-family:'DM Sans',sans-serif; transition:border-color 0.18s, box-shadow 0.18s; outline:none;
  }
  .dash-input:focus { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,0.1); }
  select.dash-input option { background:#fff; color:#0f172a; }

  .risk-low    { background:#f0fdf4; border:1.5px solid #bbf7d0; color:#16a34a; }
  .risk-medium { background:#fffbeb; border:1.5px solid #fde68a; color:#d97706; }
  .risk-high   { background:#fff1f2; border:1.5px solid #fecdd3; color:#dc2626; }

  .grid-bg-light {
    position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none; z-index:0;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes toastIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .fade-up { animation:fadeUp 0.45s ease both; }
  .float-card { animation:float 3.5s ease-in-out infinite; }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   API
═══════════════════════════════════════════════════════════════════════ */
const BASE = "/api";
async function api(path, opts = {}) {
  const token = localStorage.getItem("token");
  const method = opts.method || "GET";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(opts.headers || {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  if (res.status === 204) return {};
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.reload(); }
    throw new Error(Object.values(data).flat().find(v => typeof v === "string") || data.error || data.detail || `HTTP ${res.status}`);
  }
  return data;
}

/* ═══════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════ */
let _push;
function Toaster() {
  const [list, setList] = useState([]);
  _push = useCallback((msg, type) => {
    const id = Date.now() + Math.random();
    setList(p => [...p, { id, msg, type }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const C = { success: ["#f0fdf4", "#16a34a", "#bbf7d0"], error: ["#fff1f2", "#dc2626", "#fecdd3"], info: ["#f0f9ff", "#0ea5e9", "#bae6fd"] };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:99999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {list.map(t => {
        const [bg,fg,bd] = C[t.type] || C.info;
        return (
          <div key={t.id} style={{ animation:"toastIn 0.22s ease", background:bg, border:`1.5px solid ${bd}`, color:fg, borderRadius:12, padding:"12px 18px", fontSize:14, maxWidth:340, boxShadow:"0 8px 28px rgba(0,0,0,0.1)", pointerEvents:"auto", display:"flex", alignItems:"center", gap:10, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
            <span style={{ fontSize:15, flexShrink:0 }}>{t.type==="success"?"✓":t.type==="error"?"✕":"ℹ"}</span>{t.msg}
          </div>
        );
      })}
    </div>
  );
}
const toast = (msg, type="info") => _push?.(msg, type);

/* ═══════════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════════ */
function Ico({ d, s=18, stroke=1.8, color="currentColor", fill="none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
      {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
    </svg>
  );
}
const IC = {
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  plus:     "M12 5v14m-7-7h14",
  brain:    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  history:  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  user:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  logout:   "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  trash:    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  edit:     "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  check:    "M5 13l4 4L19 7",
  x:        "M18 6L6 18M6 6l12 12",
  alert:    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  menu:     "M4 6h16M4 12h16M4 18h16",
  hospital: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  star:     "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  chevron:  "M9 18l6-6-6-6",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  heartbeat:"M3 12h4l3-9 4 18 3-9h4",
  refresh:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  filter:   "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
};

/* ═══════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════════════════ */
function Spinner({ size=26, color="#0ea5e9" }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", border:`2.5px solid #e2e8f0`, borderTopColor:color, animation:"spin 0.75s linear infinite", flexShrink:0 }}/>;
}
function PageLoader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"72px 24px", gap:14 }}>
      <Spinner size={36}/>
      <p style={{ color:"#94a3b8", fontSize:14 }}>Loading…</p>
    </div>
  );
}
function Empty({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 32px" }}>
      <div style={{ width:64, height:64, borderRadius:16, margin:"0 auto 20px", background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)", border:"1.5px solid #bae6fd", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ico d={IC[icon]||IC.alert} s={26} color="#0ea5e9"/>
      </div>
      <p style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700, color:"#1e293b", marginBottom:8 }}>{title}</p>
      {sub && <p style={{ fontSize:14, color:"#94a3b8", lineHeight:1.6, maxWidth:300, margin:"0 auto" }}>{sub}</p>}
      {action && <div style={{ marginTop:20 }}>{action}</div>}
    </div>
  );
}
function SLabel({ children }) {
  return <label style={{ display:"block", fontFamily:"'Sora',sans-serif", fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:6 }}>{children}</label>;
}
function Field({ label, children }) { return <div><SLabel>{label}</SLabel>{children}</div>; }
function Inp({ label, ...p }) { return <Field label={label}><input className="dash-input" {...p}/></Field>; }

function StatusBadge({ status }) {
  const M = {
    pending:   { bg:"#fffbeb", fg:"#d97706", bd:"#fde68a", label:"Pending"   },
    confirmed: { bg:"#f0fdf4", fg:"#16a34a", bd:"#bbf7d0", label:"Confirmed" },
    completed: { bg:"#eff6ff", fg:"#2563eb", bd:"#bfdbfe", label:"Completed" },
    cancelled: { bg:"#fff1f2", fg:"#dc2626", bd:"#fecdd3", label:"Cancelled" },
  };
  const s = M[(status||"").toLowerCase()] || M.pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.fg, border:`1.5px solid ${s.bd}`, fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100, fontFamily:"'Sora',sans-serif", whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.fg }}/>
      {s.label}
    </span>
  );
}

function RiskBadge({ risk }) {
  const M = {
    low:    { cls:"risk-low",    icon:"✅", label:"Low Risk"    },
    medium: { cls:"risk-medium", icon:"⚠️", label:"Medium Risk" },
    high:   { cls:"risk-high",   icon:"🚨", label:"High Risk"   },
  };
  const r = M[(risk||"").toLowerCase()] || M.low;
  return (
    <span className={r.cls} style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, padding:"6px 14px", borderRadius:100, fontFamily:"'Sora',sans-serif" }}>
      {r.icon} {r.label}
    </span>
  );
}

function StatCard({ label, value, icon, color="#0ea5e9", sub, delay=0 }) {
  return (
    <div className="feature-card no-hover fade-up" style={{ animationDelay:`${delay}ms`, "--accent":`linear-gradient(135deg,${color},${color}88)` }}>
      <div style={{ position:"absolute", top:-28, right:-28, width:90, height:90, borderRadius:"50%", background:color, opacity:0.07, pointerEvents:"none" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${color}20,${color}10)`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", color }}>
          <Ico d={IC[icon]||IC.star} s={18} color={color}/>
        </div>
        <span style={{ fontFamily:"'Sora',sans-serif", fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase", marginTop:4 }}>{label}</span>
      </div>
      <p style={{ fontFamily:"'Sora',sans-serif", fontSize:36, fontWeight:800, lineHeight:1, letterSpacing:"-0.03em", color:"#0f172a", marginBottom:6 }}>{value ?? "—"}</p>
      {sub && <p style={{ fontSize:12, color:"#94a3b8" }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id:"overview",    label:"Overview",           icon:"grid"     },
  { id:"appointments",label:"My Appointments",    icon:"calendar" },
  { id:"book",        label:"Book Appointment",   icon:"plus"     },
  { id:"predict",     label:"Health Prediction",  icon:"brain"    },
  { id:"history",     label:"Prediction History", icon:"history"  },
  { id:"profile",     label:"My Profile",         icon:"user"     },
];

function Sidebar({ active, onNav, collapsed, onToggle, user }) {
  const name = user?.first_name || user?.username || "Patient";
  return (
    <aside style={{ width:collapsed?68:232, minHeight:"100vh", background:"#ffffff", borderRight:"1.5px solid #f1f5f9", display:"flex", flexDirection:"column", transition:"width 0.22s cubic-bezier(0.4,0,0.2,1)", flexShrink:0, zIndex:20, boxShadow:"2px 0 20px rgba(0,0,0,0.04)" }}>
      {/* Logo */}
      <div style={{ height:66, display:"flex", alignItems:"center", padding:collapsed?"0 18px":"0 20px", borderBottom:"1.5px solid #f1f5f9", gap:10, overflow:"hidden" }}>
        <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(14,165,233,0.35)" }}>
          <Ico d={IC.hospital} s={17} color="#fff" stroke={2}/>
        </div>
        {!collapsed && (
          <div>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, color:"#0f172a", letterSpacing:"-0.02em", lineHeight:1.1 }}>HealthPredictor</p>
            <p style={{ fontSize:10.5, color:"#94a3b8", fontWeight:500 }}>Patient Portal</p>
          </div>
        )}
        <button onClick={onToggle} style={{ marginLeft:"auto", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", padding:6, borderRadius:8, display:"flex", flexShrink:0, transition:"color 0.15s" }}
          onMouseOver={e=>e.currentTarget.style.color="#0ea5e9"} onMouseOut={e=>e.currentTarget.style.color="#94a3b8"}>
          <Ico d={IC.menu} s={16}/>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={()=>onNav(n.id)} className={`sidebar-item ${active===n.id?"active":""}`}
            style={{ justifyContent:collapsed?"center":"flex-start", paddingLeft:collapsed?0:14 }}>
            <Ico d={IC[n.icon]} s={17} color="currentColor"/>
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* User pill */}
      {!collapsed && user && (
        <div style={{ padding:"12px 16px", borderTop:"1.5px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif", boxShadow:"0 3px 10px rgba(139,92,246,0.3)" }}>
              {name[0].toUpperCase()}
            </div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</p>
              <p style={{ fontSize:11.5, color:"#94a3b8" }}>Patient</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════════════ */
function Topbar({ page, user, onLogout }) {
  const label = NAV.find(n=>n.id===page)?.label || "Dashboard";
  const name = user?.first_name || user?.username || "Patient";
  return (
    <header style={{ height:66, background:"rgba(255,255,255,0.88)", backdropFilter:"blur(16px)", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0, position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 12px rgba(0,0,0,0.05)" }}>
      <div>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>{label}</h1>
        <p style={{ fontSize:12, color:"#94a3b8", marginTop:1 }}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 14px", borderRadius:100, border:"1.5px solid #f1f5f9", background:"#fafafa" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif" }}>
            {name[0].toUpperCase()}
          </div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a" }}>{name}</span>
        </div>
        <button className="cta-ghost" onClick={onLogout} style={{ padding:"8px 16px", fontSize:13 }}>
          <Ico d={IC.logout} s={14}/> Logout
        </button>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════════════════════════ */
function Overview({ user, onNav }) {
  const [appts, setAppts]       = useState([]);
  const [lastPred, setLastPred] = useState(null);
  const [loading, setLoading]   = useState(true);
  const name = user?.first_name || user?.username || "there";

  useEffect(()=>{
    (async()=>{
      try {
        const [a, p] = await Promise.allSettled([
          api("/appointments/my-appointments/"),
          api("/predictions/history/"),
        ]);
        if(a.status==="fulfilled") setAppts(Array.isArray(a.value)?a.value:a.value?.results||[]);
        if(p.status==="fulfilled") {
          const pArr = Array.isArray(p.value)?p.value:p.value?.results||[];
          if(pArr.length>0) setLastPred(pArr[0]);
        }
      } catch{}
      setLoading(false);
    })();
  },[]);

  const upcoming = appts.filter(a=>["pending","confirmed"].includes((a.status||"").toLowerCase()));

  if(loading) return <PageLoader/>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", borderRadius:20, padding:"28px 32px", position:"relative", overflow:"hidden", boxShadow:"0 8px 32px rgba(14,165,233,0.25)" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <span className="pill-tag" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", marginBottom:14, display:"inline-flex" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#fff",animation:"pulse 2s infinite" }}/>
            Patient Portal
          </span>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:8 }}>
            Hello, {name}! 👋
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.8)" }}>Here's your health summary for today.</p>
          <div style={{ display:"flex", gap:12, marginTop:22, flexWrap:"wrap" }}>
            <button className="cta-primary" onClick={()=>onNav("book")} style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(255,255,255,0.4)", boxShadow:"none", color:"#fff", fontSize:13 }}>
              <Ico d={IC.plus} s={14} color="#fff"/> Book Appointment
            </button>
            <button className="cta-primary" onClick={()=>onNav("predict")} style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(255,255,255,0.3)", boxShadow:"none", color:"#fff", fontSize:13 }}>
              <Ico d={IC.brain} s={14} color="#fff"/> Health Check
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        <StatCard label="Total Appointments" value={appts.length}    icon="calendar" color="#0ea5e9" sub="All time"        delay={0}/>
        <StatCard label="Upcoming"           value={upcoming.length} icon="history"  color="#8b5cf6" sub="Pending/Confirmed" delay={60}/>
        <StatCard label="Completed"          value={appts.filter(a=>(a.status||"").toLowerCase()==="completed").length} icon="check" color="#22c55e" sub="Past sessions" delay={120}/>
        <StatCard label="Last Risk Level"    value={lastPred ? lastPred.risk_level?.toUpperCase().slice(0,1)+lastPred.risk_level?.toLowerCase().slice(1) : "None"} icon="brain" color="#f59e0b" sub={lastPred?new Date(lastPred.created_at).toLocaleDateString():"No prediction yet"} delay={180}/>
      </div>

      {/* Upcoming appointments */}
      <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", padding:0 }}>
        <div style={{ padding:"18px 22px", borderBottom:"1.5px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>Upcoming Appointments</h3>
          <button className="cta-ghost" onClick={()=>onNav("appointments")} style={{ padding:"7px 14px", fontSize:12 }}>View All</button>
        </div>
        {upcoming.length===0
          ? <Empty icon="calendar" title="No upcoming appointments" sub="Book an appointment with a doctor to get started." action={<button className="cta-primary" onClick={()=>onNav("book")} style={{ fontSize:13 }}><Ico d={IC.plus} s={13} color="#fff"/> Book Now</button>}/>
          : <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
              {upcoming.slice(0,4).map((a,i) => (
                <div key={a.id||i} className="appt-card fade-up" style={{ animationDelay:`${i*50}ms`, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#e0f2fe,#bae6fd)", border:"2px solid #bae6fd", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, color:"#0ea5e9", flexShrink:0 }}>
                    {(a.doctor_name||"D")[3]||"D"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a" }}>{a.doctor_name||"Doctor"}</p>
                    <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:2 }}>📅 {a.appointment_date||"—"} · 🕐 {a.appointment_time||"—"}</p>
                  </div>
                  <StatusBadge status={a.status}/>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Last prediction */}
      {lastPred && (
        <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 }}>
            <div>
              <span className="pill-tag" style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", color:"#8b5cf6", marginBottom:10, display:"inline-flex" }}>Last Prediction</span>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a", marginTop:8 }}>Health Risk Assessment</h3>
              <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:3 }}>{new Date(lastPred.created_at).toLocaleDateString("en-IN",{dateStyle:"long"})}</p>
            </div>
            <RiskBadge risk={lastPred.risk_level}/>
          </div>
          <div style={{ background:"#fafafa", borderRadius:10, padding:"12px 16px", border:"1.5px solid #f1f5f9" }}>
            <p style={{ fontSize:13.5, color:"#475569", lineHeight:1.7 }}>{lastPred.prescription||"No prescription available."}</p>
          </div>
          <button className="cta-ghost" onClick={()=>onNav("history")} style={{ marginTop:16, fontSize:13, padding:"8px 16px" }}>
            View All Predictions →
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MY APPOINTMENTS
═══════════════════════════════════════════════════════════════════════ */
function MyAppointments({ onNav }) {
  const [allAppts, setAll]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCanc] = useState(null);
  const [filterStatus, setFS] = useState("");
  const [filterDate, setFD]   = useState("");

  const load = useCallback(async()=>{
    setLoading(true);
    try { const d = await api("/appointments/my-appointments/"); setAll(Array.isArray(d)?d:d?.results||[]); }
    catch(err){ toast(err.message,"error"); }
    setLoading(false);
  },[]);
  useEffect(()=>{ load(); },[load]);

  const appts = allAppts.filter(a=>{
    const sMatch = !filterStatus || (a.status||"").toLowerCase()===filterStatus;
    const dMatch = !filterDate || (a.appointment_date||"")=== filterDate;
    return sMatch && dMatch;
  });

  async function cancel(id) {
    if(!confirm("Cancel this appointment?")) return;
    setCanc(id);
    try {
      await api(`/appointments/cancel/${id}/`,{method:"DELETE"});
      toast("Appointment cancelled","success"); load();
    } catch(err){ toast(err.message,"error"); }
    finally{ setCanc(null); }
  }

  const canCancel = a => !["completed","cancelled"].includes((a.status||"").toLowerCase());

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }} className="fade-up">
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>Appointments</span>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginTop:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em" }}>My Appointments</h2>
            <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>Track and manage your consultations</p>
          </div>
          <button className="cta-primary" onClick={()=>onNav("book")} style={{ fontSize:13 }}>
            <Ico d={IC.plus} s={14} color="#fff"/> Book New
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="feature-card no-hover" style={{ padding:20, "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"flex-end" }}>
          <Field label="Filter by Status">
            <select value={filterStatus} onChange={e=>setFS(e.target.value)} className="dash-input" style={{ width:170 }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Filter by Date">
            <input type="date" value={filterDate} onChange={e=>setFD(e.target.value)} className="dash-input" style={{ width:180 }}/>
          </Field>
          <div style={{ display:"flex", gap:8 }}>
            <button className="cta-ghost" onClick={load} style={{ padding:"10px 14px" }}><Ico d={IC.refresh} s={14}/></button>
            {(filterStatus||filterDate) && (
              <button className="cta-ghost" onClick={()=>{setFS("");setFD("");}} style={{ padding:"10px 14px", fontSize:13 }}>
                <Ico d={IC.x} s={13}/> Clear
              </button>
            )}
          </div>
        </div>
        {(filterStatus||filterDate) && allAppts.length>0 && (
          <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:10 }}>Showing {appts.length} of {allAppts.length} appointments</p>
        )}
      </div>

      {/* Cards */}
      {loading ? <PageLoader/>
        : appts.length===0
        ? <Empty icon="calendar" title="No appointments found" sub={(filterStatus||filterDate)?"Try clearing your filters.":"You have no appointments yet."} action={<button className="cta-primary" onClick={()=>onNav("book")} style={{ fontSize:13 }}><Ico d={IC.plus} s={13} color="#fff"/> Book Appointment</button>}/>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {appts.map((a,i)=>(
              <div key={a.id||i} className="appt-card fade-up" style={{ animationDelay:`${i*30}ms` }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                  {/* Doctor avatar */}
                  <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#e0f2fe,#bae6fd)", border:"2px solid #bae6fd", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:18, color:"#0ea5e9", flexShrink:0 }}>
                    {(a.doctor_name||"D")[3]||"D"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                      <p style={{ fontFamily:"'Sora',sans-serif", fontSize:15.5, fontWeight:800, color:"#0f172a" }}>{a.doctor_name||"Doctor"}</p>
                      <StatusBadge status={a.status}/>
                    </div>
                    <p style={{ fontSize:13, color:"#0ea5e9", fontWeight:600, marginBottom:8 }}>{a.doctor_specialization||"Specialist"}</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <Ico d={IC.calendar} s={14} color="#94a3b8"/>
                        <span style={{ fontSize:13, color:"#475569" }}>{a.appointment_date||"—"}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <Ico d={IC.history} s={14} color="#94a3b8"/>
                        <span style={{ fontSize:13, color:"#475569" }}>{a.appointment_time||"—"}</span>
                      </div>
                    </div>
                    {a.symptoms && (
                      <div style={{ marginTop:10, background:"#f8fafc", borderRadius:8, padding:"8px 12px", border:"1.5px solid #f1f5f9" }}>
                        <p style={{ fontSize:12, color:"#64748b", fontWeight:600, marginBottom:2 }}>Symptoms</p>
                        <p style={{ fontSize:13, color:"#475569", lineHeight:1.5 }}>{a.symptoms}</p>
                      </div>
                    )}
                    {a.notes && (
                      <div style={{ marginTop:8, background:"#f0fdf4", borderRadius:8, padding:"8px 12px", border:"1.5px solid #bbf7d0" }}>
                        <p style={{ fontSize:12, color:"#16a34a", fontWeight:600, marginBottom:2 }}>Doctor's Notes</p>
                        <p style={{ fontSize:13, color:"#166534", lineHeight:1.5 }}>{a.notes}</p>
                      </div>
                    )}
                  </div>
                  {canCancel(a) && (
                    <button className="cta-danger" onClick={()=>cancel(a.id)} disabled={cancelling===a.id} style={{ flexShrink:0 }}>
                      {cancelling===a.id ? <Spinner size={14}/> : <Ico d={IC.trash} s={14}/>}
                      {cancelling===a.id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BOOK APPOINTMENT
═══════════════════════════════════════════════════════════════════════ */
function BookAppointment() {
  const [doctors,   setDoctors]   = useState([]);
  const [selDoc,    setSelDoc]    = useState(null);
  const [slots,     setSlots]     = useState([]);
  const [selSlot,   setSelSlot]   = useState(null);
  const [selDate,   setSelDate]   = useState("");
  const [symptoms,  setSymptoms]  = useState("");
  const [step,      setStep]      = useState(1);   // 1=pick doctor, 2=pick slot, 3=confirm
  const [loadDocs,  setLoadDocs]  = useState(true);
  const [loadSlots, setLoadSlots] = useState(false);
  const [booking,   setBooking]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [booked,    setBooked]    = useState(null);

  useEffect(()=>{
    api("/doctors/list/").then(d=>setDoctors(Array.isArray(d)?d:d?.results||[])).catch(()=>{}).finally(()=>setLoadDocs(false));
  },[]);

  async function pickDoctor(doc) {
    setSelDoc(doc); setSelSlot(null); setSlots([]); setSelDate("");
    setStep(2);
  }

  async function fetchSlots() {
    if(!selDate||!selDoc) return;
    setLoadSlots(true);
    try {
      const d = await api(`/doctors/${selDoc.id}/available-slots/?date=${selDate}`);
      setSlots(Array.isArray(d)?d:d?.results||[]);
    } catch(err){ toast(err.message,"error"); }
    setLoadSlots(false);
  }

  useEffect(()=>{ if(selDate&&selDoc) fetchSlots(); },[selDate,selDoc]);

  async function book() {
    if(!selSlot||!symptoms.trim()){ toast("Please select a slot and describe your symptoms","error"); return; }
    setBooking(true);
    try {
      const res = await api("/appointments/book/",{ method:"POST", body:{ doctor_id:selDoc.id, date:selDate, slot_number:selSlot.slot_number, start_time:selSlot.start_time, symptoms }});
      setBooked(res.appointment||res);
      toast("Appointment booked successfully! 🎉","success");
      setStep(4);
    } catch(err){ toast(err.message,"error"); }
    finally{ setBooking(false); }
  }

  const filteredDocs = doctors.filter(d =>
    !search ||
    (d.user?.first_name||"").toLowerCase().includes(search.toLowerCase()) ||
    (d.user?.username||"").toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization||"").toLowerCase().includes(search.toLowerCase()) ||
    (d.hospital_name||"").toLowerCase().includes(search.toLowerCase())
  );

  const StepDot = ({ n, label }) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{
        width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:800,
        background: step>=n ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#f1f5f9",
        color: step>=n ? "#fff" : "#94a3b8",
        boxShadow: step===n ? "0 3px 10px rgba(14,165,233,0.35)" : "none",
        transition:"all 0.25s",
      }}>{step>n ? <Ico d={IC.check} s={13} color="#fff"/> : n}</div>
      <span style={{ fontFamily:"'Sora',sans-serif", fontSize:12.5, fontWeight:700, color:step>=n?"#0f172a":"#94a3b8", whiteSpace:"nowrap" }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-up">
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>New Booking</span>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", marginTop:10 }}>Book an Appointment</h2>
        <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>Find your doctor, pick a slot, and you're done.</p>
      </div>

      {/* Stepper */}
      <div className="feature-card no-hover" style={{ padding:"16px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <StepDot n={1} label="Select Doctor"/>
          <div style={{ flex:1, height:2, background:step>1?"linear-gradient(90deg,#0ea5e9,#0284c7)":"#f1f5f9", borderRadius:1, transition:"background 0.3s", minWidth:24 }}/>
          <StepDot n={2} label="Pick a Slot"/>
          <div style={{ flex:1, height:2, background:step>2?"linear-gradient(90deg,#0ea5e9,#0284c7)":"#f1f5f9", borderRadius:1, transition:"background 0.3s", minWidth:24 }}/>
          <StepDot n={3} label="Confirm"/>
          <div style={{ flex:1, height:2, background:step>3?"linear-gradient(90deg,#0ea5e9,#0284c7)":"#f1f5f9", borderRadius:1, transition:"background 0.3s", minWidth:24 }}/>
          <StepDot n={4} label="Done!"/>
        </div>
      </div>

      {/* Step 1 — Doctors */}
      {step===1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>
              <Ico d={IC.search} s={16}/>
            </div>
            <input className="dash-input" placeholder="Search by name, specialization, hospital…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:42, fontSize:14 }}/>
          </div>
          {loadDocs ? <PageLoader/>
            : filteredDocs.length===0
            ? <Empty icon="user" title="No doctors found" sub="Try a different search term."/>
            : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                {filteredDocs.map(doc=>(
                  <div key={doc.id} className="doctor-card" onClick={()=>pickDoctor(doc)}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:18, color:"#fff", flexShrink:0, boxShadow:"0 4px 14px rgba(14,165,233,0.3)" }}>
                        {(doc.user?.first_name||doc.user?.username||"D")[0].toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:800, color:"#0f172a", lineHeight:1.2 }}>
                          Dr. {doc.user?.first_name||doc.user?.username}
                        </p>
                        <p style={{ fontSize:13, color:"#0ea5e9", fontWeight:600, margin:"4px 0" }}>{doc.specialization}</p>
                        <p style={{ fontSize:12.5, color:"#64748b" }}>{doc.hospital_name}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                      <span style={{ background:"#f0f9ff", color:"#0ea5e9", border:"1px solid #bae6fd", fontSize:11.5, fontWeight:700, padding:"4px 10px", borderRadius:6, fontFamily:"'Sora',sans-serif" }}>
                        ₹{doc.consultation_fee}
                      </span>
                      <span style={{ background:"#f8fafc", color:"#64748b", border:"1px solid #e2e8f0", fontSize:11.5, fontWeight:600, padding:"4px 10px", borderRadius:6 }}>
                        {doc.experience_years} yrs exp
                      </span>
                      {doc.is_available && (
                        <span style={{ background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0", fontSize:11.5, fontWeight:700, padding:"4px 10px", borderRadius:6, fontFamily:"'Sora',sans-serif" }}>
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* Step 2 — Slots */}
      {step===2 && selDoc && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="cta-ghost" onClick={()=>setStep(1)} style={{ padding:"8px 14px", fontSize:13 }}>← Back</button>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, color:"#0f172a" }}>
                Dr. {selDoc.user?.first_name||selDoc.user?.username} · {selDoc.specialization}
              </p>
              <p style={{ fontSize:12.5, color:"#64748b" }}>{selDoc.hospital_name}</p>
            </div>
          </div>

          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <Field label="Select Date">
              <input type="date" value={selDate} min={new Date().toISOString().split("T")[0]}
                onChange={e=>{ setSelDate(e.target.value); setSelSlot(null); }}
                className="dash-input" style={{ maxWidth:220 }}/>
            </Field>
          </div>

          {selDate && (
            <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
              <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:16 }}>
                Available Slots for {selDate}
              </h4>
              {loadSlots ? <div style={{ display:"flex", justifyContent:"center", padding:24 }}><Spinner/></div>
                : slots.length===0
                ? <Empty icon="history" title="No slots available" sub="Try a different date or doctor."/>
                : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
                    {slots.map(sl=>(
                      <button key={sl.id} onClick={()=>sl.is_booked?null:setSelSlot(sl)}
                        className={`slot-chip ${sl.is_booked?"taken":""} ${selSlot?.id===sl.id?"selected":""}`}>
                        <div style={{ fontWeight:700, fontSize:13.5 }}>{sl.start_time?.slice(0,5)}</div>
                        <div style={{ fontSize:11, marginTop:2, opacity:0.75 }}>Slot #{sl.slot_number}</div>
                      </button>
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {selSlot && (
            <button className="cta-primary" onClick={()=>setStep(3)} style={{ alignSelf:"flex-start" }}>
              Continue → Confirm
            </button>
          )}
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step===3 && selDoc && selSlot && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="cta-ghost" onClick={()=>setStep(2)} style={{ padding:"8px 14px", fontSize:13 }}>← Back</button>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>Confirm Appointment</h3>
          </div>

          {/* Summary card */}
          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", background:"linear-gradient(135deg,#f0f9ff,#fafbff)", border:"1.5px solid #bae6fd" }}>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:18 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:20, color:"#fff", boxShadow:"0 4px 14px rgba(14,165,233,0.3)" }}>
                {(selDoc.user?.first_name||selDoc.user?.username||"D")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:800, color:"#0f172a" }}>Dr. {selDoc.user?.first_name||selDoc.user?.username}</p>
                <p style={{ fontSize:13, color:"#0ea5e9", fontWeight:600 }}>{selDoc.specialization}</p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Date",selDate],["Time",selSlot.start_time?.slice(0,5)+" – "+selSlot.end_time?.slice(0,5)],["Slot #",selSlot.slot_number],["Fee","₹"+selDoc.consultation_fee]].map(([l,v])=>(
                <div key={l} style={{ background:"#fff", borderRadius:8, padding:"10px 14px", border:"1.5px solid #e0f2fe" }}>
                  <p style={{ fontSize:11, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{l}</p>
                  <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <Field label="Describe Your Symptoms *">
              <textarea className="dash-input" rows={4} placeholder="Describe what you're experiencing — chest pain, headache, fever…" value={symptoms} onChange={e=>setSymptoms(e.target.value)} style={{ resize:"vertical" }}/>
            </Field>
          </div>

          <button className="cta-primary" onClick={book} disabled={booking} style={{ alignSelf:"flex-start", fontSize:14, padding:"12px 28px" }}>
            {booking ? <><Spinner size={18} color="#fff"/> Booking…</> : <>Confirm Appointment ✓</>}
          </button>
        </div>
      )}

      {/* Step 4 — Success */}
      {step===4 && booked && (
        <div className="feature-card no-hover" style={{ textAlign:"center", padding:"48px 32px", "--accent":"linear-gradient(135deg,#22c55e,#16a34a)" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(34,197,94,0.3)" }}>
            <Ico d={IC.check} s={32} color="#fff" stroke={2.5}/>
          </div>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", marginBottom:10 }}>Appointment Booked!</h3>
          <p style={{ fontSize:14, color:"#64748b", marginBottom:24, lineHeight:1.7 }}>
            Your appointment is confirmed with <strong>{booked.doctor||selDoc?.user?.first_name}</strong> on <strong>{booked.date||selDate}</strong> at <strong>{booked.start_time?.slice(0,5)||selSlot?.start_time?.slice(0,5)}</strong>.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="cta-primary" onClick={()=>{ setStep(1); setSelDoc(null); setSelSlot(null); setSelDate(""); setSymptoms(""); setBooked(null); }}>
              Book Another
            </button>
            <button className="cta-ghost" onClick={()=>window.location.reload()}>View All Appointments</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HEALTH PREDICTION
═══════════════════════════════════════════════════════════════════════ */
function Prediction({ onNav }) {
  const [form, setForm] = useState({ age:"", gender:"male", weight:"", height:"", temperature:"", blood_pressure:"", sleep:"", heart_rate:"", smoking:"no", alcohol:"no" });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const up = (k,v) => setForm(p=>({...p,[k]:v}));

  async function predict(e) {
    e.preventDefault(); setLoading(true); setResult(null);
    try {
      const res = await api("/predictions/predict/",{ method:"POST", body:{
        ...form,
        age:+form.age, weight:+form.weight, height:+form.height,
        temperature:+form.temperature, blood_pressure:+form.blood_pressure,
        sleep:+form.sleep, heart_rate:+form.heart_rate,
      }});
      setResult(res);
      toast("Prediction complete!","success");
    } catch(err){ toast(err.message,"error"); }
    finally{ setLoading(false); }
  }

  const riskGrad = { low:"linear-gradient(135deg,#22c55e,#16a34a)", medium:"linear-gradient(135deg,#f59e0b,#d97706)", high:"linear-gradient(135deg,#ef4444,#dc2626)" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-up">
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>AI Health Check</span>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", marginTop:10 }}>Health Risk Prediction</h2>
        <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>Enter your health metrics and our ML model will assess your risk level.</p>
      </div>

      {!result ? (
        <form onSubmit={predict} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Personal */}
          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Personal Information</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
              <Inp label="Age (years) *" type="number" min="1" max="120" placeholder="35" value={form.age} onChange={e=>up("age",e.target.value)} required/>
              <Field label="Gender *">
                <select value={form.gender} onChange={e=>up("gender",e.target.value)} className="dash-input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
              <Inp label="Weight (kg) *" type="number" min="20" max="300" step="0.1" placeholder="70" value={form.weight} onChange={e=>up("weight",e.target.value)} required/>
              <Inp label="Height (cm) *" type="number" min="50" max="250" placeholder="170" value={form.height} onChange={e=>up("height",e.target.value)} required/>
            </div>
          </div>

          {/* Vitals */}
          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Vital Signs</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
              <Inp label="Body Temperature (°C) *" type="number" min="35" max="42" step="0.1" placeholder="37.0" value={form.temperature} onChange={e=>up("temperature",e.target.value)} required/>
              <Inp label="Blood Pressure (systolic) *" type="number" min="50" max="250" placeholder="120" value={form.blood_pressure} onChange={e=>up("blood_pressure",e.target.value)} required/>
              <Inp label="Heart Rate (bpm) *" type="number" min="30" max="200" placeholder="72" value={form.heart_rate} onChange={e=>up("heart_rate",e.target.value)} required/>
              <Inp label="Sleep (hours/day) *" type="number" min="0" max="24" step="0.5" placeholder="7" value={form.sleep} onChange={e=>up("sleep",e.target.value)} required/>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#f43f5e,#e11d48)" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Lifestyle Factors</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Smoking *">
                <div style={{ display:"flex", gap:10, marginTop:4 }}>
                  {["no","yes"].map(v=>(
                    <button key={v} type="button" onClick={()=>up("smoking",v)} style={{
                      flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${form.smoking===v?"#0ea5e9":"#e2e8f0"}`,
                      background:form.smoking===v?"linear-gradient(135deg,#0ea5e9,#0284c7)":"#fff",
                      color:form.smoking===v?"#fff":"#64748b",
                      fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13,
                      cursor:"pointer", transition:"all 0.18s",
                    }}>{v==="no"?"🚭 No":"🚬 Yes"}</button>
                  ))}
                </div>
              </Field>
              <Field label="Alcohol *">
                <div style={{ display:"flex", gap:10, marginTop:4 }}>
                  {["no","yes"].map(v=>(
                    <button key={v} type="button" onClick={()=>up("alcohol",v)} style={{
                      flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${form.alcohol===v?"#0ea5e9":"#e2e8f0"}`,
                      background:form.alcohol===v?"linear-gradient(135deg,#0ea5e9,#0284c7)":"#fff",
                      color:form.alcohol===v?"#fff":"#64748b",
                      fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13,
                      cursor:"pointer", transition:"all 0.18s",
                    }}>{v==="no"?"🚫 No":"🍺 Yes"}</button>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          <button type="submit" disabled={loading} className="cta-primary" style={{ alignSelf:"flex-start", fontSize:14.5, padding:"13px 32px" }}>
            {loading ? <><Spinner size={18} color="#fff"/> Analyzing…</> : <><Ico d={IC.brain} s={16} color="#fff"/> Predict My Risk</>}
          </button>
        </form>
      ) : (
        /* Result */
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Risk card */}
          <div style={{
            background:riskGrad[result.risk_level?.toLowerCase()]||riskGrad.low,
            borderRadius:20, padding:"32px 36px", position:"relative", overflow:"hidden",
            boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.1)", pointerEvents:"none" }}/>
            <div style={{ position:"relative", zIndex:1 }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.75)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Your Health Risk Assessment</p>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <div>
                  <p style={{ fontFamily:"'Sora',sans-serif", fontSize:44, fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:"-0.04em" }}>
                    {result.risk_level?.toUpperCase()}
                  </p>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:6 }}>RISK</p>
                </div>
                {result.risk_score!=null && (
                  <div style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", borderRadius:14, padding:"14px 20px", border:"1.5px solid rgba(255,255,255,0.3)" }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:"#fff", lineHeight:1 }}>
                      {(result.risk_score*100).toFixed(0)}%
                    </p>
                    <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.7)", marginTop:4, fontWeight:600 }}>Risk Score</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prescription */}
          {result.prescription && (
            <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#e0f2fe,#bae6fd)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:18 }}>📋</span>
                </div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>Personalised Prescription</h3>
              </div>
              <div style={{ background:"#f8fafc", borderRadius:10, padding:"14px 18px", border:"1.5px solid #f1f5f9" }}>
                <p style={{ fontSize:14, color:"#475569", lineHeight:1.8 }}>{result.prescription}</p>
              </div>
            </div>
          )}

          {/* Recommended doctor */}
          {result.recommended_doctor && (
            <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#f43f5e,#e11d48)", border:"1.5px solid #fecdd3", background:"#fff1f2" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:22 }}>🚨</span>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#dc2626" }}>Immediate Consultation Recommended</h3>
              </div>
              <div style={{ background:"#fff", borderRadius:10, padding:"14px 18px", border:"1.5px solid #fecdd3", display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif" }}>
                  {(result.recommended_doctor.name||"D")[3]?.toUpperCase()||"D"}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14.5, color:"#0f172a" }}>{result.recommended_doctor.name}</p>
                  <p style={{ fontSize:13, color:"#0ea5e9", fontWeight:600 }}>{result.recommended_doctor.specialization}</p>
                  <p style={{ fontSize:12.5, color:"#64748b" }}>{result.recommended_doctor.hospital} · ₹{result.recommended_doctor.fee}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="cta-primary" onClick={()=>setResult(null)}>
              <Ico d={IC.refresh} s={14} color="#fff"/> New Prediction
            </button>
            <button className="cta-ghost" onClick={()=>onNav("history")}>View History →</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREDICTION HISTORY
═══════════════════════════════════════════════════════════════════════ */
function PredictionHistory({ onNav }) {
  const [all,      setAll]     = useState([]);
  const [loading,  setLoading] = useState(true);
  const [filter,   setFilter]  = useState("");
  const [expanded, setExp]     = useState(null);

  useEffect(()=>{
    api("/predictions/history/")
      .then(d=>setAll(Array.isArray(d)?d:d?.results||[]))
      .catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const list = all.filter(p=>!filter||(p.risk_level||"").toLowerCase()===filter);

  const riskColor = { low:["#f0fdf4","#16a34a","#bbf7d0"], medium:["#fffbeb","#d97706","#fde68a"], high:["#fff1f2","#dc2626","#fecdd3"] };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }} className="fade-up">
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>History</span>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginTop:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em" }}>Prediction History</h2>
            <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>Track your health risk over time</p>
          </div>
          <button className="cta-primary" onClick={()=>onNav("predict")} style={{ fontSize:13 }}>
            <Ico d={IC.brain} s={13} color="#fff"/> New Prediction
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[["","All"],["low","Low Risk"],["medium","Medium Risk"],["high","High Risk"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{
            padding:"8px 18px", borderRadius:100, border:`1.5px solid ${filter===v?"#0ea5e9":"#e2e8f0"}`,
            background:filter===v?"linear-gradient(135deg,#0ea5e9,#0284c7)":"#fff",
            color:filter===v?"#fff":"#64748b",
            fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13,
            cursor:"pointer", transition:"all 0.18s",
            boxShadow:filter===v?"0 3px 12px rgba(14,165,233,0.3)":"none",
          }}>{l}</button>
        ))}
      </div>

      {loading ? <PageLoader/>
        : list.length===0
        ? <Empty icon="brain" title="No predictions found" sub={filter?"Try selecting a different filter.":"You haven't run a health prediction yet."} action={<button className="cta-primary" onClick={()=>onNav("predict")} style={{ fontSize:13 }}><Ico d={IC.brain} s={13} color="#fff"/> Run Prediction</button>}/>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {list.map((p,i)=>{
              const risk = (p.risk_level||"low").toLowerCase();
              const [bg,fg,bd] = riskColor[risk]||riskColor.low;
              const isOpen = expanded===p.id;
              return (
                <div key={p.id||i} style={{ background:"#fff", border:"1.5px solid #f1f5f9", borderRadius:14, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s" }}>
                  <div onClick={()=>setExp(isOpen?null:p.id)} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", cursor:"pointer", flexWrap:"wrap" }}>
                    {/* Risk indicator */}
                    <div style={{ width:46, height:46, borderRadius:12, background:`linear-gradient(135deg,${fg}20,${fg}10)`, border:`1.5px solid ${bd}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:20 }}>{risk==="high"?"🚨":risk==="medium"?"⚠️":"✅"}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                        <span style={{ background:bg, color:fg, border:`1.5px solid ${bd}`, fontSize:12, fontWeight:700, padding:"3px 11px", borderRadius:100, fontFamily:"'Sora',sans-serif" }}>
                          {p.risk_level?.charAt(0).toUpperCase()+p.risk_level?.slice(1)} Risk
                        </span>
                        {p.risk_score!=null && (
                          <span style={{ fontSize:12.5, color:"#94a3b8", fontWeight:600 }}>Score: {(p.risk_score*100).toFixed(0)}%</span>
                        )}
                      </div>
                      <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:4 }}>
                        {new Date(p.created_at).toLocaleDateString("en-IN",{dateStyle:"medium"})}
                      </p>
                    </div>
                    {/* Mini metrics */}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      {[["Age",p.age],["BP",p.blood_pressure],["HR",p.heart_rate+"bpm"]].map(([l,v])=>(
                        <div key={l} style={{ textAlign:"center" }}>
                          <p style={{ fontSize:11, color:"#94a3b8", fontWeight:700, textTransform:"uppercase" }}>{l}</p>
                          <p style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a" }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <Ico d={IC.chevron} s={16} color="#94a3b8" stroke={2}/>
                  </div>

                  {isOpen && (
                    <div style={{ padding:"16px 20px", borderTop:"1.5px solid #f1f5f9", background:"#fafafa", animation:"slideIn 0.2s ease" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:16 }}>
                        {[["Weight",p.weight+"kg"],["Height",p.height+"cm"],["Temp",p.temperature+"°C"],["Sleep",p.sleep+"hrs"],["Smoking",p.smoking?"Yes":"No"],["Alcohol",p.alcohol?"Yes":"No"]].map(([l,v])=>(
                          <div key={l} style={{ background:"#fff", borderRadius:8, padding:"8px 12px", border:"1.5px solid #f1f5f9" }}>
                            <p style={{ fontSize:10.5, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{l}</p>
                            <p style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a" }}>{v}</p>
                          </div>
                        ))}
                      </div>
                      {p.prescription && (
                        <div style={{ background:"#fff", borderRadius:10, padding:"12px 16px", border:"1.5px solid #f1f5f9" }}>
                          <p style={{ fontSize:11.5, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Prescription</p>
                          <p style={{ fontSize:13.5, color:"#475569", lineHeight:1.7 }}>{p.prescription}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════════════════ */
function Profile({ user, onUserUpdate }) {
  const [form,   setForm]   = useState({ email:user?.email||"", phone_number:user?.phone_number||"" });
  const [editing,setEdit]   = useState(false);
  const [saving, setSave]   = useState(false);

  async function save() {
    setSave(true);
    try {
      const updated = await api("/accounts/profile/",{ method:"PUT", body:form });
      onUserUpdate({ ...user, ...updated });
      setEdit(false); toast("Profile updated!","success");
    } catch(err){ toast(err.message,"error"); }
    finally{ setSave(false); }
  }

  const name = user?.first_name ? `${user.first_name} ${user.last_name||""}`.trim() : user?.username || "Patient";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }} className="fade-up">
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>Account</span>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginTop:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em" }}>My Profile</h2>
            <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>Manage your account information</p>
          </div>
          {editing
            ? <div style={{ display:"flex", gap:10 }}>
                <button className="cta-ghost" onClick={()=>{setEdit(false);setForm({email:user?.email||"",phone_number:user?.phone_number||""});}}>Cancel</button>
                <button className="cta-primary" onClick={save} disabled={saving}>
                  {saving ? <><Spinner size={15} color="#fff"/> Saving…</> : <><Ico d={IC.check} s={14} color="#fff"/> Save</>}
                </button>
              </div>
            : <button className="cta-ghost" onClick={()=>setEdit(true)}><Ico d={IC.edit} s={14}/> Edit</button>
          }
        </div>
      </div>

      {/* Avatar section */}
      <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif", boxShadow:"0 6px 20px rgba(139,92,246,0.35)", flexShrink:0 }}>
          {name[0].toUpperCase()}
        </div>
        <div>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>{name}</h3>
          <p style={{ fontSize:13.5, color:"#94a3b8", marginTop:4 }}>@{user?.username}</p>
          <span className="pill-tag" style={{ marginTop:8, display:"inline-flex", background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", color:"#8b5cf6" }}>Patient Account</span>
        </div>
      </div>

      {/* Info */}
      <div className="feature-card no-hover" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Account Details</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:18 }}>
          <Field label="Full Name">
            <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0" }}>{name}</p>
          </Field>
          <Field label="Username">
            <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0" }}>@{user?.username}</p>
          </Field>
          <Field label="Email Address">
            {editing
              ? <input type="email" className="dash-input" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
              : <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0" }}>{user?.email||"—"}</p>
            }
          </Field>
          <Field label="Phone Number">
            {editing
              ? <input type="tel" className="dash-input" value={form.phone_number} onChange={e=>setForm(p=>({...p,phone_number:e.target.value}))}/>
              : <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0" }}>{user?.phone_number||"—"}</p>
            }
          </Field>
          <Field label="Account Type">
            <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0" }}>Patient</p>
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT — PatientDashboard
═══════════════════════════════════════════════════════════════════════ */
export default function PatientDashboard() {
  const [user,      setUser]      = useState(()=>{ try{ return JSON.parse(localStorage.getItem("user")); }catch{ return null; }});
  const [page,      setPage]      = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [booting,   setBooting]   = useState(true);

  const token = localStorage.getItem("token");
  const BG = "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)";

  useEffect(()=>{
    if(!token){ setBooting(false); return; }
    api("/accounts/profile/")
      .then(u=>{ setUser(u); localStorage.setItem("user",JSON.stringify(u)); })
      .catch(()=>{}).finally(()=>setBooting(false));
  },[]);

  async function logout() {
    try{ await api("/accounts/logout/",{method:"POST"}); }catch{}
    localStorage.removeItem("token"); localStorage.removeItem("user");
    window.location.reload();
  }

  if(booting) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width:52, height:52, borderRadius:13, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 28px rgba(14,165,233,0.35)", animation:"float 2s ease-in-out infinite" }}>
        <Ico d={IC.hospital} s={26} color="#fff" stroke={2}/>
      </div>
      <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:"#0f172a" }}>HealthPredictor</p>
      <Spinner size={28}/>
    </div>
  );

  if(!token) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign:"center", maxWidth:380, padding:48, "--accent":"linear-gradient(135deg,#f59e0b,#d97706)" }}>
        <Ico d={IC.alert} s={40} color="#d97706"/><br/><br/>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a" }}>Not Authenticated</h3>
        <p style={{ fontSize:14, color:"#64748b", marginTop:10, lineHeight:1.6 }}>Please log in to access the Patient Dashboard.</p>
      </div>
    </div>
  );

  if(user && user.user_type !== "patient") return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign:"center", maxWidth:380, padding:48, "--accent":"linear-gradient(135deg,#ef4444,#dc2626)" }}>
        <Ico d={IC.alert} s={40} color="#ef4444"/><br/><br/>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a" }}>Access Restricted</h3>
        <p style={{ fontSize:14, color:"#64748b", marginTop:10, lineHeight:1.6 }}>This dashboard is for patient accounts only.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:BG, fontFamily:"'DM Sans',sans-serif", color:"#0f172a" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light"/>
      <Sidebar active={page} onNav={setPage} collapsed={collapsed} onToggle={()=>setCollapsed(c=>!c)} user={user}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden", position:"relative", zIndex:1 }}>
        <Topbar page={page} user={user} onLogout={logout}/>
        <main style={{ flex:1, overflowY:"auto", padding:28 }}>
          {page==="overview"     && <Overview     user={user} onNav={setPage}/>}
          {page==="appointments" && <MyAppointments onNav={setPage}/>}
          {page==="book"         && <BookAppointment onNav={setPage}/>}
          {page==="predict"      && <Prediction onNav={setPage}/>}
          {page==="history"      && <PredictionHistory onNav={setPage}/>}
          {page==="profile"      && <Profile user={user} onUserUpdate={u=>{ setUser(u); localStorage.setItem("user",JSON.stringify(u)); }}/>}
        </main>
      </div>
      <Toaster/>
    </div>
  );
}