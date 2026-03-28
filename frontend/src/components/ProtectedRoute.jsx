import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.user_type !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
