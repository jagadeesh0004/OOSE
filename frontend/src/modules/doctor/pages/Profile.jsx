import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Spinner, toast } from "../../../components/common/Toast";
import { IC } from "../../../utils/constants";
import { SectionCard, SLabel, Inp } from "../../../components/common/UI";

export function DoctorProfile({ doctor, onRefresh }) {
  const [profile, setProfile] = useState(doctor || {});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: profile.user?.first_name || "",
    last_name: profile.user?.last_name || "",
    email: profile.user?.email || "",
    phone: profile.phone || "",
    specialization: profile.specialization || "",
    license_number: profile.license_number || "",
    hospital: profile.hospital || "",
    experience_years: profile.experience_years || "",
    consultation_fee: profile.consultation_fee || "",
    bio: profile.bio || "",
    availability_status: profile.availability_status || "offline",
  });

  useEffect(() => {
    setForm({
      first_name: profile.user?.first_name || "",
      last_name: profile.user?.last_name || "",
      email: profile.user?.email || "",
      phone: profile.phone || "",
      specialization: profile.specialization || "",
      license_number: profile.license_number || "",
      hospital: profile.hospital || "",
      experience_years: profile.experience_years || "",
      consultation_fee: profile.consultation_fee || "",
      bio: profile.bio || "",
      availability_status: profile.availability_status || "offline",
    });
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!form.specialization || !form.license_number) {
      toast("Please fill in required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const data = await api("/doctors/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          specialization: form.specialization,
          license_number: form.license_number,
          hospital: form.hospital,
          experience_years: form.experience_years ? parseInt(form.experience_years) : null,
          consultation_fee: form.consultation_fee ? parseFloat(form.consultation_fee) : null,
          bio: form.bio,
          phone: form.phone,
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
            {(form.last_name[0] || "D").toUpperCase()}
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
              Dr. {form.first_name} {form.last_name}
            </h2>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
              {form.specialization || "Specialist"}
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

      {/* Professional Information */}
      <SectionCard title="Professional Information" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="Specialization *"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              disabled={!editing}
              placeholder="e.g., Cardiology"
            />
            <Inp
              label="License Number *"
              value={form.license_number}
              onChange={(e) => setForm({ ...form, license_number: e.target.value })}
              disabled={!editing}
              placeholder="Medical license number"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="Years of Experience"
              type="number"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              disabled={!editing}
              placeholder="e.g., 10"
              min="0"
            />
            <Inp
              label="Consultation Fee (₹)"
              type="number"
              value={form.consultation_fee}
              onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
              disabled={!editing}
              placeholder="500"
              step="50"
              min="0"
            />
          </div>
          <Inp
            label="Hospital / Clinic"
            value={form.hospital}
            onChange={(e) => setForm({ ...form, hospital: e.target.value })}
            disabled={!editing}
            placeholder="Hospital name"
          />
          <Inp
            label="Bio / About"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            disabled={!editing}
            placeholder="Brief professional bio"
            style={{ minHeight: 80 }}
            as="textarea"
          />
        </div>
      </SectionCard>

      {/* Contact Information */}
      <SectionCard title="Contact Information" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp
              label="Email"
              type="email"
              value={form.email}
              disabled={true}
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
        </div>
      </SectionCard>

      {/* Availability Status */}
      <SectionCard title="Availability" accent="#0ea5e9" noPad>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: form.availability_status === "online" ? "#22c55e" : "#94a3b8",
              }}
            />
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Current Status</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>
                {form.availability_status === "online" ? "Online (Available)" : "Offline (Not Available)"}
              </p>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: "#64748b", fontStyle: "italic" }}>
            Use the availability toggle in the top bar to change your status.
          </p>
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
                {profile.user?.username || "—"}
              </p>
            </div>
          </div>
          <div style={{ height: 1, background: "#e2e8f0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
            <Ico d={IC.calendar} s={20} color="#0ea5e9" />
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Account Created</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {profile.user?.date_joined
                  ? new Date(profile.user.date_joined).toLocaleDateString("en-IN", { dateStyle: "long" })
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
