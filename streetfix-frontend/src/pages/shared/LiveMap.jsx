import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader, AlertTriangle, CheckCircle, Clock, Map as MapIcon } from 'lucide-react';
import api from '../../services/api';

const LiveMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      // Filter out complaints without coordinates
      setComplaints(res.data.filter(c => c.latitude && c.longitude));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (priority, status) => {
    if (status === 'RESOLVED' || status === 'CLOSED') return '#10b981'; // Green
    if (priority === 'CRITICAL') return '#ef4444'; // Red
    if (priority === 'HIGH') return '#f97316'; // Orange
    if (priority === 'MEDIUM') return '#eab308'; // Yellow
    return '#3b82f6'; // Blue (LOW or undefined)
  };

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
      <div className="page-header glass-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="page-header-left">
            <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon size={24} /> Live Complaint Map
            </h2>
            <p>Real-time view of civic issues across the city.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel section-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex' }}>
        <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {complaints.map(c => (
            <CircleMarker
              key={c.id}
              center={[c.latitude, c.longitude]}
              radius={8}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: getColor(c.priority, c.status),
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>{c.title}</h4>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>Category:</strong> {c.category}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}><strong>Status:</strong> {c.status}</div>
                  <button 
                    className="btn-primary w-full" 
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => navigate(`/citizen/complaint/${c.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveMap;
