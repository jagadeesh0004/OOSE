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
    throw new Error(Object.values(data).flat().find(v => typeof v === "string") || data.error || data.detail || `HTTP ${res.status}`);
  }
  
  return data;
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  let data = {};
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await res.json();
  }
  
  if (!res.ok) {
    throw new Error(data.non_field_errors?.[0] || "Invalid credentials. Please try again.");
  }
  
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export async function register(formData, userType) {
  const res = await fetch(`${BASE}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, user_type: userType }),
  });
  
  let data = {};
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await res.json();
  }
  
  if (!res.ok) {
    throw new Error(Object.values(data).flat()[0] || "Registration failed. Please try again.");
  }
  
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
