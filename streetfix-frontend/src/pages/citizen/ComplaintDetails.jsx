import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Citizen.css';
import { ArrowLeft, Clock, MapPin, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data);
      // Mocking timeline since the timeline API might be slightly different or not fully implemented on backend
      setTimeline([
        { status: 'PENDING', date: res.data.createdAt, note: 'Complaint registered' },
        res.data.status !== 'PENDING' && { status: 'ASSIGNED', date: res.data.updatedAt, note: 'Assigned to officer' },
        res.data.status === 'IN_PROGRESS' && { status: 'IN_PROGRESS', date: res.data.updatedAt, note: 'Work started' },
        (res.data.status === 'RESOLVED' || res.data.status === 'CLOSED') && { status: 'RESOLVED', date: res.data.updatedAt, note: 'Work completed by officer' }
      ].filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/feedback', { complaintId: id, ...feedback });
      alert('Feedback submitted successfully!');
      fetchComplaint();
    } catch (err) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return <div className="p-6">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="gradient-text">Complaint #{complaint.id}</h2>
            <p>{complaint.title}</p>
          </div>
        </div>
        <span className={`status-badge status-${complaint.status.toLowerCase()}`}>{complaint.status}</span>
      </div>

      <div className="dashboard-grid">
        <div className="main-content-area">
          <div className="glass-panel p-6">
            <h3>Description</h3>
            <p className="mt-4 text-muted">{complaint.description}</p>
            
            <div className="complaint-meta mt-4" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span><AlertCircle size={16}/> Category: {complaint.category || 'N/A'}</span>
              <span><AlertCircle size={16}/> Priority: {complaint.priority || 'N/A'}</span>
              <span><MapPin size={16}/> Location: {complaint.latitude}, {complaint.longitude}</span>
            </div>

            {/* Before and After Images */}
            <div className="mt-4" style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                <Camera size={24} style={{ margin: '0 auto 8px' }} />
                <p>Reported Image</p>
                <div style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.05)', marginTop: '8px', borderRadius: '4px' }}></div>
              </div>
              {complaint.status === 'RESOLVED' && (
                <div style={{ flex: 1, padding: '16px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                  <CheckCircle size={24} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                  <p>Completion Proof</p>
                  <div style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.05)', marginTop: '8px', borderRadius: '4px' }}></div>
                </div>
              )}
            </div>
          </div>

          {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') && (
            <div className="glass-panel p-6 mt-4">
              <h3>Verify & Provide Feedback</h3>
              <form onSubmit={submitFeedback} className="mt-4">
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input type="number" min="1" max="5" className="input-field" value={feedback.rating} onChange={e => setFeedback({...feedback, rating: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Comments</label>
                  <textarea className="input-field" rows="3" value={feedback.comments} onChange={e => setFeedback({...feedback, comments: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>Submit Feedback</button>
              </form>
            </div>
          )}
        </div>

        <div className="sidebar-area glass-panel p-6">
          <h3>Timeline</h3>
          <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {timeline.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)', marginTop: '6px' }}></div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.status}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleString()}</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
