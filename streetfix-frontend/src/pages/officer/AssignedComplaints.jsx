import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, AlertTriangle, CheckCircle, RotateCcw, ArrowLeft, Edit2 } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const STATUSES = ['', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const AssignedComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [priority, setPriority] = useState('');
  const [view, setView]         = useState('active'); // 'active' | 'all'

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = complaints
    .filter(c => {
      if (view === 'active' && ['RESOLVED', 'CLOSED'].includes(c.status)) return false;
      const q = search.toLowerCase();
      const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
      const matchStatus   = !status   || c.status === status;
      const matchPriority = !priority || c.priority === priority;
      return matchSearch && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      const pOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
    });

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';
  const priorityColor = p => ({ HIGH: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' })[p] || 'var(--text-muted)';

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/officer')}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">Assigned Complaints</h2>
            <p>{filtered.length} task(s) {view === 'active' ? 'requiring attention' : 'in total'}</p>
          </div>
        </div>
        <div className="page-header-actions">
          <div className="tabs">
            <button className={`tab-btn ${view === 'active' ? 'active' : ''}`} onClick={() => setView('active')}>
              Active
            </button>
            <button className={`tab-btn ${view === 'all' ? 'active' : ''}`} onClick={() => setView('all')}>
              All
            </button>
          </div>
          <button className="btn-icon" onClick={fetchComplaints}><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <div className="search-input-wrap">
            <Search size={16} color="var(--text-muted)" />
            <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="">All Priorities</option>
            {['HIGH', 'MEDIUM', 'LOW'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="glass-panel section-card">
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <p>No tasks found with the current filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filtered.map(c => (
              <div key={c.id} className="complaint-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Card header */}
                <div className="complaint-card-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="complaint-card-title">{c.title}</div>
                    {c.priority && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontSize: '11px', fontWeight: 700, color: priorityColor(c.priority) }}>
                        ● {c.priority} PRIORITY
                      </div>
                    )}
                  </div>
                  <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span>
                </div>

                <p className="complaint-card-desc">{c.description}</p>

                {/* Meta */}
                <div className="complaint-card-meta">
                  {c.category && <span><AlertTriangle size={12} />{c.category}</span>}
                  {c.latitude && <span><MapPin size={12} />{Number(c.latitude).toFixed(4)}, {Number(c.longitude).toFixed(4)}</span>}
                  {c.createdAt && <span><Clock size={12} />{fmt(c.createdAt)}</span>}
                  {c.slaBreached && <span className="sla-breach">⚠ SLA Breach</span>}
                </div>

                {/* Actions */}
                {!['RESOLVED', 'CLOSED'].includes(c.status) && (
                  <div className="complaint-card-actions">
                    <button className="btn-primary" style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }} onClick={() => navigate(`/officer/update/${c.id}`)}>
                      <Edit2 size={14} /> Update Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedComplaints;
