import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle, Clock, Star, CheckCircle, Camera, User, MessageSquare, Loader, ThumbsUp } from 'lucide-react';
import api from '../../services/api';

const timelineDot = status => {
  if (['RESOLVED', 'CLOSED'].includes(status)) return 'green';
  if (status === 'IN_PROGRESS') return 'purple';
  if (status === 'ESCALATED')   return 'red';
  if (status === 'ASSIGNED')    return 'blue';
  return 'amber';
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fbLoading, setFbLoading] = useState(false);
  const [feedback, setFeedback]   = useState({ rating: 5, comments: '' });
  const [fbDone, setFbDone]       = useState(false);
  const [error, setError]         = useState('');
  const [supporting, setSupporting] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, tlRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/complaints/${id}/timeline`).catch(() => ({ data: [] }))
      ]);
      setComplaint(cRes.data);
      const tl = Array.isArray(tlRes.data) && tlRes.data.length > 0
        ? tlRes.data
        : buildFallbackTimeline(cRes.data);
      setTimeline(tl);
    } catch (err) {
      setError('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const buildFallbackTimeline = c => {
    const entries = [{ status: 'PENDING', note: 'Complaint registered', date: c.createdAt }];
    if (!['PENDING'].includes(c.status)) entries.push({ status: 'ASSIGNED', note: 'Assigned to field officer', date: c.updatedAt });
    if (['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(c.status)) entries.push({ status: 'IN_PROGRESS', note: 'Work commenced by officer', date: c.updatedAt });
    if (['RESOLVED', 'CLOSED'].includes(c.status)) entries.push({ status: 'RESOLVED', note: 'Issue resolved and verified', date: c.updatedAt });
    return entries;
  };

  const submitFeedback = async e => {
    e.preventDefault();
    setFbLoading(true);
    try {
      await api.post('/feedback', { complaintId: id, rating: feedback.rating, comments: feedback.comments });
      setFbDone(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setFbLoading(false);
    }
  };

  const handleSupport = async () => {
    setSupporting(true);
    try {
      await api.post(`/complaints/${id}/support`);
      // Re-fetch to update count
      await fetchData();
      alert('Thank you for verifying this issue.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to support complaint.');
    } finally {
      setSupporting(false);
    }
  };

  const fmt = d => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;
  if (error || !complaint) return (
    <div className="dashboard-container">
      <div className="alert alert-error">{error || 'Complaint not found.'}</div>
      <button className="btn-secondary" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Go Back</button>
    </div>
  );

  const resolved = ['RESOLVED', 'CLOSED'].includes(complaint.status);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
          <div>
            <h2 className="gradient-text">Complaint #{complaint.id}</h2>
            <p>{complaint.title}</p>
          </div>
        </div>
        <span className={`status-badge status-${(complaint.status || '').toLowerCase()}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
          {(complaint.status || '').replace('_', ' ')}
        </span>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Description */}
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><MessageSquare size={14} color="#60a5fa" /></div>
                Description
              </div>
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-light)' }}>{complaint.description}</p>
            
            {/* Community Support */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(59,130,246,0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(59,130,246,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ThumbsUp size={16} color="var(--primary-color)" /> Community Verification
                </div>
                <div className="text-sm text-muted">{complaint.supportCount || 0} Citizens have verified this issue.</div>
              </div>
              {!resolved && (
                <button className="btn-secondary" onClick={handleSupport} disabled={supporting}>
                  {supporting ? <Loader size={14} className="spin-icon" /> : <><ThumbsUp size={14} /> Support Issue</>}
                </button>
              )}
            </div>

            {/* Meta Info */}
            <div style={{ marginTop: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)', padding: '16px' }}>
              {[
                { label: 'Category',  value: complaint.category || 'Pending AI Detection', icon: <AlertCircle size={14} /> },
                { label: 'Priority',  value: complaint.priority || 'N/A', icon: <AlertCircle size={14} /> },
                { label: 'Location',  value: complaint.latitude ? `${Number(complaint.latitude).toFixed(6)}, ${Number(complaint.longitude).toFixed(6)}` : complaint.address || 'Not specified', icon: <MapPin size={14} /> },
                { label: 'Submitted', value: fmt(complaint.createdAt), icon: <Clock size={14} /> },
                { label: 'Updated',   value: fmt(complaint.updatedAt), icon: <Clock size={14} /> },
                complaint.assignedOfficerName && { label: 'Assigned Officer', value: complaint.assignedOfficerName, icon: <User size={14} /> },
              ].filter(Boolean).map((r, i) => (
                <div key={i} className="info-row">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{r.icon}{r.label}</div>
                  <div className="info-value"
                    style={{ color: r.label === 'Priority' ? (r.value === 'HIGH' ? 'var(--danger)' : r.value === 'MEDIUM' ? 'var(--warning)' : 'var(--success)') : 'var(--text-light)' }}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title">
                <div className="section-title-icon"><Camera size={14} color="#60a5fa" /></div>
                Photo Evidence
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: resolved ? '1fr 1fr' : '1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
                <Camera size={28} color="var(--text-dim)" style={{ margin: '0 auto 8px' }} />
                <p className="text-sm text-muted">Reported Image</p>
                {complaint.imageUrl
                  ? <img src={complaint.imageUrl} alt="Issue" style={{ width: '100%', marginTop: '12px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: '200px' }} />
                  : <div style={{ height: '80px', background: 'rgba(255,255,255,0.03)', marginTop: '8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="text-xs text-muted">No image attached</span>
                    </div>
                }
              </div>
              {resolved && (
                <div style={{ background: 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center', border: '1px dashed rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={28} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                  <p className="text-sm" style={{ color: 'var(--success)' }}>Resolution Proof</p>
                  {complaint.afterImageUrl
                    ? <img src={complaint.afterImageUrl} alt="After" style={{ width: '100%', marginTop: '12px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: '200px' }} />
                    : <div style={{ height: '80px', background: 'rgba(255,255,255,0.03)', marginTop: '8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-xs text-muted">Pending officer upload</span>
                      </div>
                  }
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {resolved && (
            <div className="glass-panel section-card">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-title-icon"><Star size={14} color="#fbbf24" /></div>
                  Rate Resolution
                </div>
              </div>
              {fbDone ? (
                <div className="alert alert-success"><CheckCircle size={16} /> Thank you! Your feedback has been submitted.</div>
              ) : (
                <form onSubmit={submitFeedback}>
                  <div className="form-group">
                    <label>Rating</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFeedback(f => ({ ...f, rating: n }))}
                          style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
                            border: '1px solid ' + (feedback.rating >= n ? 'var(--warning)' : 'var(--glass-border)'),
                            background: feedback.rating >= n ? 'rgba(245,158,11,0.15)' : 'transparent',
                            cursor: 'pointer', fontSize: '20px', transition: 'var(--transition)',
                          }}
                        >⭐</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Share your experience with the resolution..."
                      value={feedback.comments}
                      onChange={e => setFeedback(f => ({ ...f, comments: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={fbLoading}>
                    {fbLoading ? <><Loader size={14} /> Submitting...</> : <><Star size={14} /> Submit Feedback</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="glass-panel section-card" style={{ position: 'sticky', top: '120px' }}>
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon"><Clock size={14} color="#60a5fa" /></div>
              Status Timeline
            </div>
          </div>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-left">
                  <div className={`timeline-dot ${timelineDot(t.status)}`} />
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-status">{(t.status || '').replace('_', ' ')}</div>
                  {t.note && <div className="timeline-note">{t.note}</div>}
                  <div className="timeline-date">{fmt(t.date || t.createdAt || t.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
          {complaint.wardNumber && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-sm text-muted">Ward Number</p>
              <p className="font-semibold">#{complaint.wardNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
