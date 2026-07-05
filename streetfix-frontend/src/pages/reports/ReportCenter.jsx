import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, FileSpreadsheet, Filter } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const ReportCenter = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    status: '',
    priority: ''
  });

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const res = await api.get(`/reports/data?${params.toString()}`);
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, []);

  const handleDownload = async (type) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const res = await api.get(`/reports/download/${type}?${params.toString()}`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `complaints_report.${type === 'excel' ? 'xlsx' : type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      alert(`Failed to download ${type.toUpperCase()} report`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={24} /> Report Center
          </h2>
          <p>Generate, filter, and download enterprise reports.</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => handleDownload('pdf')}><FileText size={16} color="#ef4444" /> Export PDF</button>
          <button className="btn-secondary" onClick={() => handleDownload('excel')}><FileSpreadsheet size={16} color="#22c55e" /> Export Excel</button>
          <button className="btn-secondary" onClick={() => handleDownload('csv')}><Download size={16} color="#60a5fa" /> Export CSV</button>
        </div>
      </div>

      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-title"><Filter size={16} /> Advanced Filters</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <input type="date" className="input-field" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} style={{ flex: 1, minWidth: '150px' }} />
          <input type="date" className="input-field" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} style={{ flex: 1, minWidth: '150px' }} />
          <select className="input-field" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={{ flex: 1, minWidth: '150px' }}>
            <option value="">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Street Light">Street Light</option>
          </select>
          <select className="input-field" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} style={{ flex: 1, minWidth: '150px' }}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select className="input-field" value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} style={{ flex: 1, minWidth: '150px' }}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button className="btn-primary" onClick={fetchPreview} style={{ padding: '0 20px' }}><Search size={16} /> Search</button>
        </div>
      </div>

      <div className="glass-panel section-card">
        <div className="section-header">
          <div className="section-title">Data Preview ({complaints.length} records)</div>
        </div>
        <div className="data-table-wrapper" style={{ marginTop: '16px' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Priority</th>
                <th style={{ padding: '12px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}><div className="spinner" style={{ margin: '0 auto' }}/></td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No records found matching filters.</td></tr>
              ) : (
                complaints.slice(0, 10).map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }} className="text-muted">#{c.id}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '12px' }}>{c.category}</td>
                    <td style={{ padding: '12px' }}><span className={`status-badge status-${(c.status||'').toLowerCase()}`}>{c.status}</span></td>
                    <td style={{ padding: '12px' }}>{c.priority}</td>
                    <td style={{ padding: '12px' }} className="text-muted">{c.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {complaints.length > 10 && <div className="text-muted text-sm" style={{ marginTop: '12px', textAlign: 'center' }}>Showing top 10 preview. Download report to see all.</div>}
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
