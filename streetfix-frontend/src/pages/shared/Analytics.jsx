import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, PieChart, Activity, Filter,
  AlertTriangle, CheckCircle, Clock, Users, RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [priorityData, setPriorityData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [slaData, setSlaData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [trend30, setTrend30] = useState([]);
  const [trend7, setTrend7] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ovRes, catRes, priRes, staRes, slaRes, usrRes, t30Res, t7Res] = await Promise.all([
        api.get('/analytics/dashboard').catch(() => ({ data: null })),
        api.get('/analytics/category').catch(() => ({ data: null })),
        api.get('/analytics/priority').catch(() => ({ data: null })),
        api.get('/analytics/status').catch(() => ({ data: null })),
        api.get('/analytics/sla').catch(() => ({ data: null })),
        api.get('/analytics/users').catch(() => ({ data: null })),
        api.get('/analytics/trend?days=30').catch(() => ({ data: null })),
        api.get('/analytics/trend?days=7').catch(() => ({ data: null })),
      ]);
      setOverview(ovRes.data);
      setCategoryData(catRes.data?.byCategory || {});
      setPriorityData(priRes.data?.byPriority || {});
      setStatusData(staRes.data?.byStatus || {});
      setSlaData(slaRes.data);
      setUserStats(usrRes.data);
      setTrend30(t30Res.data?.trend || []);
      setTrend7(t7Res.data?.trend || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const PRIORITY_COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e' };
  const STATUS_COLORS = { PENDING: '#fbbf24', ASSIGNED: '#60a5fa', IN_PROGRESS: '#a78bfa', RESOLVED: '#34d399', CLOSED: '#22d3ee', ESCALATED: '#f87171' };

  const renderBarChart = (data, colorMap) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    const max = Math.max(...Object.values(data), 1);
    return Object.entries(data).map(([key, val]) => (
      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '110px', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, textAlign: 'right' }}>{key}</div>
        <div style={{ flex: 1, height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round((val / max) * 100)}%`, background: colorMap?.[key] || 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '4px', transition: 'width 0.5s' }} />
        </div>
        <div style={{ width: '50px', fontSize: '13px', fontWeight: 600, flexShrink: 0, textAlign: 'right' }}>
          {val} <span className="text-xs text-muted">({Math.round((val / total) * 100)}%)</span>
        </div>
      </div>
    ));
  };

  const renderTrendChart = (data, heightPx = 120) => {
    const maxVal = Math.max(...data.map(t => t.count), 1);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: `${heightPx}px`, padding: '0 4px' }}>
        {data.map((p, i) => {
          const h = Math.max(Math.round((p.count / maxVal) * heightPx), p.count > 0 ? 4 : 2);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
              title={`${p.date}: ${p.count} complaints`}>
              <div style={{ width: '100%', height: `${h}px`, background: p.count > 0 ? 'linear-gradient(180deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', borderRadius: '3px 3px 0 0', transition: 'height 0.4s' }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={24} /> Analytics Center
          </h2>
          <p>Comprehensive complaint analytics, trends, SLA compliance, and citizen participation metrics.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchAll}><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Complaints', value: overview?.totalComplaints ?? 0,        icon: <AlertTriangle size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',         value: overview?.resolvedComplaints ?? 0,     icon: <CheckCircle   size={22} color="#34d399" />, cls: 'green'  },
          { label: 'SLA Compliance',   value: `${100 - (slaData?.breachRate ?? 0)}%`, icon: <Clock         size={22} color="#a78bfa" />, cls: 'purple' },
          { label: 'Platform Users',   value: userStats?.totalUsers ?? 0,            icon: <Users         size={22} color="#f59e0b" />, cls: 'amber'  },
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

      {/* 30-Day Trend */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-title"><Activity size={14} color="#60a5fa" /> 30-Day Complaint Trend</div>
          <div className="text-xs text-muted">Hover bars for daily details</div>
        </div>
        <div style={{ marginTop: '16px' }}>
          {trend30.length > 0 ? renderTrendChart(trend30, 140) : <div className="text-muted text-sm">No trend data available.</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {trend30.filter((_, i) => i % 5 === 0).map((p, i) => (
              <span key={i} className="text-xs text-muted">{p.date?.slice(5)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Priority Charts */}
      <div className="content-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><PieChart size={14} color="#a78bfa" /> Complaints by Category</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {loading ? <div className="loading-state"><div className="spinner" /></div>
             : Object.keys(categoryData).length > 0 ? renderBarChart(categoryData, null)
             : <div className="text-muted">No data.</div>}
          </div>
        </div>

        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><TrendingUp size={14} color="#f59e0b" /> Priority Distribution</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {loading ? <div className="loading-state"><div className="spinner" /></div>
             : Object.keys(priorityData).length > 0 ? renderBarChart(priorityData, PRIORITY_COLORS)
             : <div className="text-muted">No data.</div>}
          </div>
        </div>
      </div>

      {/* Status & SLA Analytics */}
      <div className="content-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><BarChart3 size={14} color="#34d399" /> Status Breakdown</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {loading ? <div className="loading-state"><div className="spinner" /></div>
             : Object.keys(statusData).length > 0 ? renderBarChart(statusData, STATUS_COLORS)
             : <div className="text-muted">No data.</div>}
          </div>
        </div>

        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><Clock size={14} color="#fbbf24" /> SLA Analytics</div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Total SLA Tracked', value: slaData?.totalTracked ?? 0, color: '#60a5fa' },
              { label: 'Compliant', value: slaData?.compliant ?? 0, color: '#34d399' },
              { label: 'Breached', value: slaData?.breached ?? 0, color: '#ef4444' },
              { label: 'Breach Rate', value: `${slaData?.breachRate ?? 0}%`, color: slaData?.breachRate > 20 ? '#ef4444' : '#34d399' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border-bright)' }}>
                <span className="text-muted">{item.label}</span>
                <span style={{ fontWeight: 800, fontSize: '18px', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Analytics & 7-Day Trend */}
      <div className="content-grid">
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><Users size={14} color="#60a5fa" /> Citizen Participation</div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Citizens', value: userStats?.citizens ?? 0, pct: Math.round(((userStats?.citizens ?? 0) / Math.max(userStats?.totalUsers ?? 1, 1)) * 100), color: '#34d399' },
              { label: 'Officers', value: userStats?.officers ?? 0, pct: Math.round(((userStats?.officers ?? 0) / Math.max(userStats?.totalUsers ?? 1, 1)) * 100), color: '#60a5fa' },
              { label: 'Workers', value: userStats?.workers ?? 0, pct: Math.round(((userStats?.workers ?? 0) / Math.max(userStats?.totalUsers ?? 1, 1)) * 100), color: '#f59e0b' },
              { label: 'Supervisors', value: userStats?.wardSupervisors ?? 0, pct: Math.round(((userStats?.wardSupervisors ?? 0) / Math.max(userStats?.totalUsers ?? 1, 1)) * 100), color: '#a78bfa' },
            ].map((item, i) => (
              <div key={i}>
                <div className="metric-header">
                  <span className="metric-label">{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 700 }}>{item.value}</span>
                </div>
                <div className="progress-bar-wrap" style={{ height: '8px' }}>
                  <div style={{ height: '8px', width: `${item.pct}%`, background: item.color, borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><TrendingUp size={14} color="#34d399" /> 7-Day Complaint Activity</div>
          </div>
          <div style={{ marginTop: '16px' }}>
            {trend7.length > 0 ? renderTrendChart(trend7, 120) : <div className="text-muted text-sm">No data.</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {trend7.map((p, i) => <span key={i} className="text-xs text-muted">{p.date?.slice(5)}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
