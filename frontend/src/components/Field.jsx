// ── SLabel — uppercase section label ──────────────────────────────────────
export function SLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "'Sora',sans-serif",
        fontSize: 11,
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        marginBottom: 7,
      }}
    >
      {children}
    </label>
  );
}

// ── Field — label + children wrapper ──────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div>
      <SLabel>{label}</SLabel>
      {children}
    </div>
  );
}

// ── Inp — labeled text input shorthand ────────────────────────────────────
export function Inp({ label, ...props }) {
  return (
    <Field label={label}>
      <input className="dash-input" {...props} />
    </Field>
  );
}
