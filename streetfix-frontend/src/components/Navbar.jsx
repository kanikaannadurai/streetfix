import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Home, User, Bell, LayoutDashboard,
  ClipboardList, PlusCircle, BarChart3, Settings, UserCheck
} from 'lucide-react';
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
    { path: '/admin/reports',     label: 'Reports',    icon: <BarChart3       size={15} /> },
    { path: '/admin/sla',         label: 'SLA',        icon: <Settings        size={15} /> },
  ],
};

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MUNICIPAL_COMMISSIONER'];
const OFFICER_ROLES = ['OFFICER', 'WARD_SUPERVISOR', 'ZONAL_OFFICER'];

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

  const navRole = ADMIN_ROLES.includes(role) ? 'ADMIN' : OFFICER_ROLES.includes(role) ? 'OFFICER' : 'CITIZEN';
  const links   = NAV_LINKS[navRole] || [];

  if (!token) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand" onClick={() => navigate(`/${navRole.toLowerCase()}`)}>
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
            className={`nav-link-btn ${location.pathname === link.path || (link.path !== `/${navRole.toLowerCase()}` && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
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
