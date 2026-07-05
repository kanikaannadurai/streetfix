import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, TrendingUp, PieChart, AlertTriangle, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const Reports = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [dlLoading, setDlLoading] = useState({});
  const [error, setError]     = useState('');

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [repRes, compRes] = await Promise.all([
        api.get('/reports').catch(() => ({ data: null })),
        api.get('/complaints').catch(() => ({ data: [] })),
      ]);
      const complaints = Array.isArray(compRes.data) ? compRes.data : [];

      // Build stats from raw data if /reports endpoint not available
      const byStatus   = {};
      const byCategory = {};
      const byPriority = {};
      complaints.forEach(c => {
        byStatus[c.status]         = (byStatus[c.status]         || 0) + 1;
        byCategory[c.category || 'Unknown'] = (byCategory[c.category || 'Unknown'] || 0) + 1;
        byPriority[c.priority || 'MEDIUM']  = (byPriority[c.priority || 'MEDIUM']  || 0) + 1;
      });

      setData(repRes.data || {
        totalComplaints:        complaints.length,
        resolvedComplaints:     byStatus['RESOLVED'] + byStatus['CLOSED'] || 0,
        pendingComplaints:      byStatus['PENDING']  || 0,
        inProgressComplaints:   byStatus['IN_PROGRESS'] || 0,
        breachedSlas:           complaints.filter(c => c.slaBreached).length,
        avgResolutionHours:     0,
        byStatus,
        byCategory,
        byPriority,
        complaints, // for display
      });
    } catch (err) {
      setError('Failed to load report data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    setDlLoading(d => ({ ...d, [type]: true }));
    try {
      const res = await api.get(`/reports/${type}`, { responseType: 'blob' });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `streetfix-report-${Date.now()}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(`Could not download ${type.toUpperCase()} report. Ensure the backend endpoint /api/reports/${type} is available.`);
    } finally {
      setDlLoading(d => ({ ...d, [type]: false }));
    }
  };

  const BarChartSimple = ({ data: barData, colorFn }) => {
    const entries = Object.entries(barData || {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const max     = Math.max(...entries.map(e => e[1]), 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.map(([label, count]) => (
          <div key={label} className="metric-row" style={{ marginBottom: 0 }}>
            <div className="metric-header">
              <span className="metric-label">{label.replace('_', ' ')}</span>
              <span className="metric-value">{count}</span>
            </div>
            <div className="progress-bar-wrap">
              <div className={`progress-bar ${colorFn ? colorFn(label) : 'blue'}`} style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-muted text-sm">No data available.</p>}
      </div>
    );
  };

  const statusColor = s => {
    const m = { RESOLVED: 'green', CLOSED: 'green', PENDING: 'amber', IN_PROGRESS: 'purple', ASSIGNED: 'blue', ESCALATED: 'red' };
    return m[s] || 'blue';
  };
  const priorityColor = p => ({ HIGH: 'red', MEDIUM: 'amber', LOW: 'green' })[p] || 'blue';

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin')}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">Reports & Analytics</h2>
            <p>System-wide complaint management performance metrics.</p>
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchReports}><RotateCcw size={16} /></button>
          <button className="btn-secondary" onClick={() => handleDownload('csv')} disabled={dlLoading.csv}>
            <Download size={16} /> {dlLoading.csv ? 'Downloading...' : 'CSV'}
          </button>
          <button className="btn-primary" onClick={() => handleDownload('pdf')} disabled={dlLoading.pdf}>
            <Download size={16} /> {dlLoading.pdf ? 'Downloading...' : 'PDF'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error"><AlertTriangle size={16} />{error}</div>}

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Complaints',   value: data?.totalComplaints   ?? 0, icon: <BarChart3   size={22} color="#60a5fa" />, cls: 'blue'   },
          { label: 'Resolved',           value: data?.resolvedComplaints ?? 0, icon: <CheckCircle size={22} color="#34d399" />, cls: 'green'  },
          { label: 'Pending',            value: data?.pendingComplaints  ?? 0, icon: <Clock       size={22} color="#fbbf24" />, cls: 'amber'  },
          { label: 'SLA Breaches',       value: data?.breachedSlas       ?? 0, icon: <AlertTriangle size={22} color="#f87171" />, cls: 'red' },
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

      {/* Charts row */}
      <div className="content-grid equal" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><PieChart size={14} color="#60a5fa" /></div>
              By Status
            </div>
          </div>
          <BarChartSimple data={data?.byStatus} colorFn={statusColor} />
        </div>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><AlertTriangle size={14} color="#f87171" /></div>
              By Priority
            </div>
          </div>
          <BarChartSimple data={data?.byPriority} colorFn={priorityColor} />
        </div>
      </div>

      <div className="content-grid equal" style={{ marginBottom: '24px' }}>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><BarChart3 size={14} color="#60a5fa" /></div>
              By Category
            </div>
          </div>
          <BarChartSimple data={data?.byCategory} colorFn={() => 'blue'} />
        </div>
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><TrendingUp size={14} color="#34d399" /></div>
              Performance Summary
            </div>
          </div>
          <div>
            {[
              { label: 'Resolution Rate',    value: `${data?.totalComplaints ? Math.round((data.resolvedComplaints / data.totalComplaints) * 100) : 0}%`,  bar: data?.totalComplaints ? (data.resolvedComplaints / data.totalComplaints) * 100 : 0, cls: 'green' },
              { label: 'SLA Breach Rate',    value: `${data?.totalComplaints ? Math.round((data.breachedSlas / data.totalComplaints) * 100) : 0}%`,         bar: data?.totalComplaints ? (data.breachedSlas / data.totalComplaints) * 100 : 0,    cls: 'red' },
              { label: 'Avg Resolution',     value: data?.avgResolutionHours ? `${data.avgResolutionHours.toFixed(1)}h` : 'N/A', bar: 0, cls: 'blue' },
              { label: 'In Progress Rate',   value: `${data?.totalComplaints ? Math.round(((data.inProgressComplaints || 0) / data.totalComplaints) * 100) : 0}%`, bar: data?.totalComplaints ? ((data.inProgressComplaints || 0) / data.totalComplaints) * 100 : 0, cls: 'purple' },
            ].map((m, i) => (
              <div key={i} className="metric-row">
                <div className="metric-header">
                  <span className="metric-label">{m.label}</span>
                  <span className="metric-value">{m.value}</span>
                </div>
                {m.bar > 0 && (
                  <div className="progress-bar-wrap">
                    <div className={`progress-bar ${m.cls}`} style={{ width: `${Math.min(m.bar, 100)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export section */}
      <div className="glass-panel section-card" style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.04)' }}>
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-icon"><Download size={14} color="#60a5fa" /></div>
            Export Reports
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { type: 'csv', label: 'CSV Report',  desc: 'Full complaint data in CSV format', icon: '📊' },
            { type: 'pdf', label: 'PDF Report',  desc: 'Formatted report with charts',      icon: '📄' },
          ].map(r => (
            <div key={r.type} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{r.icon}</span>
              <div style={{ fontWeight: 700 }}>{r.label}</div>
              <div className="text-sm text-muted">{r.desc}</div>
              <button
                className="btn-secondary"
                style={{ marginTop: '4px', padding: '9px 16px', fontSize: '13px' }}
                onClick={() => handleDownload(r.type)}
                disabled={dlLoading[r.type]}
              >
                <Download size={14} /> {dlLoading[r.type] ? 'Downloading...' : `Download ${r.type.toUpperCase()}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
