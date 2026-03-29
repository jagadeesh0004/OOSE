import { useState } from "react";
import { 
  format, 
  addDays, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths
} from "date-fns";
import { Ico } from "../utils/icons";
import { IC } from "../utils/constants";

export function DatePicker({ value, onChange, minDate }) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateClick = (date) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handlePreset = (days) => {
    const newDate = addDays(new Date(), days);
    onChange(newDate);
    setCurrentMonth(newDate);
    setShowCalendar(false);
  };

  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start, end });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ position: "relative", width: "100%", zIndex: showCalendar ? 1000 : "auto" }}>
      {/* Date Input Trigger */}
      <button
        type="button"
        onClick={() => setShowCalendar(!showCalendar)}
        style={{
          maxWidth: 220,
          padding: "8px 12px",
          background: "#f8fafc",
          border: "1.5px solid #e2e8f0",
          borderRadius: "9px",
          fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
          color: "#0f172a",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0ea5e9"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
      >
        <span>{value ? format(value, "MMM dd, yyyy") : "Select date"}</span>
        <Ico d={IC.calendar} s={16} color="#0284c7" stroke={1.5} />
      </button>

      {/* Calendar Popup */}
      {showCalendar && (
        <>
          {/* Overlay to close calendar when clicking outside */}
          <div
            onClick={() => setShowCalendar(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
            }}
          />
          
          {/* Calendar Container */}
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: 340,
          }}
        >
          {/* Month Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Ico d={IC.chevronLeft} s={20} color="#0284c7" />
            </button>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a" }}>
              {format(currentMonth, "MMMM yyyy")}
            </p>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Ico d={IC.chevronRight} s={20} color="#0284c7" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{ marginBottom: 16 }}>
            {/* Weekday Headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
              {weekDays.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    padding: "6px 0",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {days.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = value && isSameDay(day, value);
                const isDisabled = minDate && day < minDate;

                return (
                  <button
                    type="button"
                    key={day.toString()}
                    onClick={() => !isDisabled && handleDateClick(day)}
                    disabled={isDisabled || !isCurrentMonth}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1.5px solid transparent",
                      background: isSelected ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : isCurrentMonth ? "#f8fafc" : "transparent",
                      color: isSelected ? "#fff" : isCurrentMonth ? "#0f172a" : "#94a3b8",
                      cursor: !isDisabled && isCurrentMonth ? "pointer" : "default",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 13,
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "all 0.15s",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled && isCurrentMonth) {
                        e.currentTarget.style.background = "#e0f2fe";
                        e.currentTarget.style.borderColor = "#0ea5e9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isSelected) {
                        e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#0284c7)";
                        e.currentTarget.style.borderColor = "transparent";
                      } else if (isCurrentMonth) {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Presets */}
          <div style={{ borderTop: "1.5px solid #f1f5f9", paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Quick Select</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {[
                { label: "Today", value: 0 },
                { label: "Tomorrow", value: 1 },
                { label: "In 3 days", value: 3 },
                { label: "In a week", value: 7 },
              ].map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => handlePreset(preset.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#0284c7",
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ecf9ff";
                    e.currentTarget.style.borderColor = "#0284c7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
