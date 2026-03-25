// ==================== ICONS ====================
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
  brain:    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  history:  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  chevron:  "M9 18l6-6-6-6",
  heartbeat:"M3 12h4l3-9 4 18 3-9h4",
};

// ==================== NAVIGATION ====================
export const PATIENT_NAV = [
  { id: "overview",    label: "Overview",           icon: "grid"     },
  { id: "appointments", label: "My Appointments",    icon: "calendar" },
  { id: "book",        label: "Book Appointment",   icon: "plus"     },
  { id: "predict",     label: "Health Prediction",  icon: "brain"    },
  { id: "history",     label: "Prediction History", icon: "history"  },
  { id: "profile",     label: "My Profile",         icon: "user"     },
];

export const DOCTOR_NAV = [
  { id: "overview",     label: "Overview",     icon: "grid"     },
  { id: "profile",      label: "My Profile",   icon: "user"     },
  { id: "slots",        label: "Manage Slots", icon: "clock"    },
  { id: "appointments", label: "Appointments", icon: "calendar" },
];

// ==================== DAYS ====================
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ==================== LANDING PAGE ====================
export const NAV_LINKS = ["Features", "How It Works", "For Doctors", "Predictions"];

export const FEATURES = [
  {
    icon: "shield",
    title: "AI Risk Prediction",
    desc: "Our ML model analyzes 10 health metrics to classify your risk level — low, medium, or high — with personalized prescriptions.",
    accent: "#0ea5e9",
  },
  {
    icon: "calendar",
    title: "Smart Appointments",
    desc: "Book, track, and manage doctor appointments with real-time slot availability and double-booking prevention.",
    accent: "#8b5cf6",
  },
  {
    icon: "user",
    title: "Doctor Profiles",
    desc: "Browse verified doctors by specialization, view availability, and get auto-matched to the right specialist for your risk profile.",
    accent: "#f43f5e",
  },
  {
    icon: "history",
    title: "Health History",
    desc: "Track your prediction history over time, filter by risk level, and monitor health metric trends to make informed decisions.",
    accent: "#f59e0b",
  },
];

export const STEPS = [
  { num: "01", title: "Register & Login",       desc: "Create your patient or doctor account in seconds with token-based auth." },
  { num: "02", title: "Enter Health Metrics",   desc: "Submit 10 key health indicators — vitals, lifestyle, biometrics." },
  { num: "03", title: "Get Instant Prediction", desc: "Our ML model calculates your risk score and generates a prescription." },
  { num: "04", title: "Connect With Doctors",   desc: "High-risk? Get matched to a specialist and book an appointment instantly." },
];

export const METRICS = [
  { label: "Patients Served",  value: "24K+",  sub: "and growing"          },
  { label: "Doctors Onboard",  value: "380+",  sub: "verified specialists"  },
  { label: "Predictions Made", value: "91K+",  sub: "ML assessments"        },
  { label: "Accuracy Rate",    value: "94.2%", sub: "model precision"       },
];

// ==================== STATUS COLORS ====================
export const STATUS_COLORS = {
  pending:   { bg: "#fffbeb", fg: "#d97706", bd: "#fde68a", label: "Pending"   },
  confirmed: { bg: "#f0fdf4", fg: "#16a34a", bd: "#bbf7d0", label: "Confirmed" },
  completed: { bg: "#eff6ff", fg: "#2563eb", bd: "#bfdbfe", label: "Completed" },
  cancelled: { bg: "#fff1f2", fg: "#dc2626", bd: "#fecdd3", label: "Cancelled" },
};

// ==================== RISK COLORS ====================
export const RISK_COLORS = {
  low:    { bg: "#f0fdf4", bd: "#bbf7d0", fg: "#16a34a", icon: "✅", label: "Low Risk"    },
  medium: { bg: "#fffbeb", bd: "#fde68a", fg: "#d97706", icon: "⚠️", label: "Medium Risk" },
  high:   { bg: "#fff1f2", bd: "#fecdd3", fg: "#dc2626", icon: "🚨", label: "High Risk"   },
};

export const GREETING_TIMES = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
};
