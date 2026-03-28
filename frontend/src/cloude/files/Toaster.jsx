import { useState, useCallback, useEffect, useRef } from "react";

// ── Module-level ref so `toast()` can be called from anywhere ──────────────
let _pushToast;
let _isToasterMounted = false;
const _pendingToasts = [];

export function Toaster() {
  const [list, setList] = useState([]);
  const timerRefs = useRef([]);

  useEffect(() => {
    _isToasterMounted = true;
    // Process any pending toasts
    while (_pendingToasts.length > 0) {
      const { msg, type } = _pendingToasts.shift();
      _pushToast(msg, type);
    }
    return () => {
      _isToasterMounted = false;
      // Cleanup all pending timers
      timerRefs.current.forEach(id => clearTimeout(id));
      timerRefs.current = [];
    };
  }, []);

  _pushToast = useCallback((msg, type) => {
    const id = Date.now() + Math.random();
    setList((p) => [...p, { id, msg, type }]);
    const timerId = setTimeout(() => setList((p) => p.filter((t) => t.id !== id)), 4000);
    timerRefs.current.push(timerId);
  }, []);

  const colors = {
    success: ["#f0fdf4", "#16a34a", "#bbf7d0"],
    error:   ["#fff1f2", "#dc2626", "#fecdd3"],
    info:    ["#f0f9ff", "#0ea5e9", "#bae6fd"],
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      display: "flex", flexDirection: "column", gap: 10,
      pointerEvents: "none",
    }}>
      {list.map((t) => {
        const [bg, fg, border] = colors[t.type] || colors.info;
        return (
          <div
            key={t.id}
            style={{
              animation: "toastIn 0.22s ease",
              background: bg,
              border: `1.5px solid ${border}`,
              color: fg,
              borderRadius: 12,
              padding: "12px 18px",
              fontSize: 14,
              maxWidth: 340,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}

// ── Call this anywhere after <Toaster /> is mounted ───────────────────────
export const toast = (msg, type = "info") => {
  if (!_isToasterMounted) {
    _pendingToasts.push({ msg, type });
    console.warn("Toaster not mounted yet. Toast queued.");
    return;
  }
  if (_pushToast) _pushToast(msg, type);
};
