import { useSearchParams } from "react-router-dom";
import { LoginLeftPanel } from "../modules/login/LoginLeftPanel";
import { LoginFormPanel } from "../modules/login/LoginFormPanel";

export default function LoginPage({ onAuthChange }) {
  const [searchParams] = useSearchParams();

  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      minHeight: "100vh",
      background: "#fff",
      color: "#0f172a",
      display: "flex",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .form-scroll::-webkit-scrollbar { width: 3px; }
        .form-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {/* Left Panel */}
      <LoginLeftPanel />

      {/* Right Panel - Form */}
      <LoginFormPanel onAuthChange={onAuthChange} />
    </div>
  );
}
