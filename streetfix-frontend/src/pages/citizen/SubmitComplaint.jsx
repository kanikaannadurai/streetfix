import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, X, SendHorizonal, Loader, Mic, MicOff, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMarker = ({ position, setPosition, fetchAddress }) => {
  const map = useMap();
  const lat = position ? position[0] : null;
  const lng = position ? position[1] : null;
  
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  return position && position[0] ? <Marker position={position} icon={customIcon} /> : null;
};


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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [searchParams] = useSearchParams();
  const assetCodeParam = searchParams.get('assetCode');
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // default to Delhi

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    latitude: '',
    longitude: '',
    address: '',
    displayAddress: '',
    assetCode: assetCodeParam || '',
  });

  useEffect(() => {
    if (assetCodeParam) {
      api.get(`/assets/code/${assetCodeParam}`).then(res => {
        if (res.data && res.data.latitude && res.data.longitude) {
           setForm(f => ({ ...f, latitude: res.data.latitude, longitude: res.data.longitude }));
        }
      }).catch(err => console.error("Asset not found"));
    }
  }, [assetCodeParam]);
  
  const [isListening, setIsListening] = useState({ field: null });
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors(fe => ({ ...fe, [e.target.name]: null }));
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const fetchAddress = async (lat, lon) => {
    const latFixed = lat.toFixed(6);
    const lonFixed = lon.toFixed(6);
    setForm(f => ({ ...f, latitude: latFixed, longitude: lonFixed, displayAddress: 'Fetching address...' }));
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latFixed}&lon=${lonFixed}`);
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const area = a.suburb || a.neighbourhood || a.village || a.residential || a.road || '';
        const city = a.city || a.town || a.county || '';
        const district = a.state_district || '';
        const state = a.state || '';
        const country = a.country || '';
        const pincode = a.postcode || '';
        
        const parts = [];
        if (area) parts.push(area);
        if (city) parts.push(city);
        if (district && district !== city) parts.push(district);
        if (state) parts.push(state);
        if (country) {
           parts.push(pincode ? `${country} - ${pincode}` : country);
        }
        
        const displayAddr = parts.join(',\n');
        const fullAddress = data.display_name;
        
        setForm(f => ({ ...f, address: fullAddress, displayAddress: displayAddr, latitude: latFixed, longitude: lonFixed }));
      } else {
         setForm(f => ({ ...f, displayAddress: 'Unable to fetch address', latitude: latFixed, longitude: lonFixed }));
      }
    } catch (e) {
      console.error('Geocoding failed', e);
      setForm(f => ({ ...f, displayAddress: 'Unable to fetch address', latitude: latFixed, longitude: lonFixed }));
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        fetchAddress(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === 1) {
          alert("Unable to access your location. Please select a location manually on the map.");
        } else {
          alert('Could not get location');
        }
      }
    );
  };

  const toggleVoice = (field) => {
    if (isListening.field === field) {
      setIsListening({ field: null });
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Input. Please use Chrome or Edge.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening({ field });
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setForm(f => ({ ...f, [field]: f[field] ? f[field] + ' ' + transcript : transcript }));
    };
    
    recognition.onerror = (e) => {
      console.error(e);
      setIsListening({ field: null });
    };
    
    recognition.onend = () => setIsListening({ field: null });
    
    recognition.start();
  };

  const handleSupportDuplicate = async (existingId) => {
    try {
      await api.post(`/complaints/${existingId}/support`);
      alert("Successfully supported the existing issue.");
      navigate('/citizen/my-complaints');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to support complaint");
    }
  };

  const executeSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category || null,
        priority: isEmergency ? 'CRITICAL' : (form.priority || null),
        latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        address:   form.address || null,
        assetCode: form.assetCode || null,
      };
      await api.post('/complaints', payload);
      window.dispatchEvent(new Event('refreshNotifications'));
      setSuccess(true);
      setTimeout(() => navigate('/citizen/my-complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
      setShowDuplicateModal(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    let errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.latitude || !form.longitude) errors.location = 'Please set a location on the map';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields properly.');
      return;
    }
    
    if (form.latitude && form.longitude && !showDuplicateModal) {
      try {
        setLoading(true);
        const res = await api.get('/complaints/check-duplicates', {
          params: {
            title: form.title,
            description: form.description,
            category: form.category || '',
            latitude: form.latitude,
            longitude: form.longitude
          }
        });
        
        if (res.data && res.data.length > 0) {
          setDuplicates(res.data);
          setShowDuplicateModal(true);
          setLoading(false);
          return; // Stop submission to show modal
        }
      } catch (err) {
        console.error("Duplicate check failed", err);
      }
    }
    
    await executeSubmit();
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

          {showDuplicateModal && (
            <div className="alert alert-warning" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} />
                <strong>Potential Duplicates Found</strong>
              </div>
              <p>We found similar issues reported nearby. Supporting an existing issue resolves it faster!</p>
              {duplicates.slice(0,2).map(d => (
                <div key={d.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div className="text-xs text-muted">{d.category} • {Math.round(d.distanceMeters)}m away</div>
                  </div>
                  <button type="button" className="btn-primary" style={{ padding: '6px 12px' }} onClick={() => handleSupportDuplicate(d.id)}>
                    Support Instead
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowDuplicateModal(false)}>Cancel</button>
                <button type="button" className="btn-secondary" style={{ borderColor: 'var(--border-color)', color: 'var(--text-dim)' }} onClick={executeSubmit}>
                  Report Duplicate Anyway
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Title *</span>
                <button type="button" onClick={() => toggleVoice('title')} style={{ background: 'none', border: 'none', color: isListening.field === 'title' ? 'var(--primary-color)' : 'var(--text-dim)', cursor: 'pointer' }}>
                  {isListening.field === 'title' ? <Mic size={16} className="pulse-animation" /> : <MicOff size={16} />}
                </button>
              </label>
              <input
                name="title"
                className={`input-field ${fieldErrors.title ? 'invalid' : ''}`}
                style={fieldErrors.title ? { borderColor: 'var(--danger)' } : {}}
                placeholder="Brief description of the issue"
                value={form.title}
                onChange={handleChange}
              />
              {fieldErrors.title && <div className="text-xs" style={{ color: 'var(--danger)', marginTop: '4px' }}>{fieldErrors.title}</div>}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Detailed Description *</span>
                <button type="button" onClick={() => toggleVoice('description')} style={{ background: 'none', border: 'none', color: isListening.field === 'description' ? 'var(--primary-color)' : 'var(--text-dim)', cursor: 'pointer' }}>
                  {isListening.field === 'description' ? <Mic size={16} className="pulse-animation" /> : <MicOff size={16} />}
                </button>
              </label>
              <textarea
                name="description"
                className={`input-field ${fieldErrors.description ? 'invalid' : ''}`}
                style={fieldErrors.description ? { borderColor: 'var(--danger)' } : {}}
                rows={5}
                placeholder="Describe the issue in detail — when did it start, severity, impact..."
                value={form.description}
                onChange={handleChange}
              />
              {fieldErrors.description && <div className="text-xs" style={{ color: 'var(--danger)', marginTop: '4px' }}>{fieldErrors.description}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category (AI can detect)</label>
                <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                  <option value="">🤖 Auto-Detect Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority (AI can detect)</label>
                <select name="priority" className="input-field" value={form.priority} onChange={handleChange} disabled={isEmergency}>
                  <option value="">🤖 Auto-Detect Priority</option>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <input 
                type="checkbox" 
                id="emergency" 
                checked={isEmergency} 
                onChange={(e) => setIsEmergency(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="emergency" style={{ margin: 0, color: 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}>
                🚨 Mark as Emergency / Critical Hazard
              </label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Latitude *</label>
                <input name="latitude" className="input-field" value={form.latitude} onChange={handleChange} placeholder="e.g. 28.6139" style={fieldErrors.location ? { borderColor: 'var(--danger)' } : {}} />
              </div>
              <div className="form-group">
                <label>Longitude *</label>
                <input name="longitude" className="input-field" value={form.longitude} onChange={handleChange} placeholder="e.g. 77.2090" style={fieldErrors.location ? { borderColor: 'var(--danger)' } : {}} />
              </div>
            </div>
            {fieldErrors.location && <div className="text-xs" style={{ color: 'var(--danger)', marginTop: '4px' }}>{fieldErrors.location}</div>}

            <div style={{ height: '300px', width: '100%', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker 
                  position={form.latitude && form.longitude ? [parseFloat(form.latitude), parseFloat(form.longitude)] : null} 
                  setPosition={(pos) => setMapCenter(pos)} 
                  fetchAddress={fetchAddress} 
                />
              </MapContainer>
            </div>

            <button type="button" className="btn-secondary w-full" style={{ marginBottom: '16px' }} onClick={locateMe}>
              <MapPin size={16} /> Use My Current Location
            </button>

            {form.displayAddress && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px' }}>Current Location</div>
                {form.displayAddress === 'Unable to fetch address' ? (
                  <div className="text-muted">Unable to fetch address</div>
                ) : form.displayAddress === 'Fetching address...' ? (
                  <div className="text-muted">Fetching address...</div>
                ) : (
                  <div className="text-sm" style={{ whiteSpace: 'pre-line', marginBottom: '12px', lineHeight: '1.5' }}>
                    {form.displayAddress}
                  </div>
                )}
                <div className="text-xs text-muted" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div>Latitude: {form.latitude}</div>
                  <div>Longitude: {form.longitude}</div>
                </div>
              </div>
            )}

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
