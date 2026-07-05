import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, AlertTriangle, CheckCircle,
  Clock, TrendingUp, BarChart3, Users, RotateCcw, Activity, Shield
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const CommissionerHome = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [priorityData, setPriorityData] = useState({});
  const [userStats, setUserStats] = useState(null);
  const [escalated, setEscalated] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, compRes, catRes, priRes, slaRes, userRes, escalRes, trendRes] = await Promise.all([
        api.get('/dashboard/admin').catch(() => ({ data: null })),
        api.get('/complaints').catch(() => ({ data: [] })),
        api.get('/analytics/category').catch(() => ({ data: null })),
        api.get('/analytics/priority').catch(() => ({ data: null })),
        api.get('/analytics/sla').catch(() => ({ data: null })),
        api.get('/analytics/users').catch(() => ({ data: null })),
        api.get('/escalations').catch(() => ({ data: [] })),
        api.get('/analytics/trend?days=30').catch(() => ({ data: null })),
      ]);
      const comps = Array.isArray(compRes.data) ? compRes.data : [];
      setComplaints(comps);
      if (dashRes.data) setStats(dashRes.data);
      else {
        setStats({
          totalComplaints: comps.length,
          resolvedComplaints: comps.filter(c => ['RESOLVED','CLOSED'].includes(c.status)).length,
          pendingComplaints: comps.filter(c => c.status === 'PENDING').length,
          breachedSlas: comps.filter(c => c.slaBreached).length,
          inProgressComplaints: comps.filter(c => c.status === 'IN_PROGRESS').length,
          averageResolutionTimeHours: 0,
        });
      }
      setAnalytics({ categories: catRes.data?.byCategory || {}, sla: slaRes.data || {} });
      setPriorityData(priRes.data?.byPriority || {});
      setUserStats(userRes.data);
      setEscalated(Array.isArray(escalRes.data) ? escalRes.data.slice(0, 4) : []);
      setTrend(trendRes.data?.trend || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const resolutionRate = stats ? Math.round((stats.resolvedComplaints / Math.max(stats.totalComplaints, 1)) * 100) : 0;
  const criticalCount = complaints.filter(c => c.priority === 'CRITICAL' && !['RESOLVED','CLOSED'].includes(c.status)).length;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">Commissioner Dashboard</h2>
          <p>City-wide performance overview, critical monitoring, and decision support.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchData}><RotateCcw size={16} /></button>
          <button className="btn-secondary" onClick={() => navigate('/admin/reports')}><BarChart3 size={16} /> Reports</button>
          <button className="btn-primary" onClick={() => navigate('/admin/map')}><Activity size={16} /> Live Map</button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <AlertTriangle size={20} />
          <span><strong>{criticalCount} Critical Issue{criticalCount > 1 ? 's' : ''}</strong> require immediate attention.</span>
          <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/admin/complaints')}>View Now</button>
        </div>
      )}

      {/* KPI Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Issues',    value: stats?.totalComplaints ?? 0,      icon: <ClipboardList size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',        value: stats?.resolvedComplaints ?? 0,   icon: <CheckCircle   size={22} color="#34d399" />, cls: 'green'  },
          { label: 'In Progress',     value: stats?.inProgressComplaints ?? 0, icon: <Clock         size={22} color="#a78bfa" />, cls: 'purple' },
          { label: 'SLA Breaches',    value: stats?.breachedSlas ?? 0,         icon: <AlertTriangle size={22} color="#f87171" />, cls: 'red'    },
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

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '24px' }}>
        {/* Resolution Rate */}
        <div className="glass-panel section-card">
          <div className="section-title" style={{ marginBottom: '16px' }}><TrendingUp size={14} color="#34d399" /> Resolution Rate</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{resolutionRate}%</div>
            <div className="text-muted text-sm">of all complaints resolved</div>
          </div>
          <div className="progress-bar-wrap" style={{ marginTop: '8px' }}>
            <div className="progress-bar green" style={{ width: `${resolutionRate}%` }} />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass-panel section-card">
          <div className="section-title" style={{ marginBottom: '16px' }}><AlertTriangle size={14} color="#f59e0b" /> Priority Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {[
              { key: 'CRITICAL', color: '#ef4444' },
              { key: 'HIGH', color: '#f97316' },
              { key: 'MEDIUM', color: '#eab308' },
              { key: 'LOW', color: '#22c55e' },
            ].map(({ key, color }) => {
              const count = priorityData[key] || 0;
              const total = Object.values(priorityData).reduce((a, b) => a + b, 0) || 1;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', flex: 1 }}>{key}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{count}</span>
                  <span className="text-xs text-muted">({Math.round((count / total) * 100)}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Overview */}
        <div className="glass-panel section-card">
          <div className="section-title" style={{ marginBottom: '16px' }}><Users size={14} color="#60a5fa" /> System Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {[
              { label: 'Total Users', value: userStats?.totalUsers ?? '...', color: '#60a5fa' },
              { label: 'Citizens', value: userStats?.citizens ?? '...', color: '#34d399' },
              { label: 'Officers', value: userStats?.officers ?? '...', color: '#a78bfa' },
              { label: 'Workers', value: userStats?.workers ?? '...', color: '#f59e0b' },
              { label: 'Escalations', value: userStats?.escalations ?? '...', color: '#f87171' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-muted text-sm">{item.label}</span>
                <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Trend */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-title"><Activity size={14} color="#60a5fa" /> 30-Day Complaint Trend</div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px', overflowX: 'auto' }}>
          {trend.map((p, i) => {
            const maxVal = Math.max(...trend.map(t => t.count), 1);
            const h = Math.max(Math.round((p.count / maxVal) * 100), p.count > 0 ? 4 : 2);
            return (
              <div key={i} style={{ flex: '0 0 auto', minWidth: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '16px', height: `${h}px`, background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} title={`${p.date}: ${p.count}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Escalated Issues & Category Breakdown */}
      <div className="content-grid">
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><Shield size={14} color="#f87171" /> Escalated Issues</div>
            <span className="text-xs text-muted">{escalated.length} alerts</span>
          </div>
          {escalated.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}><CheckCircle size={32} color="var(--success)" /><p className="text-sm">No active escalations</p></div>
          ) : (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {escalated.map((e, i) => (
                <div key={i} className="complaint-card">
                  <div className="complaint-card-header">
                    <span className="complaint-card-title">{e.complaintTitle || `Complaint #${e.complaintId || e.id}`}</span>
                    <span className="status-badge status-escalated">Escalated</span>
                  </div>
                  <p className="text-xs text-muted">{e.reason || e.escalationReason || 'SLA breach'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><BarChart3 size={14} color="#a78bfa" /> Category Distribution</div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(analytics?.categories || {}).slice(0, 7).map(([cat, count]) => {
              const max = Math.max(...Object.values(analytics?.categories || { 0: 1 }), 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={cat}>
                  <div className="metric-header">
                    <span className="metric-label" style={{ fontSize: '12px' }}>{cat}</span>
                    <span className="metric-value" style={{ fontSize: '12px' }}>{count}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: '5px' }}>
                    <div className="progress-bar blue" style={{ width: `${pct}%`, height: '5px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommissionerDashboard = () => {
  return (
    <Routes>
      <Route index element={<CommissionerHome />} />
    </Routes>
  );
};

export default CommissionerDashboard;
