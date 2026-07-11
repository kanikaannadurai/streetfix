import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Search, CheckCircle, AlertCircle, Loader, User, MapPin, Clock } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const AssignComplaint = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);   // selected complaint
  const [officerId, setOfficerId]   = useState('');
  const [assigning, setAssigning]   = useState(false);
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, oRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/users/officers').catch(() => api.get('/users').catch(() => ({ data: [] }))),
      ]);
      const complaints = Array.isArray(cRes.data) ? cRes.data : [];
      setComplaints(complaints.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status)));
      const users = Array.isArray(oRes.data) ? oRes.data : [];
      setOfficers(users.filter(u =>
        ['OFFICER', 'WARD_SUPERVISOR', 'ZONAL_OFFICER'].some(r =>
          (u.role || '').toUpperCase().includes(r.toUpperCase().replace('ROLE_', ''))
        )
      ).length > 0 ? users.filter(u =>
        ['OFFICER', 'WARD_SUPERVISOR', 'ZONAL_OFFICER'].some(r =>
          (u.role || '').toUpperCase().includes(r.toUpperCase().replace('ROLE_', ''))
        )
      ) : users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAssign = async () => {
    if (!selected || !officerId) {
      setError('Please select both a complaint and an officer.');
      return;
    }
    setAssigning(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/assignments', { complaintId: selected.id, officerId: parseInt(officerId) });
      window.dispatchEvent(new Event('refreshNotifications'));
      setSuccess(`Complaint #${selected.id} successfully assigned!`);
      setSelected(null);
      setOfficerId('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign complaint. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const q = search.toLowerCase();
    return !q || c.title?.toLowerCase().includes(q) || String(c.id).includes(q) || c.category?.toLowerCase().includes(q);
  });

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin')}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">Assign Complaints</h2>
            <p>Select a complaint and assign it to a field officer.</p>
          </div>
        </div>
      </div>

      {error   && <div className="alert alert-error"  ><AlertCircle size={16} />{error}</div>}
      {success && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

      <div className="content-grid" style={{ gridTemplateColumns: '2fr 1.5fr', alignItems: 'start' }}>
        {/* Complaint List */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><AlertCircle size={14} color="#60a5fa" /></div>
              Unresolved Complaints
              <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '99px', fontSize: '12px', marginLeft: '4px' }}>
                {filteredComplaints.length}
              </span>
            </div>
          </div>

          <div className="search-input-wrap" style={{ marginBottom: '16px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <CheckCircle size={36} />
              <p>No unresolved complaints.</p>
            </div>
          ) : (
            <div className="complaint-list" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {filteredComplaints.map(c => (
                <div
                  key={c.id}
                  className="complaint-card clickable"
                  onClick={() => { setSelected(c); setSuccess(''); setError(''); }}
                  style={{
                    border: selected?.id === c.id ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                    background: selected?.id === c.id ? 'rgba(59,130,246,0.1)' : undefined,
                    boxShadow: selected?.id === c.id ? '0 0 0 2px rgba(59,130,246,0.25)' : undefined,
                  }}
                >
                  <div className="complaint-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <input
                        type="radio"
                        checked={selected?.id === c.id}
                        onChange={() => setSelected(c)}
                        onClick={e => e.stopPropagation()}
                        style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px', flexShrink: 0 }}
                      />
                      <span className="complaint-card-title">#{c.id} — {c.title}</span>
                    </div>
                    <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span>
                  </div>
                  <div className="complaint-card-meta" style={{ marginTop: '8px' }}>
                    {c.category && <span><AlertCircle size={12} />{c.category}</span>}
                    {c.priority && <span style={{ color: c.priority === 'HIGH' ? 'var(--danger)' : c.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>● {c.priority}</span>}
                    {c.createdAt && <span><Clock size={12} />{fmt(c.createdAt)}</span>}
                    {c.latitude  && <span><MapPin size={12} />{Number(c.latitude).toFixed(3)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected complaint preview */}
          {selected ? (
            <div className="glass-panel section-card" style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}>
              <div className="section-title" style={{ marginBottom: '12px' }}>
                <div className="section-title-icon"><CheckCircle size={14} color="#34d399" /></div>
                Selected Complaint
              </div>
              <div className="info-row">
                <div className="info-label">ID</div>
                <div className="info-value">#{selected.id}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Title</div>
                <div className="info-value" style={{ maxWidth: '160px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.title}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Priority</div>
                <div className="info-value" style={{ color: selected.priority === 'HIGH' ? 'var(--danger)' : selected.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>
                  {selected.priority || 'N/A'}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Status</div>
                <div className="info-value"><span className={`status-badge status-${(selected.status || '').toLowerCase()}`}>{(selected.status || '').replace('_', ' ')}</span></div>
              </div>
            </div>
          ) : (
            <div className="glass-panel section-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
              <AlertCircle size={32} color="var(--text-dim)" style={{ margin: '0 auto 8px' }} />
              <p className="text-sm text-muted">Select a complaint from the list</p>
            </div>
          )}

          {/* Officer selection */}
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><User size={14} color="#60a5fa" /></div>
                Select Officer
              </div>
            </div>
            {officers.length === 0 && !loading ? (
              <p className="text-sm text-muted">No officers available. Ensure officer accounts are created.</p>
            ) : (
              <select
                className="input-field"
                value={officerId}
                onChange={e => setOfficerId(e.target.value)}
                style={{ marginBottom: '16px' }}
              >
                <option value="">— Choose an officer —</option>
                {officers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name || o.username || o.email} {o.role ? `(${(o.role || '').replace('ROLE_', '')})` : ''}
                  </option>
                ))}
              </select>
            )}

            <button
              className="btn-primary w-full"
              disabled={!selected || !officerId || assigning}
              onClick={handleAssign}
            >
              {assigning ? <><Loader size={14} /> Assigning...</> : <><UserCheck size={14} /> Assign Now</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaint;
