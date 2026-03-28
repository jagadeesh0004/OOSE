import { useState } from "react";
import { Spinner } from "./Spinner";
import { doctorApi } from "../services/api";
import { toast } from "./Toaster";

// ─────────────────────────────────────────────────────────────────────────────
// AvailabilityToggle
//
// Props:
//   doctor    — doctor profile object
//   onUpdate  — (updated) => void
//   compact   — boolean, renders a small pill instead of full toggle row
// ─────────────────────────────────────────────────────────────────────────────
export function AvailabilityToggle({ doctor, onUpdate, compact = false }) {
  const [loading, setLoading] = useState(false);
  const avail = doctor?.is_available ?? false;

  async function toggle() {
    if (!doctor || loading) return;
    const next = !avail;
    onUpdate({ ...doctor, is_available: next });
    setLoading(true);
    try {
      const updated = await doctorApi.updateProfile({ is_available: next });
      onUpdate(updated);
      toast(
        `You are now ${updated.is_available ? "available for bookings" : "unavailable"}`,
        "success"
      );
    } catch (err) {
      onUpdate({ ...doctor, is_available: avail });
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 16px 7px 12px", borderRadius: 100,
          background: avail ? "#f0fdf4" : "#f8fafc",
          border: `1.5px solid ${avail ? "#bbf7d0" : "#e2e8f0"}`,
          color: avail ? "#16a34a" : "#64748b",
          cursor: loading ? "wait" : "pointer",
          fontSize: 13, fontFamily: "'Sora',sans-serif", fontWeight: 700,
          transition: "all 0.2s",
        }}
      >
        {loading
          ? <Spinner size={12} color={avail ? "#16a34a" : "#94a3b8"} />
          : (
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: avail ? "#16a34a" : "#94a3b8",
              animation: avail ? "pulse 2s infinite" : "none",
            }} />
          )
        }
        {avail ? "Available" : "Offline"}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button
        onClick={toggle}
        className="toggle-track"
        style={{
          background: avail ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#e2e8f0",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        <div className="toggle-knob" style={{ left: avail ? 24 : 4 }} />
      </button>
      <div>
        <p style={{
          fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700,
          color: avail ? "#16a34a" : "#64748b",
        }}>
          {avail ? "Accepting Appointments" : "Not Available"}
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
          {loading ? "Updating…" : "Toggle to change your availability instantly"}
        </p>
      </div>
    </div>
  );
}
