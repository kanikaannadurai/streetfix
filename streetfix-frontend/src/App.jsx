import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import WardSupervisorDashboard from './pages/supervisor/WardSupervisorDashboard';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import Navbar from './components/Navbar';
import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';
import NotFound from './pages/shared/NotFound';
import Unauthorized from './pages/shared/Unauthorized';
import GenericError from './pages/shared/GenericError';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').replace('ROLE_', '').toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Citizen — nested routes handled inside CitizenDashboard */}
          <Route path="/citizen/*" element={
            <ProtectedRoute allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />

          {/* Officer — nested routes handled inside OfficerDashboard */}
          <Route path="/officer/*" element={
            <ProtectedRoute allowedRoles={['OFFICER']}>
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          {/* Worker — nested routes handled inside WorkerDashboard */}
          <Route path="/worker/*" element={
            <ProtectedRoute allowedRoles={['WORKER']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin — nested routes handled inside AdminDashboard */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'WARD_SUPERVISOR']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Ward Supervisor */}
          <Route path="/ward-supervisor/*" element={
            <ProtectedRoute allowedRoles={['WARD_SUPERVISOR']}>
              <WardSupervisorDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/error" element={<GenericError />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
