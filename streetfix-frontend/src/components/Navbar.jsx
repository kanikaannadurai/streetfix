import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Home, User, Bell, LayoutDashboard,
  ClipboardList, PlusCircle, BarChart3, Settings, UserCheck,
  Map as MapIcon, Activity, Box, Shield, Trophy, Building, FileText,
  UserCircle, Settings as SettingsIcon
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const NAV_LINKS = {
  CITIZEN: [
    { path: '/citizen',                label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { path: '/citizen/submit',         label: 'Report',    icon: <PlusCircle      size={15} /> },
    { path: '/citizen/my-complaints',  label: 'My Cases',  icon: <ClipboardList   size={15} /> },
  ],
  OFFICER: [
    { path: '/officer',          label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { path: '/officer/assigned', label: 'My Tasks',  icon: <ClipboardList   size={15} /> },
  ],
  ADMIN: [
    { path: '/admin',             label: 'Dashboard',  icon: <LayoutDashboard size={15} /> },
    { path: '/admin/complaints',  label: 'Complaints', icon: <ClipboardList   size={15} /> },
    { path: '/admin/assign',      label: 'Assign',     icon: <UserCheck       size={15} /> },
    { path: '/admin/assets',      label: 'Assets',     icon: <Box             size={15} /> },
    { path: '/admin/reports-center', label: 'Reports', icon: <FileText        size={15} /> },
    { path: '/admin/sla',         label: 'SLA',        icon: <Settings        size={15} /> },
    { path: '/admin/performance/officer', label: 'Performance', icon: <Shield size={15} /> },
    { path: '/admin/leaderboards', label: 'Leaderboards', icon: <Trophy size={15} /> },
  ],
  WARD_SUPERVISOR: [
    { path: '/ward-supervisor',       label: 'Dashboard',  icon: <LayoutDashboard size={15} /> },
    { path: '/admin/complaints',      label: 'Complaints', icon: <ClipboardList   size={15} /> },
  ],
  COMMISSIONER: [
    { path: '/commissioner',          label: 'Dashboard',  icon: <LayoutDashboard size={15} /> },
    { path: '/admin/complaints',      label: 'Complaints', icon: <ClipboardList   size={15} /> },
    { path: '/admin/reports-center',  label: 'Reports',    icon: <FileText        size={15} /> },
  ],
  SUPER_ADMIN: [
    { path: '/super-admin',           label: 'Dashboard',  icon: <LayoutDashboard size={15} /> },
    { path: '/admin/complaints',      label: 'Complaints', icon: <ClipboardList   size={15} /> },
    { path: '/admin/assets',          label: 'Assets',     icon: <Box             size={15} /> },
    { path: '/admin/reports-center',  label: 'Reports',    icon: <FileText        size={15} /> },
    { path: '/admin/performance/officer', label: 'Officers', icon: <Shield size={15} /> },
    { path: '/admin/performance/ward-dept', label: 'Wards', icon: <Building size={15} /> },
    { path: '/admin/leaderboards',    label: 'Leaderboards', icon: <Trophy size={15} /> },
    { path: '/admin/sla',             label: 'SLA Config', icon: <Settings        size={15} /> },
  ],
};

const Navbar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('token');
  const rawRole    = localStorage.getItem('role') || '';
  const role       = rawRole.replace('ROLE_', '').toUpperCase();
  const username   = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  let navRole = 'CITIZEN';
  if (role === 'SUPER_ADMIN') navRole = 'SUPER_ADMIN';
  else if (['ASSISTANT_COMMISSIONER', 'ZONAL_OFFICER', 'MUNICIPAL_COMMISSIONER'].includes(role)) navRole = 'COMMISSIONER';
  else if (role === 'ADMIN') navRole = 'ADMIN';
  else if (role === 'WARD_SUPERVISOR') navRole = 'WARD_SUPERVISOR';
  else if (['OFFICER', 'WORKER'].includes(role)) navRole = 'OFFICER';

  const links = NAV_LINKS[navRole] || [];

  const getBrandPath = () => {
    if (navRole === 'SUPER_ADMIN') return '/super-admin';
    if (navRole === 'COMMISSIONER') return '/commissioner';
    if (navRole === 'WARD_SUPERVISOR') return '/ward-supervisor';
    return `/${navRole.toLowerCase()}`;
  };

  if (!token) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand" onClick={() => navigate(getBrandPath())}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
          🛣️
        </div>
        <span className="gradient-text" style={{ fontSize: '1.15rem', fontWeight: 800 }}>StreetFix</span>
      </div>

      {/* Nav Links */}
      <div className="navbar-links">
        {links.map(link => (
          <button
            key={link.path}
            className={`nav-link-btn ${location.pathname === link.path || (link.path !== getBrandPath() && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <NotificationBell />
        <button className="btn-icon" onClick={() => navigate('/profile')} title="Profile">
          <UserCircle size={20} />
        </button>
        <button className="btn-icon" onClick={() => navigate('/settings')} title="Settings">
          <SettingsIcon size={20} />
        </button>

        <div className="nav-user">
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
            {(username || role || 'U')[0].toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{username || 'User'}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{role.replace('_', ' ')}</span>
          </div>
        </div>
        <button className="btn-secondary logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
