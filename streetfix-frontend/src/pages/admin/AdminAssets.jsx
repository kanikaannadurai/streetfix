import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, QrCode, Trash2, Edit2, Loader, MapPin } from 'lucide-react';
import api from '../../services/api';

const ASSET_TYPES = ['ROADS', 'STREET_LIGHTS', 'WATER_PIPELINES', 'DRAINAGE', 'GARBAGE_BINS', 'PUBLIC_TOILETS', 'PARKS', 'GOVERNMENT_BUILDINGS'];

const AdminAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, type: 'ROADS', latitude: '', longitude: '', locationName: '', status: 'ACTIVE' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/assets/${form.id}`, form);
      } else {
        await api.post('/assets', form);
      }
      setShowModal(false);
      fetchAssets();
    } catch (err) {
      alert("Failed to save asset");
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      await api.delete(`/assets/${id}`);
      fetchAssets();
    } catch (err) {
      alert("Failed to delete asset");
    }
  };

  const downloadQR = async (assetCode) => {
    try {
      const res = await api.get(`/assets/${assetCode}/qr`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${assetCode}-QR.png`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download QR");
    }
  };

  if (loading) return <div className="dashboard-container"><div className="loading-state"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-container">
      <div className="page-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%' }}>
          <div className="page-header-left">
            <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={24} /> Asset Management
            </h2>
            <p>Manage municipal assets and generate QR codes for public reporting.</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm({ id: null, type: 'ROADS', latitude: '', longitude: '', locationName: '', status: 'ACTIVE' }); setShowModal(true); }}>
            <Plus size={16} /> Add Asset
          </button>
        </div>
      </div>

      <div className="glass-panel section-card">
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Asset Code</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{a.assetCode}</td>
                <td style={{ padding: '12px' }}>{a.type}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--text-dim)" /> {a.locationName}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge status-${a.status === 'ACTIVE' ? 'RESOLVED' : 'IN_PROGRESS'}`}>{a.status}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" style={{ padding: '6px' }} title="View Details" onClick={() => navigate(`/admin/assets/${a.assetCode}`)}>
                    <Settings size={14} />
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px' }} title="Download QR" onClick={() => downloadQR(a.assetCode)}>
                    <QrCode size={14} />
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px' }} title="Edit" onClick={() => { setForm(a); setShowModal(true); }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', color: 'var(--danger)' }} title="Delete" onClick={() => handleDelete(a.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>No assets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>{form.id ? 'Edit Asset' : 'Add New Asset'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="input-field" placeholder="Location Name (e.g. Park St. Bin)" value={form.locationName} onChange={e => setForm({ ...form, locationName: e.target.value })} required />
              <input className="input-field" type="number" step="any" placeholder="Latitude" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} required />
              <input className="input-field" type="number" step="any" placeholder="Longitude" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} required />
              {form.id && (
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                </select>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-secondary w-full" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary w-full">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssets;
