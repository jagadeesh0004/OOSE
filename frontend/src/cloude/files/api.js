// ═══════════════════════════════════════════════════════════════════════════
// API SERVICE LAYER
// Central authenticated fetch wrapper — used by all dashboards.
// Token is read from localStorage on every call (always fresh).
// On 401 → clears auth and reloads.
// ═══════════════════════════════════════════════════════════════════════════

const BASE = "/api";

export async function api(path, opts = {}) {
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
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    throw new Error(
      Object.values(data).flat().find((v) => typeof v === "string") ||
        data.error ||
        data.detail ||
        `HTTP ${res.status}`
    );
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (body) =>
    fetch(`${BASE}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  register: (body) =>
    fetch(`${BASE}/accounts/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  logout: () => api("/accounts/logout/", { method: "POST" }),
  getProfile: () => api("/accounts/profile/"),
  updateProfile: (body) => api("/accounts/profile/", { method: "PUT", body }),
};

// ── Doctor ────────────────────────────────────────────────────────────────
export const doctorApi = {
  checkProfile: () => api("/doctors/check-profile/"),
  getMyProfile: () => api("/doctors/my-profile/"),
  createProfile: (body) => api("/doctors/create-profile/", { method: "POST", body }),
  updateProfile: (body) => api("/doctors/update-profile/", { method: "PATCH", body }),
  updateProfileFull: (body) => api("/doctors/update-profile/", { method: "PUT", body }),
  getMySlots: () => api("/doctors/my-slots/"),
  generateSlots: (body) => api("/doctors/generate-slots/", { method: "POST", body }),
  deleteSlot: (id) => api(`/doctors/delete-slot/${id}/`, { method: "DELETE" }),
  deleteSlotsByDate: (date) => api("/doctors/delete-slot/", { method: "DELETE", body: { date } }),
  deleteAllSlots: () => api("/doctors/delete-all-slots/", { method: "DELETE" }),
  listDoctors: () => api("/doctors/list/"),
  getAvailableSlots: (doctorId, date) =>
    api(`/doctors/${doctorId}/available-slots/?date=${date}`),
};

// ── Appointments ──────────────────────────────────────────────────────────
export const appointmentApi = {
  getDoctorAppointments: () => api("/appointments/doctor/appointments/"),
  getDoctorToday: () => api("/appointments/doctor/today/"),
  getUpcoming: () => api("/appointments/upcoming/"),
  getMyAppointments: () => api("/appointments/my-appointments/"),
  updateStatus: (id, status) =>
    api(`/appointments/doctor/update-status/${id}/`, { method: "PATCH", body: { status } }),
  book: (body) => api("/appointments/book/", { method: "POST", body }),
  cancel: (id) => api(`/appointments/cancel/${id}/`, { method: "DELETE" }),
};

// ── Predictions ───────────────────────────────────────────────────────────
export const predictionApi = {
  predict: (body) => api("/predictions/predict/", { method: "POST", body }),
  getHistory: () => api("/predictions/history/"),
};
