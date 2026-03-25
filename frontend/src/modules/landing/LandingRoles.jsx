export function LandingRoles({ onPatientSignUp, onDoctorSignUp }) {
  return (
    <section style={{
      padding: "96px 80px", background: "#fafbff"
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24
      }}>
        {/* Patient Card */}
        <div style={{
          background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
          border: "1.5px solid #bae6fd", borderRadius: 20, padding: 40
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🧑‍💼</div>
          <h3 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800,
            fontSize: 26, marginBottom: 16, letterSpacing: "-0.02em", color: "#0f172a"
          }}>
            For Patients
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Register and create your profile",
              "Browse and find verified doctors",
              "Submit health metrics for ML analysis",
              "Book and manage appointments",
              "Track your complete health history"
            ].map(item => (
              <li key={item} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                fontSize: 14, color: "#475569", lineHeight: 1.6
              }}>
                <span style={{
                  color: "#0ea5e9", marginTop: 1, flexShrink: 0,
                  fontWeight: 700
                }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button
            style={{
              marginTop: 28, width: "100%",
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)", color: "#fff",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15,
              padding: "14px 32px", borderRadius: 10, border: "none", cursor: "pointer",
              transition: "all 0.2s", boxShadow: "0 4px 24px rgba(14,165,233,0.25)"
            }}
            onClick={onPatientSignUp}
          >
            Join as Patient
          </button>
        </div>

        {/* Doctor Card */}
        <div style={{
          background: "linear-gradient(135deg,#faf5ff,#f3e8ff)",
          border: "1.5px solid #ddd6fe", borderRadius: 20, padding: 40
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👨‍⚕️</div>
          <h3 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800,
            fontSize: 26, marginBottom: 16, letterSpacing: "-0.02em", color: "#0f172a"
          }}>
            For Doctors
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Create your professional profile",
              "Generate and manage time slots",
              "View all your appointments",
              "Update status with clinical notes",
              "Get matched with high-risk patients"
            ].map(item => (
              <li key={item} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                fontSize: 14, color: "#475569", lineHeight: 1.6
              }}>
                <span style={{
                  color: "#8b5cf6", marginTop: 1, flexShrink: 0,
                  fontWeight: 700
                }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button
            style={{
              marginTop: 28, width: "100%",
              background: "transparent", color: "#7c3aed",
              fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15,
              padding: "14px 32px", borderRadius: 10,
              border: "1.5px solid #c4b5fd", cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={e => {
              e.target.background = "#8b5cf6";
              e.target.color = "#fff";
            }}
            onMouseOut={e => {
              e.target.background = "transparent";
              e.target.color = "#7c3aed";
            }}
            onClick={onDoctorSignUp}
          >
            Join as Doctor
          </button>
        </div>
      </div>
    </section>
  );
}
