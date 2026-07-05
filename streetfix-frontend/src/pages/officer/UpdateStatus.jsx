import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, MapPin, AlertCircle, Upload, Camera, Loader, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import '../citizen/Citizen.css';

const STATUS_FLOW = [
  { value: 'PENDING',     label: 'Pending',     color: '#fbbf24', desc: 'Complaint awaiting acknowledgement' },
  { value: 'ASSIGNED',    label: 'Assigned',    color: '#60a5fa', desc: 'Acknowledged – not yet started' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#a78bfa', desc: 'Actively working on the issue' },
  { value: 'RESOLVED',    label: 'Resolved',    color: '#34d399', desc: 'Work completed, pending citizen verification' },
  { value: 'CLOSED',      label: 'Closed',      color: '#94a3b8', desc: 'Fully closed after verification' },
];

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark]     = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => { fetchComplaint(); }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      setError('Failed to load complaint.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newStatus) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Try PATCH /status endpoint first, fallback to PUT
      await api.patch(`/complaints/${id}/status?status=${newStatus}`).catch(() =>
        api.put(`/complaints/${id}`, { ...complaint, status: newStatus, remarks: remark })
      );
      setSuccess(`Status updated to ${newStatus.replace('_', ' ')} successfully.`);
      setComplaint(c => ({ ...c, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const fmt = d => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const currentIdx = STATUS_FLOW.findIndex(s => s.value === complaint?.status);

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;
  if (!complaint) return <div className="dashboard-container"><div className="alert alert-error">{error || 'Complaint not found'}</div><button className="btn-secondary" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button></div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
          <div className="page-header-left">
            <h2 className="gradient-text">Update Complaint #{id}</h2>
            <p>{complaint.title}</p>
          </div>
        </div>
        <span className={`status-badge status-${(complaint.status || '').toLowerCase()}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
          {(complaint.status || '').replace('_', ' ')}
        </span>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '3fr 2fr', alignItems: 'start' }}>
        {/* Left: Update Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error   && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

          {/* Status Stepper */}
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><Clock size={14} color="#60a5fa" /></div>
                Update Status
              </div>
            </div>

            {/* Visual Progress Steps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'var(--glass-border)' }} />
              <div style={{ position: 'absolute', top: '16px', left: '10%', height: '2px', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', width: `${Math.max(0, currentIdx / (STATUS_FLOW.length - 1)) * 80}%`, transition: 'width 0.4s ease' }} />
              {STATUS_FLOW.map((s, i) => (
                <div key={s.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1, flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= currentIdx ? s.color : 'var(--bg-darker)',
                    border: `2px solid ${i <= currentIdx ? s.color : 'var(--glass-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700,
                    transition: 'var(--transition)',
                    boxShadow: i === currentIdx ? `0 0 12px ${s.color}` : 'none',
                  }}>
                    {i < currentIdx ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: i === currentIdx ? s.color : 'var(--text-dim)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Status selector */}
            <div className="form-group">
              <label>Set New Status</label>
              <select className="input-field" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {STATUS_FLOW.map(s => (
                  <option key={s.value} value={s.value}>{s.label} — {s.desc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Remarks / Notes <span style={{ color: 'var(--text-dim)' }}>(optional)</span></label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Add a note about the work done, issues encountered, next steps..."
                value={remark}
                onChange={e => setRemark(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={handleUpdate}
                disabled={saving || newStatus === complaint.status}
              >
                {saving ? <><Loader size={14} /> Saving...</> : <><CheckCircle size={14} /> Update Status</>}
              </button>
              <button className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><Camera size={14} color="#60a5fa" /></div>
                Completion Evidence
              </div>
              <span className="text-xs text-muted">Required for RESOLVED status</span>
            </div>
            <div style={{
              border: '2px dashed var(--glass-border-bright)',
              borderRadius: 'var(--radius)',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'var(--transition)',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border-bright)'}
            >
              <Upload size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p className="text-sm">Upload before/after photos of the work done</p>
              <p className="text-xs" style={{ marginTop: '4px', color: 'var(--text-dim)' }}>JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Right: Complaint Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><MessageSquare size={14} color="#60a5fa" /></div>
                Complaint Info
              </div>
            </div>
            {[
              { label: 'Title',       value: complaint.title },
              { label: 'Category',    value: complaint.category || 'Auto-detecting' },
              { label: 'Priority',    value: complaint.priority || 'N/A' },
              { label: 'Location',    value: complaint.latitude ? `${Number(complaint.latitude).toFixed(4)}, ${Number(complaint.longitude).toFixed(4)}` : 'N/A' },
              { label: 'Reported On', value: fmt(complaint.createdAt) },
              { label: 'Last Update', value: fmt(complaint.updatedAt) },
              { label: 'SLA Status',  value: complaint.slaBreached ? '⚠ BREACHED' : '✓ Within SLA' },
            ].map((r, i) => (
              <div key={i} className="info-row">
                <div className="info-label">{r.label}</div>
                <div className="info-value" style={{
                  color: r.label === 'SLA Status'
                    ? (complaint.slaBreached ? 'var(--danger)' : 'var(--success)')
                    : r.label === 'Priority'
                    ? ({ HIGH: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' }[r.value] || 'var(--text-light)')
                    : 'var(--text-light)'
                }}>
                  {r.value}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel section-card">
            <div className="section-title" style={{ marginBottom: '12px' }}>📋 Description</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{complaint.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
