import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { Ico, PageLoader, Empty, Spinner, toast } from "../../../components/common/Toast";
import { IC, DAYS } from "../../../utils/constants";
import { SectionCard, SLabel } from "../../../components/common/UI";

export function DoctorSlots({ doctor }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    day: DAYS[0] || "Monday",
    start_time: "09:00",
    end_time: "10:00",
    slot_duration: 30,
  });

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/appointments/slots/");
      setSlots(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      toast(err.message, "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleCreate = useCallback(async () => {
    if (!form.day || !form.start_time || !form.end_time) {
      toast("Please fill in all fields", "error");
      return;
    }

    const start = new Date(`2000-01-01T${form.start_time}`);
    const end = new Date(`2000-01-01T${form.end_time}`);

    if (start >= end) {
      toast("End time must be after start time", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api("/appointments/create-slots/", {
        method: "POST",
        body: JSON.stringify({
          day_of_week: form.day,
          start_time: form.start_time,
          end_time: form.end_time,
          slot_duration: parseInt(form.slot_duration),
        }),
      });
      toast("Slots generated successfully!", "success");
      setShowForm(false);
      setForm({
        day: DAYS[0] || "Monday",
        start_time: "09:00",
        end_time: "10:00",
        slot_duration: 30,
      });
      await fetchSlots();
    } catch (err) {
      toast(err.message, "error");
    }
    setSubmitting(false);
  }, [form, fetchSlots]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this slot?")) return;
      setDeleting(id);
      try {
        await api(`/appointments/slots/${id}/`, { method: "DELETE" });
        toast("Slot deleted successfully", "success");
        await fetchSlots();
      } catch (err) {
        toast(err.message, "error");
      }
      setDeleting(null);
    },
    [fetchSlots]
  );

  if (loading) return <PageLoader />;

  // Group slots by day
  const slotsByDay = {};
  slots.forEach((slot) => {
    const day = slot.day_of_week || "Unknown";
    if (!slotsByDay[day]) slotsByDay[day] = [];
    slotsByDay[day].push(slot);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Create Form */}
      {showForm && (
        <SectionCard title="Generate New Slots" noPad accent="#0ea5e9">
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <SLabel>Day of Week</SLabel>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <SLabel>Slot Duration (minutes)</SLabel>
                <select
                  value={form.slot_duration}
                  onChange={(e) => setForm({ ...form, slot_duration: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <SLabel>Start Time</SLabel>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
              <div>
                <SLabel>End Time</SLabel>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="dash-input"
                  style={{ marginTop: 8, width: "100%" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="cta-ghost"
                onClick={() => setShowForm(false)}
                style={{ flex: 1, fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                className="cta-primary"
                onClick={handleCreate}
                disabled={submitting}
                style={{
                  flex: 1,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? <Spinner size={14} color="#fff" /> : <Ico d={IC.plus} s={14} color="#fff" />}
                {submitting ? "Generating..." : "Generate Slots"}
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Create button */}
      {!showForm && (
        <button
          className="cta-primary"
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 13,
            padding: "12px 20px",
          }}
        >
          <Ico d={IC.plus} s={16} color="#fff" /> Generate New Slots
        </button>
      )}

      {/* Slots by day */}
      {slots.length === 0 ? (
        <Empty icon="calendar" title="No slots created yet" sub="Generate your first availability slots." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries(slotsByDay).map(([day, daySlots], dayIdx) => (
            <SectionCard key={day} title={`${day} (${daySlots.length} slots)`} noPad accent="#8b5cf6">
              <div
                style={{
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                  gap: 10,
                }}
              >
                {daySlots.map((slot, i) => (
                  <div
                    key={slot.id || i}
                    className="stat-chip"
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>
                        {slot.start_time} - {slot.end_time}
                      </p>
                      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                        {slot.is_booked ? "🔴 Booked" : "🟢 Available"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={deleting === slot.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        color: "#ef4444",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        opacity: deleting === slot.id ? 0.5 : 1,
                      }}
                    >
                      {deleting === slot.id ? <Spinner size={10} color="#ef4444" /> : <Ico d={IC.trash} s={10} color="#ef4444" />}
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {/* Summary */}
      {slots.length > 0 && (
        <SectionCard title="Slots Summary" accent="#8b5cf6" noPad>
          <div
            style={{
              padding: "16px 18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12,
              background: "#faf5ff",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Total Slots</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {slots.length}
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Available</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {slots.filter((s) => !s.is_booked).length}
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1.5px solid #e9d5ff",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Booked</p>
              <p
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginTop: 4,
                }}
              >
                {slots.filter((s) => s.is_booked).length}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
