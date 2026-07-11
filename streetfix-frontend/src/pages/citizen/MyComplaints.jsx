import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, MapPin, Clock, ChevronRight, PlusCircle, RotateCcw, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import SkeletonLoader from '../../components/SkeletonLoader';

const STATUSES = ['', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const CATEGORIES = ['', 'Road Damage', 'Pothole', 'Garbage / Waste', 'Street Light', 'Water Leak / Sewage', 'Encroachment', 'Drainage Issue', 'Tree Hazard', 'Other'];

// Component to handle map centering
const MapController = ({ selectedComplaint }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedComplaint && selectedComplaint.latitude && selectedComplaint.longitude) {
      map.flyTo([selectedComplaint.latitude, selectedComplaint.longitude], 15, { animate: true });
    }
  }, [selectedComplaint, map]);
  return null;
};

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort]         = useState('newest');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const mapRef = useRef(null);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/my');
      const content = res.data.content ? res.data.content : (Array.isArray(res.data) ? res.data : []);
      setComplaints(content);
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

  const getColor = (priority, status) => {
    if (status === 'RESOLVED' || status === 'CLOSED') return '#10b981'; // Green
    if (priority === 'CRITICAL') return '#ef4444'; // Red
    if (priority === 'HIGH') return '#f97316'; // Orange
    if (priority === 'MEDIUM') return '#eab308'; // Yellow
    return '#3b82f6'; // Blue
  };

  const handleViewOnMap = (e, complaint) => {
    e.stopPropagation(); // Prevent card click
    setSelectedComplaint(complaint);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* List */}
        <div className="glass-panel section-card">
          {loading ? (
            <div className="loading-state" style={{ padding: '20px' }}>
              <SkeletonLoader count={3} type="card" />
            </div>
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
            <div className="complaint-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filtered.map(c => (
                <div
                  key={c.id}
                  className={`complaint-card clickable ${selectedComplaint?.id === c.id ? 'selected' : ''}`}
                  onClick={() => navigate(`/citizen/complaints/${c.id}`)}
                  style={selectedComplaint?.id === c.id ? { border: '2px solid #3b82f6' } : {}}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                      <span className={`status-badge status-${(c.status || '').toLowerCase()}`}>{(c.status || '').replace('_', ' ')}</span>
                      {c.latitude && c.longitude && (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => handleViewOnMap(e, c)}
                        >
                          <MapIcon size={14} /> View on Map
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Embedded Map */}
        {!loading && complaints.length > 0 && (
          <div ref={mapRef} className="glass-panel section-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="section-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
              <div className="section-title">
                <div className="section-title-icon"><MapIcon size={16} color="#60a5fa" /></div>
                Complaint Locations
              </div>
            </div>
            <MapContainer 
              center={selectedComplaint && selectedComplaint.latitude ? [selectedComplaint.latitude, selectedComplaint.longitude] : (complaints.find(c => c.latitude)?.latitude ? [complaints.find(c => c.latitude).latitude, complaints.find(c => c.longitude).longitude] : [28.6139, 77.2090])} 
              zoom={selectedComplaint ? 15 : 12} 
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapController selectedComplaint={selectedComplaint} />
              {complaints.filter(c => c.latitude && c.longitude).map(c => (
                <CircleMarker
                  key={c.id}
                  center={[c.latitude, c.longitude]}
                  radius={selectedComplaint?.id === c.id ? 12 : 8}
                  pathOptions={{
                    color: selectedComplaint?.id === c.id ? '#000' : '#fff',
                    weight: selectedComplaint?.id === c.id ? 3 : 2,
                    fillColor: getColor(c.priority, c.status),
                    fillOpacity: selectedComplaint?.id === c.id ? 1 : 0.8,
                  }}
                  eventHandlers={{
                    click: () => setSelectedComplaint(c)
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>{c.title}</h4>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>ID:</strong> {c.id}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>Category:</strong> {c.category}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>Status:</strong> {c.status}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>Address:</strong> {c.address || 'Address not provided'}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>Date:</strong> {fmt(c.createdAt)}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        <strong>Coords:</strong> {Number(c.latitude).toFixed(4)}, {Number(c.longitude).toFixed(4)}
                      </div>
                      <button 
                        className="btn-primary w-full" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => navigate(`/citizen/complaints/${c.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
