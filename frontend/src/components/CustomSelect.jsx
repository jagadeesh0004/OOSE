import { useState, useRef, useEffect } from "react";

export function CustomSelect({ value, onChange, options, placeholder = "Select...", style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          appearance: "none",
          background: "#fff",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M7 10l5 5 5-5z"/></svg>')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "18px",
          paddingRight: 40,
          paddingLeft: 12,
          borderRadius: "12px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Sora',sans-serif",
          color: "#0f172a",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          padding: "10px 40px 10px 12px",
          overflow: "hidden",
          ...style,
        }}
      >
        {selectedOption?.label || placeholder}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: position.width,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            zIndex: 9999,
            maxHeight: 280,
            overflowY: "auto",
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                background: value === opt.value ? "linear-gradient(135deg,#e0f2fe,#bae6fd)" : "#fff",
                border: "none",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 14,
                fontWeight: value === opt.value ? 700 : 500,
                fontFamily: "'Sora',sans-serif",
                color: value === opt.value ? "#0284c7" : "#0f172a",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = "#fff";
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
