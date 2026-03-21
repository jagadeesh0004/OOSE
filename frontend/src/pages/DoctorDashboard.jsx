import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — mirrors LandingPage.jsx & LoginPage.jsx exactly
   Fonts:   Sora (headings, labels, buttons) · DM Sans (body, data)
   Primary: #0ea5e9 → #0284c7
   BG:      linear-gradient(160deg,#f0f9ff,#faf5ff,#f0fdf4)
   Cards:   white · 1.5px solid #f1f5f9 · radius 18-24px · soft shadow
═══════════════════════════════════════════════════════════════════════════ */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@300;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body { font-family:'DM Sans','Segoe UI',sans-serif; background:#ffffff; color:#0f172a; }
  input,select,textarea,button { font-family:'DM Sans',sans-serif; }

  /* ── Landing-identical classes ── */
  .cta-primary {
    background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff;
    font-family:'Sora',sans-serif; font-weight:700; font-size:14px;
    padding:11px 24px; border-radius:10px; border:none; cursor:pointer;
    transition:all 0.2s; box-shadow:0 4px 20px rgba(14,165,233,0.28);
    letter-spacing:0.01em; display:inline-flex; align-items:center; gap:7px;
  }
  .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(14,165,233,0.38); }
  .cta-primary:disabled { opacity:0.65; cursor:not-allowed; transform:none; }

  .cta-ghost {
    background:transparent; color:#0f172a;
    font-family:'Sora',sans-serif; font-weight:600; font-size:14px;
    padding:11px 24px; border-radius:10px;
    border:1.5px solid #e2e8f0; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .cta-ghost:hover { border-color:#0ea5e9; color:#0ea5e9; background:rgba(14,165,233,0.04); }
  .cta-ghost:disabled { opacity:0.65; cursor:not-allowed; }

  .cta-danger {
    background:transparent; color:#ef4444;
    font-family:'Sora',sans-serif; font-weight:600; font-size:13px;
    padding:9px 18px; border-radius:10px;
    border:1.5px solid #fecaca; cursor:pointer; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:7px;
  }
  .cta-danger:hover { background:#fef2f2; border-color:#ef4444; }

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

  .pill-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.2);
    color:#0ea5e9; font-family:'Sora',sans-serif; font-size:10px;
    font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    padding:5px 12px; border-radius:100px;
  }

  .nav-link { font-size:14px; color:#475569; text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .nav-link:hover { color:#0ea5e9; }

  /* ── Dashboard-specific ── */
  .sidebar-item {
    display:flex; align-items:center; gap:11px;
    padding:10px 14px; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    color:#64748b; cursor:pointer; transition:all 0.18s;
    border:none; background:none; width:100%; text-align:left;
    white-space:nowrap; overflow:hidden;
  }
  .sidebar-item:hover { background:#f0f9ff; color:#0ea5e9; }
  .sidebar-item.active {
    background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(2,132,199,0.08));
    color:#0ea5e9; font-weight:600;
    border-left:3px solid #0ea5e9;
  }

  .appt-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:14px;
    padding:16px 20px; transition:all 0.22s;
    box-shadow:0 1px 6px rgba(0,0,0,0.04);
    display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  }
  .appt-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); border-color:#e2e8f0; transform:translateY(-1px); }

  .dash-input {
    width:100%; background:#fff; border:1.5px solid #e2e8f0;
    color:#0f172a; border-radius:10px; padding:10px 14px; font-size:14px;
    font-family:'DM Sans',sans-serif; transition:border-color 0.18s, box-shadow 0.18s;
    outline:none;
  }
  .dash-input:focus { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,0.1); }

  select.dash-input option { background:#fff; color:#0f172a; }

  .stat-chip {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:16px;
    padding:22px 24px; position:relative; overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,0.04);
    transition:all 0.25s; animation:fadeUp 0.5s ease both;
  }
  .stat-chip:hover { box-shadow:0 10px 32px rgba(0,0,0,0.08); transform:translateY(-2px); border-color:#e2e8f0; }

  .toggle-track {
    width:46px; height:25px; border-radius:13px;
    position:relative; cursor:pointer; transition:background 0.22s; flex-shrink:0;
    border:none; padding:0;
  }
  .toggle-knob {
    position:absolute; top:3px; width:19px; height:19px;
    border-radius:50%; background:#fff;
    box-shadow:0 1px 4px rgba(0,0,0,0.2);
    transition:left 0.22s;
  }

  .day-chip {
    padding:6px 14px; border-radius:20px; border:1.5px solid #e2e8f0;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.15s; background:#fff; color:#64748b;
  }
  .day-chip.active { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; border-color:transparent; box-shadow:0 3px 12px rgba(14,165,233,0.3); }
  .day-chip:hover:not(.active) { border-color:#0ea5e9; color:#0ea5e9; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes toastIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .float-card { animation:float 4s ease-in-out infinite; }
  .fade-up    { animation:fadeUp 0.5s ease both; }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }

  .grid-bg-light {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none;
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   API
═══════════════════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════════ */
let _pushToast;
function Toaster() {
  const [list, setList] = useState([]);
  _pushToast = useCallback((msg, type) => {
    const id = Date.now() + Math.random();
    setList(p => [...p, { id, msg, type }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const colors = { success: ["#f0fdf4","#16a34a","#bbf7d0"], error: ["#fff1f2","#dc2626","#fecdd3"], info: ["#f0f9ff","#0ea5e9","#bae6fd"] };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:99999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {list.map(t => {
        const [bg,fg,border] = colors[t.type] || colors.info;
        return (
          <div key={t.id} style={{
            animation:"toastIn 0.22s ease",
            background:bg, border:`1.5px solid ${border}`, color:fg,
            borderRadius:12, padding:"12px 18px", fontSize:14, maxWidth:340,
            boxShadow:"0 8px 32px rgba(0,0,0,0.12)", pointerEvents:"auto",
            display:"flex", alignItems:"center", gap:10,
            fontFamily:"'DM Sans',sans-serif", fontWeight:500,
          }}>
            <span style={{fontSize:16,flexShrink:0}}>{t.type==="success"?"✓":t.type==="error"?"✕":"ℹ"}</span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}
const toast = (msg, type="info") => _pushToast?.(msg, type);

/* ═══════════════════════════════════════════════════════════════════════════
   ICONS (SVG)
═══════════════════════════════════════════════════════════════════════════ */
function Ico({ d, s=18, stroke=1.8, color="currentColor", fill="none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
    </svg>
  );
}
const IC = {
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  user:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  logout:   "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  trash:    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  edit:     "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  plus:     "M12 5v14m-7-7h14",
  refresh:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  hospital: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  check:    "M5 13l4 4L19 7",
  x:        "M18 6L6 18M6 6l12 12",
  alert:    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  menu:     "M4 6h16M4 12h16M4 18h16",
  star:     "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  filter:   "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  chevDown: "M19 9l-7 7-7-7",
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */
function Spinner({ size=24, color="#0ea5e9" }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", border:`2px solid #e2e8f0`, borderTopColor:color, animation:"spin 0.75s linear infinite", flexShrink:0 }}/>;
}

function PageLoader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"72px 24px", gap:16 }}>
      <Spinner size={36}/>
      <p style={{ color:"#94a3b8", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Loading…</p>
    </div>
  );
}

function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign:"center", padding:"64px 32px" }}>
      <div style={{
        width:64, height:64, borderRadius:16, margin:"0 auto 20px",
        background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)",
        border:"1.5px solid #bae6fd",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <Ico d={IC[icon]||IC.alert} s={26} color="#0ea5e9"/>
      </div>
      <p style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700, color:"#1e293b", marginBottom:8 }}>{title}</p>
      {sub && <p style={{ fontSize:14, color:"#94a3b8", lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>{sub}</p>}
    </div>
  );
}

function SLabel({ children }) {
  return <label style={{ display:"block", fontFamily:"'Sora',sans-serif", fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:7 }}>{children}</label>;
}

function Field({ label, children }) {
  return <div><SLabel>{label}</SLabel>{children}</div>;
}

function Inp({ label, ...props }) {
  return <Field label={label}><input className="dash-input" {...props}/></Field>;
}

/* Status badges — colored pills matching landing style */
function StatusBadge({ status }) {
  const map = {
    confirmed: { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"Confirmed" },
    completed: { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe", label:"Completed" },
    cancelled: { bg:"#fff1f2", color:"#dc2626", border:"#fecdd3", label:"Cancelled" },
    pending:   { bg:"#fffbeb", color:"#d97706", border:"#fde68a", label:"Pending"   },
  };
  const s = map[(status||"").toLowerCase()] || map.pending;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:s.bg, color:s.color, border:`1.5px solid ${s.border}`,
      fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100,
      fontFamily:"'Sora',sans-serif", letterSpacing:"0.03em", whiteSpace:"nowrap",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, display:"inline-block" }}/>
      {s.label}
    </span>
  );
}

/* Stat Card — matches landing's .metric-card */
function StatCard({ label, value, icon, accentColor="#0ea5e9", sub, delay=0 }) {
  return (
    <div className="stat-chip" style={{ animationDelay:`${delay}ms`, "--accent": accentColor }}>
      <div style={{ position:"absolute", top:-30, right:-30, width:90, height:90, borderRadius:"50%", background:accentColor, opacity:0.07, pointerEvents:"none" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div style={{
          width:40, height:40, borderRadius:10,
          background:`linear-gradient(135deg,${accentColor}20,${accentColor}10)`,
          border:`1px solid ${accentColor}30`,
          display:"flex", alignItems:"center", justifyContent:"center", color:accentColor,
        }}>
          <Ico d={IC[icon]||IC.star} s={18} color={accentColor}/>
        </div>
        <span style={{ fontFamily:"'Sora',sans-serif", fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase", marginTop:4 }}>{label}</span>
      </div>
      <p style={{
        fontFamily:"'Sora',sans-serif", fontSize:36, fontWeight:800, lineHeight:1,
        letterSpacing:"-0.03em", color:"#0f172a", marginBottom:6,
      }}>{value ?? "—"}</p>
      {sub && <p style={{ fontSize:12, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif" }}>{sub}</p>}
    </div>
  );
}

/* Section card — matches landing's .feature-card */
function SectionCard({ title, action, children, noPad=false, accent="#0ea5e9" }) {
  return (
    <div className="feature-card" style={{ "--accent": `linear-gradient(135deg,${accent},${accent}99)` }}>
      {(title||action) && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: noPad ? 0 : 20, paddingBottom: noPad ? 16 : 0, borderBottom: noPad ? "1.5px solid #f1f5f9" : "none" }}>
          {title && <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a", letterSpacing:"-0.01em" }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AVAILABILITY TOGGLE
═══════════════════════════════════════════════════════════════════════════ */
function AvailabilityToggle({ doctor, onUpdate, compact=false }) {
  const [loading, setLoading] = useState(false);
  const avail = doctor?.is_available ?? false;

  async function toggle() {
    if (!doctor || loading) return;
    const next = !avail;
    onUpdate({ ...doctor, is_available: next });
    setLoading(true);
    try {
      const updated = await api("/doctors/update-profile/", { method:"PATCH", body:{ is_available:next } });
      onUpdate(updated);
      toast(`You are now ${updated.is_available ? "available for bookings" : "unavailable"}`, "success");
    } catch(err) {
      onUpdate({ ...doctor, is_available: avail });
      toast(err.message, "error");
    } finally { setLoading(false); }
  }

  if (compact) return (
    <button onClick={toggle} disabled={loading} style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"7px 16px 7px 12px", borderRadius:100,
      background: avail ? "#f0fdf4" : "#f8fafc",
      border:`1.5px solid ${avail ? "#bbf7d0" : "#e2e8f0"}`,
      color: avail ? "#16a34a" : "#64748b",
      cursor: loading ? "wait" : "pointer", fontSize:13,
      fontFamily:"'Sora',sans-serif", fontWeight:700,
      transition:"all 0.2s",
    }}>
      {loading
        ? <Spinner size={12} color={avail?"#16a34a":"#94a3b8"}/>
        : <span style={{ width:8, height:8, borderRadius:"50%", background:avail?"#16a34a":"#94a3b8", animation:avail?"pulse 2s infinite":"none" }}/>
      }
      {avail ? "Available" : "Offline"}
    </button>
  );

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <button
        onClick={toggle}
        className="toggle-track"
        style={{ background: avail ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#e2e8f0", cursor:loading?"wait":"pointer", opacity:loading?0.7:1 }}
      >
        <div className="toggle-knob" style={{ left: avail ? 24 : 4 }}/>
      </button>
      <div>
        <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:avail?"#16a34a":"#64748b" }}>
          {avail ? "Accepting Appointments" : "Not Available"}
        </p>
        <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
          {loading ? "Updating…" : "Toggle to change your availability instantly"}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id:"overview",     label:"Overview",     icon:"grid"     },
  { id:"profile",      label:"My Profile",   icon:"user"     },
  { id:"slots",        label:"Manage Slots", icon:"clock"    },
  { id:"appointments", label:"Appointments", icon:"calendar" },
];

function Sidebar({ active, onNav, collapsed, onToggle, doctor }) {
  const name = doctor?.user?.first_name || doctor?.user?.username || "Doctor";
  const initial = name[0].toUpperCase();

  return (
    <aside style={{
      width: collapsed ? 68 : 230,
      minHeight:"100vh",
      background:"#ffffff",
      borderRight:"1.5px solid #f1f5f9",
      display:"flex", flexDirection:"column",
      transition:"width 0.22s cubic-bezier(0.4,0,0.2,1)",
      flexShrink:0, position:"relative", zIndex:20,
      boxShadow:"2px 0 20px rgba(0,0,0,0.04)",
    }}>
      {/* Logo */}
      <div style={{
        height:66, display:"flex", alignItems:"center",
        padding: collapsed ? "0 18px" : "0 20px",
        borderBottom:"1.5px solid #f1f5f9", gap:10, overflow:"hidden",
      }}>
        <div style={{
          width:34, height:34, borderRadius:9, flexShrink:0,
          background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 14px rgba(14,165,233,0.35)",
        }}>
          <Ico d={IC.hospital} s={17} color="#fff" stroke={2}/>
        </div>
        {!collapsed && (
          <div>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, color:"#0f172a", letterSpacing:"-0.02em", lineHeight:1.1 }}>HealthPredictor</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10.5, color:"#94a3b8", fontWeight:500 }}>Doctor Dashboard</p>
          </div>
        )}
        <button onClick={onToggle} style={{
          marginLeft:"auto", background:"none", border:"none",
          color:"#94a3b8", cursor:"pointer", padding:6, borderRadius:8,
          display:"flex", flexShrink:0, transition:"all 0.15s",
        }}
          onMouseOver={e=>e.currentTarget.style.color="#0ea5e9"}
          onMouseOut={e=>e.currentTarget.style.color="#94a3b8"}
        >
          <Ico d={IC.menu} s={16}/>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:3 }}>
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            className={`sidebar-item ${active===n.id?"active":""}`}
            style={{ justifyContent: collapsed ? "center" : "flex-start", paddingLeft: collapsed ? 0 : 14, borderLeft: active===n.id ? "3px solid #0ea5e9" : "3px solid transparent" }}
          >
            <Ico d={IC[n.icon]} s={17} color="currentColor"/>
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* Doctor pill */}
      {!collapsed && doctor && (
        <div style={{ padding:"14px 16px", borderTop:"1.5px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:800, color:"#fff",
              fontFamily:"'Sora',sans-serif",
              boxShadow:"0 3px 10px rgba(14,165,233,0.3)",
            }}>{initial}</div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                Dr. {name}
              </p>
              <p style={{ fontSize:11.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif" }}>{doctor.specialization||"Physician"}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOPBAR — glass effect like landing nav
═══════════════════════════════════════════════════════════════════════════ */
function Topbar({ page, doctor, onUpdate, onLogout }) {
  const pageLabel = NAV_ITEMS.find(n=>n.id===page)?.label || "Dashboard";
  const name = doctor?.user?.first_name || doctor?.user?.username || "Doctor";
  const initial = name[0].toUpperCase();

  return (
    <header style={{
      height:66,
      background:"rgba(255,255,255,0.88)",
      backdropFilter:"blur(16px)",
      borderBottom:"1px solid #f1f5f9",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 28px", flexShrink:0,
      position:"sticky", top:0, zIndex:10,
      boxShadow:"0 1px 12px rgba(0,0,0,0.05)",
    }}>
      <div>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>{pageLabel}</h1>
        <p style={{ fontSize:12, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", marginTop:1 }}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </p>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {doctor && <AvailabilityToggle doctor={doctor} onUpdate={onUpdate} compact/>}

        {/* Avatar + name */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 12px", borderRadius:100, border:"1.5px solid #f1f5f9", background:"#fafafa" }}>
          <div style={{
            width:30, height:30, borderRadius:"50%",
            background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif",
          }}>{initial}</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#0f172a" }}>Dr. {name}</span>
        </div>

        <button className="cta-ghost" onClick={onLogout} style={{ padding:"8px 18px", fontSize:13 }}>
          <Ico d={IC.logout} s={14}/> Logout
        </button>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CREATE PROFILE — full onboarding form
═══════════════════════════════════════════════════════════════════════════ */
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function CreateProfile({ onDone }) {
  const [form, setForm] = useState({
    specialization:"", qualification:"", experience_years:"",
    consultation_fee:"", consultation_duration:30, slot_duration:15,
    hospital_name:"", hospital_address:"",
    available_days:["Monday","Tuesday","Wednesday","Thursday","Friday"],
    time_slots:[{start:"09:00",end:"12:00"},{start:"14:00",end:"17:00"}],
  });
  const [saving, setSaving] = useState(false);

  const up = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleDay = d => up("available_days", form.available_days.includes(d) ? form.available_days.filter(x=>x!==d) : [...form.available_days,d]);
  const updSlot  = (i,k,v) => up("time_slots", form.time_slots.map((s,j)=>j===i?{...s,[k]:v}:s));
  const addSlot  = () => up("time_slots", [...form.time_slots, {start:"09:00",end:"10:00"}]);
  const remSlot  = i  => up("time_slots", form.time_slots.filter((_,j)=>j!==i));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    try {
      await api("/doctors/create-profile/", { method:"POST", body:{
        ...form,
        experience_years:+form.experience_years, consultation_fee:+form.consultation_fee,
        consultation_duration:+form.consultation_duration, slot_duration:+form.slot_duration,
      }});
      toast("Profile created! Welcome to HealthPredictor 🎉","success");
      onDone();
    } catch(err){ toast(err.message,"error"); }
    finally { setSaving(false); }
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)",
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"56px 24px 80px", position:"relative",
    }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light"/>

      <div style={{ width:"100%", maxWidth:700, position:"relative", zIndex:1 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:20,
            background:"#fff", border:"1.5px solid #f1f5f9", borderRadius:14, padding:"10px 18px",
            boxShadow:"0 4px 20px rgba(14,165,233,0.1)",
          }}>
            <div style={{ width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#0ea5e9,#0284c7)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(14,165,233,0.3)" }}>
              <Ico d={IC.hospital} s={18} color="#fff" stroke={2}/>
            </div>
            <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:"#0f172a" }}>HealthPredictor</span>
          </div>
          <span className="pill-tag" style={{ marginBottom:20, display:"inline-flex" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#0ea5e9",animation:"pulse 2s infinite" }}/>
            One-Time Setup
          </span>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:30, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", marginBottom:10, marginTop:14 }}>
            Set Up Your Doctor Profile
          </h2>
          <p style={{ fontSize:15, color:"#64748b", lineHeight:1.7 }}>
            Complete your profile to start managing appointments and connecting with patients.
          </p>
        </div>

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Professional */}
          <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:16, borderBottom:"1.5px solid #f8fafc" }}>
              <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Ico d={IC.user} s={16} color="#0ea5e9"/>
              </div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13.5, color:"#0f172a" }}>Professional Details</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Inp label="Specialization *" placeholder="e.g. Cardiology" value={form.specialization} onChange={e=>up("specialization",e.target.value)} required/>
              <Inp label="Qualification *" placeholder="e.g. MD, MBBS" value={form.qualification} onChange={e=>up("qualification",e.target.value)} required/>
              <Inp label="Experience (years) *" type="number" min="0" value={form.experience_years} onChange={e=>up("experience_years",e.target.value)} required/>
              <Inp label="Consultation Fee (₹) *" type="number" min="0" step="0.01" value={form.consultation_fee} onChange={e=>up("consultation_fee",e.target.value)} required/>
              <Inp label="Consultation Duration (min) *" type="number" min="5" max="120" value={form.consultation_duration} onChange={e=>up("consultation_duration",e.target.value)} required/>
              <Inp label="Slot Duration (min) *" type="number" min="5" max="120" value={form.slot_duration} onChange={e=>up("slot_duration",e.target.value)} required/>
            </div>
          </div>

          {/* Hospital */}
          <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:16, borderBottom:"1.5px solid #f8fafc" }}>
              <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#ede9fe,#ddd6fe)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Ico d={IC.hospital} s={16} color="#8b5cf6"/>
              </div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13.5, color:"#0f172a" }}>Hospital Information</p>
            </div>
            <div style={{ display:"grid", gap:14 }}>
              <Inp label="Hospital Name *" placeholder="City General Hospital" value={form.hospital_name} onChange={e=>up("hospital_name",e.target.value)} required/>
              <Field label="Hospital Address *">
                <textarea value={form.hospital_address} onChange={e=>up("hospital_address",e.target.value)}
                  placeholder="123 Main Street, Hyderabad — 500001"
                  rows={2} required className="dash-input" style={{ resize:"vertical" }}/>
              </Field>
            </div>
          </div>

          {/* Schedule */}
          <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#f43f5e,#e11d48)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:16, borderBottom:"1.5px solid #f8fafc" }}>
              <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#fff1f2,#fecdd3)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Ico d={IC.calendar} s={16} color="#f43f5e"/>
              </div>
              <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13.5, color:"#0f172a" }}>Schedule</p>
            </div>
            <Field label="Available Days *">
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
                {DAYS.map(d=>(
                  <button key={d} type="button" className={`day-chip ${form.available_days.includes(d)?"active":""}`} onClick={()=>toggleDay(d)}>
                    {d.slice(0,3)}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ marginTop:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <SLabel>Working Hours *</SLabel>
                <button type="button" className="cta-ghost" onClick={addSlot} style={{ padding:"5px 14px", fontSize:12 }}>
                  <Ico d={IC.plus} s={12}/> Add Range
                </button>
              </div>
              {form.time_slots.map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <input type="time" value={s.start} onChange={e=>updSlot(i,"start",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                  <span style={{ color:"#94a3b8", fontSize:13, flexShrink:0, fontFamily:"'Sora',sans-serif" }}>to</span>
                  <input type="time" value={s.end} onChange={e=>updSlot(i,"end",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                  {form.time_slots.length>1 && (
                    <button type="button" onClick={()=>remSlot(i)} style={{ background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:6,borderRadius:8,display:"flex",transition:"all 0.15s" }}
                      onMouseOver={e=>e.currentTarget.style.background="#fff1f2"}
                      onMouseOut={e=>e.currentTarget.style.background="none"}>
                      <Ico d={IC.x} s={14}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="cta-primary"
            style={{ width:"100%", justifyContent:"center", padding:"14px 0", fontSize:15 }}>
            {saving ? <><Spinner size={18} color="#fff"/> Creating Profile…</> : <>Create Profile & Continue →</>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════════════════════════════ */
function greeting() {
  const h = new Date().getHours();
  return h<12?"morning":h<17?"afternoon":"evening";
}

function Overview({ doctor }) {
  const [stats, setStats]     = useState({ all:null, today:null, upcoming:null });
  const [todayAppts, setToday] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const [all, today, upcoming] = await Promise.allSettled([
          api("/appointments/doctor/appointments/"),
          api("/appointments/doctor/today/"),
          api("/appointments/upcoming/"),
        ]);
        const toArr = r => r.status==="fulfilled" ? (Array.isArray(r.value)?r.value:r.value?.results||[]) : [];
        const a=toArr(all), t=toArr(today), u=toArr(upcoming);
        setStats({ all:a.length, today:t.length, upcoming:u.length });
        setToday(t.slice(0,5));
      } catch{}
      setLoading(false);
    })();
  },[]);

  if(loading) return <PageLoader/>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22, animation:"fadeUp 0.4s ease" }}>

      {/* Welcome banner — matches landing hero style */}
      <div style={{
        background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)",
        borderRadius:20, padding:"28px 32px",
        position:"relative", overflow:"hidden",
        boxShadow:"0 8px 32px rgba(14,165,233,0.25)",
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <span className="pill-tag" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", marginBottom:12, display:"inline-flex" }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#fff",animation:"pulse 2s infinite" }}/>
              Good {greeting()}
            </span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.03em", lineHeight:1.2 }}>
              Dr. {doctor?.user?.first_name || doctor?.user?.username || "Doctor"} 👋
            </h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.78)", marginTop:8, fontFamily:"'DM Sans',sans-serif" }}>
              {doctor?.specialization} · {doctor?.hospital_name}
            </p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[["Today",stats.today,"📅"],["Upcoming",stats.upcoming,"⏳"]].map(([l,v,emoji])=>(
              <div key={l} style={{
                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(12px)",
                borderRadius:14, padding:"14px 20px", textAlign:"center",
                border:"1.5px solid rgba(255,255,255,0.25)", minWidth:90,
              }}>
                <p style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:"#fff", lineHeight:1 }}>{v ?? "—"}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600, marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>{emoji} {l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))", gap:16 }}>
        <StatCard label="Total Appointments" value={stats.all}      icon="calendar" accentColor="#0ea5e9" sub="All time"         delay={0}/>
        <StatCard label="Today's Schedule"   value={stats.today}    icon="clock"    accentColor="#22c55e" sub="Scheduled today"  delay={60}/>
        <StatCard label="Upcoming"           value={stats.upcoming} icon="calendar" accentColor="#f59e0b" sub="Future bookings"  delay={120}/>
        <StatCard label="Consult Fee"
          value={doctor?`₹${doctor.consultation_fee}`:"—"}
          icon="star" accentColor="#8b5cf6" sub="Per session" delay={180}/>
      </div>

      {/* Today's appointments — card list */}
      <SectionCard title="Today's Schedule" accent="#0ea5e9"
        action={
          <span className="pill-tag" style={{ fontSize:11 }}>
            {todayAppts.length} appointment{todayAppts.length!==1?"s":""}
          </span>
        }>
        {todayAppts.length===0
          ? <Empty icon="calendar" title="All clear for today" sub="No appointments scheduled. Enjoy your day!"/>
          : <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
              {todayAppts.map((a,i)=>(
                <div key={a.id||i} className="appt-card" style={{ animationDelay:`${i*50}ms` }}>
                  <div style={{
                    width:40, height:40, borderRadius:"50%", flexShrink:0,
                    background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:"#0ea5e9",
                  }}>{(a.patient_name||a.patient||"P")[0].toUpperCase()}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a" }}>
                      {a.patient_name||a.patient||"Patient"}
                    </p>
                    <p style={{ fontSize:12.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>
                      🕐 {a.slot_start_time||a.time||"—"}
                    </p>
                  </div>
                  <StatusBadge status={a.status||"pending"}/>
                </div>
              ))}
            </div>
        }
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════════════════════ */
function Profile({ doctor, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);

  useEffect(()=>{ if(doctor) setForm({...doctor}); }, [doctor]);

  const up = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleDay = d => up("available_days", (form.available_days||[]).includes(d) ? form.available_days.filter(x=>x!==d) : [...(form.available_days||[]),d]);
  const updSlot = (i,k,v) => up("time_slots",(form.time_slots||[]).map((s,j)=>j===i?{...s,[k]:v}:s));

  async function save() {
    setSaving(true);
    try {
      const updated = await api("/doctors/update-profile/", { method:"PUT", body:{
        ...form,
        experience_years:+form.experience_years, consultation_fee:+form.consultation_fee,
        consultation_duration:+form.consultation_duration, slot_duration:+form.slot_duration,
      }});
      onUpdate(updated); setEditing(false);
      toast("Profile updated successfully!","success");
    } catch(err){ toast(err.message,"error"); }
    finally{ setSaving(false); }
  }

  if(!doctor) return <PageLoader/>;
  const R = editing ? form : doctor;

  const InfoRow = ({ label, value, editKey, type="text" }) => (
    <Field label={label}>
      {editing
        ? <input type={type} value={form[editKey]??""} onChange={e=>up(editKey,e.target.value)} className="dash-input"/>
        : <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0", fontFamily:"'DM Sans',sans-serif" }}>{value||"—"}</p>
      }
    </Field>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, animation:"fadeUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
        <div>
          <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>Profile Management</span>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", marginTop:10 }}>My Profile</h2>
          <p style={{ fontSize:14, color:"#64748b", fontFamily:"'DM Sans',sans-serif", marginTop:4 }}>Manage your professional information and availability</p>
        </div>
        {editing ? (
          <div style={{ display:"flex", gap:10 }}>
            <button className="cta-ghost" onClick={()=>{setEditing(false);setForm({...doctor});}}>Cancel</button>
            <button className="cta-primary" onClick={save} disabled={saving}>
              {saving ? <><Spinner size={15} color="#fff"/> Saving…</> : <><Ico d={IC.check} s={14} color="#fff"/> Save Changes</>}
            </button>
          </div>
        ):(
          <button className="cta-ghost" onClick={()=>setEditing(true)}>
            <Ico d={IC.edit} s={14}/> Edit Profile
          </button>
        )}
      </div>

      {/* Availability */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#22c55e,#16a34a)" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:16 }}>Availability Status</h3>
        <AvailabilityToggle doctor={doctor} onUpdate={onUpdate}/>
      </div>

      {/* Professional */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Professional Details</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:18 }}>
          <InfoRow label="Specialization"           value={doctor.specialization}        editKey="specialization"/>
          <InfoRow label="Qualification"            value={doctor.qualification}         editKey="qualification"/>
          <InfoRow label="Experience (years)"       value={doctor.experience_years}      editKey="experience_years"      type="number"/>
          <InfoRow label="Consultation Fee (₹)"     value={doctor.consultation_fee}      editKey="consultation_fee"      type="number"/>
          <InfoRow label="Consultation Duration (min)" value={doctor.consultation_duration} editKey="consultation_duration" type="number"/>
          <InfoRow label="Slot Duration (min)"      value={doctor.slot_duration}         editKey="slot_duration"         type="number"/>
        </div>
      </div>

      {/* Hospital */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Hospital Information</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:18 }}>
          <InfoRow label="Hospital Name"    value={doctor.hospital_name}    editKey="hospital_name"/>
          <Field label="Hospital Address">
            {editing
              ? <textarea value={form.hospital_address||""} onChange={e=>up("hospital_address",e.target.value)} rows={2} className="dash-input" style={{ resize:"vertical" }}/>
              : <p style={{ fontSize:14.5, color:"#1e293b", fontWeight:600, padding:"10px 0", fontFamily:"'DM Sans',sans-serif" }}>{doctor.hospital_address||"—"}</p>
            }
          </Field>
        </div>
      </div>

      {/* Schedule */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#f43f5e,#e11d48)" }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:20 }}>Schedule</h3>
        <Field label="Available Days">
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
            {DAYS.map(d=>{
              const on = (R.available_days||[]).includes(d);
              return (
                <button key={d} type="button" className={`day-chip ${on?"active":""}`}
                  onClick={()=>editing&&toggleDay(d)}
                  style={{ cursor:editing?"pointer":"default", opacity:editing||on?1:0.55 }}>
                  {d.slice(0,3)}
                </button>
              );
            })}
          </div>
        </Field>

        <div style={{ marginTop:20 }}>
          <SLabel>Working Hours</SLabel>
          {editing
            ? (form.time_slots||[]).map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
                  <input type="time" value={s.start} onChange={e=>updSlot(i,"start",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                  <span style={{ color:"#94a3b8", fontFamily:"'Sora',sans-serif", fontSize:13 }}>→</span>
                  <input type="time" value={s.end} onChange={e=>updSlot(i,"end",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                </div>
              ))
            : (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
                {(doctor.time_slots||[]).map((s,i)=>(
                  <span key={i} style={{
                    background:"#f0f9ff", border:"1.5px solid #bae6fd",
                    borderRadius:8, padding:"6px 14px", fontSize:13, color:"#0ea5e9",
                    fontFamily:"'Sora',sans-serif", fontWeight:600,
                  }}>
                    {s.start} → {s.end}
                  </span>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLOTS
═══════════════════════════════════════════════════════════════════════════ */
function Slots() {
  const [allSlots,   setAllSlots]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [filterDate, setFDate]     = useState("");
  const [filterBook, setFBook]     = useState("all");
  const [showGen,    setShowGen]   = useState(false);
  const [delDate,    setDelDate]   = useState("");
  const [genLoading, setGenLoad]   = useState(false);
  const [genForm,    setGenForm]   = useState({
    start_date:"", end_date:"",
    time_slots:[{start:"09:00",end:"12:00"}],
    days_to_generate:["Monday","Tuesday","Wednesday","Thursday","Friday"],
  });

  const upG = (k,v) => setGenForm(p=>({...p,[k]:v}));
  const toggleGenDay = d => upG("days_to_generate", genForm.days_to_generate.includes(d) ? genForm.days_to_generate.filter(x=>x!==d) : [...genForm.days_to_generate,d]);
  const updGenSlot = (i,k,v) => upG("time_slots", genForm.time_slots.map((s,j)=>j===i?{...s,[k]:v}:s));

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const d = await api("/doctors/my-slots/");
      setAllSlots(Array.isArray(d)?d:d?.results||[]);
    } catch(err){ toast(err.message,"error"); }
    setLoading(false);
  },[]);
  useEffect(()=>{ load(); },[load]);

  // Client-side filtering
  const slots = allSlots.filter(s => {
    const dMatch = !filterDate || s.date === filterDate;
    const bMatch = filterBook==="all" ? true : filterBook==="booked" ? s.is_booked===true : s.is_booked===false;
    return dMatch && bMatch;
  });

  async function generate() {
    if(!genForm.start_date||!genForm.end_date){ toast("Select start and end dates","error"); return; }
    setGenLoad(true);
    try {
      const res = await api("/doctors/generate-slots/",{method:"POST",body:genForm});
      toast(`Generated ${res.generated_slots_count||"?"} slots!`,"success");
      setShowGen(false); load();
    } catch(err){ toast(err.message,"error"); }
    finally{ setGenLoad(false); }
  }

  async function deleteSlot(id) {
    if(!confirm("Delete this slot?")) return;
    try { await api(`/doctors/delete-slot/${id}/`,{method:"DELETE"}); toast("Slot deleted","success"); load(); }
    catch(err){ toast(err.message,"error"); }
  }

  async function deleteByDate() {
    if(!delDate){ toast("Pick a date first","error"); return; }
    if(!confirm(`Delete all slots for ${delDate}?`)) return;
    try {
      const res = await api("/doctors/delete-slot/",{method:"DELETE",body:{date:delDate}});
      toast(`Deleted ${res.deleted_count||"?"} slots`,"success"); setDelDate(""); load();
    } catch(err){ toast(err.message,"error"); }
  }

  async function deleteAll() {
    if(!confirm("Delete ALL your slots? This cannot be undone.")) return;
    try {
      const res = await api("/doctors/delete-all-slots/",{method:"DELETE"});
      toast(`Deleted ${res.deleted_count||"?"} slots`,"success"); load();
    } catch(err){ toast(err.message,"error"); }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, animation:"fadeUp 0.4s ease" }}>
      {/* Header */}
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>Slot Management</span>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginTop:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em" }}>Manage Slots</h2>
            <p style={{ fontSize:14, color:"#64748b", fontFamily:"'DM Sans',sans-serif", marginTop:4 }}>Generate, view and manage your consultation time slots</p>
          </div>
          <button className="cta-primary" onClick={()=>setShowGen(!showGen)}>
            <Ico d={IC.plus} s={14} color="#fff"/> Generate Slots
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", padding:20 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"flex-end" }}>
          <Field label="Filter by Date" >
            <input type="date" value={filterDate} onChange={e=>setFDate(e.target.value)} className="dash-input" style={{ width:180 }}/>
          </Field>
          <Field label="Booking Status">
            <select value={filterBook} onChange={e=>setFBook(e.target.value)} className="dash-input" style={{ width:160 }}>
              <option value="all">All Slots</option>
              <option value="booked">Booked</option>
              <option value="unbooked">Available</option>
            </select>
          </Field>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", flexWrap:"wrap" }}>
            <button className="cta-ghost" onClick={load} style={{ padding:"10px 16px" }}>
              <Ico d={IC.refresh} s={14}/>
            </button>
            {(filterDate||filterBook!=="all") && (
              <button className="cta-ghost" onClick={()=>{setFDate("");setFBook("all");}} style={{ padding:"10px 16px", fontSize:13 }}>
                <Ico d={IC.x} s={13}/> Clear
              </button>
            )}
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <input type="date" value={delDate} onChange={e=>setDelDate(e.target.value)} className="dash-input" style={{ width:165 }} title="Delete slots by date"/>
              <button className="cta-danger" onClick={deleteByDate} style={{ padding:"10px 14px" }}>
                <Ico d={IC.trash} s={14}/>
              </button>
            </div>
            <button className="cta-danger" onClick={deleteAll}>Delete All</button>
          </div>
        </div>
        {(filterDate||filterBook!=="all") && allSlots.length>0 && (
          <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:12, fontFamily:"'DM Sans',sans-serif" }}>
            Showing {slots.length} of {allSlots.length} slots
          </p>
        )}
      </div>

      {/* Generate panel */}
      {showGen && (
        <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", border:"1.5px solid #bae6fd", animation:"slideIn 0.22s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:16, borderBottom:"1.5px solid #f0f9ff" }}>
            <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>⚡</span>
            </div>
            <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:14, color:"#0ea5e9" }}>Auto-Generate Slots</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <Inp label="Start Date *" type="date" value={genForm.start_date} onChange={e=>upG("start_date",e.target.value)}/>
            <Inp label="End Date *"   type="date" value={genForm.end_date}   onChange={e=>upG("end_date",e.target.value)}/>
          </div>
          <Field label="Days to Generate">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
              {DAYS.map(d=>(
                <button key={d} type="button" className={`day-chip ${genForm.days_to_generate.includes(d)?"active":""}`} onClick={()=>toggleGenDay(d)}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>
          </Field>
          <div style={{ marginTop:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <SLabel>Time Ranges</SLabel>
              <button type="button" className="cta-ghost" onClick={()=>upG("time_slots",[...genForm.time_slots,{start:"09:00",end:"10:00"}])} style={{ padding:"5px 12px", fontSize:12 }}>+ Add</button>
            </div>
            {genForm.time_slots.map((s,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <input type="time" value={s.start} onChange={e=>updGenSlot(i,"start",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                <span style={{ color:"#94a3b8", fontSize:13, fontFamily:"'Sora',sans-serif" }}>to</span>
                <input type="time" value={s.end} onChange={e=>updGenSlot(i,"end",e.target.value)} className="dash-input" style={{ flex:1 }}/>
                {genForm.time_slots.length>1 && (
                  <button type="button" onClick={()=>upG("time_slots",genForm.time_slots.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:6,borderRadius:8 }}>
                    <Ico d={IC.x} s={14}/>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button className="cta-primary" onClick={generate} disabled={genLoading}>
              {genLoading ? <><Spinner size={16} color="#fff"/> Generating…</> : "Generate"}
            </button>
            <button className="cta-ghost" onClick={()=>setShowGen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Slots list — card-based rows */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", padding:0 }}>
        <div style={{ padding:"18px 22px", borderBottom:"1.5px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>My Time Slots</h3>
          <span className="pill-tag">{allSlots.length} total</span>
        </div>

        {loading ? <PageLoader/>
          : slots.length===0
          ? <Empty icon="clock"
              title={allSlots.length===0 ? "No slots yet" : "No slots match your filters"}
              sub={allSlots.length===0 ? "Click 'Generate Slots' to create your availability." : "Try changing the date or status filter."}/>
          : (
            <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
              {slots.map((s,i)=>(
                <div key={s.id} className="appt-card" style={{ animationDelay:`${i*20}ms` }}>
                  {/* Date badge */}
                  <div style={{
                    background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                    border:"1.5px solid #bae6fd", borderRadius:10,
                    padding:"8px 14px", textAlign:"center", flexShrink:0,
                  }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:11, fontWeight:700, color:"#0ea5e9", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      {s.day?.slice(0,3)||"—"}
                    </p>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:800, color:"#0f172a", lineHeight:1.1, marginTop:2 }}>
                      {s.date?.split("-")[2]||"—"}
                    </p>
                    <p style={{ fontSize:10.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif" }}>
                      {s.date?.slice(0,7)||""}
                    </p>
                  </div>
                  {/* Time */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:"#0f172a" }}>
                      {s.start_time?.slice(0,5)} — {s.end_time?.slice(0,5)}
                    </p>
                    <p style={{ fontSize:12.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", marginTop:3 }}>
                      Duration: {s.slot_duration} min
                    </p>
                  </div>
                  {/* Status */}
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    background: s.is_booked ? "#fffbeb" : "#f0fdf4",
                    color:  s.is_booked ? "#d97706" : "#16a34a",
                    border: `1.5px solid ${s.is_booked ? "#fde68a" : "#bbf7d0"}`,
                    fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100,
                    fontFamily:"'Sora',sans-serif", whiteSpace:"nowrap",
                  }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:s.is_booked?"#d97706":"#16a34a" }}/>
                    {s.is_booked ? "Booked" : "Available"}
                  </span>
                  {/* Delete */}
                  {!s.is_booked && (
                    <button className="cta-danger" onClick={()=>deleteSlot(s.id)} style={{ padding:"7px 12px", flexShrink:0 }}>
                      <Ico d={IC.trash} s={14}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APPOINTMENTS
═══════════════════════════════════════════════════════════════════════════ */
const STATUS_OPTS = ["Pending","Confirmed","Completed","Cancelled"];
const BLANK_FILTERS = { date:"", status:"", search:"" };

function Appointments() {
  const [view,     setView]     = useState("all");
  const [allAppts, setAllAppts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filters,  setFilters]  = useState(BLANK_FILTERS);

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const path = view==="today" ? "/appointments/doctor/today/" : view==="upcoming" ? "/appointments/upcoming/" : "/appointments/doctor/appointments/";
      const d = await api(path);
      setAllAppts(Array.isArray(d)?d:d?.results||[]);
    } catch(err){ toast(err.message,"error"); }
    setLoading(false);
  },[view]);
  useEffect(()=>{ load(); },[load]);

  const displayed = allAppts.filter(a => {
    const dMatch = !filters.date   || (a.slot_date||a.date||"")=== filters.date;
    const sMatch = !filters.status || (a.status||"").toLowerCase()===filters.status.toLowerCase();
    const qMatch = !filters.search || (a.patient_name||a.patient||"").toLowerCase().includes(filters.search.toLowerCase());
    return dMatch && sMatch && qMatch;
  });

  async function changeStatus(id, newStatus) {
    const oldAppt = allAppts.find(a=>a.id===id);
    if(!oldAppt) return;
    const oldStatus = oldAppt.status;
    setUpdating(id);
    setAllAppts(p=>p.map(a=>a.id===id?{...a,status:newStatus}:a));
    try {
      await api(`/appointments/doctor/update-status/${id}/`,{method:"PATCH",body:{status:newStatus}});
      toast(`Status updated to ${newStatus}!`,"success");
    } catch(err) {
      setAllAppts(p=>p.map(a=>a.id===id?{...a,status:oldStatus}:a));
      toast("Failed: "+err.message,"error");
    } finally { setUpdating(null); }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, animation:"fadeUp 0.4s ease" }}>
      {/* Header */}
      <div>
        <span className="pill-tag" style={{ marginBottom:10, display:"inline-flex" }}>Appointment Management</span>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", marginTop:10 }}>Appointments</h2>
        <p style={{ fontSize:14, color:"#64748b", fontFamily:"'DM Sans',sans-serif", marginTop:4 }}>View, filter and update the status of your consultations</p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:12, padding:5, width:"fit-content" }}>
        {[["all","All"],["today","Today"],["upcoming","Upcoming"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setView(v);setFilters(BLANK_FILTERS);}} style={{
            padding:"8px 22px", borderRadius:9, border:"none", cursor:"pointer",
            background: view===v ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
            color: view===v ? "#fff" : "#64748b",
            fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13,
            transition:"all 0.18s",
            boxShadow: view===v ? "0 3px 14px rgba(14,165,233,0.3)" : "none",
          }}>{l}</button>
        ))}
      </div>

      {/* Filters */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", padding:20 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"flex-end" }}>
          <Field label="Filter by Date">
            <input type="date" value={filters.date} onChange={e=>setFilters(f=>({...f,date:e.target.value}))} className="dash-input" style={{ width:180 }}/>
          </Field>
          <Field label="Status">
            <select value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))} className="dash-input" style={{ width:160 }}>
              <option value="">All Statuses</option>
              {STATUS_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Search Patient">
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>
                <Ico d={IC.search} s={14}/>
              </div>
              <input type="text" placeholder="Patient name…" value={filters.search}
                onChange={e=>setFilters(f=>({...f,search:e.target.value}))}
                className="dash-input" style={{ paddingLeft:36, width:200 }}/>
            </div>
          </Field>
          <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
            <button className="cta-ghost" onClick={load} style={{ padding:"10px 16px" }}><Ico d={IC.refresh} s={14}/></button>
            {(filters.date||filters.status||filters.search) && (
              <button className="cta-ghost" onClick={()=>setFilters(BLANK_FILTERS)} style={{ padding:"10px 16px", fontSize:13 }}>
                <Ico d={IC.x} s={13}/> Clear
              </button>
            )}
          </div>
        </div>
        {(filters.date||filters.status||filters.search) && allAppts.length>0 && (
          <p style={{ fontSize:12.5, color:"#94a3b8", marginTop:12, fontFamily:"'DM Sans',sans-serif" }}>
            Showing {displayed.length} of {allAppts.length} appointments
          </p>
        )}
      </div>

      {/* Appointment cards */}
      <div className="feature-card" style={{ "--accent":"linear-gradient(135deg,#0ea5e9,#0284c7)", padding:0 }}>
        <div style={{ padding:"18px 22px", borderBottom:"1.5px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>
            {view==="today"?"Today's Appointments":view==="upcoming"?"Upcoming Appointments":"All Appointments"}
          </h3>
          <span className="pill-tag">{displayed.length} shown</span>
        </div>

        {loading ? <PageLoader/>
          : displayed.length===0
          ? <Empty icon="calendar"
              title="No appointments found"
              sub={filters.date||filters.status||filters.search ? "Try clearing your filters." : "Appointments will appear here once patients book with you."}/>
          : (
            <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:12 }}>
              {displayed.map((a,i)=>(
                <div key={a.id||i} className="appt-card" style={{ animationDelay:`${i*25}ms`, flexWrap:"wrap" }}>
                  {/* Avatar */}
                  <div style={{
                    width:44, height:44, borderRadius:"50%", flexShrink:0,
                    background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",
                    border:"2px solid #bae6fd",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:"#0ea5e9",
                  }}>{(a.patient_name||a.patient||"P")[0].toUpperCase()}</div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:160 }}>
                    <p style={{ fontFamily:"'Sora',sans-serif", fontSize:14.5, fontWeight:700, color:"#0f172a" }}>
                      {a.patient_name||a.patient||"Patient"}
                    </p>
                    <p style={{ fontSize:12.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", marginTop:3 }}>
                      📅 {a.slot_date||a.date||"—"} &nbsp;·&nbsp; 🕐 {a.slot_start_time||a.time||"—"}
                    </p>
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={a.status||"pending"}/>

                  {/* Status dropdown */}
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <select
                      value={a.status||"Pending"}
                      onChange={e=>changeStatus(a.id,e.target.value)}
                      disabled={updating===a.id}
                      className="dash-input"
                      style={{
                        width:154, fontSize:13,
                        fontFamily:"'Sora',sans-serif", fontWeight:600,
                        paddingRight:30,
                        opacity:updating===a.id?0.6:1,
                        cursor:updating===a.id?"wait":"pointer",
                        background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
                      }}
                    >
                      {STATUS_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    {updating===a.id && (
                      <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)" }}>
                        <Spinner size={14}/>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const [user]           = useState(()=>{ try{ return JSON.parse(localStorage.getItem("user")); }catch{ return null; }});
  const [doctor,         setDoctor]        = useState(null);
  const [profileExists,  setProfileExists] = useState(null);
  const [page,           setPage]          = useState("overview");
  const [collapsed,      setCollapsed]     = useState(false);
  const [booting,        setBooting]       = useState(true);

  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){ setBooting(false); return; }
    (async()=>{
      try {
        const check = await api("/doctors/check-profile/");
        setProfileExists(!!check.exists);
        if(check.exists){ const prof = await api("/doctors/my-profile/"); setDoctor(prof); }
      } catch{ setProfileExists(false); }
      setBooting(false);
    })();
  },[]);

  async function logout() {
    try{ await api("/accounts/logout/",{method:"POST"}); }catch{}
    localStorage.removeItem("token"); localStorage.removeItem("user");
    window.location.reload();
  }

  const BG = "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)";

  // Loading
  if(booting) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width:52, height:52, borderRadius:13, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 28px rgba(14,165,233,0.35)", animation:"float 2s ease-in-out infinite" }}>
        <Ico d={IC.hospital} s={26} color="#fff" stroke={2}/>
      </div>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:"#0f172a", marginBottom:6 }}>HealthPredictor</p>
        <p style={{ fontSize:13.5, color:"#94a3b8", fontFamily:"'DM Sans',sans-serif" }}>Loading your dashboard…</p>
      </div>
      <Spinner size={28}/>
    </div>
  );

  // Not authenticated
  if(!token) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign:"center", maxWidth:380, padding:48, "--accent":"linear-gradient(135deg,#f59e0b,#d97706)" }}>
        <div style={{ width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#fffbeb,#fef3c7)",border:"1.5px solid #fde68a",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
          <Ico d={IC.alert} s={26} color="#d97706"/>
        </div>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:10 }}>Not Authenticated</h3>
        <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6 }}>Please log in to access the Doctor Dashboard.</p>
      </div>
    </div>
  );

  // Wrong role
  if(user && user.user_type !== "doctor") return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="feature-card" style={{ textAlign:"center", maxWidth:380, padding:48, "--accent":"linear-gradient(135deg,#ef4444,#dc2626)" }}>
        <div style={{ width:56,height:56,borderRadius:14,background:"#fff1f2",border:"1.5px solid #fecdd3",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
          <Ico d={IC.alert} s={26} color="#ef4444"/>
        </div>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:10 }}>Access Restricted</h3>
        <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6 }}>This dashboard is only accessible to doctor accounts.</p>
      </div>
    </div>
  );

  // Create profile
  if(profileExists===false) return (
    <>
      <CreateProfile onDone={async()=>{
        try{ const prof = await api("/doctors/my-profile/"); setDoctor(prof); setProfileExists(true); }
        catch(err){ toast(err.message,"error"); }
      }}/>
      <Toaster/>
    </>
  );

  // Main dashboard
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:BG, fontFamily:"'DM Sans',sans-serif", color:"#0f172a" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="grid-bg-light" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}/>

      <Sidebar active={page} onNav={setPage} collapsed={collapsed} onToggle={()=>setCollapsed(c=>!c)} doctor={doctor}/>

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden", position:"relative", zIndex:1 }}>
        <Topbar page={page} doctor={doctor} onUpdate={setDoctor} onLogout={logout}/>
        <main style={{ flex:1, overflowY:"auto", padding:28 }}>
          {page==="overview"     && <Overview     doctor={doctor}/>}
          {page==="profile"      && <Profile      doctor={doctor} onUpdate={setDoctor}/>}
          {page==="slots"        && <Slots/>}
          {page==="appointments" && <Appointments/>}
        </main>
      </div>

      <Toaster/>
    </div>
  );
}