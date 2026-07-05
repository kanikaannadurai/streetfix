import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, MapPin, Clock, ChevronRight, PlusCircle, RotateCcw } from 'lucide-react';
import api from '../../services/api';

const STATUSES = ['', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const CATEGORIES = ['', 'Road Damage', 'Pothole', 'Garbage / Waste', 'Street Light', 'Water Leak / Sewage', 'Encroachment', 'Drainage Issue', 'Tree Hazard', 'Other'];

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort]         = useState('newest');

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/my');
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch   = !q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
      const matchStatus   = !status   || c.status === status;
      const matchCategory = !category || c.category === category;
      return matchSearch && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'priority') {
        const p = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
      }
      return 0;
    });

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const statusDotColor = s => ({
    PENDING: '#fbbf24', ASSIGNED: '#60a5fa', IN_PROGRESS: '#a78bfa',
    RESOLVED: '#34d399', CLOSED: '#94a3b8', ESCALATED: '#f87171',
  })[s] || '#94a3b8';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div className="page-header-left">
          <h2 className="gradient-text">My Complaints</h2>
          <p>{complaints.length} total issues reported by you</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchComplaints} title="Refresh"><RotateCcw size={16} /></button>
          <button className="btn-primary" onClick={() => navigate('/citizen/submit')}>
            <PlusCircle size={16} /> New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <div className="search-input-wrap">
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search complaints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
        </div>
        {(search || status || category) && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-muted text-sm">{filtered.length} result(s)</span>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => { setSearch(''); setStatus(''); setCategory(''); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="glass-panel section-card">
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>{complaints.length === 0 ? 'No complaints filed yet.' : 'No complaints match your filters.'}</p>
            {complaints.length === 0 && (
              <button className="btn-primary" onClick={() => navigate('/citizen/submit')}>
                <PlusCircle size={16} /> Report First Issue
              </button>
            )}
          </div>
        ) : (
          <div className="complaint-list">
            {filtered.map(c => (
              <div
                key={c.id}
                className="complaint-card clickable"
                onClick={() => navigate(`/citizen/complaints/${c.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    {/* Status indicator dot */}
                    <div style={{ marginTop: '6px', width: 10, height: 10, borderRadius: '50%', background: statusDotColor(c.status), flexShrink: 0, boxShadow: `0 0 6px ${statusDotColor(c.status)}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="complaint-card-title" style={{ marginBottom: '4px' }}>{c.title}</div>
                      <p className="complaint-card-desc">{c.description}</p>
                      <div className="complaint-card-meta">
                        {c.category && <span><AlertCircle size={12} />{c.category}</span>}
                        {c.priority && <span style={{ color: c.priority === 'HIGH' ? 'var(--danger)' : c.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>● {c.priority}</span>}
                        {c.createdAt && <span><Clock size={12} />{fmt(c.createdAt)}</span>}
                        {c.latitude && <span><MapPin size={12} />{Number(c.latitude).toFixed(4)}, {Number(c.longitude).toFixed(4)}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span>
                    <ChevronRight size={16} color="var(--text-dim)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
