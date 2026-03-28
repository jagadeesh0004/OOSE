import { useState } from "react";
import { Spinner } from "../../components/common/Spinner";
import { Field } from "../../components/ui/Field";
import { Ico, IC } from "../../utils/constants";
import { authApi } from "../../services/api";
import { toast } from "../../components/common/Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// Profile — Patient profile view/edit page
//
// Props:
//   user         — user object
//   onUserUpdate — (updated) => void
// ─────────────────────────────────────────────────────────────────────────────
export function Profile({ user, onUserUpdate }) {
  const [form,    setForm]  = useState({ email: user?.email || "", phone_number: user?.phone_number || "" });
  const [editing, setEdit]  = useState(false);
  const [saving,  setSave]  = useState(false);

  async function save() {
    setSave(true);
    try {
      const updated = await authApi.updateProfile(form);
      onUserUpdate({ ...user, ...updated });
      setEdit(false);
      toast("Profile updated!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSave(false);
    }
  }

  const name = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Patient";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-up">

      {/* ── Header ── */}
      <div>
        <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Account</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>My Profile</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Manage your account information</p>
          </div>
          {editing
            ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button className="cta-ghost" onClick={() => { setEdit(false); setForm({ email: user?.email || "", phone_number: user?.phone_number || "" }); }}>
                  Cancel
                </button>
                <button className="cta-primary" onClick={save} disabled={saving}>
                  {saving
                    ? <><Spinner size={15} color="#fff" /> Saving…</>
                    : <><Ico d={IC.check} s={14} color="#fff" /> Save</>
                  }
                </button>
              </div>
            )
            : (
              <button className="cta-ghost" onClick={() => setEdit(true)}>
                <Ico d={IC.edit} s={14} /> Edit
              </button>
            )
          }
        </div>
      </div>

      {/* ── Avatar section ── */}
      <div className="feature-card no-hover" style={{
        "--accent": "linear-gradient(135deg,#8b5cf6,#6d28d9)",
        display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "#fff",
          fontFamily: "'Sora',sans-serif",
          boxShadow: "0 6px 20px rgba(139,92,246,0.35)", flexShrink: 0,
        }}>
          {name[0].toUpperCase()}
        </div>
        <div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            {name}
          </h3>
          <p style={{ fontSize: 13.5, color: "#94a3b8", marginTop: 4 }}>@{user?.username}</p>
          <span className="pill-tag" style={{ marginTop: 8, display: "inline-flex", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6" }}>
            Patient Account
          </span>
        </div>
      </div>

      {/* ── Account Details ── */}
      <div className="feature-card no-hover" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Account Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>

          <Field label="Full Name">
            <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0" }}>{name}</p>
          </Field>

          <Field label="Username">
            <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0" }}>@{user?.username}</p>
          </Field>

          <Field label="Email Address">
            {editing
              ? <input type="email" className="dash-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0" }}>{user?.email || "—"}</p>
            }
          </Field>

          <Field label="Phone Number">
            {editing
              ? <input type="tel" className="dash-input" value={form.phone_number} onChange={(e) => setForm((p) => ({ ...p, phone_number: e.target.value }))} />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0" }}>{user?.phone_number || "—"}</p>
            }
          </Field>

          <Field label="Account Type">
            <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0" }}>Patient</p>
          </Field>
        </div>
      </div>
    </div>
  );
}
