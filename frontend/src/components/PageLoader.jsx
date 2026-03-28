import { Spinner } from "./Spinner";

export function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 24px",
        gap: 16,
      }}
    >
      <Spinner size={36} />
      <p style={{ color: "#94a3b8", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
        Loading…
      </p>
    </div>
  );
}
