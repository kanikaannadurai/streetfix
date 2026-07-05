import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Shield, Users, Settings, Database, Activity, CheckCircle,
  AlertTriangle, RotateCcw, Trash2, Edit2, ClipboardList, BarChart3
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const ROLES = [
  'ROLE_CITIZEN', 'ROLE_WORKER', 'ROLE_OFFICER', 'ROLE_WARD_SUPERVISOR',
  'ROLE_ASSISTANT_COMMISSIONER', 'ROLE_ZONAL_OFFICER', 'ROLE_MUNICIPAL_COMMISSIONER',
  'ROLE_ADMIN', 'ROLE_SUPER_ADMIN',
];

const SuperAdminHome = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [slaStats, setSlaStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, userAnalRes, slaRes] = await Promise.all([
        api.get('/analytics/dashboard').catch(() => ({ data: null })),
        api.get('/analytics/admin/users').catch(() => ({ data: [] })),
        api.get('/analytics/users').catch(() => ({ data: null })),
        api.get('/analytics/sla').catch(() => ({ data: null })),
      ]);
      if (dashRes.data) setStats(dashRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setUserAnalytics(userAnalRes.data);
      setSlaStats(slaRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleRoleUpdate = async () => {
    if (!editingUser || !newRole) return;
    try {
      await api.put(`/analytics/admin/users/${editingUser.id}/role?role=${newRole}`);
      setEditingUser(null);
      fetchData();
      alert('Role updated successfully');
    } catch (e) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/analytics/admin/users/${userId}`);
      fetchData();
    } catch (e) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} /> Super Admin Control Center
          </h2>
          <p>Complete system monitoring, user management, and platform analytics.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchData}><RotateCcw size={16} /></button>
          <button className="btn-secondary" onClick={() => navigate('/admin/reports')}><BarChart3 size={16} /> Reports</button>
          <button className="btn-primary" onClick={() => navigate('/admin/complaints')}><ClipboardList size={16} /> All Complaints</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Complaints', value: stats?.totalComplaints ?? 0,    icon: <ClipboardList size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',         value: stats?.resolvedComplaints ?? 0, icon: <CheckCircle   size={22} color="#34d399" />, cls: 'green'  },
          { label: 'SLA Breaches',     value: stats?.breachedSlas ?? 0,       icon: <AlertTriangle size={22} color="#f87171" />, cls: 'red'    },
          { label: 'Total Users',      value: userAnalytics?.totalUsers ?? 0, icon: <Users         size={22} color="#a78bfa" />, cls: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card glass-panel">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '...' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* User Role Distribution & SLA */}
      <div className="content-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-title" style={{ marginBottom: '20px' }}><Users size={14} color="#60a5fa" /> User Role Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'citizens', label: 'Citizens', color: '#34d399' },
              { key: 'officers', label: 'Officers', color: '#60a5fa' },
              { key: 'workers', label: 'Workers', color: '#f59e0b' },
              { key: 'wardSupervisors', label: 'Ward Supervisors', color: '#a78bfa' },
              { key: 'admins', label: 'Admins', color: '#f87171' },
            ].map(({ key, label, color }) => {
              const val = userAnalytics?.[key] ?? 0;
              const total = userAnalytics?.totalUsers || 1;
              const pct = Math.round((val / total) * 100);
              return (
                <div key={key}>
                  <div className="metric-header">
                    <span className="metric-label">{label}</span>
                    <span style={{ fontWeight: 700, color }}>{val}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: '6px' }}>
                    <div style={{ height: '6px', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel section-card">
          <div className="section-title" style={{ marginBottom: '20px' }}><Activity size={14} color="#34d399" /> System Health</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Platform Status', value: 'Operational', color: 'var(--success)' },
              { label: 'SLA Compliance', value: `${100 - (slaStats?.breachRate ?? 0)}%`, color: slaStats?.breachRate > 20 ? 'var(--danger)' : 'var(--success)' },
              { label: 'SLA Breached', value: slaStats?.breached ?? 0, color: 'var(--danger)' },
              { label: 'Avg Resolution', value: stats?.averageResolutionTimeHours ? `${stats.averageResolutionTimeHours.toFixed(1)}h` : 'N/A', color: 'var(--primary-color)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border-bright)' }}>
                <span className="text-muted">{item.label}</span>
                <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel section-card">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <div className="section-title"><Users size={14} color="#60a5fa" /> User Management</div>
          <input
            type="text"
            className="input-field"
            style={{ width: '250px', padding: '6px 12px', fontSize: '13px' }}
            placeholder="Search users..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />
        </div>
        <div className="data-table-wrapper">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, 15).map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '10px' }} className="text-muted">#{u.id}</td>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '10px' }} className="text-muted">{u.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span className="status-badge" style={{ fontSize: '11px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>
                      {u.role?.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '5px' }} onClick={() => { setEditingUser(u); setNewRole(u.role); }}>
                      <Edit2 size={13} />
                    </button>
                    <button className="btn-secondary" style={{ padding: '5px', color: 'var(--danger)' }} onClick={() => handleDeleteUser(u.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Edit Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '380px', padding: '28px' }}>
            <h3 style={{ marginTop: 0 }}>Change Role</h3>
            <p className="text-muted" style={{ marginBottom: '16px' }}>User: <strong>{editingUser.name}</strong> ({editingUser.email})</p>
            <select className="input-field" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ marginBottom: '20px' }}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('ROLE_', '')}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary w-full" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn-primary w-full" onClick={handleRoleUpdate}>Update Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SuperAdminDashboard = () => {
  return (
    <Routes>
      <Route index element={<SuperAdminHome />} />
    </Routes>
  );
};

export default SuperAdminDashboard;
