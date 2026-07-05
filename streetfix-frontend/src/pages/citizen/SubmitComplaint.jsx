import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, X, SendHorizonal, Loader } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
  'Road Damage', 'Pothole', 'Garbage / Waste',
  'Street Light', 'Water Leak / Sewage', 'Encroachment',
  'Drainage Issue', 'Tree Hazard', 'Noise Complaint', 'Other',
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    latitude: '',
    longitude: '',
    address: '',
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      pos => setForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => alert('Could not get location')
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category || null,
        priority: form.priority,
        latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        address:   form.address || null,
      };
      await api.post('/complaints', payload);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/my-complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--success)' }}>
            <SendHorizonal size={36} color="var(--success)" />
          </div>
          <h2 className="gradient-text">Complaint Submitted!</h2>
          <p className="text-muted">Your issue has been registered. Our AI will analyse and categorise it shortly.</p>
          <p className="text-muted text-sm">Redirecting to My Complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/citizen')}>
            <ArrowLeft size={18} />
          </button>
          <div className="page-header-left">
            <h2 className="gradient-text">Report a Civic Issue</h2>
            <p>Submit a complaint — AI will categorise & prioritise it automatically.</p>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Form */}
        <div className="glass-panel section-card">
          {error && <div className="alert alert-error"><X size={16} />{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                name="title"
                className="input-field"
                placeholder="Brief description of the issue"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Detailed Description *</label>
              <textarea
                name="description"
                className="input-field"
                rows={5}
                placeholder="Describe the issue in detail — when did it start, severity, impact..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category (optional — AI will detect)</label>
                <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                  <option value="">🤖 Auto-Detect</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" className="input-field" value={form.priority} onChange={handleChange}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address / Landmark</label>
              <input
                name="address"
                className="input-field"
                placeholder="e.g. Near Central Park, Main Street"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="28.6139"
                  value={form.latitude}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="77.2090"
                  value={form.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="button" className="btn-secondary w-full" style={{ marginBottom: '16px' }} onClick={locateMe}>
              <MapPin size={16} /> Use My Current Location
            </button>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <><Loader size={16} className="spin-icon" /> Submitting...</> : <><SendHorizonal size={16} /> Submit Complaint</>}
            </button>
          </form>
        </div>

        {/* Sidebar tips & photo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Photo upload */}
          <div className="glass-panel section-card">
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <div className="section-title">
                <div className="section-title-icon"><Upload size={14} color="#60a5fa" /></div>
                Attach Photo
              </div>
            </div>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: '2px dashed var(--glass-border-bright)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: 'rgba(59,130,246,0.03)',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border-bright)'}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              ) : (
                <>
                  <Upload size={32} color="var(--text-dim)" style={{ margin: '0 auto 8px' }} />
                  <p className="text-muted text-sm">Click to upload photo evidence</p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)', marginTop: '4px' }}>PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            {preview && (
              <button className="btn-secondary w-full" style={{ marginTop: '8px' }} onClick={() => { setPreview(null); fileRef.current.value = ''; }}>
                <X size={14} /> Remove Photo
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="glass-panel section-card">
            <div className="section-title" style={{ marginBottom: '16px' }}>💡 Tips for faster resolution</div>
            {[
              'Be specific about the location.',
              'Include severity — how long has this existed?',
              'Attach a photo for quicker verification.',
              'AI will auto-detect category if left blank.',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--primary-color)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
