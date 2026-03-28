import { useState, useEffect, useRef } from "react";
import { PageLoader } from "./PageLoader";
import { Field } from "./Field";
import { Spinner } from "./Spinner";
import { Ico } from "../../utils/icons";
import { IC } from "../../utils/constants";
import { authApi } from "../../services/api";
import { toast } from "./Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// UserProfile — Patient profile view/edit page
//
// Props:
//   user          — patient user profile object
//   onUserUpdate  — (updated) => void
// ─────────────────────────────────────────────────────────────────────────────
export function UserProfile({ user, onUserUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (user && !initializedRef.current) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        user_type: user.user_type || "",
        phone_number: user.phone_number || "",
        profile_pic: user.profile_pic || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
      initializedRef.current = true;
    }
  }, [user]);

  async function save() {
    setSaving(true);
    try {
      const updated = await authApi.updateProfile({
        username: form.username,
        email: form.email,
        user_type: form.user_type,
        phone_number: form.phone_number || "",
        first_name: form.first_name,
        last_name: form.last_name,
      });
      onUserUpdate(updated);
      setEditing(false);
      toast("Profile updated successfully!", "success");
    } catch (err) {
      toast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <PageLoader />;
  const R = editing ? form : user;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.4s ease" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="pill-tag" style={{ marginBottom: 10, display: "inline-flex" }}>Profile Management</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 10 }}>My Profile</h2>
          <p style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>Manage your personal information</p>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cta-ghost" onClick={() => { setEditing(false); setForm({ username: user.username || "", email: user.email || "", user_type: user.user_type || "", phone_number: user.phone_number || "", profile_pic: user.profile_pic || "", first_name: user.first_name || "", last_name: user.last_name || "" }); }}>
              Cancel
            </button>
            <button className="cta-primary" onClick={save} disabled={saving}>
              {saving
                ? <><Spinner size={15} color="#fff" /> Saving…</>
                : <><Ico d={IC.check} s={14} color="#fff" /> Save Changes</>
              }
            </button>
          </div>
        ) : (
          <button className="cta-primary" onClick={() => setEditing(true)} style={{ fontSize: 13 }}>
            <Ico d={IC.edit} s={14} color="#fff" /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="feature-card" style={{ "--accent": "linear-gradient(135deg,#0ea5e9,#0284c7)", padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          
          {/* First Name */}
          <Field label="First Name">
            {editing
              ? <input type="text" value={form.first_name ?? ""} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} className="dash-input" />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{R.first_name || "—"}</p>
            }
          </Field>

          {/* Last Name */}
          <Field label="Last Name">
            {editing
              ? <input type="text" value={form.last_name ?? ""} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} className="dash-input" />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{R.last_name || "—"}</p>
            }
          </Field>

          {/* Email */}
          <Field label="Email">
            {editing
              ? <input type="email" value={form.email ?? ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="dash-input" />
              : <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{R.email || "—"}</p>
            }
          </Field>

          {/* Username (read-only) */}
          <Field label="Username">
            <p style={{ fontSize: 14.5, color: "#1e293b", fontWeight: 600, padding: "10px 0", fontFamily: "'DM Sans',sans-serif" }}>{R.username || "—"}</p>
          </Field>
        </div>
      </div>
    </div>
  );
}
