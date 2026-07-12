import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Home, User, Bell, LayoutDashboard,
  ClipboardList, PlusCircle, BarChart3, Settings, UserCheck,
  Map as MapIcon, Activity, Box, Shield, Trophy, Building, FileText,
  UserCircle, Settings as SettingsIcon, Menu, X
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
  WORKER: [
    { path: '/worker',           label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { path: '/worker/tasks',     label: 'My Tasks',  icon: <ClipboardList   size={15} /> },
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
};

const Navbar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('token');
  const rawRole    = localStorage.getItem('role') || '';
  const role       = rawRole.replace('ROLE_', '').toUpperCase();
  const username   = localStorage.getItem('name');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  let navRole = 'CITIZEN';
  if (role === 'ADMIN') navRole = 'ADMIN';
  else if (role === 'WARD_SUPERVISOR') navRole = 'WARD_SUPERVISOR';
  else if (role === 'OFFICER') navRole = 'OFFICER';
  else if (role === 'WORKER') navRole = 'WORKER';

  const links = NAV_LINKS[navRole] || [];

  const getBrandPath = () => {
    if (navRole === 'WARD_SUPERVISOR') return '/ward-supervisor';
    return `/${navRole.toLowerCase()}`;
  };

  if (!token) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-top-row">
        <div className="navbar-brand" onClick={() => navigate(getBrandPath())}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            🛣️
          </div>
          <span className="gradient-text" style={{ fontSize: '1.15rem', fontWeight: 800 }}>StreetFix</span>
        </div>

        <div className="navbar-mobile-actions">
          <NotificationBell />
          <button className="btn-icon mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
        {/* Nav Links */}
        <div className="navbar-links">
          {links.map(link => (
            <button
              key={link.path}
              className={`nav-link-btn ${location.pathname === link.path || (link.path !== getBrandPath() && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
              onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <div className="desktop-only-bell">
            <NotificationBell />
          </div>
          <button className="btn-icon" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} title="Profile">
            <UserCircle size={20} />
          </button>
          <button className="btn-icon" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} title="Settings">
            <SettingsIcon size={20} />
          </button>

          <div className="nav-user">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
              {(username || role || 'U')[0].toUpperCase()}
            </div>
            <div className="nav-user-text">
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{username || 'User'}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{role.replace('_', ' ')}</span>
            </div>
          </div>
          <button className="btn-secondary logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
