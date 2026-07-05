import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, UserCheck, BarChart3, Settings,
  CheckCircle, AlertTriangle, Clock, TrendingUp, Users, RotateCcw,
  Download, Shield
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';
import AllComplaints from './AllComplaints';
import AssignComplaint from './AssignComplaint';
import Reports from './Reports';
import SLAConfig from './SLAConfig';
import LiveMap from '../shared/LiveMap';
import HeatMap from '../shared/HeatMap';
import AdminAssets from './AdminAssets';
import AssetDetail from './AssetDetail';

// ─── Admin Dashboard Home ────────────────────────────────
const AdminHome = () => {
  const [stats, setStats]      = useState(null);
  const [recent, setRecent]    = useState([]);
  const [escalated, setEscalated] = useState([]);
  const [loading, setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, compRes, escalRes] = await Promise.all([
        api.get('/dashboard/admin').catch(() => ({ data: null })),
        api.get('/complaints').catch(() => ({ data: [] })),
        api.get('/escalations').catch(() => ({ data: [] })),
      ]);
      const complaints = Array.isArray(compRes.data) ? compRes.data : [];
      setRecent(complaints.slice(0, 6));
      setEscalated(Array.isArray(escalRes.data) ? escalRes.data.slice(0, 4) : []);
      if (dashRes.data) {
        setStats(dashRes.data);
      } else {
        const total    = complaints.length;
        const resolved = complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
        const pending  = complaints.filter(c => c.status === 'PENDING').length;
        const breaches = complaints.filter(c => c.slaBreached).length;
        const inProg   = complaints.filter(c => c.status === 'IN_PROGRESS').length;
        setStats({ totalComplaints: total, resolvedComplaints: resolved, pendingComplaints: pending, breachedSlas: breaches, inProgressComplaints: inProg, averageResolutionTimeHours: 0 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resolutionPct = stats ? Math.round((stats.resolvedComplaints / Math.max(stats.totalComplaints, 1)) * 100) : 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">Admin Command Center</h2>
          <p>System-wide overview of civic issue management.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchData}><RotateCcw size={16} /></button>
          <button className="btn-secondary" onClick={() => navigate('/admin/reports')}>
            <Download size={16} /> Reports
          </button>
          <button className="btn-primary" onClick={() => navigate('/admin/complaints')}>
            <ClipboardList size={16} /> All Complaints
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Issues',     value: stats?.totalComplaints ?? 0,     icon: <ClipboardList   size={22} color="#60a5fa" />, cls: 'blue',   change: null },
          { label: 'Resolved',         value: stats?.resolvedComplaints ?? 0,  icon: <CheckCircle     size={22} color="#34d399" />, cls: 'green',  change: `${resolutionPct}% rate` },
          { label: 'Pending Review',   value: stats?.pendingComplaints ?? 0,   icon: <Clock           size={22} color="#fbbf24" />, cls: 'amber',  change: null },
          { label: 'SLA Breaches',     value: stats?.breachedSlas ?? 0,        icon: <AlertTriangle   size={22} color="#f87171" />, cls: 'red',    change: null },
        ].map((s, i) => (
          <div key={i} className="stat-card glass-panel">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '...' : s.value}</div>
              <div className="stat-label">{s.label}</div>
              {s.change && <div className="stat-change up">{s.change}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Rate & Avg Time */}
      <div className="content-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><TrendingUp size={14} color="#60a5fa" /></div>
              System Performance
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-label">Resolution Rate</span>
                <span className="metric-value text-success">{resolutionPct}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar green" style={{ width: `${resolutionPct}%` }} />
              </div>
            </div>
            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-label">Avg. Resolution Time</span>
                <span className="metric-value">{stats?.averageResolutionTimeHours ? `${stats.averageResolutionTimeHours.toFixed(1)}h` : 'N/A'}</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar blue" style={{ width: `${Math.min(100, (stats?.averageResolutionTimeHours || 0) / 72 * 100)}%` }} />
              </div>
            </div>
            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-label">SLA Breach Rate</span>
                <span className="metric-value text-danger">
                  {stats ? `${Math.round((stats.breachedSlas / Math.max(stats.totalComplaints, 1)) * 100)}%` : 'N/A'}
                </span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar red" style={{ width: `${stats ? Math.round((stats.breachedSlas / Math.max(stats.totalComplaints, 1)) * 100) : 0}%` }} />
              </div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <button className="btn-secondary" onClick={() => navigate('/admin/assign')}>
              <UserCheck size={14} /> Assign Complaints
            </button>
            <button className="btn-secondary" onClick={() => navigate('/admin/sla')}>
              <Settings size={14} /> Configure SLA
            </button>
          </div>
        </div>

        {/* Escalated Issues */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><Shield size={14} color="#f87171" /></div>
              Escalated Issues
            </div>
            <span className="text-xs text-muted">{escalated.length} alerts</span>
          </div>
          {escalated.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <CheckCircle size={36} color="var(--success)" />
              <p className="text-sm">No escalations at this time</p>
            </div>
          ) : (
            <div className="complaint-list">
              {escalated.map((e, i) => (
                <div key={i} className="complaint-card">
                  <div className="complaint-card-header">
                    <span className="complaint-card-title">{e.complaintTitle || e.title || `Complaint #${e.complaintId || e.id}`}</span>
                    <span className="status-badge status-escalated">Escalated</span>
                  </div>
                  <p className="text-xs text-muted">{e.reason || e.escalationReason || 'SLA breach / inactivity'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon"><ClipboardList size={14} color="#60a5fa" /></div>
            Recent Complaints
          </div>
          <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => navigate('/admin/complaints')}>
            View All
          </button>
        </div>
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>SLA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id}>
                    <td className="text-muted">#{c.id}</td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                    </td>
                    <td className="text-muted">{c.category || '—'}</td>
                    <td>
                      {c.priority
                        ? <span style={{ fontSize: '11px', fontWeight: 700, color: c.priority === 'HIGH' ? 'var(--danger)' : c.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>● {c.priority}</span>
                        : '—'}
                    </td>
                    <td><span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span></td>
                    <td>
                      {c.slaBreached
                        ? <span className="text-xs sla-breach">⚠ Breached</span>
                        : <span className="text-xs sla-ok">✓ OK</span>}
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => navigate('/admin/assign')} title="Assign">
                        <UserCheck size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Nav items for sidebar (used in sub-pages) ──────────
export const AdminNavItems = [
  { path: '/admin',          label: 'Dashboard',     icon: <LayoutDashboard size={16} /> },
  { path: '/admin/complaints', label: 'All Complaints', icon: <ClipboardList size={16} /> },
  { path: '/admin/assign',   label: 'Assign',        icon: <UserCheck size={16} /> },
  { path: '/admin/reports',  label: 'Reports',       icon: <BarChart3 size={16} /> },
  { path: '/admin/sla',      label: 'SLA Config',    icon: <Settings size={16} /> },
];

// ─── Admin Dashboard Wrapper ─────────────────────────────
const AdminDashboard = () => {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="complaints" element={<AllComplaints />} />
      <Route path="assign" element={<AssignComplaint />} />
      <Route path="reports" element={<Reports />} />
      <Route path="sla" element={<SLAConfig />} />
      <Route path="map" element={<LiveMap />} />
      <Route path="heatmap" element={<HeatMap />} />
      <Route path="assets" element={<AdminAssets />} />
      <Route path="assets/:assetCode" element={<AssetDetail />} />
    </Routes>
  );
};

export default AdminDashboard;
