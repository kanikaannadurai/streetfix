import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, AlertTriangle, CheckCircle,
  Clock, TrendingUp, BarChart3, Users, RotateCcw, Map
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

// ─── Ward Supervisor Home ────────────────────────────────
const WardSupervisorHome = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const rawRole = localStorage.getItem('role') || '';
  const role = rawRole.replace('ROLE_', '').toUpperCase();

  const getDashboardTitle = () => {
    switch (role) {
      case 'WARD_SUPERVISOR': return 'Ward Supervisor Dashboard';
      default: return 'Supervisor Dashboard';
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, compRes, catRes, slaRes, trendRes] = await Promise.all([
        api.get('/dashboard/ward-supervisor').catch(() => ({ data: null })),
        api.get('/complaints').catch(() => ({ data: [] })),
        api.get('/analytics/category').catch(() => ({ data: null })),
        api.get('/analytics/sla').catch(() => ({ data: null })),
        api.get('/analytics/trend?days=7').catch(() => ({ data: null })),
      ]);
      const comps = Array.isArray(compRes.data) ? compRes.data : [];
      setComplaints(comps.slice(0, 6));
      if (dashRes.data) setStats(dashRes.data);
      else {
        setStats({
          totalComplaints: comps.length,
          resolvedComplaints: comps.filter(c => ['RESOLVED','CLOSED'].includes(c.status)).length,
          pendingComplaints: comps.filter(c => c.status === 'PENDING').length,
          breachedSlas: comps.filter(c => c.slaBreached).length,
        });
      }
      setAnalytics({ categories: catRes.data?.byCategory || {}, sla: slaRes.data || {} });
      setTrend(trendRes.data?.trend || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const resolutionRate = stats ? Math.round((stats.resolvedComplaints / Math.max(stats.totalComplaints, 1)) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">{getDashboardTitle()}</h2>
          <p>Ward-level monitoring, SLA compliance, and officer performance overview.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchData}><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Complaints', value: stats?.totalComplaints ?? 0,    icon: <ClipboardList  size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',         value: stats?.resolvedComplaints ?? 0, icon: <CheckCircle    size={22} color="#34d399" />, cls: 'green'  },
          { label: 'Pending',          value: stats?.pendingComplaints ?? 0,  icon: <Clock          size={22} color="#fbbf24" />, cls: 'amber'  },
          { label: 'SLA Breaches',     value: stats?.breachedSlas ?? 0,       icon: <AlertTriangle  size={22} color="#f87171" />, cls: 'red'    },
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

      <div className="content-grid">
        {/* Resolution Rate + SLA */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><TrendingUp size={14} color="#60a5fa" /> Performance</div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div className="metric-header">
                <span className="metric-label">Resolution Rate</span>
                <span className="metric-value text-success">{resolutionRate}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar green" style={{ width: `${resolutionRate}%` }} />
              </div>
            </div>
            <div>
              <div className="metric-header">
                <span className="metric-label">SLA Breach Rate</span>
                <span className="metric-value text-danger">{analytics?.sla?.breachRate ?? 0}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar red" style={{ width: `${analytics?.sla?.breachRate ?? 0}%` }} />
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)' }}>{analytics?.sla?.compliant ?? 0}</div>
                <div className="text-xs text-muted">Compliant</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--danger)' }}>{analytics?.sla?.breached ?? 0}</div>
                <div className="text-xs text-muted">Breached</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><BarChart3 size={14} color="#a78bfa" /> Issue Categories</div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(analytics?.categories || {}).slice(0, 6).map(([cat, count]) => {
              const max = Math.max(...Object.values(analytics?.categories || {1:1}));
              const pct = Math.round((count / max) * 100);
              return (
                <div key={cat}>
                  <div className="metric-header">
                    <span className="metric-label" style={{ fontSize: '13px' }}>{cat}</span>
                    <span className="metric-value" style={{ fontSize: '13px' }}>{count}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: '6px' }}>
                    <div className="progress-bar blue" style={{ width: `${pct}%`, height: '6px' }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(analytics?.categories || {}).length === 0 && (
              <div className="text-muted text-sm">No category data yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Trend */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title"><TrendingUp size={14} color="#34d399" /> 7-Day Complaint Trend</div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
          {trend.map((p, i) => {
            const maxVal = Math.max(...trend.map(t => t.count), 1);
            const h = Math.round((p.count / maxVal) * 100);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', height: `${h}px`, background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s', minHeight: h === 0 ? '2px' : undefined }} title={`${p.count} complaints`} />
                <div className="text-xs text-muted">{p.date?.slice(5)}</div>
              </div>
            );
          })}
          {trend.length === 0 && <div className="text-muted">No trend data.</div>}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title"><ClipboardList size={14} color="#60a5fa" /> Recent Complaints</div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/admin/complaints')}>View All</button>
        </div>
        <div className="data-table-wrapper" style={{ marginTop: '16px' }}>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td className="text-muted">#{c.id}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                  <td className="text-muted">{c.category || '—'}</td>
                  <td><span style={{ fontSize: '11px', fontWeight: 700, color: c.priority === 'HIGH' || c.priority === 'CRITICAL' ? 'var(--danger)' : c.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>● {c.priority}</span></td>
                  <td><span className={`status-badge status-${(c.status||'').toLowerCase()}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WardSupervisorDashboard = () => {
  return (
    <Routes>
      <Route index element={<WardSupervisorHome />} />
    </Routes>
  );
};

export default WardSupervisorDashboard;
