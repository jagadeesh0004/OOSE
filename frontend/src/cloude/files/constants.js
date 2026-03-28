// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & ICONS
// ═══════════════════════════════════════════════════════════════════════════

// ── SVG Icon Paths ────────────────────────────────────────────────────────
export const IC = {
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
  chevron:  "M9 18l6-6-6-6",
  brain:    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  history:  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  heartbeat:"M3 12h4l3-9 4 18 3-9h4",
};

// ── SVG Icon Component ─────────────────────────────────────────────────────
export function Ico({ d, s = 18, stroke = 1.8, color = "currentColor", fill = "none" }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {Array.isArray(d)
        ? d.map((p, i) => <path key={i} d={p} />)
        : <path d={d} />
      }
    </svg>
  );
}

// ── Schedule ───────────────────────────────────────────────────────────────
export const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// ── Appointment status options (doctor dashboard) ──────────────────────────
export const STATUS_OPTS = ["Pending", "Confirmed", "Completed", "Cancelled"];

// ── Doctor sidebar nav items ───────────────────────────────────────────────
export const DOCTOR_NAV_ITEMS = [
  { id: "overview",     label: "Overview",     icon: "grid"     },
  { id: "profile",      label: "My Profile",   icon: "user"     },
  { id: "slots",        label: "Manage Slots", icon: "clock"    },
  { id: "appointments", label: "Appointments", icon: "calendar" },
];

// ── Patient sidebar nav items ──────────────────────────────────────────────
export const PATIENT_NAV_ITEMS = [
  { id: "overview",     label: "Overview",           icon: "grid"     },
  { id: "appointments", label: "My Appointments",    icon: "calendar" },
  { id: "book",         label: "Book Appointment",   icon: "plus"     },
  { id: "predict",      label: "Health Prediction",  icon: "brain"    },
  { id: "history",      label: "Prediction History", icon: "history"  },
  { id: "profile",      label: "My Profile",         icon: "user"     },
];

// ── Status badge map (shared between doctor & patient) ────────────────────
export const STATUS_BADGE_MAP = {
  confirmed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Confirmed" },
  completed: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "Completed" },
  cancelled: { bg: "#fff1f2", color: "#dc2626", border: "#fecdd3", label: "Cancelled" },
  pending:   { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Pending"   },
};

// ── Risk badge map (patient prediction) ───────────────────────────────────
export const RISK_BADGE_MAP = {
  low:    { cls: "risk-low",    icon: "✅", label: "Low Risk"    },
  medium: { cls: "risk-medium", icon: "⚠️", label: "Medium Risk" },
  high:   { cls: "risk-high",   icon: "🚨", label: "High Risk"   },
};

// ── Risk gradient map (prediction result card) ─────────────────────────────
export const RISK_GRAD = {
  low:    "linear-gradient(135deg,#22c55e,#16a34a)",
  medium: "linear-gradient(135deg,#f59e0b,#d97706)",
  high:   "linear-gradient(135deg,#ef4444,#dc2626)",
};

// ── Risk color triples [bg, fg, border] (history list) ────────────────────
export const RISK_COLOR = {
  low:    ["#f0fdf4", "#16a34a", "#bbf7d0"],
  medium: ["#fffbeb", "#d97706", "#fde68a"],
  high:   ["#fff1f2", "#dc2626", "#fecdd3"],
};

// ── App branding ───────────────────────────────────────────────────────────
export const APP_NAME = "HealthPredictor";
export const DASHBOARD_BG = "linear-gradient(160deg,#f0f9ff 0%,#faf5ff 50%,#f0fdf4 100%)";
