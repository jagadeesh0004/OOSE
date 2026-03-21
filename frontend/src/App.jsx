import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { getDashboardPath, getStoredUser, subscribeToAuthChanges } from './api/api.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import PredictionPage from './pages/PredictionPage.jsx';

function App() {
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => subscribeToAuthChanges(setUser), []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={getDashboardPath(user)} replace /> : <LoginPage onAuthChange={setUser} />}
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute user={user} role="patient">
              <PatientDashboard user={user} onAuthChange={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute user={user} role="doctor">
              <DoctorDashboard user={user} onAuthChange={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute user={user} role="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prediction"
          element={
            <ProtectedRoute user={user} role="patient">
              <PredictionPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? getDashboardPath(user) : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
