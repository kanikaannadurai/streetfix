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
import CommissionerDashboard from './pages/commissioner/CommissionerDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('role') || '').replace('ROLE_', '').toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
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
            <ProtectedRoute allowedRoles={['OFFICER', 'WARD_SUPERVISOR', 'ZONAL_OFFICER']}>
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin — nested routes handled inside AdminDashboard */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'MUNICIPAL_COMMISSIONER']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Ward Supervisor */}
          <Route path="/ward-supervisor/*" element={
            <ProtectedRoute allowedRoles={['WARD_SUPERVISOR']}>
              <WardSupervisorDashboard />
            </ProtectedRoute>
          } />

          {/* Commissioner (Asst. Commissioner, Zonal Officer, Municipal Commissioner) */}
          <Route path="/commissioner/*" element={
            <ProtectedRoute allowedRoles={['ASSISTANT_COMMISSIONER', 'ZONAL_OFFICER', 'MUNICIPAL_COMMISSIONER']}>
              <CommissionerDashboard />
            </ProtectedRoute>
          } />

          {/* Super Admin */}
          <Route path="/super-admin/*" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
