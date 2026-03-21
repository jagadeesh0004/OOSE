import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.user_type !== role) {
    return <Navigate to={role === "doctor" ? "/patient-dashboard" : "/doctor-dashboard"} replace />;
  }

  return children;
}
