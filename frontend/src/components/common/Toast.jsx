import { useState, useCallback } from "react";
import { IC } from "../../utils/constants";

export function Ico({ d, s = 18, stroke = 1.8, color = "currentColor", fill = "none" }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

export function Spinner({ size = 26, color = "#0ea5e9" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2.5px solid #e2e8f0`,
        borderTopColor: color,
        animation: "spin 0.75s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 24px",
        gap: 14,
      }}
    >
      <Spinner size={36} />
      <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading…</p>
    </div>
  );
}

export function Empty({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 32px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          margin: "0 auto 20px",
          background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
          border: "1.5px solid #bae6fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ico d={IC[icon] || IC.alert} s={26} color="#0ea5e9" />
      </div>
      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
        {title}
      </p>
      {sub && (
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>{sub}</p>
      )}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

let _toastPush;

export function Toaster() {
  const [list, setList] = useState([]);

  _toastPush = useCallback((msg, type) => {
    const id = Date.now() + Math.random();
    setList((p) => [...p, { id, msg, type }]);
    setTimeout(() => setList((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  const colors = {
    success: ["#f0fdf4", "#16a34a", "#bbf7d0"],
    error: ["#fff1f2", "#dc2626", "#fecdd3"],
    info: ["#f0f9ff", "#0ea5e9", "#bae6fd"],
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {list.map((t) => {
        const [bg, fg, bd] = colors[t.type] || colors.info;
        return (
          <div
            key={t.id}
            style={{
              animation: "toastIn 0.22s ease",
              background: bg,
              border: `1.5px solid ${bd}`,
              color: fg,
              borderRadius: 12,
              padding: "12px 18px",
              fontSize: 14,
              maxWidth: 340,
              boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 15, flexShrink: 0 }}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}

export const toast = (msg, type = "info") => _toastPush?.(msg, type);
