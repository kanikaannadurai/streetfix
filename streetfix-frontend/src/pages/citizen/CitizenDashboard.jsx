import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, ClipboardList, FileText,
  MapPin, AlertCircle, TrendingUp, CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import './Citizen.css';
import SubmitComplaint from './SubmitComplaint';
import MyComplaints from './MyComplaints';
import ComplaintDetail from './ComplaintDetail';

// ─── Citizen Dashboard Home ─────────────────────────────
const CitizenHome = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'Citizen';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, compRes] = await Promise.all([
        api.get('/dashboard/citizen').catch(() => ({ data: null })),
        api.get('/complaints/my').catch(() => ({ data: [] }))
      ]);
      if (dashRes.data) setStats(dashRes.data);
      const complaints = Array.isArray(compRes.data) ? compRes.data : [];
      setRecent(complaints.slice(0, 5));
      if (!dashRes.data) {
        const total  = complaints.length;
        const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
        const pending  = complaints.filter(c => c.status === 'PENDING').length;
        setStats({ total, resolved, pending, inProgress: total - resolved - pending });
      }
    } catch (err) { console.error(err); }
  };

  const statusColor = (s) => {
    const map = { PENDING: 'amber', ASSIGNED: 'blue', IN_PROGRESS: 'purple', RESOLVED: 'green', CLOSED: 'cyan', ESCALATED: 'red' };
    return map[s] || 'blue';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">Welcome back, {name} 👋</h2>
          <p>Here's an overview of your civic reports.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => navigate('/citizen/submit')}>
            <PlusCircle size={18} /> Report Issue
          </button>
          <button className="btn-secondary" onClick={() => navigate('/citizen/my-complaints')}>
            <ClipboardList size={18} /> My Complaints
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Reported',  value: stats?.total ?? 0,       icon: <FileText   size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',        value: stats?.resolved ?? 0,    icon: <CheckCircle size={22} color="#34d399" />, cls: 'green'  },
          { label: 'Pending',         value: stats?.pending ?? 0,     icon: <AlertCircle size={22} color="#fbbf24" />, cls: 'amber'  },
          { label: 'In Progress',     value: stats?.inProgress ?? 0,  icon: <TrendingUp  size={22} color="#a78bfa" />, cls: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card glass-panel">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon">
              <ClipboardList size={16} color="#60a5fa" />
            </div>
            Recent Complaints
          </div>
          <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => navigate('/citizen/my-complaints')}>
            View All
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <p>No complaints filed yet. Report an issue to get started.</p>
            <button className="btn-primary" onClick={() => navigate('/citizen/submit')}>
              <PlusCircle size={16} /> Report First Issue
            </button>
          </div>
        ) : (
          <div className="complaint-list">
            {recent.map(c => (
              <div
                key={c.id}
                className="complaint-card clickable"
                onClick={() => navigate(`/citizen/complaints/${c.id}`)}
              >
                <div className="complaint-card-header">
                  <span className="complaint-card-title">{c.title}</span>
                  <span className={`status-badge status-${(c.status||'').toLowerCase()}`}>{c.status}</span>
                </div>
                <p className="complaint-card-desc">{c.description}</p>
                <div className="complaint-card-meta">
                  <span><AlertCircle size={12} /> {c.category || 'Auto-detecting'}</span>
                  <span><MapPin size={12} /> {c.latitude ? `${Number(c.latitude).toFixed(4)}, ${Number(c.longitude).toFixed(4)}` : 'Location set'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Citizen Dashboard Wrapper with Routing ─────────────
const CitizenDashboard = () => {
  return (
    <Routes>
      <Route index element={<CitizenHome />} />
      <Route path="submit" element={<SubmitComplaint />} />
      <Route path="my-complaints" element={<MyComplaints />} />
      <Route path="complaints/:id" element={<ComplaintDetail />} />
    </Routes>
  );
};

export default CitizenDashboard;
