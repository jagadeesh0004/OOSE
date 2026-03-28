export function Spinner({ size = 24, color = "#0ea5e9" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid #e2e8f0",
        borderTopColor: color,
        animation: "spin 0.75s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}
