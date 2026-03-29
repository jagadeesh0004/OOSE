import { useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
  const [buttonRect, setButtonRect] = useState(null);
  const buttonRef = useRef(null);

  const handleDateClick = (date) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handlePreset = (days) => {
    const newDate = addDays(new Date(), days);
    onChange(newDate);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    if (!showCalendar) {
      setButtonRect(buttonRef.current?.getBoundingClientRect());
    }
    setShowCalendar(!showCalendar);
  };

  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start, end });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Date Input Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleCalendar}
        style={{
          maxWidth: 220,
          padding: "10px 14px",
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
          gap: 16,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0ea5e9"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
      >
        <span style={{ flex: 1 }}>{value ? format(value, "MMM dd, yyyy") : "Select date"}</span>
        <Ico d={IC.calendar} s={16} color="#0284c7" stroke={1.5} style={{ flexShrink: 0 }} />
      </button>

      {/* Calendar Portal */}
      {showCalendar && buttonRect && createPortal(
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
              position: "fixed",
              top: `${buttonRect.bottom + 10}px`,
              left: `${buttonRect.left}px`,
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.12), 0 5px 15px rgba(0,0,0,0.08)",
              zIndex: 1000,
              minWidth: 380,
              animation: "slideDown 0.2s ease-out",
            }}
          >
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>

            {/* Month Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                style={{
                  background: "none",
                  border: "1.5px solid transparent",
                  cursor: "pointer",
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "6px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <Ico d={IC.chevronLeft} s={18} color="#0284c7" stroke={2} />
              </button>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", fontSize: 15, margin: 0 }}>
                {format(currentMonth, "MMMM yyyy")}
              </p>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                style={{
                  background: "none",
                  border: "1.5px solid transparent",
                  cursor: "pointer",
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "6px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <Ico d={IC.chevronRight} s={18} color="#0284c7" stroke={2} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{ marginBottom: 12 }}>
              {/* Weekday Headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 10 }}>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      padding: "6px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0 }}>
                {days.map((day) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = value && isSameDay(day, value);
                  const isDisabled = minDate && day < minDate;
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      type="button"
                      key={day.toString()}
                      onClick={() => !isDisabled && isCurrentMonth && handleDateClick(day)}
                      disabled={isDisabled || !isCurrentMonth}
                      style={{
                        padding: "4px 2px",
                        borderRadius: "3px",
                        border: "none",
                        margin: 0,
                        flex: 1,
                        minHeight: 24,
                        background: isSelected 
                          ? "linear-gradient(135deg,#0ea5e9,#0284c7)" 
                          : isToday && isCurrentMonth
                          ? "#ecf9ff"
                          : isCurrentMonth 
                          ? "#fff" 
                          : "transparent",
                        boxShadow: isSelected 
                          ? "inset 0 0 0 1.5px #0284c7"
                          : isToday && isCurrentMonth
                          ? "inset 0 0 0 1.5px #0ea5e9"
                          : "none",
                        color: isSelected ? "#fff" : isCurrentMonth ? "#0f172a" : "#94a3b8",
                        cursor: !isDisabled && isCurrentMonth ? "pointer" : "default",
                        fontWeight: isSelected || isToday ? 700 : 500,
                        fontSize: 13,
                        fontFamily: "'DM Sans',sans-serif",
                        transition: "all 0.15s",
                        opacity: isDisabled ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isDisabled && isCurrentMonth && !isSelected) {
                          e.currentTarget.style.background = "#f0f9ff";
                          e.currentTarget.style.color = "#0284c7";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isSelected) {
                          e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#0284c7)";
                          e.currentTarget.style.color = "#fff";
                        } else if (isToday && isCurrentMonth) {
                          e.currentTarget.style.background = "#ecf9ff";
                          e.currentTarget.style.color = "#0f172a";
                        } else if (isCurrentMonth) {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "#0f172a";
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
            <div style={{ borderTop: "1.5px solid #f1f5f9", padding: "10px 0 0 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { label: "Today", value: 0 },
                  { label: "Tomorrow", value: 1 },
                  { label: "In 3 days", value: 3 },
                  { label: "In a week", value: 7 },
                  { label: "In 2 weeks", value: 14 },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.value}
                    onClick={() => handlePreset(preset.value)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      background: "#fff",
                      color: "#0284c7",
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "center",
                      minHeight: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg,#ecf9ff,#e0f2fe)";
                      e.currentTarget.style.borderColor = "#0ea5e9";
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
        </>,
        document.body
      )}
    </div>
  );
}
