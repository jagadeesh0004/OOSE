import { Ico } from "../utils/icons";
import { IC } from "../utils/constants";

export function Empty({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 32px" }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: 16, margin: "0 auto 20px",
          background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
          border: "1.5px solid #bae6fd",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Ico d={IC[icon] || IC.alert} s={26} color="#0ea5e9" />
      </div>
      <p style={{
        fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700,
        color: "#1e293b", marginBottom: 8,
      }}>
        {title}
      </p>
      {sub && (
        <p style={{
          fontSize: 14, color: "#94a3b8", lineHeight: 1.6,
          maxWidth: 320, margin: "0 auto",
        }}>
          {sub}
        </p>
      )}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}
