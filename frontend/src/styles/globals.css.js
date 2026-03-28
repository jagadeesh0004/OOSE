/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — shared across all pages
   Fonts:   Sora (headings, labels, buttons) · DM Sans (body, data)
   Primary: #0ea5e9 → #0284c7
   BG:      linear-gradient(160deg,#f0f9ff,#faf5ff,#f0fdf4)
   Cards:   white · 1.5px solid #f1f5f9 · radius 18-24px · soft shadow
═══════════════════════════════════════════════════════════════════════════ */

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@300;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body { font-family:'DM Sans','Segoe UI',sans-serif; background:#ffffff; color:#0f172a; }
  input,select,textarea,button { font-family:'DM Sans',sans-serif; }

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
  .cta-danger:disabled { opacity:0.65; cursor:not-allowed; }

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

  .nav-link { font-size:14px; color:#475569; text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .nav-link:hover { color:#0ea5e9; }

  .metric-value {
    font-family:'Sora',sans-serif; font-size:38px; font-weight:800;
    background:linear-gradient(135deg,#0ea5e9,#8b5cf6);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; line-height:1.1;
  }

  /* ── Dashboard shared ── */
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
    background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(2,132,199,0.08));
    color:#0ea5e9; font-weight:600; border-left:3px solid #0ea5e9;
  }

  .appt-card {
    background:#fff; border:1.5px solid #f1f5f9; border-radius:14px;
    padding:16px 20px; transition:all 0.22s;
    box-shadow:0 1px 6px rgba(0,0,0,0.04);
    display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  }
  .appt-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); border-color:#e2e8f0; transform:translateY(-1px); }

  .dash-input {
    width:100%; background:#f8fafc; border:1.5px solid #e2e8f0;
    color:#0f172a; border-radius:9px; padding:8px 12px; font-size:14px;
    font-family:'DM Sans',sans-serif; transition:all 0.18s; outline:none;
  }
  .dash-input:focus { border-color:#0ea5e9; background:#fff; box-shadow:0 0 0 3px rgba(14,165,233,0.09); }
  select.dash-input option { background:#fff; color:#0f172a; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.8); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

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

  /* ── Doctor card (patient booking) ── */
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

  /* ── Slot chip (booking) ── */
  .slot-chip {
    padding:9px 16px; border-radius:10px; border:1.5px solid #e2e8f0;
    font-family:'Sora',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.18s; background:#fff; color:#475569;
    text-align:center;
  }
  .slot-chip:hover:not(.taken) { border-color:#0ea5e9; color:#0ea5e9; background:#f0f9ff; }
  .slot-chip.selected { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; border-color:transparent; box-shadow:0 3px 12px rgba(14,165,233,0.3); }
  .slot-chip.taken { background:#f8fafc; color:#cbd5e1; cursor:not-allowed; border-color:#f1f5f9; }

  /* ── Risk classes ── */
  .risk-low    { background:#f0fdf4; border:1.5px solid #bbf7d0; color:#16a34a; }
  .risk-medium { background:#fffbeb; border:1.5px solid #fde68a; color:#d97706; }
  .risk-high   { background:#fff1f2; border:1.5px solid #fecdd3; color:#dc2626; }

  /* ── Animations ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes toastIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .float-card { animation:float 4s ease-in-out infinite; }
  .fade-up    { animation:fadeUp 0.5s ease both; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }

  /* ── Grid background ── */
  .grid-bg-light {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none;
  }
`;

export const DASHBOARD_BG = "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)";
