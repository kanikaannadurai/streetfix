import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, CheckCircle, Clock, AlertTriangle,
  TrendingUp, MapPin, User, Bell, RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';
import AssignedComplaints from './AssignedComplaints';
import UpdateStatus from './UpdateStatus';

// ─── Officer Dashboard Home ─────────────────────────────
const OfficerHome = () => {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'Officer';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, compRes] = await Promise.all([
        api.get('/dashboard/officer').catch(() => ({ data: null })),
        api.get('/complaints').catch(() => ({ data: [] }))
      ]);
      const complaints = Array.isArray(compRes.data) ? compRes.data : [];
      setRecent(complaints.slice(0, 6));
      if (dashRes.data) {
        setStats(dashRes.data);
      } else {
        const active    = complaints.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status)).length;
        const resolved  = complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
        const overdue   = complaints.filter(c => c.slaBreached).length;
        setStats({ active, resolved, overdue, total: complaints.length });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const priorityColor = p => ({ HIGH: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' })[p] || 'var(--text-muted)';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">Officer Portal — {name}</h2>
          <p>Manage your assigned civic issues and update resolution progress.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchData}><RotateCcw size={16} /></button>
          <button className="btn-primary" onClick={() => navigate('/officer/assigned')}>
            <ClipboardList size={16} /> My Tasks
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Active Tasks',    value: stats?.active ?? 0,    icon: <ClipboardList size={22} color="#60a5fa" />,   cls: 'blue'   },
          { label: 'Resolved Today',  value: stats?.resolved ?? 0,  icon: <CheckCircle  size={22} color="#34d399" />,   cls: 'green'  },
          { label: 'SLA Breaches',    value: stats?.overdue ?? 0,   icon: <AlertTriangle size={22} color="#f87171" />,  cls: 'red'    },
          { label: 'Total Assigned',  value: stats?.total ?? 0,     icon: <TrendingUp    size={22} color="#a78bfa" />,  cls: 'purple' },
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

      {/* Recent Active Complaints */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon"><Bell size={14} color="#60a5fa" /></div>
            Active Assignments
          </div>
          <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => navigate('/officer/assigned')}>
            View All
          </button>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : recent.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status)).length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <p>All caught up! No active tasks at the moment.</p>
          </div>
        ) : (
          <div className="complaint-list">
            {recent.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status)).slice(0, 4).map(c => (
              <div key={c.id} className="complaint-card clickable" onClick={() => navigate(`/officer/update/${c.id}`)}>
                <div className="complaint-card-header">
                  <span className="complaint-card-title">{c.title}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {c.priority && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: priorityColor(c.priority) }}>● {c.priority}</span>
                    )}
                    <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span>
                  </div>
                </div>
                <p className="complaint-card-desc">{c.description}</p>
                <div className="complaint-card-meta">
                  {c.category && <span><AlertTriangle size={12} />{c.category}</span>}
                  {c.latitude && <span><MapPin size={12} />{Number(c.latitude).toFixed(4)}</span>}
                  {c.slaBreached && <span style={{ color: 'var(--danger)' }}>⚠ SLA Breached</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Officer Dashboard Wrapper ──────────────────────────
const OfficerDashboard = () => {
  return (
    <Routes>
      <Route index element={<OfficerHome />} />
      <Route path="assigned" element={<AssignedComplaints />} />
      <Route path="update/:id" element={<UpdateStatus />} />
    </Routes>
  );
};

export default OfficerDashboard;
