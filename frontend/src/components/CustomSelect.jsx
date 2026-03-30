import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function CustomSelect({ value, onChange, options, placeholder = "Select...", style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const updatePosition = () => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    updatePosition();
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleScroll() {
      updatePosition();
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
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
          background: "#f8fafc",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M7 10l5 5 5-5z"/></svg>')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "18px",
          paddingRight: 40,
          paddingLeft: 12,
          borderRadius: "9px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'DM Sans',sans-serif",
          color: "#0f172a",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          cursor: "pointer",
          transition: "all 0.18s",
          padding: "8px 40px 8px 12px",
          outline: "none",
          ...style,
        }}
      >
        {selectedOption?.label || placeholder}
      </button>

      {isOpen && createPortal(
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: position.width,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "9px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            zIndex: 999999,
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
                padding: "8px 12px",
                textAlign: "left",
                background: value === opt.value ? "linear-gradient(135deg,#e0f2fe,#bae6fd)" : "#fff",
                border: "none",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
                color: value === opt.value ? "#0284c7" : "#0f172a",
                cursor: "pointer",
                transition: "all 0.18s",
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
        </div>,
        document.body
      )}
    </div>
  );
}
