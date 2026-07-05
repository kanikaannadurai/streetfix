import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, Filter } from 'lucide-react';
import api from '../../services/api';

const HeatMap = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    try {
      const res = await api.get('/maps/heatmap');
      setPoints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
      <div className="page-header glass-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%' }}>
          <div className="page-header-left">
            <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={24} /> Complaint Density Heatmap
            </h2>
            <p>Visualizing civic issue hotspots across the city.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel section-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex' }}>
        <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {points.map((p, idx) => (
            <CircleMarker
              key={idx}
              center={[p.latitude, p.longitude]}
              radius={Math.min(30, p.weight * 5)}
              pathOptions={{
                color: 'transparent',
                fillColor: '#ef4444',
                fillOpacity: Math.min(0.8, p.weight * 0.1),
              }}
            >
              <Popup>
                <div>
                  <strong>Density Score:</strong> {p.weight}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HeatMap;
