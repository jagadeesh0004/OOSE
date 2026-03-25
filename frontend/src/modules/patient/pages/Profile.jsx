import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Spinner, toast } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { SectionCard, SLabel, Inp } from "../../../components/common/UI";

export function PatientProfile({ user, onRefresh }) {
  const [profile, setProfile] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    date_of_birth: profile.date_of_birth || "",
    address: profile.address || "",
    height: profile.height || "",
    weight: profile.weight || "",
    blood_type: profile.blood_type || "",
    medical_conditions: profile.medical_conditions || "",
    allergies: profile.allergies || "",
    medications: profile.medications || "",
  });

  useEffect(() => {
    setForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      date_of_birth: profile.date_of_birth || "",
      address: profile.address || "",
      height: profile.height || "",
      weight: profile.weight || "",
      blood_type: profile.blood_type || "",
      medical_conditions: profile.medical_conditions || "",
      allergies: profile.allergies || "",
      medications: profile.medications || "",
    });
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      toast("Please fill in required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const data = await api("/accounts/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
          address: form.address,
          height: form.height || null,
          weight: form.weight || null,
          blood_type: form.blood_type,
          medical_conditions: form.medical_conditions,
          allergies: form.allergies,
          medications: form.medications,
        }),
      });
      setProfile(data);
      setEditing(false);
      toast("Profile updated successfully!", "success");
      if (onRefresh) onRefresh(data);
    } catch (err) {
      toast(err.message, "error");
    }
    setSaving(false);
  }, [form, onRefresh]);

  if (loading) return <PageLoader />;

  const bmi = form.height && form.weight
    ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
          borderRadius: 16,
          padding: "24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Sora',sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            {(form.first_name[0] || "P").toUpperCase()}
          </div>
          <div>
            <h2
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {form.first_name} {form.last_name}
            </h2>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
              Patient ID: {profile.id || "—"}
            </p>
          </div>
        </div>
        <button
          className="cta-primary"
          onClick={() => {
            if (editing) {
              handleSave();
            } else {
              setEditing(true);
            }
          }}
          disabled={saving}
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            boxShadow: "none",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? <Spinner size={14} color="#fff" /> : <Ico d={editing ? IC.check : IC.edit} s={14} color="#fff" />}
          {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Information */}
      <SectionCard title="Personal Information" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="First Name *"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              disabled={!editing}
              placeholder="Your first name"
            />
            <Inp
              label="Last Name *"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              disabled={!editing}
              placeholder="Your last name"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!editing}
              placeholder="your.email@example.com"
            />
            <Inp
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={!editing}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              disabled={!editing}
            />
            <Inp
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              disabled={!editing}
              placeholder="123 Main St, City, State"
            />
          </div>
        </div>
      </SectionCard>

      {/* Health Information */}
      <SectionCard title="Health Information" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Inp
              label="Height (cm)"
              type="number"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              disabled={!editing}
              placeholder="170"
            />
            <Inp
              label="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              disabled={!editing}
              placeholder="70"
            />
            <div>
              <SLabel>BMI</SLabel>
              <div
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0f172a",
                  textAlign: "center",
                }}
              >
                {bmi ? bmi : "—"}
              </div>
            </div>
          </div>
          <div>
            <SLabel>Blood Type</SLabel>
            <select
              value={form.blood_type}
              onChange={(e) => setForm({ ...form, blood_type: e.target.value })}
              disabled={!editing}
              className="dash-input"
              style={{ marginTop: 8, width: "100%" }}
            >
              <option value="">Select Blood Type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <Inp
            label="Medical Conditions"
            value={form.medical_conditions}
            onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })}
            disabled={!editing}
            placeholder="e.g., Diabetes, Hypertension"
            style={{ minHeight: 60 }}
            as="textarea"
          />
          <Inp
            label="Allergies"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            disabled={!editing}
            placeholder="e.g., Penicillin, Nuts"
            style={{ minHeight: 60 }}
            as="textarea"
          />
          <Inp
            label="Current Medications"
            value={form.medications}
            onChange={(e) => setForm({ ...form, medications: e.target.value })}
            disabled={!editing}
            placeholder="e.g., Aspirin (100mg daily)"
            style={{ minHeight: 60 }}
            as="textarea"
          />
        </div>
      </SectionCard>

      {/* Account Information */}
      <SectionCard title="Account Information" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
            <Ico d={IC.user} s={20} color="#0ea5e9" />
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Username</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {profile.username || "—"}
              </p>
            </div>
          </div>
          <div style={{ height: 1, background: "#e2e8f0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
            <Ico d={IC.calendar} s={20} color="#0ea5e9" />
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Account Created</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {profile.date_joined
                  ? new Date(profile.date_joined).toLocaleDateString("en-IN", { dateStyle: "long" })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Cancel button if editing */}
      {editing && (
        <button
          className="cta-ghost"
          onClick={() => setEditing(false)}
          style={{ fontSize: 13 }}
        >
          <Ico d={IC.x} s={14} /> Cancel Editing
        </button>
      )}
    </div>
  );
}
