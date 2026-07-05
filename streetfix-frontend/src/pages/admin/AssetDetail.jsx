import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, MapPin, Activity, AlertCircle, FileText } from 'lucide-react';
import api from '../../services/api';

const AssetDetail = () => {
  const { assetCode } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [assetCode]);

  const fetchData = async () => {
    try {
      const [assetRes, complaintsRes] = await Promise.all([
        api.get(`/assets/code/${assetCode}`),
        api.get(`/assets/${assetCode}/complaints`)
      ]);
      setAsset(assetRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;
  if (!asset) return <div className="dashboard-container"><div className="alert alert-error">Asset not found.</div></div>;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin/assets')}>
            <ArrowLeft size={18} />
          </button>
          <div className="page-header-left">
            <h2 className="gradient-text">Asset Details: {asset.assetCode}</h2>
            <p>Comprehensive overview of asset health and complaint history.</p>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title"><Settings size={14} color="#60a5fa" /> Overview</div>
            </div>
            <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
              <div>
                <div className="text-muted text-xs">Type</div>
                <div style={{ fontWeight: 600 }}>{asset.type}</div>
              </div>
              <div>
                <div className="text-muted text-xs">Location</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <MapPin size={14} color="var(--primary-color)" /> {asset.locationName}
                </div>
              </div>
              <div>
                <div className="text-muted text-xs">Coordinates</div>
                <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{asset.latitude}, {asset.longitude}</div>
              </div>
              <div>
                <div className="text-muted text-xs">Status</div>
                <span className={`status-badge status-${asset.status === 'ACTIVE' ? 'RESOLVED' : 'IN_PROGRESS'}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                  {asset.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel section-card">
            <div className="section-header">
              <div className="section-title"><Activity size={14} color="#f59e0b" /> Health Metrics</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{complaints.length}</div>
                <div className="text-xs text-muted">Total Issues</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)' }}>
                  {complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
                </div>
                <div className="text-xs text-muted">Active Issues</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel section-card">
          <div className="section-header">
            <div className="section-title"><FileText size={14} color="#10b981" /> Complaint History</div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.length === 0 ? (
              <div className="text-muted" style={{ padding: '24px', textAlign: 'center' }}>No complaints linked to this asset.</div>
            ) : (
              complaints.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border-bright)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>{c.title}</h4>
                    <div className="text-xs text-muted">{new Date(c.createdAt).toLocaleDateString()} • {c.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className={`priority-badge priority-${c.priority.toLowerCase()}`}>{c.priority}</span>
                    <span className={`status-badge status-${c.status.toLowerCase()}`}>{c.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
