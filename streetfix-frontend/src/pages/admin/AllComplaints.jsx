import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, UserCheck, AlertTriangle, MapPin, Clock, ChevronRight, RotateCcw, Eye } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/SkeletonLoader';
import '../citizen/Citizen.css';

const STATUSES = ['', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED'];
const CATEGORIES = ['', 'Road Damage', 'Pothole', 'Garbage / Waste', 'Street Light', 'Water Leak / Sewage', 'Encroachment', 'Drainage Issue', 'Other'];

const AllComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort]         = useState('newest');
  const [page, setPage]         = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      const content = res.data.content ? res.data.content : (Array.isArray(res.data) ? res.data : []);
      setComplaints(content);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = complaints
    .filter(c => {
      const q = search.toLowerCase();
      const ms = !q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || String(c.id).includes(q);
      const mst = !status   || c.status === status;
      const mc  = !category || c.category === category;
      const mp  = !priority || c.priority === priority;
      return ms && mst && mc && mp;
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

  const pages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paged  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const fmt    = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';

  const resetFilters = () => { setSearch(''); setStatus(''); setCategory(''); setPriority(''); setPage(1); };

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin')}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">All Complaints</h2>
            <p>{filtered.length} of {complaints.length} complaints</p>
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn-icon" onClick={fetchComplaints}><RotateCcw size={16} /></button>
          <button className="btn-primary" onClick={() => navigate('/admin/assign')}>
            <UserCheck size={16} /> Assign
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel section-card" style={{ marginBottom: '24px' }}>
        <div className="filter-bar" style={{ marginBottom: '0' }}>
          <div className="search-input-wrap" style={{ flex: 2 }}>
            <Search size={16} color="var(--text-muted)" />
            <input placeholder="Search by ID, title, description..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={status}   onChange={e => { setStatus(e.target.value);   setPage(1); }}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select className="filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>
            <option value="">All Priorities</option>
            {['HIGH', 'MEDIUM', 'LOW'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
          {(search || status || category || priority) && (
            <button className="btn-secondary" style={{ padding: '11px 16px' }} onClick={resetFilters}>Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel section-card">
        {loading ? (
          <div className="loading-state" style={{ padding: '20px' }}>
            <SkeletonLoader count={5} type="card" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} />
            <p>No complaints match your filters.</p>
            <button className="btn-secondary" onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>SLA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map(c => (
                    <tr key={c.id}>
                      <td className="text-muted text-sm">#{c.id}</td>
                      <td style={{ maxWidth: '180px' }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                        {c.description && (
                          <div className="text-xs text-muted" style={{ marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {c.description}
                          </div>
                        )}
                      </td>
                      <td className="text-sm">{c.category || <span className="text-muted">Auto-detect</span>}</td>
                      <td>
                        {c.priority
                          ? <span style={{ fontSize: '11px', fontWeight: 700, color: c.priority === 'HIGH' ? 'var(--danger)' : c.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>● {c.priority}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td><span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span></td>
                      <td className="text-sm text-muted">
                        {c.latitude ? `${Number(c.latitude).toFixed(3)}…` : '—'}
                      </td>
                      <td className="text-sm text-muted">{fmt(c.createdAt)}</td>
                      <td>
                        {c.slaBreached
                          ? <span className="text-xs sla-breach">⚠ Breach</span>
                          : <span className="text-xs sla-ok">✓ OK</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-icon" title="Assign Officer" onClick={() => navigate('/admin/assign')}>
                            <UserCheck size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  ← Prev
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={page === p ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '7px 12px', fontSize: '13px', minWidth: '36px' }}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  );
                })}
                <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }} disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllComplaints;
